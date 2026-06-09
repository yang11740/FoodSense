/**
 * 中式节气和时令推荐模块
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Festival = 'spring-festival' | 'qingming' | 'dragon-boat' | 'summer-solstice' | 'mid-autumn' | 'winter-solstice';

export interface SeasonalRecommendation {
  season: Season;
  displayName: string;
  advice: string;
  recommendations: string[];
  avoidFoods: string[];
  keywords: string[];
}

export interface FestivalRecommendation {
  festival: Festival;
  displayName: string;
  date: string;
  advice: string;
  traditionalFoods: string[];
  healthTips: string[];
}

/**
 * 季节饮食推荐库
 */
export const seasonalRecommendations: Record<Season, SeasonalRecommendation> = {
  spring: {
    season: 'spring',
    displayName: '春季（3-5月）',
    advice: '春季是阳气生发的季节，饮食应清淡爽口，以清热祛湿为主。春季人体容易困顿，应食用一些能够提神醒脑的食物。',
    recommendations: [
      '绿叶蔬菜：春菜、春笋、荠菜、香椿芽等',
      '健脾食物：山药、红枣、蜂蜜',
      '活血化瘀：黑木耳、黑芝麻、葱、姜',
      '清热祛湿：冬瓜、薏米、绿豆',
      '护肝食物：青菜、春竹笋'
    ],
    avoidFoods: [
      '过度油腻',
      '高盐腌制品',
      '辛辣刺激食物（虽然春季宜食少量）',
      '过度滋补'
    ],
    keywords: ['清淡', '祛湿', '护肝', '活血']
  },
  summer: {
    season: 'summer',
    displayName: '夏季（6-8月）',
    advice: '夏季炎热，人体容易出汗丢失大量水分和电解质。饮食应清淡清凉，以清热益气、补充水分为主。避免过度贪凉。',
    recommendations: [
      '清热食物：冬瓜、绿豆、冬瓜薏米汤',
      '补气食物：山药、红枣、蜂蜜水',
      '利尿祛湿：薏米、红豆、茯苓',
      '清心火：绿茶、苦瓜、莲子心茶',
      '酸味食物：柠檬、醋、山楂（促进消化）'
    ],
    avoidFoods: [
      '过度冷饮',
      '过度油腻食物',
      '过甜饮料',
      '高盐腌制品'
    ],
    keywords: ['清热', '祛湿', '补气', '清凉']
  },
  autumn: {
    season: 'autumn',
    displayName: '秋季（9-11月）',
    advice: '秋季干燥，应滋阴润肺。秋季是进补的好季节，可适当增加营养。注意补水，食用一些润肺的食物。',
    recommendations: [
      '润肺食物：银耳、百合、雪梨、蜂蜜',
      '滋阴食物：黑芝麻、黑木耳、黑豆',
      '补气血：红枣、桂圆、山楂',
      '养阴食物：莲藕、冬瓜、山药',
      '护肠食物：蜂蜜、黑芝麻油'
    ],
    avoidFoods: [
      '过度辛辣',
      '烟熏食物',
      '过度油腻',
      '过度进补'
    ],
    keywords: ['润肺', '滋阴', '进补', '养阴']
  },
  winter: {
    season: 'winter',
    displayName: '冬季（12-2月）',
    advice: '冬季是"冬令进补"的最佳季节。此时应温阳益气，食用温暖的汤品和炖菜。适当增加蛋白质和脂肪的摄入来增强体质。',
    recommendations: [
      '温阳食物：羊肉、牛肉、鸡肉',
      '补肾食物：黑色食物（黑芝麻、黑豆、黑木耳、冬虫夏草）',
      '热汤品：骨头汤、羊肉汤、黄芪鸡汤、冬瓜排骨汤',
      '温中食物：生姜、红糖、核桃、栗子',
      '益气食物：红枣、黄芪、党参'
    ],
    avoidFoods: [
      '过度冷饮',
      '生冷食物',
      '过度辛辣',
      '过度进补导致上火'
    ],
    keywords: ['温阳', '进补', '益气', '温中']
  }
};

/**
 * 传统节日饮食推荐
 */
export const festivalRecommendations: Record<Festival, FestivalRecommendation> = {
  'spring-festival': {
    festival: 'spring-festival',
    displayName: '春节（农历正月初一）',
    date: '1月下旬或2月初',
    advice: '春节是团聚的节日，饮食丰富但要注意均衡。避免过度油腻和暴饮暴食，节后要适当调理肠胃。',
    traditionalFoods: [
      '饺子：寓意团聚，富含蛋白质',
      '年糕：寓意年年高升，含碳水化合物',
      '鱼：寓意年年有余，含优质蛋白',
      '春卷：新春的象征，含纤维素',
      '坚果：寓意富贵，含有益脂肪酸'
    ],
    healthTips: [
      '控制油炸食品的摄入，选择清蒸或水煮',
      '多食用绿叶蔬菜和水果来平衡油腻',
      '饭后可食用山楂或普洱茶来消食',
      '避免暴饮暴食，定时定量进餐',
      '春节后可用冬瓜薏米粥来调理肠胃'
    ]
  },
  'qingming': {
    festival: 'qingming',
    displayName: '清明节（4月4-6日）',
    date: '4月4-6日',
    advice: '清明是春季养生的重要节点，饮食应清淡。这个时期要防止春困，多食用一些能提神醒脑的食物。',
    traditionalFoods: [
      '青团：用艾草制作，具有温阳作用',
      '春笋：春季时令菜，富含纤维素',
      '春菜：清热祛湿，促进消化',
      '鸡蛋：传统食物，营养丰富',
      '蜂蜜：清热养颜，补充能量'
    ],
    healthTips: [
      '食用青团时配合清茶，避免过甜',
      '春笋虽好，过量容易引起腹胀，适量食用',
      '清明时节天气多变，食物应温热适度',
      '可食用红枣粥、山药粥来健脾',
      '晨起可饮用蜂蜜水来润肠通便'
    ]
  },
  'dragon-boat': {
    festival: 'dragon-boat',
    displayName: '端午节（农历五月初五）',
    date: '5月下旬或6月初',
    advice: '端午节前后天气开始炎热，饮食应清热祛湿。端午传统食物丰富，但要注意不要过量。',
    traditionalFoods: [
      '粽子：糯米性温，但不要过量',
      '绿豆糕：清热祛湿的好食物',
      '鸭肉：性凉，适合夏季食用',
      '冬瓜：清热利尿，低脂肪',
      '薏米粥：祛湿健脾'
    ],
    healthTips: [
      '粽子虽然传统，但糯米难消化，适量食用',
      '吃粽子后可喝普洱茶或山楂茶来消食',
      '端午前后要增加清热祛湿的食物',
      '可食用绿豆薏米粥来预防中暑',
      '饭后散步有助消化，避免立即休息'
    ]
  },
  'summer-solstice': {
    festival: 'summer-solstice',
    displayName: '夏至（6月20-22日）',
    date: '6月20-22日',
    advice: '夏至是夏季最热的时期，此时应清热益气。虽然天气炎热，但也不能过度吃冷饮，要温阳护阳。',
    traditionalFoods: [
      '绿豆粥：清热解毒，是夏至必备',
      '冬瓜粥：清热利尿，低脂肪',
      '薏米粥：祛湿健脾的好食物',
      '苦瓜：清心火，虽然味苦但很健康',
      '丝瓜：清热化痰'
    ],
    healthTips: [
      '避免过度进冷饮，可饮用温热的凉白开',
      '绿豆粥虽然清热，但不能长期只吃，要配合其他营养',
      '夏至可适当补充盐分和电解质，如盐白开水',
      '中午可适当午睡30分钟来调理体力',
      '可食用冬瓜薏米汤来调理肠胃'
    ]
  },
  'mid-autumn': {
    festival: 'mid-autumn',
    displayName: '中秋节（农历八月十五）',
    date: '9月中旬',
    advice: '中秋时节天气开始转凉，应滋阴润肺。中秋传统食物虽然美味，但要控制摄入量，特别是月饼。',
    traditionalFoods: [
      '月饼：虽然美味，但高糖高油，要适量',
      '螃蟹：滋阴补肾的好食物，但性凉要适量',
      '梨：润肺止咳，是秋季的好水果',
      '板栗：补肾益气，是秋季坚果的上品',
      '蜂蜜：润肺养颜，可配合白开水饮用'
    ],
    healthTips: [
      '月饼虽然传统，但每次只吃一小块，配合清茶',
      '螃蟹性凉，不要过量，特别是脾胃虚弱的人',
      '梨可蒸着吃或配合蜂蜜炖，效果更好',
      '中秋后可开始进补，食用黄芪、人参等',
      '可食用银耳百合粥来滋阴润肺'
    ]
  },
  'winter-solstice': {
    festival: 'winter-solstice',
    displayName: '冬至（12月21-23日）',
    date: '12月21-23日',
    advice: '冬至是冬季进补的最佳时节。古语说"冬至大如年"，此时应食用温暖的汤品和炖菜来温阳益气。',
    traditionalFoods: [
      '饺子：传统冬至食物，含蛋白质和碳水',
      '汤圆：象征团圆，但要适量',
      '羊肉汤：温阳益气的最好进补品',
      '黄芪鸡汤：补气健脾，增强免疫力',
      '核桃粥：补肾益脑，适合冬季'
    ],
    healthTips: [
      '冬至是进补的开始，可食用羊肉汤、黄芪汤等',
      '进补不要过度，要循序渐进，避免上火',
      '汤圆虽然传统，但糯米难消化，适量食用',
      '冬至后要逐步增加进补，到年底达到最高',
      '可食用黑芝麻粥、黑豆粥来补肾'
    ]
  }
};

/**
 * 获取当前季节
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

/**
 * 获取当前或指定季节的推荐
 */
export function getSeasonalAdvice(season?: Season): SeasonalRecommendation {
  const targetSeason = season || getCurrentSeason();
  return seasonalRecommendations[targetSeason];
}

/**
 * 获取特定节日的推荐
 */
export function getFestivalAdvice(festival: Festival): FestivalRecommendation {
  return festivalRecommendations[festival];
}

/**
 * 根据日期获取最近的节日
 */
export function getUpcomingFestival(): FestivalRecommendation | null {
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  // 简化的节日匹配（实际应该更精确）
  if (month === 1 || (month === 2 && date <= 15)) {
    return getFestivalAdvice('spring-festival');
  } else if (month === 4) {
    return getFestivalAdvice('qingming');
  } else if (month === 5 || (month === 6 && date <= 10)) {
    return getFestivalAdvice('dragon-boat');
  } else if (month === 6) {
    return getFestivalAdvice('summer-solstice');
  } else if (month === 9) {
    return getFestivalAdvice('mid-autumn');
  } else if (month === 12 || (month === 1 && date <= 15)) {
    return getFestivalAdvice('winter-solstice');
  }

  return null;
}

/**
 * 获取当前月份的主要节日
 */
export function getCurrentMonthFestival(): FestivalRecommendation | null {
  const month = new Date().getMonth() + 1;

  const festivalByMonth: Record<number, Festival | null> = {
    1: 'spring-festival',
    2: null,
    3: null,
    4: 'qingming',
    5: 'dragon-boat',
    6: 'summer-solstice',
    7: null,
    8: null,
    9: 'mid-autumn',
    10: null,
    11: null,
    12: 'winter-solstice'
  };

  const festival = festivalByMonth[month];
  return festival ? getFestivalAdvice(festival) : null;
}
