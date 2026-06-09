/**
 * 中国二十四节气饮食推荐（简化版）
 */

export type SolarTerm =
  | '立春' | '雨水' | '惊蛰' | '春分' | '清明' | '谷雨'
  | '立夏' | '小满' | '芒种' | '夏至' | '小暑' | '大暑'
  | '立秋' | '处暑' | '白露' | '秋分' | '寒露' | '霜降'
  | '立冬' | '小雪' | '大雪' | '冬至' | '小寒' | '大寒';

export interface SolarTermRecommendation {
  term: SolarTerm;
  dateApprox: string; // 近似公历日期
  advice: string;
  recommendedFoods: string[];
  avoidFoods: string[];
  tips: string[];
}

// 简化的节气推荐库
export const solarTermRecommendations: Record<SolarTerm, SolarTermRecommendation> = {
  '立春': {
    term: '立春',
    dateApprox: '2月4-5日',
    advice: '立春宜养肝、疏通，饮食以清淡、少油腻为主，适当补充维生素。',
    recommendedFoods: ['春笋', '绿叶菜', '豆制品', '荠菜'],
    avoidFoods: ['过咸', '过油腻'],
    tips: ['多吃应季蔬菜，少食油炸', '早餐吃点温粥，利于脾胃']
  },
  '雨水': {
    term: '雨水',
    dateApprox: '2月18-19日',
    advice: '雨水节气多湿，宜健脾祛湿，饮食清淡，适当利水。',
    recommendedFoods: ['薏米', '冬瓜', '绿豆'],
    avoidFoods: ['生冷冷饮', '辛辣刺激'],
    tips: ['多喝薏米冬瓜汤', '适量补充蛋白质']
  },
  '惊蛰': {
    term: '惊蛰',
    dateApprox: '3月5-6日',
    advice: '春雷始鸣，万物复苏，宜通阳醒脾，饮食以清淡为主。',
    recommendedFoods: ['新鲜蔬菜', '韭菜', '荠菜'],
    avoidFoods: ['过于滋补的食物'],
    tips: ['少油腻，多蔬果', '可适量吃一些蜂蜜']
  },
  '春分': {
    term: '春分',
    dateApprox: '3月20-21日',
    advice: '昼夜均分，宜养肝护脾，饭食要有节，注重多样化。',
    recommendedFoods: ['菠菜', '胡萝卜', '山药'],
    avoidFoods: ['暴饮暴食'],
    tips: ['均衡饮食，少食辛辣', '多吃富含维生素的食物']
  },
  '清明': {
    term: '清明',
    dateApprox: '4月4-5日',
    advice: '清明多雨，气候湿冷，宜清淡祛湿，少油腻。',
    recommendedFoods: ['青团', '春笋', '苦瓜'],
    avoidFoods: ['过甜点心'],
    tips: ['适量食用青团，配清茶', '多吃时令蔬菜']
  },
  '谷雨': {
    term: '谷雨',
    dateApprox: '4月19-20日',
    advice: '谷雨时节宜护肝利湿，适当食用有利肝脏和消化的食物。',
    recommendedFoods: ['燕麦', '春茶', '绿叶蔬菜'],
    avoidFoods: ['油炸食物'],
    tips: ['饮用少量春茶', '多吃纤维素丰富食物']
  },
  '立夏': {
    term: '立夏',
    dateApprox: '5月5-6日',
    advice: '进入夏季前期，宜清热利湿，补充水分和维生素。',
    recommendedFoods: ['冬瓜', '绿豆', '苦瓜'],
    avoidFoods: ['过量冷饮', '油腻食物'],
    tips: ['适量喝绿豆汤', '增加蔬果摄入']
  },
  '小满': {
    term: '小满',
    dateApprox: '5月20-21日',
    advice: '小满气温升高，注意清暑养阴，饮食宜清淡。',
    recommendedFoods: ['薏米', '绿豆', '苦瓜'],
    avoidFoods: ['辛辣重口'],
    tips: ['多喝凉汤但不寒凉', '补充电解质']
  },
  '芒种': {
    term: '芒种',
    dateApprox: '6月5-6日',
    advice: '芒种忙于播种与收获，宜清热利湿，注意防暑。',
    recommendedFoods: ['粳米粥', '绿豆', '冬瓜'],
    avoidFoods: ['油炸', '高糖食物'],
    tips: ['午间注意避暑', '食用易消化食物']
  },
  '夏至': {
    term: '夏至',
    dateApprox: '6月21-22日',
    advice: '夏至时日长而热，注意养心清热，保持水分与电解质。',
    recommendedFoods: ['绿豆粥', '冬瓜汤', '苦瓜'],
    avoidFoods: ['过度冷饮', '油腻食物'],
    tips: ['补充盐分与水分', '吃些清凉但营养的食物']
  },
  '小暑': {
    term: '小暑',
    dateApprox: '7月6-7日',
    advice: '小暑渐热，注意防暑降温，饮食以清淡为主。',
    recommendedFoods: ['绿豆', '冬瓜', '丝瓜'],
    avoidFoods: ['重油重盐'],
    tips: ['避免午间高温时段户外活动', '多喝清淡汤水']
  },
  '大暑': {
    term: '大暑',
    dateApprox: '7月22-23日',
    advice: '大暑为一年最热时节，宜以清补结合，注意补水。',
    recommendedFoods: ['绿豆粥', '西瓜', '冬瓜'],
    avoidFoods: ['辛辣油炸食物'],
    tips: ['适量补充能量与电解质', '避免高温时剧烈运动']
  },
  '立秋': {
    term: '立秋',
    dateApprox: '8月7-8日',
    advice: '立秋标志着气候转凉，应养阴润燥，适当补益不宜进补过度。',
    recommendedFoods: ['梨', '百合', '银耳'],
    avoidFoods: ['辛辣油炸'],
    tips: ['多吃润肺食物', '早晚注意增减衣物']
  },
  '处暑': {
    term: '处暑',
    dateApprox: '8月22-23日',
    advice: '暑气渐退，饮食应清凉滋润，注意脾胃调理。',
    recommendedFoods: ['莲藕', '红枣', '山药'],
    avoidFoods: ['生冷食物过多'],
    tips: ['少喝冷饮', '适量进补以健脾']
  },
  '白露': {
    term: '白露',
    dateApprox: '9月7-8日',
    advice: '早晚露重，宜润肺止咳，饮食偏温润滋补。',
    recommendedFoods: ['蜂蜜', '梨', '银耳'],
    avoidFoods: ['辛辣刺激'],
    tips: ['多喝温开水', '注意保暖']
  },
  '秋分': {
    term: '秋分',
    dateApprox: '9月22-23日',
    advice: '昼夜平分，宜养阴润肺并保持营养均衡。',
    recommendedFoods: ['山药', '红枣', '栗子'],
    avoidFoods: ['过度油腻'],
    tips: ['适量进补', '保持作息规律']
  },
  '寒露': {
    term: '寒露',
    dateApprox: '10月7-8日',
    advice: '气温下降，宜滋阴润肺，防寒保暖。',
    recommendedFoods: ['核桃', '山药', '蜂蜜'],
    avoidFoods: ['生冷食物'],
    tips: ['注意添衣', '吃些温补食物']
  },
  '霜降': {
    term: '霜降',
    dateApprox: '10月22-23日',
    advice: '霜降天气渐冷，宜温补，注重润肺补肾。',
    recommendedFoods: ['栗子', '黑芝麻', '牛肉'],
    avoidFoods: ['海鲜冷饮'],
    tips: ['适量补钙补气', '饮食以温为主']
  },
  '立冬': {
    term: '立冬',
    dateApprox: '11月7-8日',
    advice: '进入冬季，宜温补养生，多食温热滋补的汤品。',
    recommendedFoods: ['羊肉汤', '鸡汤', '红枣'],
    avoidFoods: ['生冷食物'],
    tips: ['多喝温汤', '适当增加热量摄入']
  },
  '小雪': {
    term: '小雪',
    dateApprox: '11月22-23日',
    advice: '气候转冷，宜养阳补肾，饮食温热为主。',
    recommendedFoods: ['黑豆', '核桃', '羊肉'],
    avoidFoods: ['生冷'],
    tips: ['注意保暖', '进补宜适度']
  },
  '大雪': {
    term: '大雪',
    dateApprox: '12月6-8日',
    advice: '寒冷加剧，宜温补驱寒，汤羹类为佳。',
    recommendedFoods: ['羊肉', '牛骨汤', '红薯'],
    avoidFoods: ['生冷海鲜'],
    tips: ['多喝热汤', '增加御寒食物']
  },
  '冬至': {
    term: '冬至',
    dateApprox: '12月21-22日',
    advice: '冬至为进补良机，适当补肾温阳，但要循序渐进。',
    recommendedFoods: ['汤圆', '羊肉汤', '黄芪鸡汤'],
    avoidFoods: ['过量甜食'],
    tips: ['适量进补', '避免暴饮暴食']
  },
  '小寒': {
    term: '小寒',
    dateApprox: '1月5-6日',
    advice: '天寒气冷，宜温补，注意保暖与营养均衡。',
    recommendedFoods: ['羊肉', '核桃', '黑芝麻'],
    avoidFoods: ['生冷食物'],
    tips: ['多喝热汤', '减少生冷食品']
  },
  '大寒': {
    term: '大寒',
    dateApprox: '1月19-20日',
    advice: '一年之中最寒冷时节，宜温补驱寒并注意防寒保暖。',
    recommendedFoods: ['羊肉', '牛骨汤', '红枣核桃粥'],
    avoidFoods: ['生冷食物'],
    tips: ['加强保暖', '饮食宜温热']
  }
};

/**
 * 根据日期简化判断当前节气（近似）
 */
export function getCurrentSolarTerm(date: Date = new Date()): SolarTermRecommendation {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 使用近似阈值匹配节气开始（简化版）
  const keyByThreshold: Array<{ m: number; d: number; term: SolarTerm }> = [
    { m: 2, d: 4, term: '立春' },
    { m: 2, d: 19, term: '雨水' },
    { m: 3, d: 6, term: '惊蛰' },
    { m: 3, d: 21, term: '春分' },
    { m: 4, d: 5, term: '清明' },
    { m: 4, d: 20, term: '谷雨' },
    { m: 5, d: 6, term: '立夏' },
    { m: 5, d: 21, term: '小满' },
    { m: 6, d: 6, term: '芒种' },
    { m: 6, d: 21, term: '夏至' },
    { m: 7, d: 7, term: '小暑' },
    { m: 7, d: 23, term: '大暑' },
    { m: 8, d: 8, term: '立秋' },
    { m: 8, d: 23, term: '处暑' },
    { m: 9, d: 8, term: '白露' },
    { m: 9, d: 23, term: '秋分' },
    { m: 10, d: 8, term: '寒露' },
    { m: 10, d: 23, term: '霜降' },
    { m: 11, d: 7, term: '立冬' },
    { m: 11, d: 22, term: '小雪' },
    { m: 12, d: 7, term: '大雪' },
    { m: 12, d: 21, term: '冬至' },
    { m: 1, d: 5, term: '小寒' },
    { m: 1, d: 20, term: '大寒' }
  ];

  // find last threshold <= current date in the year cycle
  // convert month-day to ordinal day in year for comparison
  const ordinal = (mm: number, dd: number) => {
    const t = new Date(date.getFullYear(), mm - 1, dd);
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.floor((t.getTime() - start.getTime()) / 86400000) + 1;
  };

  const todayOrdinal = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000) + 1;

  // build list of thresholds as ordinals
  const thresholdOrdinals = keyByThreshold.map((k) => {
    // handle Jan entries mapped to next year vs current year
    let yearOffset = date.getFullYear();
    let mm = k.m;
    if (k.m === 1) {
      // Jan thresholds might be earlier in year cycle - if today is in Dec, treat Jan as next year
      if (month === 12) {
        yearOffset = date.getFullYear() + 1;
      }
    }
    const ord = Math.floor((new Date(yearOffset, mm - 1, k.d).getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000) + 1;
    return { ord, term: k.term };
  });

  // find the last threshold <= todayOrdinal; fallback to last element
  let chosen = thresholdOrdinals[0].term;
  for (let i = 0; i < thresholdOrdinals.length; i++) {
    if (thresholdOrdinals[i].ord <= todayOrdinal) {
      chosen = thresholdOrdinals[i].term;
    }
  }

  // if none matched (e.g., early Jan), pick '大寒' as default
  if (!solarTermRecommendations[chosen]) {
    chosen = '大寒';
  }

  return solarTermRecommendations[chosen];
}
