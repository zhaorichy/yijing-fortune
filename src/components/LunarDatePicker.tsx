import React, { useState, useEffect } from 'react';
import { getLunarYears, getLunarMonths, getLunarDays, lunarToSolar } from '../lunar';

interface LunarDatePickerProps {
  value: { year: number; month: number; day: number; isLeap: boolean } | null;
  onChange: (value: { year: number; month: number; day: number; isLeap: boolean; solarDate: string }) => void;
}

const LunarDatePicker: React.FC<LunarDatePickerProps> = ({ value, onChange }) => {
  const years = getLunarYears();
  const [selectedYear, setSelectedYear] = useState<number>(value?.year || 2000);
  const [selectedMonth, setSelectedMonth] = useState<number>(value?.month || 1);
  const [selectedDay, setSelectedDay] = useState<number>(value?.day || 1);
  const [isLeap, setIsLeap] = useState<boolean>(value?.isLeap || false);
  
  const months = getLunarMonths(selectedYear);
  const days = getLunarDays(selectedYear, selectedMonth, isLeap);
  
  // 当选择月份时，检查是否为闰月
  const handleMonthChange = (monthValue: number, leap: boolean) => {
    setSelectedMonth(monthValue);
    setIsLeap(leap);
    // 重置日期为1，避免超出新月份的天数
    setSelectedDay(1);
  };
  
  // 当任何选择改变时，触发onChange
  useEffect(() => {
    const solarDate = lunarToSolar(selectedYear, selectedMonth, selectedDay, isLeap);
    const solarDateStr = `${solarDate.year}-${String(solarDate.month).padStart(2, '0')}-${String(solarDate.day).padStart(2, '0')}`;
    onChange({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      isLeap,
      solarDate: solarDateStr
    });
  }, [selectedYear, selectedMonth, selectedDay, isLeap]);
  
  return (
    <div className="lunar-date-picker">
      <div className="lunar-picker-row">
        {/* 年份选择 */}
        <div className="lunar-picker-item">
          <label className="lunar-picker-label">年</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="lunar-picker-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
        </div>
        
        {/* 月份选择 */}
        <div className="lunar-picker-item">
          <label className="lunar-picker-label">月</label>
          <select
            value={`${selectedMonth}-${isLeap}`}
            onChange={(e) => {
              const [month, leap] = e.target.value.split('-');
              handleMonthChange(Number(month), leap === 'true');
            }}
            className="lunar-picker-select"
          >
            {months.map((month) => (
              <option key={`${month.value}-${month.isLeap}`} value={`${month.value}-${month.isLeap}`}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* 日期选择 */}
        <div className="lunar-picker-item">
          <label className="lunar-picker-label">日</label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="lunar-picker-select"
          >
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LunarDatePicker;
