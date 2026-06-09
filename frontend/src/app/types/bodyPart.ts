/**
 * 人体部位类型定义
 */

export type BodyPartName = 
  | '头部' | '颈部' | '肩膀' | '心脏' | '肺部' | '胃部' 
  | '肝脏' | '肾脏' | '脾脏' | '腹部' | '小肠' | '大肠' 
  | '左臂' | '右臂' | '左腿' | '右腿' | '脊椎';

export interface BodyPartInfo {
  name: BodyPartName;
  displayName: string;
  description: string;
  healthRisks: string[];
  position: {
    x: number; // 0-100 百分比
    y: number; // 0-100 百分比
  };
}

export interface BodyPartHealth {
  part: BodyPartName;
  healthScore: number; // 0-100
  isAtRisk: boolean;
  riskLevel: 'low' | 'medium' | 'high'; // 低、中、高
  recommendations: string[];
}

export interface BodyPartFoodRecommendation {
  part: BodyPartName;
  recommendedFoods: string[];
  avoidFoods: string[];
  recommendations: string[];
  seasonalTips?: string;
}

// 身体部位详细信息库
export const bodyPartDatabase: Record<BodyPartName, Omit<BodyPartInfo, 'name'>> = {
  '头部': {
    displayName: '头部',
    description: '大脑控制中枢，需要充足的氧气和营养供应。良好的饮食可以增强记忆力和专注力。',
    healthRisks: ['高血压', '偏头痛', '脑疲劳'],
    position: { x: 50, y: 15 }
  },
  '颈部': {
    displayName: '颈部',
    description: '连接头部和躯干的重要部位，包含血管和神经。需要保持灵活性和血液流通。',
    healthRisks: ['颈椎病', '落枕', '肩颈僵硬'],
    position: { x: 50, y: 25 }
  },
  '肩膀': {
    displayName: '肩膀',
    description: '上肢的支撑点，经常承受压力。需要充足的钙质和蛋白质来保持肌肉和骨骼健康。',
    healthRisks: ['肩周炎', '肌肉酸痛', '骨质疏松'],
    position: { x: 35, y: 30 }
  },
  '心脏': {
    displayName: '心脏',
    description: '身体的动力源泉，需要充足的营养支持和健康的血管。低盐低脂饮食非常重要。',
    healthRisks: ['高血压', '高血脂', '心脏病'],
    position: { x: 50, y: 38 }
  },
  '肺部': {
    displayName: '肺部',
    description: '呼吸系统的关键器官，需要抗氧化营养保护。富含维生素C和E的食物对肺部健康很重要。',
    healthRisks: ['呼吸系统问题', '肺功能下降'],
    position: { x: 45, y: 40 }
  },
  '胃部': {
    displayName: '胃部',
    description: '消化系统的第一道关卡。需要避免刺激性食物，保持规律饮食习惯。',
    healthRisks: ['胃炎', '消化不良', '胃溃疡'],
    position: { x: 50, y: 45 }
  },
  '肝脏': {
    displayName: '肝脏',
    description: '体内的"解毒工厂"，负责代谢和解毒。需要避免过度油腻和过量饮酒。',
    healthRisks: ['脂肪肝', '肝硬化', '代谢异常'],
    position: { x: 55, y: 48 }
  },
  '肾脏': {
    displayName: '肾脏',
    description: '排泄代谢产物的重要器官。需要充足的水分和低盐饮食来保护肾脏功能。',
    healthRisks: ['肾脏疾病', '代谢紊乱', '高血压'],
    position: { x: 45, y: 48 }
  },
  '脾脏': {
    displayName: '脾脏',
    description: '免疫系统的一部分，帮助体内防御。需要充足的维生素和矿物质来增强免疫力。',
    healthRisks: ['免疫力下降', '脾虚'],
    position: { x: 52, y: 50 }
  },
  '腹部': {
    displayName: '腹部',
    description: '消化器官集中区域，容易积累脂肪。需要控制热量摄入和增加纤维素。',
    healthRisks: ['腹部脂肪堆积', '消化问题', '肠胃不适'],
    position: { x: 50, y: 55 }
  },
  '小肠': {
    displayName: '小肠',
    description: '主要的营养吸收器官。需要良好的肠道菌群和充足的纤维素。',
    healthRisks: ['肠道问题', '吸收不良'],
    position: { x: 50, y: 60 }
  },
  '大肠': {
    displayName: '大肠',
    description: '吸收水分和储存粪便的器官。需要充足的纤维素来保持肠道健康。',
    healthRisks: ['便秘', '肠道菌群失调', '肠炎'],
    position: { x: 50, y: 65 }
  },
  '左臂': {
    displayName: '左臂',
    description: '上肢的重要组成部分，需要充足的蛋白质来维持肌肉。',
    healthRisks: ['肌肉无力', '关节问题'],
    position: { x: 30, y: 50 }
  },
  '右臂': {
    displayName: '右臂',
    description: '上肢的重要组成部分，需要充足的蛋白质来维持肌肉。',
    healthRisks: ['肌肉无力', '关节问题'],
    position: { x: 70, y: 50 }
  },
  '左腿': {
    displayName: '左腿',
    description: '下肢的主要支撑，需要充足的钙质和蛋白质来保持强健。',
    healthRisks: ['腿部无力', '关节问题', '静脉曲张'],
    position: { x: 35, y: 75 }
  },
  '右腿': {
    displayName: '右腿',
    description: '下肢的主要支撑，需要充足的钙质和蛋白质来保持强健。',
    healthRisks: ['腿部无力', '关节问题', '静脉曲张'],
    position: { x: 65, y: 75 }
  },
  '脊椎': {
    displayName: '脊椎',
    description: '身体的中轴线，支撑整个身体。需要充足的钙质和良好的姿态。',
    healthRisks: ['脊椎病', '腰椎间盘突出', '腰酸背痛'],
    position: { x: 50, y: 50 }
  }
};

// 获取特定身体部位的信息
export function getBodyPartInfo(part: BodyPartName): BodyPartInfo {
  const info = bodyPartDatabase[part];
  return {
    name: part,
    ...info
  };
}

// 根据健康状况获取需要关注的身体部位
export function getAffectedBodyParts(healthIssues: string[]): BodyPartName[] {
  const issueKeywords: Record<string, BodyPartName[]> = {
    '脂肪': ['腹部', '肝脏'],
    '睡眠': ['头部', '心脏'],
    '消化': ['胃部', '小肠', '大肠'],
    '血压': ['心脏', '肾脏', '头部'],
    '血脂': ['肝脏', '心脏'],
    '关节': ['肩膀', '颈部', '脊椎'],
    '肠胃': ['胃部', '小肠', '大肠'],
    '免疫': ['脾脏'],
    '肌肉': ['左臂', '右臂', '左腿', '右腿']
  };

  const affectedParts = new Set<BodyPartName>();
  
  healthIssues.forEach(issue => {
    Object.entries(issueKeywords).forEach(([keyword, parts]) => {
      if (issue.includes(keyword)) {
        parts.forEach(part => affectedParts.add(part));
      }
    });
  });

  return Array.from(affectedParts);
}
