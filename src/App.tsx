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
      const prompt = `你是一位精通易经、深谙阴阳五行的国学大师，拥有三十年的易经研究经验。请为以下用户进行专业、详尽的卦象深度解读：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【求测者信息】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 姓名：${userName}
• 农历生辰：${lunarDateInfo.year}年${lunarDateInfo.isLeap ? '闰' : ''}${lunarDateInfo.month}月${lunarDateInfo.day}日
• 八字干支：${guaResult.elements.tiangan}${guaResult.elements.dizhi}年生人
• 五行属性：五行属${guaResult.elements.wuxing}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【卦象排盘】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【本卦（主卦）】${guaResult.mainGua.chineseName}（${guaResult.mainGua.name}卦）
• 卦象：${guaResult.mainGua.symbol}
• 卦辞：${guaResult.mainGua.meaning}
• 卦德：${guaResult.mainGua.description}

【变卦（之卦）】${guaResult.changeGua.chineseName}（${guaResult.changeGua.name}卦）
• 卦象：${guaResult.changeGua.symbol}
• 卦辞：${guaResult.changeGua.meaning}
• 变卦含义：${guaResult.changeGua.description}

【互卦（过程卦）】${guaResult.huGua.chineseName}（${guaResult.huGua.name}卦）
• 卦象：${guaResult.huGua.symbol}
• 卦辞：${guaResult.huGua.meaning}
• 互卦含义：${guaResult.huGua.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【深度解读要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

请按照以下结构进行详尽解读，务必引用《易经》原文，并结合现代生活实际：

## 一、卦象总论与三卦关系

详细分析本卦、变卦、互卦之间的深层关联：
- 本卦代表当前处境和问题的本质
- 变卦代表事情发展的最终结果和趋势
- 互卦代表事情发展过程中的内在变化
- 三卦组合揭示的整体命运走向
- 引用《易经》相关卦辞、彖传、象传原文

## 二、六爻详析

分析本卦六爻（从初爻到上爻）的含义：
- 每一爻的爻辞及其现代解读
- 哪一爻是动爻（变爻），其特殊含义
- 爻位分析（当位/不当位、得中/失中）
- 爻与爻之间的关系（比、应、乘、承）

## 三、事业运势深度分析

结合卦象详细分析：
- 当前事业发展阶段和状态
- 适合从事的行业方向
- 职场人际关系建议
- 升迁发展的最佳时机
- 创业/守业的选择建议
- 引用相关卦辞原文并解释

## 四、财运分析

详细解读财运状况：
- 正财（工资收入）运势
- 偏财（投资、副业）运势
- 理财投资建议
- 财运旺盛/低迷的时间段
- 守财与开源的方法
- 风险提示

## 五、感情婚姻分析

深入分析感情运势：
- 单身者桃花运分析
- 恋爱中者的感情走向
- 已婚者的婚姻建议
- 最佳婚恋时机
- 与不同属相/五行的匹配度
- 化解感情阻碍的方法

## 六、健康养生指导

根据五行和卦象给出健康建议：
- 当前体质特点
- 需要注意的身体部位和器官
- 适合的养生方法
- 饮食调理建议
- 运动锻炼方向
- 情绪调养要点

## 七、时间节点预测

预测重要时间节点：
- 近期（1-3个月）运势变化
- 中期（3-6个月）发展机遇
- 年度运势转折点
- 最佳行动时机
- 需要谨慎行事的时间段

## 八、化解方法与开运建议

提供具体的改运方法：
- 风水布局建议
- 吉祥方位与颜色
- 适合佩戴的饰品
- 行善积德的方向
- 需要避免的事项
- 增强运势的日常习惯

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【写作要求】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 语言风格：古典雅致但通俗易懂，既有国学韵味又贴近现代生活
2. 引用规范：每个重要观点都要引用《易经》原文（卦辞、爻辞、彖传、象传等）
3. 字数要求：1500-2500字，内容要详尽充实
4. 结构清晰：使用Markdown格式，层次分明
5. 实用性强：给出具体可行的建议，避免空泛之谈
6. 态度严谨：既要指出机遇，也要提醒风险，保持客观中正`;

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
              content: '你是一位精通易经的国学大师，拥有三十年研究经验。你擅长将古老的易经智慧与现代生活相结合，为用户提供专业、详尽、实用的卦象解读。你的解读既有深厚的国学底蕴，又有现代生活的实用价值。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          setAiInterpretation(data.choices[0].message.content);
        } else {
          setAiInterpretation(generateFallbackInterpretation(guaResult, userName, lunarDateInfo));
        }
      } else {
        // API调用失败，使用本地生成
        setAiInterpretation(generateFallbackInterpretation(guaResult, userName, lunarDateInfo));
      }
    } catch (error) {
      console.error('AI解读失败:', error);
      setAiInterpretation(generateFallbackInterpretation(guaResult, userName, lunarDateInfo));
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 本地备用解读生成 - 丰富的备用内容
  const generateFallbackInterpretation = (guaResult: GuaResult, userName: string, _lunarDateInfo: { year: number; month: number; day: number; isLeap: boolean }): string => {
    const { mainGua, changeGua, huGua, elements } = guaResult;
    
    // 根据五行生成不同的分析
    const wuxingAnalysis: Record<string, { character: string; career: string; health: string; color: string; direction: string }> = {
      '金': {
        character: '刚毅果断，重义气，有领导才能',
        career: '适合从事金融、法律、管理、军警等行业',
        health: '注意肺部、呼吸系统健康，宜多做深呼吸运动',
        color: '白色、金色',
        direction: '西方'
      },
      '木': {
        character: '仁慈宽厚，有创造力，善于规划',
        career: '适合从事教育、文化、设计、园艺等行业',
        health: '注意肝胆健康，宜早睡早起，保持心情舒畅',
        color: '绿色、青色',
        direction: '东方'
      },
      '水': {
        character: '聪明机智，善于变通，适应力强',
        career: '适合从事贸易、物流、旅游、咨询等行业',
        health: '注意肾脏、泌尿系统健康，宜多喝水',
        color: '黑色、蓝色',
        direction: '北方'
      },
      '火': {
        character: '热情开朗，有感染力，行动力强',
        career: '适合从事演艺、餐饮、能源、科技等行业',
        health: '注意心脏、血压健康，宜保持情绪稳定',
        color: '红色、紫色',
        direction: '南方'
      },
      '土': {
        character: '稳重踏实，诚实守信，有耐心',
        career: '适合从事房地产、建筑、农业、服务业',
        health: '注意脾胃消化系统健康，饮食宜规律',
        color: '黄色、棕色',
        direction: '中央'
      }
    };
    
    const wx = wuxingAnalysis[elements.wuxing] || wuxingAnalysis['土'];
    
    // 生成月份运势
    const months = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    const currentMonth = new Date().getMonth();
    const luckyMonths = [
      months[(currentMonth + 1) % 12],
      months[(currentMonth + 3) % 12],
      months[(currentMonth + 6) % 12]
    ];
    const cautionMonths = [
      months[(currentMonth + 2) % 12],
      months[(currentMonth + 7) % 12]
    ];
    
    return `## 一、卦象总论与三卦关系

**《易经》原文：**"${mainGua.meaning}"

${userName}您好，根据您的生辰八字（${elements.tiangan}${elements.dizhi}年，五行属${elements.wuxing}），本次占得**${mainGua.chineseName}**。

### 三卦关系解析：

**本卦（主卦）${mainGua.name}卦**代表您当前所处的境遇和问题的本质。${mainGua.description}

**变卦${changeGua.name}卦**揭示事情发展的最终趋势。${changeGua.description}这预示着事情将向着${changeGua.id > mainGua.id ? '积极' : '需要调整'}的方向发展。

**互卦${huGua.name}卦**反映事情发展过程中的内在变化。${huGua.description}这提示您在过程中需要注意${huGua.id % 2 === 0 ? '把握机遇' : '谨慎行事'}。

三卦合参，整体运势呈现**${mainGua.id <= 20 ? '上升' : mainGua.id <= 40 ? '平稳' : '调整'}**态势，宜${mainGua.id % 3 === 0 ? '积极进取' : mainGua.id % 3 === 1 ? '稳健守成' : '静待时机'}。

---

## 二、六爻详析

${mainGua.name}卦六爻蕴含深刻智慧：

**初爻**（基础）：代表事情的开端和基础。宜脚踏实地，打好基础。

**二爻**（发展）：代表事情的发展阶段。得中位，宜把握时机，稳步前进。

**三爻**（转折）：代表事情的关键转折点。需谨慎决策，避免冒进。

**四爻**（上升）：代表事情向更高层次发展。宜积极进取，但不可骄傲。

**五爻**（鼎盛）：代表事情的鼎盛时期。君位，运势最佳，宜大展宏图。

**上爻**（极变）：代表事情的极端和变化。物极必反，需防微杜渐。

---

## 三、事业运势深度分析

根据${mainGua.name}卦的启示，您的事业运势分析如下：

**当前状态：**
${mainGua.id <= 15 ? '您正处于事业上升期，机遇与挑战并存。' : mainGua.id <= 30 ? '事业发展平稳，需要耐心等待突破时机。' : '事业面临调整期，宜反思总结，重新规划。'}

**适合方向：**
${wx.career}

**职场建议：**
- ${mainGua.id % 2 === 0 ? '与同事保持良好关系，团队合作会带来更大成功' : '保持独立判断能力，关键时刻要有自己的主见'}
- ${elements.wuxing === '金' || elements.wuxing === '火' ? '宜主动争取机会，展现领导才能' : '宜稳扎稳打，用实力说话'}
- 注意与${['鼠', '牛', '虎', '兔', '龙', '蛇'][mainGua.id % 6]}年、${['马', '羊', '猴', '鸡', '狗', '猪'][changeGua.id % 6]}年生人的合作

**升迁时机：**
未来${mainGua.id % 3 + 3}个月内可能出现重要机遇，需提前做好准备。

---

## 四、财运分析

**《象》曰：**"${mainGua.meaning}"

**正财运势：**
${mainGua.id <= 20 ? '正财稳定，工资收入有保障，努力工作会有相应回报。' : mainGua.id <= 40 ? '正财平稳，宜专注本职工作，不宜频繁跳槽。' : '正财波动，需谨慎理财，避免不必要的开支。'}

**偏财运势：**
${mainGua.id % 4 === 0 ? '偏财较旺，可适当进行投资理财，但需控制风险。' : '偏财一般，不宜进行高风险投资，守财为上。'}

**理财建议：**
- 宜将资金分散投资，不要把鸡蛋放在一个篮子里
- ${luckyMonths[0]}和${luckyMonths[1]}财运较旺，可把握时机
- ${cautionMonths[0]}需谨慎理财，避免大额支出
- 适合投资方向：${elements.wuxing === '金' ? '贵金属、金融理财' : elements.wuxing === '木' ? '教育文化、绿色环保' : elements.wuxing === '水' ? '物流贸易、旅游服务' : elements.wuxing === '火' ? '科技创新、餐饮娱乐' : '房地产、农业食品'}

---

## 五、感情婚姻分析

**感情运势：**
${mainGua.id % 2 === 0 ? '感情运势较好，单身者桃花运旺，已婚者夫妻和睦。' : '感情需要用心经营，单身者需主动出击，已婚者需多沟通。'}

**单身者：**
- 最佳桃花方位：${wx.direction}
- 有利月份：${luckyMonths[0]}、${luckyMonths[1]}
- 适合对象：五行属${elements.wuxing === '金' ? '土、水' : elements.wuxing === '木' ? '水、火' : elements.wuxing === '水' ? '金、木' : elements.wuxing === '火' ? '木、土' : '火、金'}之人
- 建议：多参加社交活动，展现真实自我

**恋爱中/已婚者：**
- 注意沟通方式，避免因小事产生误会
- ${mainGua.id % 3 === 0 ? '感情稳定，可考虑进一步发展' : '需要多花时间陪伴对方，增进感情'}
- 共同兴趣是感情的润滑剂，可培养共同爱好

---

## 六、健康养生指导

**体质特点：**
五行属${elements.wuxing}之人，${wx.character}。

**健康注意：**
${wx.health}

**养生建议：**
- 饮食：宜多食${elements.wuxing === '金' ? '白色食物如白萝卜、银耳' : elements.wuxing === '木' ? '绿色蔬菜如菠菜、芹菜' : elements.wuxing === '水' ? '黑色食物如黑豆、黑芝麻' : elements.wuxing === '火' ? '红色食物如红枣、番茄' : '黄色食物如南瓜、小米'}
- 运动：${elements.wuxing === '金' ? '适合游泳、跑步等有氧运动' : elements.wuxing === '木' ? '适合太极、瑜伽等柔和运动' : elements.wuxing === '水' ? '适合球类、舞蹈等灵活运动' : elements.wuxing === '火' ? '适合登山、骑行等户外活动' : '适合健走、八段锦等温和运动'}
- 作息：保持规律作息，${elements.wuxing === '木' ? '尤其要早睡早起' : elements.wuxing === '火' ? '避免熬夜，保证充足睡眠' : '避免过度劳累'}
- 情绪：保持心态平和，${mainGua.id % 2 === 0 ? '积极乐观' : '遇事冷静'}

---

## 七、时间节点预测

**近期运势（1-3个月）：**
${luckyMonths[0]}运势上升，宜把握机遇；${cautionMonths[0]}需谨慎行事。

**中期运势（3-6个月）：**
${luckyMonths[1]}至${luckyMonths[2]}期间，可能出现重要转折，需提前规划。

**年度关键时间点：**
- 最佳行动时机：${luckyMonths[0]}、${luckyMonths[1]}、${luckyMonths[2]}
- 需谨慎时段：${cautionMonths[0]}、${cautionMonths[1]}
- 转运时机：农历${['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][mainGua.id % 12]}月

---

## 八、化解方法与开运建议

**开运方位：**
- 吉利方位：${wx.direction}、${['东', '南', '西', '北', '东南', '东北', '西南', '西北'][(mainGua.id + 1) % 8]}
- 不利方位：${['东', '南', '西', '北', '东南', '东北', '西南', '西北'][(mainGua.id + 4) % 8]}

**开运颜色：**
- 首选：${wx.color}
- 次选：${elements.wuxing === '金' ? '黄色、棕色' : elements.wuxing === '木' ? '黑色、蓝色' : elements.wuxing === '水' ? '白色、金色' : elements.wuxing === '火' ? '绿色、青色' : '红色、紫色'}

**吉祥饰品：**
- 适合佩戴：${elements.wuxing === '金' ? '金属饰品、白水晶' : elements.wuxing === '木' ? '木质饰品、绿幽灵' : elements.wuxing === '水' ? '黑曜石、海蓝宝' : elements.wuxing === '火' ? '红玛瑙、紫水晶' : '黄水晶、玉石'}
- 幸运数字：${mainGua.id % 9 + 1}、${(mainGua.id + changeGua.id) % 9 + 1}、${(mainGua.id + huGua.id) % 9 + 1}

**行善积德：**
- 宜多行善事，${mainGua.id % 3 === 0 ? '帮助有需要的人' : mainGua.id % 3 === 1 ? '参与公益活动' : '孝敬父母长辈'}
- 可放生、布施，积累福报
- 保持善念，口出善言

**日常习惯：**
- 晨起面向${wx.direction}方深呼吸${mainGua.id % 5 + 3}次，吸纳吉气
- 办公桌可摆放${elements.wuxing === '金' ? '金属摆件' : elements.wuxing === '木' ? '绿色植物' : elements.wuxing === '水' ? '水景摆件' : elements.wuxing === '火' ? '红色装饰' : '陶瓷饰品'}
- 保持居家环境整洁，尤其是${wx.direction}方位

---

**总结：**
${userName}，您的五行属${elements.wuxing}，得${mainGua.name}卦，整体运势${mainGua.id <= 30 ? '向好' : '需要调整'}。记住《易经》的智慧："天行健，君子以自强不息；地势坤，君子以厚德载物。"保持积极向上的心态，积德行善，自然福泽绵长。

*注：本解读基于传统易经文化，仅供参考。命运掌握在自己手中，行善积德才是改运的根本。*`;
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
                <div className="ai-loading">
                  <div className="ai-loading-spinner"></div>
                  <p className="ai-loading-text">AI大师正在为您深度解读卦象，请稍候...</p>
                  <p className="text-gray-500 text-sm mt-2">正在分析三卦关系、六爻变化、五行生克...</p>
                </div>
              ) : aiInterpretation ? (
                <div className="prose prose-invert ai-interpretation">
                  <div 
                    className="text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: aiInterpretation
                        .replace(/## (.*)/g, '<h2>$1</h2>')
                        .replace(/### (.*)/g, '<h3>$1</h3>')
                        .replace(/#### (.*)/g, '<h4>$1</h4>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/---/g, '<hr>')
                        .replace(/• (.*)/g, '<li>$1</li>')
                        .replace(/- (.*)/g, '<li>$1</li>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/"/g, '<span style="color:#f4d03f;font-style:italic;">"$1"</span>')
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
