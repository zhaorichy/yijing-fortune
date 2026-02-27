import React from 'react';
import { GuaResult } from '../types';

interface FortuneAnalysisProps {
  result: GuaResult;
}

const FortuneAnalysis: React.FC<FortuneAnalysisProps> = ({ result }) => {
  const { fortune, advice } = result;

  const fortuneItems = [
    { key: 'overall', title: '总体运势', icon: '☯', color: 'from-purple-500 to-pink-500' },
    { key: 'career', title: '事业运势', icon: '💼', color: 'from-blue-500 to-cyan-500' },
    { key: 'love', title: '感情运势', icon: '❤️', color: 'from-red-500 to-pink-500' },
    { key: 'wealth', title: '财运分析', icon: '💰', color: 'from-amber-500 to-yellow-500' },
    { key: 'health', title: '健康运势', icon: '🏥', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold text-center mb-6">运势详解</h3>

      <div className="grid gap-4">
        {fortuneItems.map((item, index) => (
          <div
            key={item.key}
            className="glass rounded-xl p-5 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-amber-300 font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-300 leading-relaxed">
                  {fortune[item.key as keyof typeof fortune]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 建议 */}
      <div className="glass rounded-xl p-6 mt-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-xl">💡</span>
          </div>
          <h4 className="text-xl font-bold text-gold">大师建议</h4>
        </div>
        <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg p-4">
          <p className="text-gray-200 leading-relaxed text-lg">{advice}</p>
        </div>
      </div>

      {/* 吉祥提示 */}
      <div className="glass rounded-xl p-6 mt-6 animate-fade-in">
        <h4 className="text-lg font-semibold text-amber-300 mb-4 text-center">吉祥提示</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">幸运数字</p>
            <p className="text-2xl font-bold text-amber-400">{Math.floor(Math.random() * 9) + 1}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">幸运方位</p>
            <p className="text-lg font-bold text-amber-400">{['东', '南', '西', '北', '东南', '东北', '西南', '西北'][Math.floor(Math.random() * 8)]}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">幸运颜色</p>
            <p className="text-lg font-bold text-amber-400">{['红', '黄', '蓝', '绿', '紫', '白'][Math.floor(Math.random() * 6)]}</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <p className="text-gray-400 text-xs mb-1">贵人属相</p>
            <p className="text-lg font-bold text-amber-400">{['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'][Math.floor(Math.random() * 12)]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FortuneAnalysis;
