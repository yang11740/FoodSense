export type BodyStatus = 'good' | 'mild' | 'attention' | 'unknown';

export interface HealthSummaryStat {
  value: string;
  label: string;
  tone: string;
}

export interface HealthTrendPoint {
  date: string;
  risk?: number;
  value?: number;
}

export interface HealthReminder {
  type: 'medication' | 'diet' | 'review';
  title: string;
  time: string;
  note: string;
}

export interface NextWeekGoal {
  title: string;
  note: string;
  progress: number;
}

export interface HealthSummary {
  weekSummary: {
    title: string;
    description: string;
  };
  summaryStats: HealthSummaryStat[];
  riskTrendData: Array<{ date: string; risk: number }>;
  intakeTrendData: Array<{ date: string; value: number }>;
  weeklyMetrics: {
    riskChangeLabel: string;
    riskTrend: 'up' | 'down' | 'flat';
    balanceChangeLabel: string;
    balanceTrend: 'up' | 'down' | 'flat';
  };
  weeklyReport: string;
  mainRiskTags: string[];
  reminders: HealthReminder[];
  nextWeekGoals: NextWeekGoal[];
  hasEnoughData: boolean;
}

export interface BodyImpact {
  id: string;
  label: string;
  status: BodyStatus;
  reason: string;
  impact: string;
  foods: string[];
  task: string;
}

export interface HealthProfileInsights {
  bodyImpacts: BodyImpact[];
  todayTasks: string[];
  overallStatus: string;
  profileLevel: string;
  missingRecords: number;
  hasEnoughData: boolean;
}
