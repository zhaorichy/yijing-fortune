/**
 * 农历日期转换工具
 * 使用可靠的算法进行农历转换
 */

// 农历数据表 (1900-2100) - 每个元素表示该年的农历信息
// 高4位为闰月月份，低12位为每月大小月 (1=大月30天，0=小月29天)
const lunarInfo = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];

// 天干
const gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
// 地支
const zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
// 生肖
const animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
// 农历月份名称
const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
// 农历日期名称
const lunarDays = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];

// 获取某年的农历信息
function getLunarYearInfo(year: number): { leapMonth: number; months: number[] } {
  const info = lunarInfo[year - 1900];
  const leapMonth = info >> 16;
  const months: number[] = [];
  for (let i = 0; i < 12; i++) {
    months.push((info >> (15 - i)) & 1 ? 30 : 29);
  }
  return { leapMonth, months };
}

// 获取某年闰月的天数
function getLeapMonthDays(year: number): number {
  const info = lunarInfo[year - 1900];
  return (info >> 16) ? ((info >> 16) & 1 ? 30 : 29) : 0;
}

// 公历转农历
export function solarToLunar(year: number, month: number, day: number): {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
  ganZhi: string;
  animal: string;
  lunarMonthName: string;
  lunarDayName: string;
} {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  
  let lunarYear = 1900;
  
  for (let i = 1900; i < 2100 && offset >= 0; i++) {
    const yearInfo = getLunarYearInfo(i);
    let yearDays = yearInfo.months.reduce((a, b) => a + b, 0);
    if (yearInfo.leapMonth > 0) {
      yearDays += getLeapMonthDays(i);
    }
    if (offset < yearDays) {
      lunarYear = i;
      break;
    }
    offset -= yearDays;
    lunarYear = i + 1;
  }
  
  const yearInfo = getLunarYearInfo(lunarYear);
  let lunarMonth = 1;
  let isLeap = false;
  
  for (let i = 0; i < 12 && offset >= 0; i++) {
    const monthDays = yearInfo.months[i];
    if (offset < monthDays) {
      lunarMonth = i + 1;
      break;
    }
    offset -= monthDays;
    
    if (yearInfo.leapMonth === i + 1) {
      const leapDays = getLeapMonthDays(lunarYear);
      if (offset < leapDays) {
        lunarMonth = i + 1;
        isLeap = true;
        break;
      }
      offset -= leapDays;
    }
    lunarMonth = i + 2;
  }
  
  if (lunarMonth > 12) lunarMonth = 12;
  const lunarDay = offset + 1;
  
  const ganIndex = (lunarYear - 4) % 10;
  const zhiIndex = (lunarYear - 4) % 12;
  const ganZhi = gan[ganIndex] + zhi[zhiIndex];
  const animal = animals[zhiIndex];
  
  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeap,
    ganZhi,
    animal,
    lunarMonthName: (isLeap ? '闰' : '') + lunarMonths[lunarMonth - 1] + '月',
    lunarDayName: lunarDays[lunarDay - 1]
  };
}

// 农历转公历 - 使用暴力查找法确保准确
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean = false): {
  year: number;
  month: number;
  day: number;
  solarDateStr: string;
} {
  // 暴力查找：从该农历年正月初一开始，逐日累加，找到对应的公历日期
  const yearInfo = getLunarYearInfo(lunarYear);
  
  // 计算从年初到目标日期的天数
  let targetDays = 0;
  
  // 累加之前月份的天数
  for (let i = 1; i < lunarMonth; i++) {
    // 检查是否有闰月在本月之前
    if (yearInfo.leapMonth === i && i < lunarMonth) {
      targetDays += getLeapMonthDays(lunarYear);
    }
    targetDays += yearInfo.months[i - 1];
  }
  
  // 处理闰月情况
  if (isLeap && yearInfo.leapMonth === lunarMonth) {
    // 闰月在本月，需要加上正常月的天数
    targetDays += yearInfo.months[lunarMonth - 1];
  }
  
  // 加上当月的天数
  targetDays += lunarDay - 1;
  
  // 从农历年正月初一（1900年1月31日）开始计算
  let totalDays = 0;
  
  // 累加之前年份的天数
  for (let i = 1900; i < lunarYear; i++) {
    const prevYearInfo = getLunarYearInfo(i);
    totalDays += prevYearInfo.months.reduce((a, b) => a + b, 0);
    if (prevYearInfo.leapMonth > 0) {
      totalDays += getLeapMonthDays(i);
    }
  }
  
  // 加上目标日期在本年的天数
  totalDays += targetDays;
  
  // 计算公历日期
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(baseDate.getTime() + totalDays * 86400000);
  
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  
  return {
    year,
    month,
    day,
    solarDateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  };
}

// 获取农历年份列表 (1900-2100)
export function getLunarYears(): number[] {
  return Array.from({ length: 201 }, (_, i) => 1900 + i);
}

// 获取农历月份列表 (1-12，包含闰月)
export function getLunarMonths(year: number): { value: number; label: string; isLeap: boolean }[] {
  const yearInfo = getLunarYearInfo(year);
  const months: { value: number; label: string; isLeap: boolean }[] = [];
  
  for (let i = 1; i <= 12; i++) {
    months.push({ value: i, label: lunarMonths[i - 1] + '月', isLeap: false });
    if (yearInfo.leapMonth === i) {
      months.push({ value: i, label: '闰' + lunarMonths[i - 1] + '月', isLeap: true });
    }
  }
  
  return months;
}

// 获取农历日期列表 (1-30)
export function getLunarDays(year: number, month: number, isLeap: boolean): { value: number; label: string }[] {
  const yearInfo = getLunarYearInfo(year);
  let days = 0;
  
  if (isLeap && yearInfo.leapMonth === month) {
    days = getLeapMonthDays(year);
  } else {
    days = yearInfo.months[month - 1];
  }
  
  return Array.from({ length: days }, (_, i) => ({
    value: i + 1,
    label: lunarDays[i]
  }));
}

// 获取当前日期的农历
export function getTodayLunar(): {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeap: boolean;
} {
  const today = new Date();
  const result = solarToLunar(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return {
    lunarYear: result.lunarYear,
    lunarMonth: result.lunarMonth,
    lunarDay: result.lunarDay,
    isLeap: result.isLeap
  };
}
