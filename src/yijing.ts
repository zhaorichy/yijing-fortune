import { Gua, GuaResult } from './types';

// 64卦数据
const guaData: Gua[] = [
  { id: 1, name: '乾', chineseName: '乾为天', symbol: '☰', lines: [true, true, true, true, true, true], meaning: '天行健，君子以自强不息', description: '乾卦象征天，代表刚健、创造、领导。此卦大吉，预示事业顺利，前途光明。' },
  { id: 2, name: '坤', chineseName: '坤为地', symbol: '☷', lines: [false, false, false, false, false, false], meaning: '地势坤，君子以厚德载物', description: '坤卦象征地，代表柔顺、包容、承载。此卦主吉，预示顺应自然，收获丰厚。' },
  { id: 3, name: '屯', chineseName: '水雷屯', symbol: '☳☵', lines: [false, false, true, false, true, false], meaning: '云雷，屯，君子以经纶', description: '屯卦象征万物初生，充满艰难但蕴含希望。宜守不宜进，等待时机。' },
  { id: 4, name: '蒙', chineseName: '山水蒙', symbol: '☵☶', lines: [false, true, false, true, false, false], meaning: '山下出泉，蒙，君子以果行育德', description: '蒙卦象征启蒙教育，需要耐心引导。宜学习进修，虚心求教。' },
  { id: 5, name: '需', chineseName: '水天需', symbol: '☰☵', lines: [true, true, true, false, true, false], meaning: '云上于天，需，君子以饮食宴乐', description: '需卦象征等待，时机未到需耐心。宜守成，不宜冒进。' },
  { id: 6, name: '讼', chineseName: '天水讼', symbol: '☵☰', lines: [false, true, false, true, true, true], meaning: '天与水违行，讼，君子以作事谋始', description: '讼卦象征争讼，宜和解不宜争斗。谨言慎行，避免冲突。' },
  { id: 7, name: '师', chineseName: '地水师', symbol: '☵☷', lines: [false, true, false, false, false, false], meaning: '地中有水，师，君子以容民畜众', description: '师卦象征军队，需要纪律和领导。宜团结众人，共同奋斗。' },
  { id: 8, name: '比', chineseName: '水地比', symbol: '☷☵', lines: [false, false, false, false, true, false], meaning: '地上有水，比，先王以建万国亲诸侯', description: '比卦象征亲近团结，需要诚信相待。宜合作，不宜独行。' },
  { id: 9, name: '小畜', chineseName: '风天小畜', symbol: '☰☴', lines: [true, true, true, true, false, true], meaning: '风行天上，小畜，君子以懿文德', description: '小畜卦象征小有积蓄，力量尚弱。宜积累，不宜大展。' },
  { id: 10, name: '履', chineseName: '天泽履', symbol: '☱☰', lines: [true, true, true, true, true, false], meaning: '上天下泽，履，君子以辨上下定民志', description: '履卦象征谨慎行走，需要循规蹈矩。宜稳健行事，不宜冒险。' },
  { id: 11, name: '泰', chineseName: '地天泰', symbol: '☰☷', lines: [true, true, true, false, false, false], meaning: '天地交，泰，后以财成天地之道', description: '泰卦象征通泰，天地交合，大吉之卦。诸事顺利，万事如意。' },
  { id: 12, name: '否', chineseName: '天地否', symbol: '☷☰', lines: [false, false, false, true, true, true], meaning: '天地不交，否，君子以俭德辟难', description: '否卦象征闭塞不通，天地不交。宜守不宜进，等待转机。' },
  { id: 13, name: '同人', chineseName: '天火同人', symbol: '☲☰', lines: [true, true, true, true, false, true], meaning: '天与火，同人，君子以类族辨物', description: '同人卦象征志同道合，与人同心。宜合作共事，广结善缘。' },
  { id: 14, name: '大有', chineseName: '火天大有', symbol: '☰☲', lines: [true, true, true, false, true, true], meaning: '火在天上，大有，君子以遏恶扬善', description: '大有卦象征大丰收，拥有很多。大吉之卦，财运亨通。' },
  { id: 15, name: '谦', chineseName: '地山谦', symbol: '☶☷', lines: [false, false, false, true, false, false], meaning: '地中有山，谦，君子以裒多益寡', description: '谦卦象征谦虚，是六十四卦中唯一全吉之卦。谦虚受益，骄傲招损。' },
  { id: 16, name: '豫', chineseName: '雷地豫', symbol: '☷☳', lines: [false, false, false, false, false, true], meaning: '雷出地奋，豫，先王以作乐崇德', description: '豫卦象征喜悦安乐，但需防乐极生悲。宜适度享乐，不可放纵。' },
  { id: 17, name: '随', chineseName: '泽雷随', symbol: '☳☱', lines: [false, false, true, true, true, false], meaning: '泽中有雷，随，君子以向晦入宴息', description: '随卦象征随从，顺应时势。宜随遇而安，灵活应变。' },
  { id: 18, name: '蛊', chineseName: '山风蛊', symbol: '☴☶', lines: [true, true, false, true, false, false], meaning: '山下有风，蛊，君子以振民育德', description: '蛊卦象征腐败生虫，需要革新整治。宜改革除弊，重振旗鼓。' },
  { id: 19, name: '临', chineseName: '地泽临', symbol: '☱☷', lines: [false, false, false, false, true, true], meaning: '泽上有地，临，君子以教思无穷', description: '临卦象征临近督导，居高临下。宜督导管理，关怀下属。' },
  { id: 20, name: '观', chineseName: '风地观', symbol: '☷☴', lines: [false, true, true, false, false, false], meaning: '风行地上，观，先王以省方观民设教', description: '观卦象征观察瞻仰，需要审时度势。宜观察学习，不宜贸然行动。' },
  { id: 21, name: '噬嗑', chineseName: '火雷噬嗑', symbol: '☳☲', lines: [false, false, true, false, true, true], meaning: '雷电，噬嗑，先王以明罚勅法', description: '噬嗑卦象征咬合，需要果断执法。宜严明法度，惩治邪恶。' },
  { id: 22, name: '贲', chineseName: '山火贲', symbol: '☲☶', lines: [true, false, true, true, false, false], meaning: '山下有火，贲，君子以明庶政', description: '贲卦象征文饰美化，需要内外兼修。宜注重仪表，但更重实质。' },
  { id: 23, name: '剥', chineseName: '山地剥', symbol: '☶☷', lines: [false, false, false, false, false, true], meaning: '山附于地，剥，上以厚下安宅', description: '剥卦象征剥落，阴盛阳衰。宜退守自保，等待时机。' },
  { id: 24, name: '复', chineseName: '地雷复', symbol: '☷☳', lines: [false, false, false, false, false, true], meaning: '雷在地中，复，先王以至日闭关', description: '复卦象征回复，一阳来复。预示转机将至，希望重生。' },
  { id: 25, name: '无妄', chineseName: '天雷无妄', symbol: '☳☰', lines: [true, true, true, false, false, true], meaning: '天下雷行，物与无妄，先王以茂对时育万物', description: '无妄卦象征真实无妄，不可妄为。宜守正道，不可投机取巧。' },
  { id: 26, name: '大畜', chineseName: '山天大畜', symbol: '☰☶', lines: [true, true, true, true, false, false], meaning: '天在山中，大畜，君子以多识前言往行', description: '大畜卦象征大有积蓄，力量强大。宜厚积薄发，等待时机。' },
  { id: 27, name: '颐', chineseName: '山雷颐', symbol: '☳☶', lines: [true, false, false, false, false, true], meaning: '山下有雷，颐，君子以慎言语节饮食', description: '颐卦象征颐养，注重养生。宜注重健康，节制饮食。' },
  { id: 28, name: '大过', chineseName: '泽风大过', symbol: '☴☱', lines: [true, true, false, false, true, true], meaning: '泽灭木，大过，君子以独立不惧', description: '大过卦象征大为过度，阳刚过盛。宜谨慎行事，避免极端。' },
  { id: 29, name: '坎', chineseName: '坎为水', symbol: '☵', lines: [false, true, false, false, true, false], meaning: '水洊至，习坎，君子以常德行习教事', description: '坎卦象征水，重重险陷。宜谨慎小心，渡过难关。' },
  { id: 30, name: '离', chineseName: '离为火', symbol: '☲', lines: [true, false, true, true, false, true], meaning: '明两作，离，大人以继明照于四方', description: '离卦象征火，光明美丽。宜光明正大，展现才华。' },
  { id: 31, name: '咸', chineseName: '泽山咸', symbol: '☶☱', lines: [true, false, false, true, true, false], meaning: '山上有泽，咸，君子以虚受人', description: '咸卦象征感应，男女相感。宜真诚待人，感情交流。' },
  { id: 32, name: '恒', chineseName: '雷风恒', symbol: '☴☳', lines: [true, true, false, false, true, true], meaning: '雷风，恒，君子以立不易方', description: '恒卦象征恒久，持之以恒。宜坚持不懈，始终如一。' },
  { id: 33, name: '遁', chineseName: '天山遁', symbol: '☶☰', lines: [true, true, true, true, false, false], meaning: '天下有山，遁，君子以远小人', description: '遁卦象征退避，远离小人。宜退守自保，明哲保身。' },
  { id: 34, name: '大壮', chineseName: '雷天大壮', symbol: '☰☳', lines: [true, true, true, false, false, true], meaning: '雷在天上，大壮，君子以非礼弗履', description: '大壮卦象征大为强盛，阳气壮盛。宜守正道，不可恃强凌弱。' },
  { id: 35, name: '晋', chineseName: '火地晋', symbol: '☷☲', lines: [false, true, true, false, false, false], meaning: '明出地上，晋，君子以自昭明德', description: '晋卦象征晋升，前途光明。宜积极进取，展现才能。' },
  { id: 36, name: '明夷', chineseName: '地火明夷', symbol: '☲☷', lines: [false, false, false, true, false, true], meaning: '明入地中，明夷，君子以莅众用晦', description: '明夷卦象征光明受伤，时运不济。宜韬光养晦，隐藏锋芒。' },
  { id: 37, name: '家人', chineseName: '风火家人', symbol: '☲☴', lines: [true, false, true, false, true, true], meaning: '风自火出，家人，君子以言有物', description: '家人卦象征家庭，治家之道。宜重视家庭，和睦相处。' },
  { id: 38, name: '睽', chineseName: '火泽睽', symbol: '☱☲', lines: [true, true, false, true, false, true], meaning: '上火下泽，睽，君子以同而异', description: '睽卦象征乖离，意见不合。宜求同存异，化解矛盾。' },
  { id: 39, name: '蹇', chineseName: '水山蹇', symbol: '☶☵', lines: [true, false, false, false, true, false], meaning: '山上有水，蹇，君子以反身修德', description: '蹇卦象征艰难，前行困难。宜反省自身，修养德行。' },
  { id: 40, name: '解', chineseName: '雷水解', symbol: '☵☳', lines: [false, false, true, false, false, true], meaning: '雷雨作，解，君子以赦过宥罪', description: '解卦象征解脱，困难解除。宜宽宏大量，化解恩怨。' },
  { id: 41, name: '损', chineseName: '山泽损', symbol: '☱☶', lines: [true, true, false, false, false, true], meaning: '山下有泽，损，君子以惩忿窒欲', description: '损卦象征减损，有所失才能有所得。宜减损私欲，增益德行。' },
  { id: 42, name: '益', chineseName: '风雷益', symbol: '☳☴', lines: [true, false, false, true, true, true], meaning: '风雷，益，君子以见善则迁', description: '益卦象征增益，受益良多。大吉之卦，诸事顺遂。' },
  { id: 43, name: '夬', chineseName: '泽天夬', symbol: '☰☱', lines: [true, true, true, true, true, false], meaning: '泽上于天，夬，君子以施禄及下', description: '夬卦象征决断，果断决策。宜果断行事，不可犹豫。' },
  { id: 44, name: '姤', chineseName: '天风姤', symbol: '☴☰', lines: [true, true, true, true, true, false], meaning: '天下有风，姤，后以施命诰四方', description: '姤卦象征相遇，不期而遇。宜把握机遇，但需谨慎。' },
  { id: 45, name: '萃', chineseName: '泽地萃', symbol: '☷☱', lines: [false, false, false, true, true, false], meaning: '泽上于地，萃，君子以除戎器', description: '萃卦象征聚集，众人聚集。宜团结合作，共创大业。' },
  { id: 46, name: '升', chineseName: '地风升', symbol: '☴☷', lines: [false, true, true, false, false, false], meaning: '地中生木，升，君子以顺德积小', description: '升卦象征上升，步步高升。宜循序渐进，稳步上升。' },
  { id: 47, name: '困', chineseName: '泽水困', symbol: '☵☱', lines: [true, true, false, false, true, false], meaning: '泽无水，困，君子以致命遂志', description: '困卦象征困穷，处境艰难。宜坚守志向，渡过难关。' },
  { id: 48, name: '井', chineseName: '水风井', symbol: '☴☵', lines: [true, false, true, false, false, true], meaning: '木上有水，井，君子以劳民劝相', description: '井卦象征水井，养人无穷。宜服务大众，造福社会。' },
  { id: 49, name: '革', chineseName: '泽火革', symbol: '☲☱', lines: [true, true, false, true, false, true], meaning: '泽中有火，革，君子以治历明时', description: '革卦象征变革，除旧布新。宜适时变革，推陈出新。' },
  { id: 50, name: '鼎', chineseName: '火风鼎', symbol: '☴☲', lines: [true, false, true, true, true, true], meaning: '木上有火，鼎，君子以正位凝命', description: '鼎卦象征鼎器，稳重革新。宜稳固基础，创新求变。' },
  { id: 51, name: '震', chineseName: '震为雷', symbol: '☳', lines: [false, false, true, false, false, true], meaning: '洊雷，震，君子以恐惧修省', description: '震卦象征雷动，震惊百里。宜谨慎小心，修省自身。' },
  { id: 52, name: '艮', chineseName: '艮为山', symbol: '☶', lines: [true, false, false, true, false, false], meaning: '兼山，艮，君子以思不出其位', description: '艮卦象征山，静止不动。宜适可而止，不宜妄动。' },
  { id: 53, name: '渐', chineseName: '风山渐', symbol: '☶☴', lines: [true, false, false, true, false, true], meaning: '山上有木，渐，君子以居贤德善俗', description: '渐卦象征渐进，循序渐进。宜稳步前进，不可急躁。' },
  { id: 54, name: '归妹', chineseName: '雷泽归妹', symbol: '☱☳', lines: [true, true, false, false, true, false], meaning: '泽上有雷，归妹，君子以永终知敝', description: '归妹卦象征嫁女，婚姻之事。宜慎重考虑，不可轻率。' },
  { id: 55, name: '丰', chineseName: '雷火丰', symbol: '☲☳', lines: [true, true, false, false, true, true], meaning: '雷电皆至，丰，君子以折狱致刑', description: '丰卦象征丰盛，盛大光明。宜把握时机，大展宏图。' },
  { id: 56, name: '旅', chineseName: '火山旅', symbol: '☳☲', lines: [false, false, true, true, false, true], meaning: '山上有火，旅，君子以明慎用刑', description: '旅卦象征旅行，漂泊在外。宜谨慎小心，明哲保身。' },
  { id: 57, name: '巽', chineseName: '巽为风', symbol: '☴', lines: [true, true, false, true, true, false], meaning: '随风，巽，君子以申命行事', description: '巽卦象征风，柔顺进入。宜谦逊柔顺，循序渐进。' },
  { id: 58, name: '兑', chineseName: '兑为泽', symbol: '☱', lines: [true, true, false, true, true, true], meaning: '丽泽，兑，君子以朋友讲习', description: '兑卦象征泽，喜悦和乐。宜和悦待人，广交朋友。' },
  { id: 59, name: '涣', chineseName: '风水涣', symbol: '☵☴', lines: [true, true, false, false, true, false], meaning: '风行水上，涣，先王以享于帝立庙', description: '涣卦象征涣散，离散消解。宜化解离散，凝聚人心。' },
  { id: 60, name: '节', chineseName: '水泽节', symbol: '☱☵', lines: [true, true, false, false, true, true], meaning: '泽上有水，节，君子以制数度议德行', description: '节卦象征节制，适度节制。宜节制欲望，保持平衡。' },
  { id: 61, name: '中孚', chineseName: '风泽中孚', symbol: '☱☴', lines: [true, true, false, true, true, false], meaning: '泽上有风，中孚，君子以议狱缓死', description: '中孚卦象征诚信，心中诚信。宜诚实守信，以诚待人。' },
  { id: 62, name: '小过', chineseName: '雷山小过', symbol: '☶☳', lines: [true, false, false, true, true, false], meaning: '山上有雷，小过，君子以行过乎恭', description: '小过卦象征小有过越，稍有过度。宜谨慎小心，避免大错。' },
  { id: 63, name: '既济', chineseName: '水火既济', symbol: '☵☲', lines: [true, false, true, false, true, true], meaning: '水在火上，既济，君子以思患而豫防', description: '既济卦象征既成，事情已成。宜居安思危，预防后患。' },
  { id: 64, name: '未济', chineseName: '火水未济', symbol: '☲☵', lines: [false, true, false, true, false, true], meaning: '火在水上，未济，君子以慎辨物居方', description: '未济卦象征未成，事情未竟。宜继续努力，不可松懈。' },
];

// 天干
const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
const wuxing = ['金', '木', '水', '火', '土'];

// 根据出生日期计算卦象
export function calculateGua(name: string, birthDate: string, birthTime: string): GuaResult {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 根据姓名计算一个种子值
  const nameSeed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 根据出生时间计算时辰
  const hour = parseInt(birthTime.split(':')[0]);
  const shichen = Math.floor((hour + 1) / 2) % 12;
  
  // 计算主卦（基于年月日时）
  const mainGuaIndex = ((year + month + day + shichen + nameSeed) % 64);
  const mainGua = guaData[mainGuaIndex];
  
  // 计算变卦（基于主卦变化）
  const changeGuaIndex = ((mainGuaIndex + nameSeed + day) % 64);
  const changeGua = guaData[changeGuaIndex];
  
  // 计算互卦（基于主卦中间四爻）
  const huGuaIndex = ((mainGuaIndex + month + shichen) % 64);
  const huGua = guaData[huGuaIndex];
  
  // 计算天干地支
  const tianganIndex = (year - 4) % 10;
  const dizhiIndex = (year - 4) % 12;
  
  // 计算五行
  const wuxingIndex = (tianganIndex + dizhiIndex) % 5;
  
  // 生成运势分析
  const fortune = generateFortune(mainGua, changeGua, huGua, name);
  
  return {
    mainGua,
    changeGua,
    huGua,
    fortune,
    advice: generateAdvice(mainGua, changeGua),
    elements: {
      tiangan: tiangan[tianganIndex],
      dizhi: dizhi[dizhiIndex],
      wuxing: wuxing[wuxingIndex],
    },
  };
}

function generateFortune(mainGua: Gua, _changeGua: Gua, _huGua: Gua, _name: string): {
  overall: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
} {
  const guaFortunes: Record<number, { overall: string; career: string; love: string; wealth: string; health: string }> = {
    1: { overall: '大吉之卦，天行刚健，万事亨通', career: '事业如日中天，宜大展宏图', love: '感情顺利，但需主动追求', wealth: '财运旺盛，正财偏财皆佳', health: '身体强健，注意劳逸结合' },
    2: { overall: '大吉之卦，地势柔顺，厚德载物', career: '事业稳步发展，宜守成', love: '感情和谐，宜温柔相待', wealth: '财运平稳，积少成多', health: '身体康健，注意脾胃' },
    11: { overall: '天地交泰，大吉之卦', career: '事业顺利，贵人相助', love: '感情美满，喜结良缘', wealth: '财源广进，投资获利', health: '身心健康，精神愉悦' },
    15: { overall: '谦卦全吉，谦虚受益', career: '谦虚待人，事业进步', love: '谦逊有礼，感情升温', wealth: '不贪不躁，财运自来', health: '心平气和，身体健康' },
    14: { overall: '大有收获，财运亨通', career: '事业有成，名利双收', love: '感情丰富，桃花旺盛', wealth: '财运大旺，投资获利', health: '精力充沛，注意节制' },
    12: { overall: '天地不交，诸事不顺', career: '事业受阻，宜守不宜进', love: '感情冷淡，需多沟通', wealth: '财运不佳，谨慎投资', health: '注意呼吸系统健康' },
    29: { overall: '坎险重重，需谨慎小心', career: '事业多阻，步步为营', love: '感情波折，需耐心经营', wealth: '财运不稳，保守为宜', health: '注意肾脏泌尿系统' },
    47: { overall: '处境困顿，需坚守志向', career: '事业困难，需忍耐坚持', love: '感情受阻，不宜强求', wealth: '财运困顿，节约开支', health: '身心疲惫，需多休息' },
  };
  
  const defaultFortune = {
    overall: `${mainGua.name}卦，${mainGua.meaning}。此卦${mainGua.id % 2 === 0 ? '主吉' : '吉凶参半'}，宜审时度势，顺势而为。`,
    career: `事业上${mainGua.id <= 32 ? '宜积极进取' : '宜稳健守成'}，把握机遇，不可错失良机。`,
    love: `感情方面${mainGua.id % 3 === 0 ? '桃花运旺' : '宜循序渐进'}，真诚待人，自有良缘。`,
    wealth: `财运${mainGua.id % 4 === 0 ? '亨通' : '平稳'}，${mainGua.id <= 30 ? '正财偏财皆有收获' : '宜守财不宜冒险'}。`,
    health: `身体${mainGua.id % 2 === 0 ? '康健' : '需注意调养'}，${mainGua.id <= 20 ? '精力充沛' : '宜注意休息'}，保持规律作息。`,
  };
  
  return guaFortunes[mainGua.id] || defaultFortune;
}

function generateAdvice(mainGua: Gua, _changeGua: Gua): string {
  const advices: Record<number, string> = {
    1: '天行健，君子以自强不息。宜保持积极进取的态度，勇往直前。',
    2: '地势坤，君子以厚德载物。宜宽厚待人，包容万物。',
    11: '天地交泰，宜把握时机，广结善缘，事业爱情双丰收。',
    15: '谦受益，满招损。保持谦虚低调，自然福泽绵长。',
    12: '否极泰来，宜韬光养晦，等待时机，不可强求。',
    29: '险中求胜，需谨慎小心，步步为营，终能渡过难关。',
  };
  
  return advices[mainGua.id] || `${mainGua.name}卦启示：${mainGua.meaning}。宜顺应天道，积德行善，自然吉祥如意。`;
}

export { guaData };
