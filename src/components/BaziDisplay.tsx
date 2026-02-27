import React from 'react';
import { BaziResult } from '../types';

interface BaziDisplayProps {
  bazi: BaziResult;
}

const BaziDisplay: React.FC<BaziDisplayProps> = ({ bazi }) => {
  // 五行颜色映射
  const wuxingColors: Record<string, string> = {
    '金': 'text-yellow-400',
    '木': 'text-green-400',
    '水': 'text-blue-400',
    '火': 'text-red-400',
    '土': 'text-amber-600'
  };

  // 十神颜色映射
  const shishenColors: Record<string, string> = {
    '比肩': 'text-purple-400',
    '劫财': 'text-pink-400',
    '食神': 'text-orange-400',
    '伤官': 'text-red-400',
    '偏财': 'text-yellow-400',
    '正财': 'text-amber-400',
    '七杀': 'text-red-500',
    '正官': 'text-blue-400',
    '偏印': 'text-indigo-400',
    '正印': 'text-cyan-400',
    '日主': 'text-gold font-bold'
  };

  // 渲染五行统计条
  const renderWuxingBar = (wuxing: string, count: number) => {
    const maxCount = Math.max(...Object.values(bazi.wuxingCount));
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    const colorClass = wuxingColors[wuxing] || 'text-gray-400';
    
    return (
      <div key={wuxing} className="flex items-center gap-2 mb-2">
        <span className={`w-8 font-bold ${colorClass}`}>{wuxing}</span>
        <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              wuxing === '金' ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
              wuxing === '木' ? 'bg-gradient-to-r from-green-500 to-green-300' :
              wuxing === '水' ? 'bg-gradient-to-r from-blue-500 to-blue-300' :
              wuxing === '火' ? 'bg-gradient-to-r from-red-500 to-red-300' :
              'bg-gradient-to-r from-amber-600 to-amber-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-6 text-right text-gray-300">{count}</span>
      </div>
    );
  };

  return (
    <div className="glass rounded-xl p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gold mb-2">八字排盘</h3>
        <p className="text-gray-400 text-sm">基于农历生辰的精准八字分析</p>
      </div>

      {/* 八字总览 */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl px-8 py-4 border border-amber-500/30">
          <p className="text-3xl md:text-4xl font-bold text-gold tracking-wider">
            {bazi.bazi}
          </p>
        </div>
        <p className="mt-3 text-gray-300">
          生肖：<span className="text-amber-400 font-bold">{bazi.shengXiao}</span>
          <span className="mx-4">|</span>
          日主：<span className={`font-bold ${wuxingColors[bazi.dayMasterWuxing]}`}>
            {bazi.dayMaster}（{bazi.dayMasterWuxing}）
          </span>
        </p>
      </div>

      {/* 四柱排盘表格 */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-amber-500/30">
              <th className="py-3 px-2 text-amber-300 text-left"></th>
              <th className="py-3 px-2 text-amber-300 text-center">年柱</th>
              <th className="py-3 px-2 text-amber-300 text-center">月柱</th>
              <th className="py-3 px-2 text-amber-300 text-center bg-amber-500/10 rounded-t-lg">日柱（日主）</th>
              <th className="py-3 px-2 text-amber-300 text-center">时柱</th>
            </tr>
          </thead>
          <tbody>
            {/* 天干行 */}
            <tr className="border-b border-white/10">
              <td className="py-3 px-2 text-gray-400">天干</td>
              <td className="py-3 px-2 text-center">
                <div className={`text-2xl font-bold ${wuxingColors[bazi.yearPillar.gan] || 'text-gray-300'}`}>
                  {bazi.yearPillar.gan}
                </div>
                <div className="text-xs text-gray-500 mt-1">{bazi.shiShen.year}</div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className={`text-2xl font-bold ${wuxingColors[bazi.monthPillar.gan] || 'text-gray-300'}`}>
                  {bazi.monthPillar.gan}
                </div>
                <div className="text-xs text-gray-500 mt-1">{bazi.shiShen.month}</div>
              </td>
              <td className="py-3 px-2 text-center bg-amber-500/5">
                <div className={`text-2xl font-bold ${wuxingColors[bazi.dayPillar.gan] || 'text-gray-300'}`}>
                  {bazi.dayPillar.gan}
                </div>
                <div className="text-xs text-amber-400 mt-1 font-bold">日主</div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className={`text-2xl font-bold ${wuxingColors[bazi.hourPillar.gan] || 'text-gray-300'}`}>
                  {bazi.hourPillar.gan}
                </div>
                <div className="text-xs text-gray-500 mt-1">{bazi.shiShen.hour}</div>
              </td>
            </tr>
            {/* 地支行 */}
            <tr>
              <td className="py-3 px-2 text-gray-400">地支</td>
              <td className="py-3 px-2 text-center">
                <div className="text-2xl font-bold text-gray-300">{bazi.yearPillar.zhi}</div>
                <div className="text-xs text-gray-500 mt-1">
                  藏：{bazi.cangGan.year.join('、')}
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className="text-2xl font-bold text-gray-300">{bazi.monthPillar.zhi}</div>
                <div className="text-xs text-gray-500 mt-1">
                  藏：{bazi.cangGan.month.join('、')}
                </div>
              </td>
              <td className="py-3 px-2 text-center bg-amber-500/5 rounded-b-lg">
                <div className="text-2xl font-bold text-gray-300">{bazi.dayPillar.zhi}</div>
                <div className="text-xs text-gray-500 mt-1">
                  藏：{bazi.cangGan.day.join('、')}
                </div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className="text-2xl font-bold text-gray-300">{bazi.hourPillar.zhi}</div>
                <div className="text-xs text-gray-500 mt-1">
                  藏：{bazi.cangGan.hour.join('、')}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 纳音五行 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '年柱纳音', value: bazi.naYin.year, pillar: bazi.yearPillar.ganZhi },
          { label: '月柱纳音', value: bazi.naYin.month, pillar: bazi.monthPillar.ganZhi },
          { label: '日柱纳音', value: bazi.naYin.day, pillar: bazi.dayPillar.ganZhi },
          { label: '时柱纳音', value: bazi.naYin.hour, pillar: bazi.hourPillar.ganZhi },
        ].map((item, index) => (
          <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">{item.label}</p>
            <p className="text-amber-400 font-bold">{item.pillar}</p>
            <p className="text-gray-300 text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 五行统计 */}
      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-lg font-bold text-amber-300 mb-4 text-center">五行分析</h4>
        <div className="max-w-md mx-auto">
          {Object.entries(bazi.wuxingCount).map(([wx, count]) => renderWuxingBar(wx, count))}
        </div>        
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            日主<span className="text-amber-400 font-bold">{bazi.dayMaster}</span>属
            <span className={`font-bold ${wuxingColors[bazi.dayMasterWuxing]}`}>{bazi.dayMasterWuxing}</span>
            <span className="mx-2">|</span>
            最旺五行：
            <span className={`font-bold ${wuxingColors[Object.entries(bazi.wuxingCount).sort((a, b) => b[1] - a[1])[0][0]]}`}>
              {Object.entries(bazi.wuxingCount).sort((a, b) => b[1] - a[1])[0][0]}
            </span>
          </p>
        </div>
      </div>

      {/* 十神说明 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
        {Object.entries(shishenColors).filter(([k]) => k !== '日主').map(([name, color]) => (
          <div key={name} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`}></span>
            <span className="text-gray-400">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BaziDisplay;
