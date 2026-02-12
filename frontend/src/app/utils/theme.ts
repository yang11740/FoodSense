// 食知（FoodSense）应用主题配置

export const COLORS = {
  // 主色系 - 健康绿
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b'
  },
  
  // 辅助色 - 信息蓝
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  
  // 警告色 - 橙色
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f59e0b',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12'
  },
  
  // 危险色 - 红色
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  }
};

export const RECOMMENDATION_CONFIG = {
  recommended: {
    label: '推荐食用',
    color: 'bg-green-50 text-green-700 border-green-200',
    badgeColor: 'bg-green-100 text-green-700 border-green-200',
    iconColor: 'text-green-600',
    progressColor: '[&>div]:bg-green-500'
  },
  caution: {
    label: '谨慎食用',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    iconColor: 'text-orange-600',
    progressColor: '[&>div]:bg-orange-500'
  },
  'not-recommended': {
    label: '不推荐食用',
    color: 'bg-red-50 text-red-700 border-red-200',
    badgeColor: 'bg-red-100 text-red-700 border-red-200',
    iconColor: 'text-red-600',
    progressColor: '[&>div]:bg-red-500'
  }
} as const;

export const DISCLAIMER_MESSAGES = {
  general: '分析结果用于饮食风险感知与辅助决策，不构成医疗诊断。',
  detailed: '分析结果用于饮食风险感知与辅助决策，不构成医疗诊断。最终饮食选择请结合个人实际情况综合判断。',
  healthProfile: '健康状态感知示意，不构成医学诊断。',
  welcome: '本系统为饮食决策辅助工具，不提供医疗诊断或治疗建议。最终决策请结合个人实际情况综合判断。'
} as const;
