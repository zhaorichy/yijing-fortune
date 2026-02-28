import React from 'react';
import { GuaResult } from '../types';

interface GuaDisplayProps {
  result: GuaResult;
}

const GuaDisplay: React.FC<GuaDisplayProps> = ({ result }) => {
  const { mainGua, changeGua, huGua } = result;

  // 渲染爻线
  const renderYao = (isYang: boolean, index: number) => {
    return (
      <div key={index} className="flex justify-center my-2">
        {isYang ? (
          <div className="yao-yang w-32" />
        ) : (
          <div className="yao-yin w-32" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* 主卦 */}
      <div className="glass rounded-xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <p className="text-amber-300 text-sm mb-2">本卦</p>
          <h2 className="text-3xl font-bold text-gold mb-2">{mainGua.chineseName}</h2>
          <p className="text-5xl my-4">{mainGua.symbol}</p>
          <p className="text-gray-300 italic">"{mainGua.meaning}"</p>
        </div>

        <div className="flex flex-col-reverse items-center mb-6">
          {mainGua.lines.map((line, index) => renderYao(line, index))}
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-gray-300 leading-relaxed">{mainGua.description}</p>
        </div>
      </div>

      {/* 互卦和变卦 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 animate-fade-in">
          <div className="text-center mb-4">
            <p className="text-amber-300 text-sm mb-1">互卦</p>
            <h3 className="text-xl font-bold text-gold">{huGua.chineseName}</h3>
            <p className="text-3xl my-2">{huGua.symbol}</p>
          </div>
          <div className="flex flex-col-reverse items-center">
            {huGua.lines.map((line, index) => (
              <div key={index} className="flex justify-center my-1">
                {line ? (
                  <div className="yao-yang w-20" />
                ) : (
                  <div className="yao-yin w-20" />
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4 text-center">{huGua.meaning}</p>
        </div>

        <div className="glass rounded-xl p-6 animate-fade-in">
          <div className="text-center mb-4">
            <p className="text-amber-300 text-sm mb-1">变卦</p>
            <h3 className="text-xl font-bold text-gold">{changeGua.chineseName}</h3>
            <p className="text-3xl my-2">{changeGua.symbol}</p>
          </div>
          <div className="flex flex-col-reverse items-center">
            {changeGua.lines.map((line, index) => (
              <div key={index} className="flex justify-center my-1">
                {line ? (
                  <div className="yao-yang w-20" />
                ) : (
                  <div className="yao-yin w-20" />
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4 text-center">{changeGua.meaning}</p>
        </div>
      </div>
    </div>
  );
};

export default GuaDisplay;
