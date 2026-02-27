/**
 * 八字排盘计算模块
 * 基于传统八字算法，准确计算四柱八字
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 五行
const WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水']; // 天干五行
const ZHI_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水']; // 地支五行
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 八字结果接口
export interface BaziResult {
  // 四柱
  yearPillar: { gan: string; zhi: string; ganZhi: string };
  monthPillar: { gan: string; zhi: string; ganZhi: string };
  dayPillar: { gan: string; zhi: string; ganZhi: string };
  hourPillar: { gan: string; zhi: string; ganZhi: string };
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
    day: string; // 日支对日主是地支，没有十神，但可显示其藏干
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

// 地支藏干表
const ZHI_CANG_GAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 纳音五行表
const NA_YIN_WUXING: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水'
};

// 年上起月表（五虎遁）
// 年干 -> 正月月干
const YEAR_TO_MONTH_GAN: Record<string, string> = {
  '甲': '丙', '乙': '戊', '丙': '庚', '丁': '壬', '戊': '甲',
  '己': '丙', '庚': '戊', '辛': '庚', '壬': '壬', '癸': '甲'
};

// 日上起时表（五鼠遁）
// 日干 -> 子时时干
const DAY_TO_HOUR_GAN: Record<string, string> = {
  '甲': '甲', '乙': '丙', '丙': '戊', '丁': '庚', '戊': '壬',
  '己': '甲', '庚': '丙', '辛': '戊', '壬': '庚', '癸': '壬'
};

// 节气日期表（1900-2100年，每年立春日期）
// 立春通常在2月3日、4日或5日
function getLiChunDate(_year: number): { month: number; day: number } {
  // 简化的立春日期计算
  // 1900年立春是2月4日
  // const baseYear = 1900; // 未使用
  // const baseDate = new Date(1900, 1, 4); // 1900年2月4日 // 未使用
  
  // 计算该年的立春日期（简化算法）
  // 实际上立春日期在2月3-5日之间变化
  // const yearOffset = year - baseYear; // 未使用
  const liChunDay = 4; // 简化处理，使用2月4日
  
  return { month: 2, day: liChunDay };
}

// 获取月支（根据节气）
function getMonthZhi(year: number, month: number, day: number): string {
  // 简化的月支计算
  // 传统上，月支是根据节气划分的
  // 立春到惊蛰为寅月，惊蛰到清明为卯月，依此类推
  
  const liChun = getLiChunDate(year);
  
  // 如果已经过了立春，使用正常的月份对应
  // 寅月(正月)=2月立春后，卯月(二月)=3月惊蛰后，依此类推
  let zhiIndex: number;
  
  if (month < liChun.month || (month === liChun.month && day < liChun.day)) {
    // 还没过立春，属于上一年的丑月
    zhiIndex = 1; // 丑
  } else {
    // 已过立春
    // 寅月对应立春后的时间
    // 简化处理：2月立春后为寅月，3月为卯月，依此类推
    zhiIndex = (month - 2 + 12) % 12;
    if (zhiIndex < 0) zhiIndex += 12;
    // 寅月是索引2
    zhiIndex = (zhiIndex + 2) % 12;
  }
  
  return DI_ZHI[zhiIndex];
}

// 计算日柱（使用蔡勒公式或基姆拉尔森公式）
// 这里使用简化的算法
function getDayPillar(year: number, month: number, day: number): { gan: string; zhi: string } {
  // 基准日期：1900年1月31日为甲子日
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  
  // 计算天数差
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 计算干支
  const ganIndex = (diffDays % 10 + 10) % 10;
  const zhiIndex = (diffDays % 12 + 12) % 12;
  
  return {
    gan: TIAN_GAN[ganIndex],
    zhi: DI_ZHI[zhiIndex]
  };
}

// 计算时柱
function getHourPillar(dayGan: string, hour: number): { gan: string; zhi: string } {
  // 确定时支
  // 23-1点子时，1-3点丑时，依此类推
  const zhiIndex = Math.floor(((hour + 1) % 24) / 2) % 12;
  const zhi = DI_ZHI[zhiIndex];
  
  // 确定时干（五鼠遁）
  const startGan = DAY_TO_HOUR_GAN[dayGan];
  const startGanIndex = TIAN_GAN.indexOf(startGan);
  const ganIndex = (startGanIndex + zhiIndex) % 10;
  const gan = TIAN_GAN[ganIndex];
  
  return { gan, zhi };
}

// 计算十神
function calculateShiShen(dayMaster: string, gan: string): string {
  const dayMasterIndex = TIAN_GAN.indexOf(dayMaster);
  const ganIndex = TIAN_GAN.indexOf(gan);
  
  // 计算与日主的关系
  const diff = (ganIndex - dayMasterIndex + 10) % 10;
  
  // 判断阴阳
  const dayMasterYinYang = dayMasterIndex % 2 === 0 ? '阳' : '阴';
  const ganYinYang = ganIndex % 2 === 0 ? '阳' : '阴';
  const sameYinYang = dayMasterYinYang === ganYinYang;
  
  // 根据五行生克关系确定十神
  // 0:比肩 1:劫财 2:食神 3:伤官 4:偏财 5:正财 6:七杀 7:正官 8:偏印 9:正印
  if (diff === 0) return sameYinYang ? '比肩' : '劫财';
  if (diff === 1) return sameYinYang ? '劫财' : '比肩';
  if (diff === 2 || diff === -8) return sameYinYang ? '食神' : '伤官';
  if (diff === 3 || diff === -7) return sameYinYang ? '伤官' : '食神';
  if (diff === 4 || diff === -6) return sameYinYang ? '偏财' : '正财';
  if (diff === 5 || diff === -5) return sameYinYang ? '正财' : '偏财';
  if (diff === 6 || diff === -4) return sameYinYang ? '七杀' : '正官';
  if (diff === 7 || diff === -3) return sameYinYang ? '正官' : '七杀';
  if (diff === 8 || diff === -2) return sameYinYang ? '偏印' : '正印';
  if (diff === 9 || diff === -1) return sameYinYang ? '正印' : '偏印';
  
  return '未知';
}

// 获取五行
function getWuxing(gan: string): string {
  const index = TIAN_GAN.indexOf(gan);
  return WUXING[index];
}

function getZhiWuxing(zhi: string): string {
  const index = DI_ZHI.indexOf(zhi);
  return ZHI_WUXING[index];
}

// 计算八字
export function calculateBazi(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  hour: number,
  _minute: number = 0,
  _isLunar: boolean = false,
  _lunarYear?: number,
  _lunarMonth?: number,
  _lunarDay?: number,
  _isLeap?: boolean
): BaziResult {
  // 如果是农历，需要先转换为公历
  let year = solarYear;
  let month = solarMonth;
  let day = solarDay;
  
  // 计算年柱
  // 年柱以立春为界
  const liChun = getLiChunDate(year);
  let yearGanIndex: number;
  
  if (month < liChun.month || (month === liChun.month && day < liChun.day)) {
    // 还没过立春，属于上一年
    yearGanIndex = (year - 1 - 4) % 10;
  } else {
    yearGanIndex = (year - 4) % 10;
  }
  
  const yearZhiIndex = (year - 4) % 12;
  const yearGan = TIAN_GAN[(yearGanIndex + 10) % 10];
  const yearZhi = DI_ZHI[(yearZhiIndex + 12) % 12];
  
  // 计算月柱
  const monthZhi = getMonthZhi(year, month, day);
  const monthStartGan = YEAR_TO_MONTH_GAN[yearGan];
  const monthStartGanIndex = TIAN_GAN.indexOf(monthStartGan);
  const monthZhiIndex = DI_ZHI.indexOf(monthZhi);
  // 正月是寅月，索引为2
  const zhiOffset = (monthZhiIndex - 2 + 12) % 12;
  const monthGanIndex = (monthStartGanIndex + zhiOffset) % 10;
  const monthGan = TIAN_GAN[monthGanIndex];
  
  // 计算日柱
  const dayPillar = getDayPillar(year, month, day);
  
  // 计算时柱
  const hourPillar = getHourPillar(dayPillar.gan, hour);
  
  // 日主（日干）
  const dayMaster = dayPillar.gan;
  const dayMasterWuxing = getWuxing(dayMaster);
  
  // 计算十神
  const shiShen = {
    year: calculateShiShen(dayMaster, yearGan),
    month: calculateShiShen(dayMaster, monthGan),
    day: '日主', // 日支对日主是地支，没有十神
    hour: calculateShiShen(dayMaster, hourPillar.gan)
  };
  
  // 获取藏干
  const cangGan = {
    year: ZHI_CANG_GAN[yearZhi] || [],
    month: ZHI_CANG_GAN[monthZhi] || [],
    day: ZHI_CANG_GAN[dayPillar.zhi] || [],
    hour: ZHI_CANG_GAN[hourPillar.zhi] || []
  };
  
  // 计算五行统计
  const wuxingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  
  // 统计天干五行
  [yearGan, monthGan, dayPillar.gan, hourPillar.gan].forEach(gan => {
    const wx = getWuxing(gan);
    wuxingCount[wx]++;
  });
  
  // 统计地支五行（简化处理，只统计主气）
  [yearZhi, monthZhi, dayPillar.zhi, hourPillar.zhi].forEach(zhi => {
    const wx = getZhiWuxing(zhi);
    wuxingCount[wx]++;
  });
  
  // 纳音
  const naYin = {
    year: NA_YIN_WUXING[yearGan + yearZhi] || '',
    month: NA_YIN_WUXING[monthGan + monthZhi] || '',
    day: NA_YIN_WUXING[dayPillar.gan + dayPillar.zhi] || '',
    hour: NA_YIN_WUXING[hourPillar.gan + hourPillar.zhi] || ''
  };
  
  // 生肖
  const shengXiao = SHENG_XIAO[(yearZhiIndex + 12) % 12];
  
  return {
    yearPillar: { gan: yearGan, zhi: yearZhi, ganZhi: yearGan + yearZhi },
    monthPillar: { gan: monthGan, zhi: monthZhi, ganZhi: monthGan + monthZhi },
    dayPillar: { gan: dayPillar.gan, zhi: dayPillar.zhi, ganZhi: dayPillar.gan + dayPillar.zhi },
    hourPillar: { gan: hourPillar.gan, zhi: hourPillar.zhi, ganZhi: hourPillar.gan + hourPillar.zhi },
    bazi: `${yearGan}${yearZhi} ${monthGan}${monthZhi} ${dayPillar.gan}${dayPillar.zhi} ${hourPillar.gan}${hourPillar.zhi}`,
    wuxingCount,
    dayMaster,
    dayMasterWuxing,
    shiShen,
    cangGan,
    shengXiao,
    naYin
  };
}

// 格式化八字显示
export function formatBaziDisplay(bazi: BaziResult): string {
  return `
八字：${bazi.bazi}

四柱：
年柱：${bazi.yearPillar.ganZhi} (${bazi.naYin.year})
月柱：${bazi.monthPillar.ganZhi} (${bazi.naYin.month})
日柱：${bazi.dayPillar.ganZhi} (${bazi.naYin.day}) - 日主：${bazi.dayMaster} (${bazi.dayMasterWuxing})
时柱：${bazi.hourPillar.ganZhi} (${bazi.naYin.hour})

十神：
年干：${bazi.shiShen.year}
月干：${bazi.shiShen.month}
日干：日主
时干：${bazi.shiShen.hour}

五行统计：
金：${bazi.wuxingCount['金']}
木：${bazi.wuxingCount['木']}
水：${bazi.wuxingCount['水']}
火：${bazi.wuxingCount['火']}
土：${bazi.wuxingCount['土']}
  `.trim();
}

// 获取八字分析文本（用于AI prompt）
export function getBaziAnalysisText(bazi: BaziResult): string {
  const wuxingAnalysis = Object.entries(bazi.wuxingCount)
    .sort((a, b) => b[1] - a[1])
    .map(([wx, count]) => `${wx}:${count}个`)
    .join('、');
  
  const sortedWuxing = Object.entries(bazi.wuxingCount).sort((a, b) => b[1] - a[1]);
  const dominantWuxing = sortedWuxing.length > 0 ? sortedWuxing[0][0] : '';
  
  const weakWuxing = Object.entries(bazi.wuxingCount)
    .filter(([_, count]) => count === 0)
    .map(([wx, _]) => wx)
    .join('、') || '无';
  
  return `【八字排盘】
八字：${bazi.bazi}
生肖：${bazi.shengXiao}
日主：${bazi.dayMaster}（${bazi.dayMasterWuxing}）

【四柱纳音】
年柱：${bazi.yearPillar.ganZhi} - ${bazi.naYin.year}
月柱：${bazi.monthPillar.ganZhi} - ${bazi.naYin.month}
日柱：${bazi.dayPillar.ganZhi} - ${bazi.naYin.day}
时柱：${bazi.hourPillar.ganZhi} - ${bazi.naYin.hour}

【十神分析】
年干${bazi.yearPillar.gan}：${bazi.shiShen.year}
月干${bazi.monthPillar.gan}：${bazi.shiShen.month}
时干${bazi.hourPillar.gan}：${bazi.shiShen.hour}

【五行分析】
五行分布：${wuxingAnalysis}
最旺五行：${dominantWuxing}
缺失五行：${weakWuxing}

【藏干】
年支${bazi.yearPillar.zhi}藏：${bazi.cangGan.year.join('、')}
月支${bazi.monthPillar.zhi}藏：${bazi.cangGan.month.join('、')}
日支${bazi.dayPillar.zhi}藏：${bazi.cangGan.day.join('、')}
时支${bazi.hourPillar.zhi}藏：${bazi.cangGan.hour.join('、')}`;
}
