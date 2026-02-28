import React, { useState } from 'react';
import './index.css';
import { GuaResult } from './types';
import { calculateGua } from './yijing';
import GuaDisplay from './components/GuaDisplay';
import LunarDatePicker from './components/LunarDatePicker';

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

【八字计算规则 - 务必严格遵守】
1. 年柱：以农历年份为准，立春前算上一年。天干地支按60甲子循环
2. 月柱：按节气划分月份，不是按农历初一。正月立春、二月惊蛰、三月清明、四月立夏、五月芒种、六月小暑、七月立秋、八月白露、九月寒露、十月立冬、冬月大雪、腊月小寒
3. 日柱：根据公历日期计算，使用万年历公式或已知基准推算
4. 时柱：根据日干推算时干，子时为23:00-1:00，丑时1:00-3:00，以此类推

【生肖计算规则】
生肖以农历年为准，立春为分界。立春前属上一年生肖。
• 鼠年：2020、2008、1996、1984、1972、1960
• 牛年：2021、2009、1997、1985、1973、1961
• 虎年：2022、2010、1998、1986、1974、1962
• 兔年：2023、2011、1999、1987、1975、1963
• 龙年：2024、2012、2000、1988、1976、1964
• 蛇年：2025、2013、2001、1989、1977、1965
• 马年：2026、2014、2002、1990、1978、1966
• 羊年：2027、2015、2003、1991、1979、1967
• 猴年：2028、2016、2004、1992、1980、1968
• 鸡年：2029、2017、2005、1993、1981、1969
• 狗年：2030、2018、2006、1994、1982、1970
• 猪年：2031、2019、2007、1995、1983、1971

【天干地支对照】
天干：甲(1)、乙(2)、丙(3)、丁(4)、戊(5)、己(6)、庚(7)、辛(8)、壬(9)、癸(10)
地支：子(1)、丑(2)、寅(3)、卯(4)、辰(5)、巳(6)、午(7)、未(8)、申(9)、酉(10)、戌(11)、亥(12)

【五行属性】
甲乙属木，丙丁属火，戊己属土，庚辛属金，壬癸属水
寅卯属木，巳午属火，申酉属金，亥子属水，辰戌丑未属土

【十神定义】
以日干为"日主"，其他干支相对于日主的关系：
• 比肩：同我且同阴阳（如甲见甲）
• 劫财：同我且异阴阳（如甲见乙）
• 食神：我生且同阴阳（如甲见丙）
• 伤官：我生且异阴阳（如甲见丁）
• 偏财：我克且同阴阳（如甲见戊）
• 正财：我克且异阴阳（如甲见己）
• 七杀：克我且同阴阳（如甲见庚）
• 正官：克我且异阴阳（如甲见辛）
• 偏印：生我且同阴阳（如甲见壬）
• 正印：生我且异阴阳（如甲见癸）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【卦象信息】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本卦：${guaResult.mainGua.chineseName}（${guaResult.mainGua.name}卦）
卦辞：${guaResult.mainGua.meaning}
卦象：${guaResult.mainGua.description}

变卦：${guaResult.changeGua.chineseName}（${guaResult.changeGua.name}卦）
卦辞：${guaResult.changeGua.meaning}
卦象：${guaResult.changeGua.description}

互卦：${guaResult.huGua.chineseName}（${guaResult.huGua.name}卦）
卦辞：${guaResult.huGua.meaning}
卦象：${guaResult.huGua.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【解读要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请按照以下结构进行详细解读：

## 一、八字命理总论

首先展示你计算的八字排盘：
- 公历生日：XXX年XX月XX日
- 农历生日：XXX年XX月XX日
- 生肖属相：XXX（说明计算依据）
- 八字四柱：
  * 年柱：XX（天干地支）
  * 月柱：XX（天干地支）
  * 日柱：XX（天干地支）- 日主
  * 时柱：XX（天干地支）
- 日主：XXX（五行属性）
- 地支藏干：
  * 年支藏：XX
  * 月支藏：XX
  * 日支藏：XX
  * 时支藏：XX
- 纳音五行：年柱XX、月柱XX、日柱XX、时柱XX
- 五行统计：金X个、木X个、水X个、火X个、土X个
- 十神配置：（列出各柱的十神关系）
- 八字格局：XXX（如正官格、七杀格、食神格等）

然后进行命理分析，包括身强身弱判断、喜用神分析等。

## 二、卦象与八字综合分析

结合本卦、变卦、互卦与八字进行深入解读：
1. 本卦代表当前状况，与八字命局的关系
2. 变卦代表发展趋势，与大运流年的呼应
3. 互卦代表内在因素，与性格命运的关联
引用《易经》原文进行卦象解读，结合八字五行进行综合分析。

## 三、事业财运分析

根据八字格局和卦象，分析：
1. 适合从事的行业方向
2. 财运走势和理财建议
3. 事业发展的关键时机

## 四、感情婚姻分析

分析八字中的婚姻宫和配偶星，结合卦象：
1. 感情运势特点
2. 婚姻状况预测
3. 相处建议

## 五、健康养生指导

根据八字五行平衡和卦象提示：
1. 体质特点分析
2. 需要注意的脏腑
3. 养生调理建议

## 六、流年运势与开运建议

分析当前大运和流年：
1. 近期运势走向
2. 吉凶方位指引
3. 开运颜色、数字、饰品等建议

## 七、综合建议与吉祥提示

1. 人生发展建议
2. 需要注意的事项
3. 吉祥提示（幸运数字、幸运方位、幸运颜色、贵人属相）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【写作要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 务必确保生肖和八字计算准确，这是基础
2. 引用《易经》原文进行卦象解读，增加权威性
3. 结合八字五行进行综合分析，不要孤立看卦
4. 给出具体可行的建议，避免空泛
5. 语气要专业但不失亲切，像一位资深命理大师
6. 字数2000-3500字，内容要充实`;

      const response = await fetch('https://api.kimi.com/coding/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-kimi-WH9bxUx5E6aip6ftwHf0PLdA2kZhXVGBf5uvxAixNmo4bqhYdvAvwK3kgPagjty1'
        },
        body: JSON.stringify({
          model: 'k2p5',
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

          {(isLoadingAI || aiInterpretation) && (
            <div className="glass rounded-xl p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gold">大师深度解读</h3>
                  <p className="text-gray-400 text-sm">基于易经与八字的智能分析</p>
                </div>
              </div>

              {isLoadingAI ? (
                <div className="ai-loading">
                  <div className="fortune-tube-shake">🎋</div>
                  <p className="ai-loading-text">大师正在测算中...</p>
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
                        .replace(/(\d+)\.\s+/g, '<br/>$1. ')
                        .replace(/\n\n/g, '</p><p>')
                    }}
                  />
                </div>
              ) : null}
            </div>
          )}

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
