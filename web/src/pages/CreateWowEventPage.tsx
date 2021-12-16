import React, {PureComponent} from 'react';
import {Button} from 'antd';
import {Link} from 'react-router-dom';
import {fetchWcl} from '../apis';

interface Props {}

interface State {
  wcl: string;
}

export class CreateWowEventPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      wcl: '',
    };
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <div>
        <Link to="/login">{'登录'}</Link>
        <Button type="primary">{'提交'}</Button>
        <div style={{whiteSpace: 'pre'}}>{this.state.wcl}</div>
      </div>
    );
  }

  loadData = () => {
    fetchWcl('GjmB9Q7rfzhPck6A').then(res => {
      this.setState({
        wcl: JSON.stringify(res.data.reportData.report, null, 4),
      });
    });
  };
}
