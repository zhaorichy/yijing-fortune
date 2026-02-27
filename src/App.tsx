import React, { useState } from 'react';
import './index.css';
import { GuaResult } from './types';
import { calculateGua } from './yijing';
import GuaDisplay from './components/GuaDisplay';
import FortuneAnalysis from './components/FortuneAnalysis';
import LunarDatePicker from './components/LunarDatePicker';
// import { getTodayLunar } from './lunar';

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
    
    // Simulate calculation delay for dramatic effect
    setTimeout(async () => {
      const guaResult = calculateGua(name, lunarDate.solarDate, birthTime, {
        year: lunarDate.year,
        month: lunarDate.month,
        day: lunarDate.day,
        isLeap: lunarDate.isLeap
      });
      setResult(guaResult);
      setIsCalculating(false);
      
      // 自动调用AI解读
      await fetchAIInterpretation(guaResult, name, lunarDate);
    }, 1500);
  };

  const fetchAIInterpretation = async (guaResult: GuaResult, userName: string, lunarDateInfo: { year: number; month: number; day: number; isLeap: boolean }) => {
    setIsLoadingAI(true);
    try {
      // 构建提示词
      const prompt = `你是一位精通易经的国学大师。请为以下用户进行深度卦象解读：

【用户信息】
姓名：${userName}
农历生辰：${lunarDateInfo.year}年${lunarDateInfo.isLeap ? '闰' : ''}${lunarDateInfo.month}月${lunarDateInfo.day}日

【卦象信息】
本卦（主卦）：${guaResult.mainGua.chineseName}（${guaResult.mainGua.name}卦）
卦辞：${guaResult.mainGua.meaning}
卦象描述：${guaResult.mainGua.description}

变卦：${guaResult.changeGua.chineseName}（${guaResult.changeGua.name}卦）
卦辞：${guaResult.changeGua.meaning}

互卦：${guaResult.huGua.chineseName}（${guaResult.huGua.name}卦）
卦辞：${guaResult.huGua.meaning}

八字五行：${guaResult.elements.tiangan}${guaResult.elements.dizhi}，五行属${guaResult.elements.wuxing}

请从以下几个方面进行深度解读（请引用易经原文并给出现代解释）：

1. **卦象总论** - 结合本卦、变卦、互卦，分析整体运势走向
2. **事业财运** - 引用易经原文，分析事业发展方向和财运状况
3. **感情婚姻** - 引用相关卦辞，分析感情运势
4. **健康养生** - 根据五行和卦象，给出健康建议
5. **近期建议** - 针对未来3-6个月的具体建议

请用古典雅致但易懂的语言，既有易经原文引用，又有现代生活化的解释。字数控制在800-1200字左右。`;

      // 调用Kimi API
      const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-yijifortune'
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            {
              role: 'system',
              content: '你是一位精通易经的国学大师，擅长将古老的易经智慧与现代生活相结合，为用户提供深入浅出的卦象解读。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setAiInterpretation(data.choices[0].message.content);
        } else {
          setAiInterpretation(generateFallbackInterpretation(guaResult, userName));
        }
      } else {
        // API调用失败，使用本地生成
        setAiInterpretation(generateFallbackInterpretation(guaResult, userName));
      }
    } catch (error) {
      console.error('AI解读失败:', error);
      setAiInterpretation(generateFallbackInterpretation(guaResult, userName));
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 本地备用解读生成
  const generateFallbackInterpretation = (guaResult: GuaResult, userName: string): string => {
    const interpretations: Record<number, string> = {
      1: `## 乾卦深度解读

**《易经》原文：**"天行健，君子以自强不息。"

**卦象总论：**
${userName}得乾卦，此乃六十四卦之首，纯阳之象。乾为天，代表刚健、创造、领导力。此卦预示您天生具有领导才能，做事果断，有开创精神。

**事业财运：**
乾卦象征龙，有"飞龙在天"之象。事业上宜积极进取，把握机遇。财运亨通，正财偏财皆佳，但需谨记"亢龙有悔"，不可过于骄傲自满。

**感情婚姻：**
乾卦之人感情上宜主动追求，但需避免过于强势。与柔顺之人相配最佳，可成"天地交泰"之美。

**健康养生：**
阳气旺盛，身体强健。但需注意劳逸结合，避免过度消耗精力。宜早睡早起，保持规律作息。

**近期建议：**
未来数月宜把握时机，大展宏图。但需谨记谦虚谨慎，广结善缘，方能长久。`,
      
      2: `## 坤卦深度解读

**《易经》原文：**"地势坤，君子以厚德载物。"

**卦象总论：**
${userName}得坤卦，纯阴之象，代表大地、包容、承载。此卦预示您性格温和，善于包容，有母性光辉。

**事业财运：**
坤卦主守成，事业上宜稳扎稳打，不宜冒险。财运平稳，积少成多。与强势之人合作最佳，可互补长短。

**感情婚姻：**
坤卦之人感情上温柔体贴，是理想的伴侣。宜找有主见之人相配，可成"夫唱妇随"之美。

**健康养生：**
阴气平和，身体康健。需注意脾胃保养，饮食宜清淡规律。

**近期建议：**
未来数月宜守不宜攻，静待时机。多行善积德，自然福泽绵长。`,
      
      11: `## 泰卦深度解读

**《易经》原文：**"天地交而万物通也，上下交而其志同也。"

**卦象总论：**
${userName}得泰卦，此乃大吉之卦！天地交泰，阴阳和合，预示诸事顺利，万事如意。

**事业财运：**
泰卦象征通达，事业上贵人相助，机遇频现。财运亨通，投资获利。宜把握时机，积极进取。

**感情婚姻：**
感情美满，喜结良缘之象。单身者桃花旺盛，已婚者夫妻和睦。

**健康养生：**
身心愉悦，精神焕发。宜保持乐观心态，适度运动。

**近期建议：**
此乃难得的好运时期，宜大胆追求目标。但需谨记"居安思危"，不可骄奢淫逸。`
    };
    
    return interpretations[guaResult.mainGua.id] || `## ${guaResult.mainGua.chineseName}深度解读

**《易经》原文：**"${guaResult.mainGua.meaning}"

**卦象总论：**
${userName}得${guaResult.mainGua.name}卦，${guaResult.mainGua.description}

变卦为${guaResult.changeGua.name}，预示事情将有变化，${guaResult.changeGua.description}

互卦为${guaResult.huGua.name}，显示事情发展过程中，${guaResult.huGua.description}

**综合建议：**
${guaResult.advice}

**五行分析：**
您的八字五行属${guaResult.elements.wuxing}，${guaResult.elements.tiangan}${guaResult.elements.dizhi}年生人。

未来数月宜顺应天时，积德行善，自然吉祥如意。`;
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
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-pulse-glow">
            <span className="text-4xl">☯</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
          易经算命
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          探索古老智慧，解读命运密码
        </p>
      </header>

      {!result ? (
        /* Input Form */
        <div className="max-w-md mx-auto glass rounded-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-amber-300 text-sm font-medium mb-2">
                姓名
              </label>
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
              <label className="block text-amber-300 text-sm font-medium mb-2">
                农历出生日期
              </label>
              <LunarDatePicker 
                value={lunarDate} 
                onChange={handleLunarDateChange} 
              />
              {lunarDate && (
                <p className="text-gray-400 text-sm mt-2">
                  对应公历：{lunarDate.solarDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="birthTime" className="block text-amber-300 text-sm font-medium mb-2">
                出生时辰
              </label>
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
              ) : (
                '开始算命'
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Results Display */
        <div className="animate-fade-in space-y-8">
          <GuaDisplay result={result} />
          
          {/* AI深度解读 */}
          {(isLoadingAI || aiInterpretation) && (
            <div className="glass rounded-xl p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">AI大师深度解读</h3>
                  <p className="text-gray-400 text-sm">基于易经原文的智能分析</p>
                </div>
              </div>
              
              {isLoadingAI ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-10 w-10 text-amber-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-300">AI大师正在为您解读卦象...</p>
                  </div>
                </div>
              ) : aiInterpretation ? (
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="text-gray-200 leading-relaxed whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: aiInterpretation
                        .replace(/## (.*)/g, '<h3 class="text-xl font-bold text-amber-300 mt-6 mb-3">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200">$1</strong>')
                        .replace(/"([^"]*)"/g, '<span class="text-amber-400 italic">"$1"</span>')
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

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-500 text-sm">
        <p>本应用仅供娱乐参考，命运掌握在自己手中</p>
      </footer>
    </div>
  );
}

export default App;
