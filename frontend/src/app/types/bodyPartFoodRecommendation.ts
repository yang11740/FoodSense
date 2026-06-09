import type { BodyPartName } from './bodyPart';

/**
 * 针对不同身体部位的个性化食物推荐
 */
export interface BodyPartFoodRecommendation {
  part: BodyPartName;
  recommendedFoods: string[];
  avoidFoods: string[];
  benefits: string[];
  seasonalTips: Record<'spring' | 'summer' | 'autumn' | 'winter', string>;
}

export const bodyPartFoodRecommendations: Record<BodyPartName, BodyPartFoodRecommendation> = {
  '头部': {
    part: '头部',
    recommendedFoods: ['核桃', '蓝莓', '黑芝麻', '鸡蛋', '深海鱼', '黑木耳'],
    avoidFoods: ['高盐食物', '过量咖啡因', '酒精'],
    benefits: ['增强记忆力', '提高专注力', '延缓衰老'],
    seasonalTips: {
      spring: '春季宜食用新鲜蔬菜，特别是绿叶菜，帮助大脑清爽',
      summer: '夏季推荐冬瓜、绿豆等清凉食物，缓解脑疲劳',
      autumn: '秋季食用蜂蜜、梨等润肺食物，改善睡眠质量',
      winter: '冬季食用黑色食物如黑芝麻、黑木耳，温阳益气'
    }
  },
  '颈部': {
    part: '颈部',
    recommendedFoods: ['钙质食物', '蛋白质', '维生素D', '葱', '生姜'],
    avoidFoods: ['过硬食物', '腌制品'],
    benefits: ['保持灵活性', '改善血液循环', '缓解僵硬感'],
    seasonalTips: {
      spring: '春季食用葱、姜等温阳食物，疏通经络',
      summer: '夏季可食用薄荷、绿茶，清热舒缓',
      autumn: '秋季食用洋葱、黑木耳，活血化瘀',
      winter: '冬季推荐羊肉汤、鸡汤，温阳驱寒'
    }
  },
  '肩膀': {
    part: '肩膀',
    recommendedFoods: ['牛奶', '豆制品', '芝麻', '虾', '骨头汤', '黑木耳'],
    avoidFoods: ['过量糖分', '酸性食物'],
    benefits: ['强化骨骼', '补充蛋白质', '缓解酸痛'],
    seasonalTips: {
      spring: '春季食用竹笋、春菜，舒缓肌肉',
      summer: '夏季可食用冬瓜薏米汤，祛湿消肿',
      autumn: '秋季食用栗子、黑芝麻，补肾强骨',
      winter: '冬季推荐炖汤，如黄芪鸡汤，温阳补气'
    }
  },
  '心脏': {
    part: '心脏',
    recommendedFoods: ['三文鱼', '核桃', '红枣', '黑木耳', '绿茶', '洋葱'],
    avoidFoods: ['高脂肪', '高盐', '过甜食物', '酒精'],
    benefits: ['保护心脏', '降低血脂', '稳定血压'],
    seasonalTips: {
      spring: '春季食用玫瑰花茶、红枣茶，养心',
      summer: '夏季推荐绿豆粥、冬瓜汤，清心火',
      autumn: '秋季食用银耳、百合，润心肺',
      winter: '冬季推荐红参、黄芪炖鸡，温阳益气'
    }
  },
  '肺部': {
    part: '肺部',
    recommendedFoods: ['雪梨', '银耳', '百合', '蜂蜜', '山楂', '黑芝麻'],
    avoidFoods: ['辛辣刺激', '烟熏食物'],
    benefits: ['清肺润肺', '增强呼吸功能', '提高免疫力'],
    seasonalTips: {
      spring: '春季食用蜂蜜、百合，润肺养阴',
      summer: '夏季推荐冰糖银耳羹、绿豆粥',
      autumn: '秋季是润肺最好季节，食用雪梨、银耳、百合',
      winter: '冬季推荐黄芪、冬虫夏草炖汤，温肺'
    }
  },
  '胃部': {
    part: '胃部',
    recommendedFoods: ['白粥', '馄饨面', '白菜', '南瓜', '红薯', '山楂'],
    avoidFoods: ['辛辣', '油腻', '冷饮', '咖啡'],
    benefits: ['保护胃黏膜', '促进消化', '缓解胃不适'],
    seasonalTips: {
      spring: '春季食用山药粥、红枣粥，健脾养胃',
      summer: '夏季推荐薏米粥、冬瓜粥，清热祛湿',
      autumn: '秋季食用红薯、南瓜，温胃益脾',
      winter: '冬季推荐生姜红糖茶、羊肉汤，温中散寒'
    }
  },
  '肝脏': {
    part: '肝脏',
    recommendedFoods: ['绿叶菜', '红枣', '蘑菇', '黑木耳', '燕麦', '柚子'],
    avoidFoods: ['油炸食物', '酒精', '过于油腻'],
    benefits: ['保护肝脏', '促进解毒', '预防脂肪肝'],
    seasonalTips: {
      spring: '春季是养肝最佳季节，食用青菜、春笋',
      summer: '夏季可食用冬瓜、薏米，清肝利胆',
      autumn: '秋季食用银耳、百合，滋阴润肝',
      winter: '冬季推荐黑芝麻、黑木耳，补肾保肝'
    }
  },
  '肾脏': {
    part: '肾脏',
    recommendedFoods: ['黑芝麻', '黑豆', '核桃', '栗子', '桂圆', '黑木耳'],
    avoidFoods: ['高盐', '刺激性食物', '过量蛋白质'],
    benefits: ['补肾益气', '增强体质', '改善代谢'],
    seasonalTips: {
      spring: '春季可食用黑豆粥、黑芝麻粉',
      summer: '夏季推荐冬瓜薏米汤，清热补肾',
      autumn: '秋季食用黑芝麻、黑豆，补肾阴',
      winter: '冬季是补肾最好季节，推荐羊肉、黑色食物'
    }
  },
  '脾脏': {
    part: '脾脏',
    recommendedFoods: ['山药', '薏米', '红豆', '南瓜', '糙米', '蜂蜜'],
    avoidFoods: ['油腻', '生冷', '过甜'],
    benefits: ['增强免疫力', '促进消化', '补气健脾'],
    seasonalTips: {
      spring: '春季食用山药红豆粥，健脾祛湿',
      summer: '夏季推荐薏米冬瓜粥，清热健脾',
      autumn: '秋季食用山楂、红枣，健脾益胃',
      winter: '冬季推荐红糖姜水、山药粥，温阳健脾'
    }
  },
  '腹部': {
    part: '腹部',
    recommendedFoods: ['膳食纤维', '绿叶菜', '全谷类', '豆类', '低脂肉类'],
    avoidFoods: ['油炸', '高糖', '高脂肪', '加工食品'],
    benefits: ['减少腹部脂肪', '改善消化', '控制体重'],
    seasonalTips: {
      spring: '春季食用竹笋、冬瓜，清热消脂',
      summer: '夏季推荐绿豆粥、冬瓜汤，清淡消脂',
      autumn: '秋季食用山楂、冬瓜，消食健脾',
      winter: '冬季推荐山楂红糖茶、萝卜汤，消食温中'
    }
  },
  '小肠': {
    part: '小肠',
    recommendedFoods: ['益生菌', '膳食纤维', '发酵食品', '酸奶', '粗粮'],
    avoidFoods: ['过度加工', '过油腻', '高糖'],
    benefits: ['改善菌群', '促进吸收', '增强肠道健康'],
    seasonalTips: {
      spring: '春季食用酸奶、豆制品，调理肠胃',
      summer: '夏季推荐酸奶冷饮、绿豆粥',
      autumn: '秋季食用粗粮、蜂蜜，润肠通便',
      winter: '冬季推荐温热酸奶、黑芝麻粥'
    }
  },
  '大肠': {
    part: '大肠',
    recommendedFoods: ['膳食纤维', '水分', '粗粮', '蜂蜜', '黑木耳', '芝麻油'],
    avoidFoods: ['过油腻', '低纤维', '过度加热'],
    benefits: ['促进排便', '改善便秘', '肠道清洁'],
    seasonalTips: {
      spring: '春季食用黑木耳、蜂蜜，润肠通便',
      summer: '夏季推荐冬瓜粥、绿豆粥',
      autumn: '秋季食用蜂蜜、黑芝麻，润肠',
      winter: '冬季推荐温热蜂蜜水、黑芝麻油拌粥'
    }
  },
  '左臂': {
    part: '左臂',
    recommendedFoods: ['蛋白质食物', '乳制品', '坚果', '豆类', '鱼类'],
    avoidFoods: ['过硬食物'],
    benefits: ['强化肌肉', '补充蛋白质', '增强力量'],
    seasonalTips: {
      spring: '春季食用豆制品、蛋类，补蛋白',
      summer: '夏季推荐清汤、鱼肉，清淡补蛋白',
      autumn: '秋季食用坚果、鸡肉，温和补蛋白',
      winter: '冬季推荐羊肉、牛肉汤，温阳补蛋白'
    }
  },
  '右臂': {
    part: '右臂',
    recommendedFoods: ['蛋白质食物', '乳制品', '坚果', '豆类', '鱼类'],
    avoidFoods: ['过硬食物'],
    benefits: ['强化肌肉', '补充蛋白质', '增强力量'],
    seasonalTips: {
      spring: '春季食用豆制品、蛋类，补蛋白',
      summer: '夏季推荐清汤、鱼肉，清淡补蛋白',
      autumn: '秋季食用坚果、鸡肉，温和补蛋白',
      winter: '冬季推荐羊肉、牛肉汤，温阳补蛋白'
    }
  },
  '左腿': {
    part: '左腿',
    recommendedFoods: ['钙质食物', '维生素D', '蛋白质', '黑芝麻', '虾皮'],
    avoidFoods: ['过度酸性'],
    benefits: ['强化骨骼', '增强腿部力量', '预防衰弱'],
    seasonalTips: {
      spring: '春季食用鲜笋、豆类，补钙强腿',
      summer: '夏季推荐豆制品、鱼类，补钙',
      autumn: '秋季食用栗子、黑芝麻，补肾强腿',
      winter: '冬季推荐骨头汤、羊肉汤，温阳强腿'
    }
  },
  '右腿': {
    part: '右腿',
    recommendedFoods: ['钙质食物', '维生素D', '蛋白质', '黑芝麻', '虾皮'],
    avoidFoods: ['过度酸性'],
    benefits: ['强化骨骼', '增强腿部力量', '预防衰弱'],
    seasonalTips: {
      spring: '春季食用鲜笋、豆类，补钙强腿',
      summer: '夏季推荐豆制品、鱼类，补钙',
      autumn: '秋季食用栗子、黑芝麻，补肾强腿',
      winter: '冬季推荐骨头汤、羊肉汤，温阳强腿'
    }
  },
  '脊椎': {
    part: '脊椎',
    recommendedFoods: ['牛奶', '豆制品', '芝麻', '虾', '黑木耳', '海带'],
    avoidFoods: ['过硬食物', '酸性食物'],
    benefits: ['强化骨骼', '支撑身体', '改善姿态'],
    seasonalTips: {
      spring: '春季食用竹笋、豆制品，补钙强脊',
      summer: '夏季推荐薏米、豆制品，清热补钙',
      autumn: '秋季食用黑芝麻、栗子，补肾强脊',
      winter: '冬季推荐骨头汤、羊骨汤，温阳强脊'
    }
  }
};

/**
 * 获取针对特定身体部位的食物推荐
 */
export function getBodyPartFoodRecommendations(part: BodyPartName): BodyPartFoodRecommendation {
  return bodyPartFoodRecommendations[part];
}

/**
 * 根据季节获取针对身体部位的推荐
 */
export function getSeasonalTip(part: BodyPartName, season: 'spring' | 'summer' | 'autumn' | 'winter'): string {
  const recommendations = bodyPartFoodRecommendations[part];
  return recommendations.seasonalTips[season];
}

/**
 * 获取当前季节
 */
export function getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
