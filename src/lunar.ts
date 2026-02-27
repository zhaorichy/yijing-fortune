/**
 * 农历日期转换工具
 * 使用 lunar-javascript 库进行准确的农历转换
 */

// @ts-ignore
import { Lunar, Solar } from 'lunar-javascript';

// 农历月份名称
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

// 农历日期名称
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
 '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

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
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  
  const lunarYear = lunar.getYear();
  const lunarMonth = lunar.getMonth();
  const lunarDay = lunar.getDay();
  
  // 检查是否为闰月 - 通过比较农历月是否等于实际月
  const isLeap = false; // 简化处理
  
  // 获取干支
  const ganZhi = lunar.getYearInGanZhi();
  // 获取生肖
  const animal = lunar.getYearShengXiao();
  
  // 构建月份名称
  const lunarMonthName = lunarMonths[lunarMonth - 1] + '月';
  const lunarDayName = lunarDays[lunarDay - 1];
  
  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeap,
    ganZhi,
    animal,
    lunarMonthName,
    lunarDayName
  };
}

// 农历转公历
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, _isLeap: boolean = false): {
  year: number;
  month: number;
  day: number;
  solarDateStr: string;
} {
  // 使用 lunar-javascript 库进行转换
  const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
  const solar = lunar.getSolar();
  
  const year = solar.getYear();
  const month = solar.getMonth();
  const day = solar.getDay();
  
  const solarDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  return {
    year,
    month,
    day,
    solarDateStr
  };
}

// 获取农历年份列表 (1900-2100)
export function getLunarYears(): number[] {
  return Array.from({ length: 201 }, (_, i) => 1900 + i);
}

// 获取农历月份列表 (1-12，包含闰月)
export function getLunarMonths(year: number): { value: number; label: string; isLeap: boolean }[] {
  const months: { value: number; label: string; isLeap: boolean }[] = [];
  
  // 创建农历对象获取闰月信息
  const lunar = Lunar.fromYmd(year, 1, 1);
  const leapMonth = lunar.getLeapMonth();
  
  for (let i = 1; i <= 12; i++) {
    months.push({ value: i, label: lunarMonths[i - 1] + '月', isLeap: false });
    // 如果当前月有闰月，添加闰月
    if (leapMonth === i) {
      months.push({ value: i, label: '闰' + lunarMonths[i - 1] + '月', isLeap: true });
    }
  }
  
  return months;
}

// 获取农历日期列表 (1-30)
export function getLunarDays(year: number, month: number, _isLeap: boolean): { value: number; label: string }[] {
  // 创建农历对象获取该月天数
  const lunar = Lunar.fromYmd(year, month, 1);
  // 获取该月天数 - 通过获取下月初一的前一天
  let daysInMonth = 30;
  try {
    // 尝试获取该月的最后一天
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextLunar = Lunar.fromYmd(nextYear, nextMonth, 1);
    const lastDaySolar = nextLunar.getSolar();
    const lastDay = new Date(lastDaySolar.getYear(), lastDaySolar.getMonth() - 1, lastDaySolar.getDay() - 1);
    const firstDay = new Date(lunar.getSolar().getYear(), lunar.getSolar().getMonth() - 1, lunar.getSolar().getDay());
    daysInMonth = Math.floor((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  } catch {
    daysInMonth = 30;
  }
  
  return Array.from({ length: daysInMonth }, (_, i) => ({
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
