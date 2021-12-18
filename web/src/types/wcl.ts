export interface GameZone {
  id: number;
  name: string;
}

export interface ReportFight {
  // 本次FB的战斗ID，从1开始。
  id: number;

  // 战斗名字
  name: string;

  // 参与战斗的玩家ID列表
  friendlyPlayers: number[];

  // 副本所在区域
  gameZone: GameZone;

  // boss是否击杀。小怪为null；
  // 特别注意：有些boss用bug打法，即便过了，也会变成false。
  kill: boolean;

  // boss ID。为0表示小怪战斗
  encounterID: number;

  // 参战玩家的平均装等
  averageItemLevel: number;

  // 结束时boss的血量百分比。不太准，好几个都是0.01
  bossPercentage: number;

  // 打完这个战斗，副本是否完结
  completeRaid: boolean;

  // BOSS难度。为null表示小怪难度
  difficulty: number;

  startTime: number;
  endTime: number;
  wipeCalledTime: number;
}

export interface Player {
  // 玩家ID。注意：这是本次report里的ID，从1开始。不是整个WCL全局唯一的ID。
  id: number;

  // 玩家名字
  name: string;

  // 服务器名字
  server: string;

  // 魔兽玩家ID。这是魔兽世界官方的玩家ID，应该是全球唯一。
  guid: number;

  // 职业
  type: string;

  // 天赋。应该是兼容正式服的，代表玩家在本次Raid里的专精。
  specs: any[];
}

export interface Actor {
  // 同Player.guid
  gameID: number;

  // 同Player.id
  id: number;

  // 同Player.name
  name: string;

  // 同Player.server
  server: string;

  subType: string;
  type: 'NPC' | 'Player' | 'Pet';
}

export interface Report {
  code: string;
  startTime: number;
  endTime: number;
  events: any[];
  fights: ReportFight[];
  title: string;

  // 注意：！！！ 这个数据是有问题的，它只有第一次战斗开始时的玩家数据。
  //      中途加入的没有计算！
  playerDetails: {
    data: {
      playerDetails: {
        tanks: Player[];
        dps: Player[];
        healers: Player[];
      };
    };
  };

  masterData: {
    actors: Actor[];
  };
}

export interface Wcl {
  reportData: {
    report: Report;
    reports: Report[];
  };
}
