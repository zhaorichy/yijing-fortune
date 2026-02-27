export interface Gua {
  id: number;
  name: string;
  chineseName: string;
  symbol: string;
  lines: boolean[]; // true = yang (阳), false = yin (阴)
  meaning: string;
  description: string;
}

// 八字排盘接口
export interface BaziPillar {
  gan: string;
  zhi: string;
  ganZhi: string;
}

export interface BaziResult {
  // 四柱
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
  // 完整八字
  bazi: string;
  // 五行统计
  wuxingCount: Record<string, number>;
  // 日主（日干）
  dayMaster: string;
  dayMasterWuxing: string;
  // 十神
  shiShen: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 藏干
  cangGan: {
    year: string[];
    month: string[];
    day: string[];
    hour: string[];
  };
  // 生肖
  shengXiao: string;
  // 纳音
  naYin: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
}

export interface GuaResult {
  mainGua: Gua;
  changeGua: Gua;
  huGua: Gua;
  fortune: {
    overall: string;
    career: string;
    love: string;
    wealth: string;
    health: string;
  };
  advice: string;
  elements: {
    tiangan: string;
    dizhi: string;
    wuxing: string;
  };
  // 八字排盘
  bazi?: BaziResult;
}
