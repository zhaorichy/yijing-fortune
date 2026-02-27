import React, { useState } from 'react';
import './index.css';
import { GuaResult } from './types';
import { calculateGua } from './yijing';
import GuaDisplay from './components/GuaDisplay';
import FortuneAnalysis from './components/FortuneAnalysis';
import LunarDatePicker from './components/LunarDatePicker';
import BaziDisplay from './components/BaziDisplay';

function App() {
  const [name, setName] = useState('');
  const [lunarDate, setLunarDate] = useState<{ year: number; month: number; day: number; isLeap: boolean; solarDate: string } | null>(null);
  const [birthTime, setBirthTime] = useState('12:00');
  const [result, setResult] = useState<GuaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleLunarDateChange = (value: { year: number; month: number; day: number; isLeap: boolean; solarDate: string }) => {
    setLunarDate(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !lunarDate) return;

    setIsCalculating(true);
    setAiInterpretation(null);
    
    setTimeout(async () => {
      const guaResult = calculateGua(name, lunarDate.solarDate, birthTime, {
        year: lunarDate.year,
        month: lunarDate.month,
        day: lunarDate.day,
        isLeap: lunarDate.isLeap
      });
      setResult(guaResult);
      setIsCalculating(false);
      
      await fetchAIInterpretation(guaResult, name, lunarDate);
    }, 1500);
  };

  const fetchAIInterpretation = async (guaResult: GuaResult, userName: string, lunarDateInfo: { year: number; month: number; day: number; isLeap: boolean }) => {
    setIsLoadingAI(true);
    try {
      const prompt = `你是一位精通易经、深谙阴阳五行的国学大师。请根据以下信息进行专业、详尽的命理分析。

【重要提示】请根据用户提供的农历生辰，自行计算准确的八字排盘、生肖属相、五行分析等所有命理信息。不要依赖任何外部计算结果。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【用户基本信息】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 姓名：${userName}
• 农历生辰：${lunarDateInfo.year}年${lunarDateInfo.isLeap ? '闰' : ''}${lunarDateInfo.month}月${lunarDateInfo.day}日
• 出生时辰：${birthTime}

【你需要计算的内容】
1. 准确的生肖属相（农历1992年是猴年，1990年是马年，1991年是羊年，1993年是鸡年）
2. 完整的八字四柱（年柱、月柱、日柱、时柱）
3. 日主（日干）及五行属性
4. 十神配置（比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印）
5. 地支藏干
6. 纳音五行
7. 五行统计（金木水火土各几个）
8. 八字格局分析

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【卦象信息】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本卦：${guaResult.mainGua.chineseName}（${guaResult.mainGua.name}卦）
卦辞：${guaResult.mainGua.meaning}

变卦：${guaResult.changeGua.chineseName}（${guaResult.changeGua.name}卦）
卦辞：${guaResult.changeGua.meaning}

互卦：${guaResult.huGua.chineseName}（${guaResult.huGua.name}卦）
卦辞：${guaResult.huGua.meaning}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【解读要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请按照以下结构进行详细解读：

## 一、八字命理总论

首先展示你计算的八字排盘：
- 生肖属相：XXX
- 八字：XX XX XX XX
- 日主：XXX
- 五行分析：XXX

然后进行命理分析...

## 二、卦象与八字综合分析

结合卦象和八字进行深度解读...

## 三、事业财运分析

## 四、感情婚姻分析

## 五、健康养生指导

## 六、流年运势与开运建议

## 七、综合建议与吉祥提示

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【写作要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 务必确保生肖计算准确（1992年=猴，1990年=马，1991年=羊，1993年=鸡）
2. 引用《易经》原文进行卦象解读
3. 结合八字五行进行综合分析
4. 给出具体可行的建议
5. 字数2000-3000字`;

      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-5urvjUy4SMNusnnxLaFbxtu3LQMisLvEEsGJgPL8wfnzWAaL'
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: '你是一位精通易经和八字命理的国学大师，擅长根据农历生辰准确计算八字排盘，并结合卦象进行专业解读。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setAiInterpretation(data.choices[0].message.content);
        } else {
          setAiInterpretation('AI解读生成失败：' + JSON.stringify(data));
        }
      } else {
        const errorText = await response.text();
        setAiInterpretation('AI服务错误：' + response.status + ' ' + errorText);
      }
    } catch (error) {
      console.error('AI解读失败:', error);
      setAiInterpretation('网络错误，请检查连接后重试。');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setAiInterpretation(null);
    setName('');
    setLunarDate(null);
    setBirthTime('12:00');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-pulse-glow">
            <span className="text-4xl">☯</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">易经算命</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">探索古老智慧，解读命运密码</p>
      </header>

      {!result ? (
        <div className="max-w-md mx-auto glass rounded-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-amber-300 text-sm font-medium mb-2">姓名</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm font-medium mb-2">农历出生日期</label>
              <LunarDatePicker value={lunarDate} onChange={handleLunarDateChange} />
            </div>

            <div>
              <label htmlFor="birthTime" className="block text-amber-300 text-sm font-medium mb-2">出生时辰</label>
              <input
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating || !lunarDate}
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-lg hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  正在推算...
                </span>
              ) : '开始算命'}
            </button>
          </form>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8">
          <div className="glass rounded-xl p-6 text-center animate-fade-in">
            <h3 className="text-xl font-bold text-gold mb-4">求测者信息</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">姓名</p>
                <p className="text-xl font-bold text-amber-400">{name}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">农历生辰</p>
                <p className="text-xl font-bold text-amber-400">
                  {lunarDate?.year}年{lunarDate?.isLeap ? '闰' : ''}{lunarDate?.month ? ['正','二','三','四','五','六','七','八','九','十','冬','腊'][lunarDate.month - 1] : ''}月{lunarDate?.day ? ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'][lunarDate.day - 1] : ''}
                </p>
              </div>
            </div>
          </div>
          
          <GuaDisplay result={result} />
          
          {result.bazi && <BaziDisplay bazi={result.bazi} />}
          
          {(isLoadingAI || aiInterpretation) && (
            <div className="glass rounded-xl p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">AI大师深度解读</h3>
                  <p className="text-gray-400 text-sm">基于易经与八字的智能分析</p>
                </div>
              </div>
              
              {isLoadingAI ? (
                <div className="ai-loading">
                  <div className="ai-loading-spinner"></div>
                  <p className="ai-loading-text">AI大师正在为您深度解读...</p>
                  <p className="text-gray-500 text-sm mt-2">正在计算八字排盘、分析卦象...</p>
                </div>
              ) : aiInterpretation ? (
                <div className="prose prose-invert ai-interpretation">
                  <div 
                    className="text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: aiInterpretation
                        .replace(/## (.*)/g, '<h2>$1</h2>')
                        .replace(/### (.*)/g, '<h3>$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n\n/g, '</p><p>')
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}
          
          <FortuneAnalysis result={result} />
          
          <div className="text-center">
            <button
              onClick={resetForm}
              className="px-8 py-3 rounded-lg border-2 border-amber-500 text-amber-400 font-medium hover:bg-amber-500 hover:text-white transition-all"
            >
              重新测算
            </button>
          </div>
        </div>
      )}

      <footer className="text-center mt-16 text-gray-500 text-sm">
        <p>本应用仅供娱乐参考，命运掌握在自己手中</p>
      </footer>
    </div>
  );
}

export default App;
