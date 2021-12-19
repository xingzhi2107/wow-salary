import React, {PureComponent} from 'react';
import {
  Typography,
  Table,
  Input,
  Checkbox,
  Divider,
  Descriptions,
  Form,
  InputNumber,
  Button,
  Tooltip,
} from 'antd';
import {fetchWcl} from '../apis';
import {Report, ReportFight} from '../types/wcl';
import {ColumnsType} from 'antd/lib/table/interface';
import {SalaryCalculator, SalaryItem} from '../SalaryCalcutor';
import lodash from 'lodash';
import moment from 'moment';

const {Search} = Input;
const {Text, Link, Title} = Typography;

interface Props {}

interface State {
  wclId: string;
  report: Report | null;
  loading: boolean;
  asKillFightIds: number[];
  equipmentIncome: number;
  salaries: SalaryItem[] | null;

  // calc state
  totalKilledTimes: number;
  killedBossCount: number;
  basicSalaryPerKilledTimes: number;
  totalSendSalary: number;
  wipeOff: number;
  encodedResult: string;
  jsonResult: string;
}

function wowCurrency(num: number | string, unit = 'G'): string {
  if (typeof num === 'string') {
    num = Number.parseFloat(num);
  }
  let rslt = '';
  if (num > 10000) {
    rslt = Math.floor(num / 10000) + '万';
    num = num % 10000;
  }

  if (num > 1000) {
    rslt = rslt + Math.floor(num / 1000) + '千';
    num = num % 1000;
  }

  // if (num > 100) {
  //   rslt = rslt + Math.floor(num / 100) + '百';
  //   num = num % 100;
  // }

  if (num !== 0) {
    rslt = rslt + num.toFixed(2);
  }

  rslt = rslt + unit;

  return rslt;
}

export class CreateWowEventPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      wclId: '',
      report: null,
      loading: false,
      asKillFightIds: [],
      equipmentIncome: 0,
      salaries: null,

      totalKilledTimes: 0,
      killedBossCount: 0,
      basicSalaryPerKilledTimes: 0,
      totalSendSalary: 0,
      wipeOff: 0,
      encodedResult: '',
      jsonResult: '',
    };
  }

  get flights() {
    const result = this.state.report?.fights.filter(x => x.encounterID) || [];
    return result;
  }

  render() {
    const {loading, wclId} = this.state;

    return (
      <div style={{padding: 16, paddingTop: 64}}>
        <div style={{marginBottom: 20}}>
          <Form.Item
            extra={
              '举例：https://classic.warcraftlogs.com/reports/LnA7Xdwyb3jmF2JQ，最后那串"LnA7Xdwyb3jmF2JQ"就是WCL ID'
            }
          >
            <Search
              enterButton="加载"
              size="large"
              placeholder="输入WCL ID"
              loading={loading}
              value={wclId}
              onChange={e => this.setState({wclId: e.target.value})}
              onSearch={this.handleOnLoadWclData}
              style={{marginBottom: 16, maxWidth: 500}}
            />
          </Form.Item>
        </div>
        {this.renderReport()}
        {this.renderSalaries()}
      </div>
    );
  }

  renderReport() {
    if (!this.state.report) {
      return;
    }

    const columns: ColumnsType<ReportFight> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: id => <Text>{id}</Text>,
      },
      {
        title: '战斗',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => {
          return (
            <Link
              href={`https://classic.warcraftlogs.com/reports/${this.state.wclId.trim()}#fight=${
                record.id
              }`}
            >
              {name}
            </Link>
          );
        },
      },
      {
        title: '击杀',
        dataIndex: 'kill',
        key: 'kill',
        render: (kill, record) => {
          const id = record.id;
          const asKilled = this.state.asKillFightIds.includes(id);
          const ms = record.endTime - record.startTime;
          const ts = Math.floor(ms / 1000);
          const min = Math.floor(ts / 60);
          const sec = ts % 60;
          const duration = `${min}:${sec.toString().padStart(2, '0')}`;
          const durationText = `（${duration}）`;
          if (asKilled) {
            return <Text type="warning">{'视作击杀' + durationText}</Text>;
          } else if (kill) {
            return <Text type="success">{'击杀' + durationText}</Text>;
          } else {
            return <Text type="danger">{'失败' + durationText}</Text>;
          }
        },
      },
      {
        title: '视作击杀',
        dataIndex: 'kill',
        key: 'kill',
        render: (kill, record) => {
          if (kill) {
            return null;
          }
          const id = record.id;
          const asKilled = this.state.asKillFightIds.includes(id);
          const currBossId = record.encounterID;
          const otherFlightsOfCurrBoss = this.flights.filter(
            x => x.encounterID === currBossId && x.id !== id,
          );
          const otherFlightsIdsOfCurrBoss = otherFlightsOfCurrBoss.map(
            x => x.id,
          );
          const currBossKilledInOthers =
            otherFlightsOfCurrBoss.some(x => x.kill) ||
            otherFlightsIdsOfCurrBoss.some(x =>
              this.state.asKillFightIds.includes(x),
            );
          return (
            <Checkbox
              value={asKilled}
              disabled={currBossKilledInOthers}
              onChange={e => {
                const checked = e.target.checked;
                if (checked) {
                  this.state.asKillFightIds.push(id);
                  this.setState({
                    asKillFightIds: [...this.state.asKillFightIds],
                  });
                } else {
                  this.setState({
                    asKillFightIds: this.state.asKillFightIds.filter(
                      x => x !== id,
                    ),
                  });
                }
              }}
            >
              {'视作击杀'}
            </Checkbox>
          );
        },
      },
      {
        title: '参战人数',
        dataIndex: 'friendlyPlayers',
        key: 'friendlyPlayers',
        render: friendlyPlayers => (
          <Typography.Text>{friendlyPlayers.length}</Typography.Text>
        ),
      },
      {
        title: '战斗时长',
        dataIndex: 'flightTime',
        key: 'flightTime',
        render: (_, record) => {
          const ms = record.endTime - record.startTime;
          const ts = Math.floor(ms / 1000);
          const min = Math.floor(ts / 60);
          const sec = ts % 60;
          return <Typography.Text>{min + '分钟' + sec + '秒'}</Typography.Text>;
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: ms => {
          ms = ms + (this.state.report?.startTime || 0);
          const dt = moment(new Date(ms));
          return (
            <Tooltip title={dt.format('YYYY-MM-DD HH:mm:ss')}>
              <Typography.Text>{dt.format('HH:mm:ss')}</Typography.Text>
            </Tooltip>
          );
        },
      },
    ];
    return (
      <div>
        <Title>
          <Link
            href={
              'https://classic.warcraftlogs.com/reports/' +
              this.state.wclId.trim()
            }
            target="_blank"
          >
            {this.state.report.title}
          </Link>
        </Title>
        <Divider plain>{'战斗数据'}</Divider>
        <Table columns={columns} dataSource={this.flights} />
        <div>
          <div>
            <Form
              name="basic"
              labelCol={{span: 2}}
              wrapperCol={{span: 22}}
              autoComplete="off"
            >
              <Form.Item
                label="装备收入(G)"
                name="equipmentIncome"
                rules={[{required: true, message: '输入装备总收入'}]}
              >
                <InputNumber
                  value={this.state.equipmentIncome}
                  onChange={val => {
                    this.setState({
                      equipmentIncome: val,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={this.handleCalc} type="primary">
                  {'计算'}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Divider>{'结果'}</Divider>
            <Descriptions>
              <Descriptions.Item label="装备收入">
                {wowCurrency(this.state.equipmentIncome)}
              </Descriptions.Item>
              <Descriptions.Item label="击杀总数">
                {this.state.killedBossCount}
              </Descriptions.Item>
              <Descriptions.Item label="击杀总人次">
                {this.state.totalKilledTimes}
              </Descriptions.Item>
              <Descriptions.Item label="单次击杀人次工资">
                {wowCurrency(this.state.basicSalaryPerKilledTimes)}
              </Descriptions.Item>
              <Descriptions.Item label="邮寄总金额">
                {wowCurrency(this.state.totalSendSalary.toFixed(2))}
              </Descriptions.Item>
              <Descriptions.Item label="抹零">
                {this.state.wipeOff.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </div>
    );
  }

  renderSalaries() {
    const {salaries} = this.state;
    if (!salaries || !salaries.length) {
      return;
    }

    const columns: ColumnsType<SalaryItem> = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (_1, _2, idx) => <Typography.Text>{idx + 1}</Typography.Text>,
      },
      {
        title: '昵称',
        dataIndex: 'name',
        key: 'name',
        render: name => <Typography.Text>{name}</Typography.Text>,
      },
      {
        title: '总工资',
        dataIndex: 'total',
        key: 'total',
        render: total => (
          <Typography.Text>{wowCurrency(total)}</Typography.Text>
        ),
      },
    ];

    return (
      <div>
        <Divider plain>{'工资详情'}</Divider>
        <Table
          columns={columns}
          dataSource={salaries}
          pagination={{pageSize: 50}}
        />
        <div>
          <Button onClick={this.handleClickCopy} type="primary">
            {'复制结果'}
          </Button>
        </div>

        <div style={{whiteSpace: 'pre', maxHeight: 400, overflow: 'scroll'}}>
          {this.state.encodedResult}
        </div>
      </div>
    );
  }

  loadData = (wclId: string) => {
    this.setState({
      loading: true,
    });
    fetchWcl(wclId).then(res => {
      this.setState({
        report: res.data.reportData.report,
        loading: false,
        asKillFightIds: [],

        equipmentIncome: 0,
        salaries: null,

        totalKilledTimes: 0,
        killedBossCount: 0,
        basicSalaryPerKilledTimes: 0,
        totalSendSalary: 0,
        wipeOff: 0,
        encodedResult: '',
        jsonResult: '',
      });
    });
  };

  handleOnLoadWclData = (wcl: string) => {
    wcl = wcl.trim();
    if (!wcl) {
      return;
    }
    this.loadData(wcl);
  };

  handleCalc = () => {
    const {report, equipmentIncome, asKillFightIds} = this.state;
    if (!report) {
      return;
    }
    const copyReport: Report = JSON.parse(JSON.stringify(report));
    copyReport.fights.forEach(x => {
      if (asKillFightIds.includes(x.id)) {
        x.kill = true;
      }
    });
    const calculator = new SalaryCalculator(copyReport, equipmentIncome);
    const salaries = calculator.calc();
    const totalSendSalary = lodash.sumBy(salaries, x => x.total);

    const dt = moment(copyReport.startTime);
    const result = {
      id: copyReport.code,
      title: copyReport.title,
      eventTime: dt.unix(),
      emailBody: '',
      isCompleted: false,
      timeRemoved: 0,
      salaries,
    };
    const jsonResult = JSON.stringify(result, null, 4);
    const base64Content = window.btoa(unescape(encodeURIComponent(jsonResult)));
    const lines = lodash.chunk(base64Content, 80).map(chars => chars.join(''));
    const commentLines = [
      '-- WCL Id： ' + copyReport.code,
      '-- 活动标题：' + copyReport.title,
      '-- 活动日期：' + dt.format('YYYY-MM-DD'),
      '-- 总邮寄人数：' + salaries.length,
      '-- 总邮寄金额：' + totalSendSalary,
    ];
    const humanityBase64Content = [
      ...commentLines,
      ...lines,
      ...commentLines,
    ].join('\n');
    this.setState({
      totalKilledTimes: calculator.totalKilledTimes,
      killedBossCount: calculator.killedBossCount,
      basicSalaryPerKilledTimes: calculator.basicSalaryPerKilledTimes,
      totalSendSalary,
      wipeOff: equipmentIncome - totalSendSalary,
      salaries,
      jsonResult: JSON.stringify(result, null, 4),
      encodedResult: humanityBase64Content,
    });
  };

  handleClickCopy = () => {
    navigator.clipboard.writeText(this.state.encodedResult);
  };
}
