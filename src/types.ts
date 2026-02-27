export interface Gua {
  id: number;
  name: string;
  chineseName: string;
  symbol: string;
  lines: boolean[]; // true = yang (阳), false = yin (阴)
  meaning: string;
  description: string;
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
}
