import {Report} from './types/wcl';
import lodash from 'lodash';

export interface SalaryDetailItem {
  playerId: number;
  item: string;
  value: number;
}

export interface SalaryItem {
  uuid: string;
  eventId: string;
  name: string;
  server: string;
  total: number;
  detailItems: SalaryDetailItem[];
  optLogs: any[];
  timeRemoved: number;
  timeSent: number;
}

function salaryRound(salary: number): number {
  // 总是约去工资的小数点第三位
  let salaryStr = salary.toFixed(3);
  salaryStr = salaryStr.slice(0, salaryStr.length - 1);
  return Number.parseFloat(salaryStr);
}

export class SalaryCalculator {
  constructor(private wclReport: Report, private equipmentIncome: number) {}

  public get killedBossFlights() {
    return this.wclReport.fights.filter(x => x.kill && x.encounterID !== 0);
  }

  public get totalKilledTimes() {
    return lodash.sumBy(this.killedBossFlights, x => x.friendlyPlayers.length);
  }

  public get basicSalaryPerKilledTimes() {
    return salaryRound(this.equipmentIncome / this.totalKilledTimes);
  }

  public get playerId2KilledCount() {
    const allFriendlyPlayersOfKilledBoss = lodash.flatten(
      this.killedBossFlights.map(x => x.friendlyPlayers),
    );

    return lodash.countBy(allFriendlyPlayersOfKilledBoss);
  }

  public get killedBossCount() {
    return this.killedBossFlights.length;
  }

  public get basicSalaries(): SalaryDetailItem[] {
    const playerId2KilledCount = this.playerId2KilledCount;
    const killedBossCount = this.killedBossCount;
    const basicSalaryPerKilledTimes = this.basicSalaryPerKilledTimes;
    return this.allPlayers.map(player => {
      const id = player.id;
      const playerKilledCount = playerId2KilledCount[id];
      const salaryValue = salaryRound(
        playerKilledCount * basicSalaryPerKilledTimes,
      );

      const note = `基本工资(${playerKilledCount}/${killedBossCount})`;

      return {
        playerId: id,
        item: note,
        value: salaryValue,
      };
    });
  }

  private get id2BasicSalary() {
    return lodash.keyBy(this.basicSalaries, x => x.playerId);
  }

  private get playerDetails() {
    return this.wclReport.playerDetails.data.playerDetails;
  }

  private get actors() {
    return this.wclReport.masterData.actors;
  }

  private get allPlayers() {
    return this.actors.filter(x => x.type === 'Player');
  }

  private get id2Player() {
    return lodash.keyBy(this.allPlayers, x => x.id);
  }

  public calc(): SalaryItem[] {
    const wclId = this.wclReport.code;
    const eventId = wclId;

    // 基本工资
    const id2BasicSalary = this.id2BasicSalary;

    // 补贴：TODO

    // 罚款：TODO

    return this.allPlayers.map(player => {
      const id = player.id;
      const uuid = `${wclId}--${player.gameID}`;
      const detailItems = [id2BasicSalary[id]].filter(x => x);
      const total = lodash.sumBy(detailItems, x => x.value);

      if (!player.server) {
        debugger;
      }

      return {
        uuid,
        eventId,
        name: player.name,
        server: player.server,
        optLogs: [],
        timeRemoved: 0,
        timeSent: 0,
        detailItems,
        total,
      };
    });
  }
}
