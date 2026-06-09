'use client';

import { Bell, TrendingDown, TrendingUp, Calendar, Pill, AlertCircle, FileText, Download, Share2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SeasonalRecommendationCard from '@/app/components/SeasonalRecommendationCard';
import SolarTermCard from '@/app/components/SolarTermCard';
import { generateExportFileName, exportHealthReportAsCSV } from '@/app/utils/healthReportExport';
import { useState } from 'react';

const riskTrendData = [
  { date: '周一', risk: 3 },
  { date: '周二', risk: 2 },
  { date: '周三', risk: 4 },
  { date: '周四', risk: 3 },
  { date: '周五', risk: 2 },
  { date: '周六', risk: 1 },
  { date: '周日', risk: 2 }
];

const healthIndicatorData = [
  { date: '第 1 周', value: 78 },
  { date: '第 2 周', value: 77.5 },
  { date: '第 3 周', value: 77 },
  { date: '第 4 周', value: 76.5 }
];

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(76, 203, 99, 0.16)',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(76, 203, 99, 0.12)'
};

export default function HealthReport() {
  const [isExporting, setIsExporting] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const today = new Date().toLocaleDateString('zh-CN');
      const reportData = {
        reportDate: today,
        userName: '张三',
        userBasicInfo: {
          age: 35,
          gender: '男',
          height: 175,
          weight: 78,
          bmi: 25.5
        },
        weekSummary: {
          title: '高盐次数少了 2 次，做得不错',
          description: '油炸类还有点多，下周可以控制在 2 次以内，搭配绿叶菜会更稳。'
        },
        keyMetrics: {
          riskReduction: 35,
          healthScoreImprovement: 12
        },
        reminders: reminders,
        seasonalTips: '春季宜食用新鲜蔬菜，特别是绿叶菜，帮助大脑清爽',
        healthGoals: ['控糖', '减脂', '改善睡眠'],
        recommendations: [
          '油炸类控制在 2 次以内',
          '晚餐多加一份绿叶菜',
          '坚持锻炼，每周至少3次',
          '保证充足睡眠'
        ]
      };

      exportHealthReportAsCSV(reportData, generateExportFileName('csv'));
    } finally {
      setIsExporting(false);
    }
  };

  const reminders = [
    {
      type: 'medication',
      title: '降压药提醒',
      time: '每日 08:00',
      note: '饭后服用'
    },
    {
      type: 'diet',
      title: '午餐小提醒',
      time: '每日 12:00',
      note: '今天尽量少选高盐高脂'
    },
    {
      type: 'device',
      title: '血压测量',
      time: '每日 20:00',
      note: '同步到健康数据'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7FFF4] pb-24">
      <div className="sticky top-0 z-10 bg-[#F7FFF4]/90 backdrop-blur">
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#111827]">本周饮食小结</h1>
            <p className="text-sm text-[#6B7280] mt-1">用一句话看懂最近表现</p>
          </div>
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="p-2 rounded-full bg-[#15803D] hover:bg-[#12702E] text-white transition-colors disabled:opacity-50"
            aria-label="导出健康报告"
            title="一键导出健康报告"
          >
            <Download className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <Card className="p-5 bg-[#F0FBEF] border-[#BDEFC3]">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#DCF8D8] text-[#15803D]">
              <FileText className="w-6 h-6" strokeWidth={1.75} />
            </span>
            <div>
              <Badge variant="outline" className="mb-2 bg-white/70 text-[#15803D] border-[#BDEFC3]">
                本周总结
              </Badge>
              <h2 className="text-lg font-bold text-[#15803D]">高盐次数少了 2 次，做得不错</h2>
              <p className="mt-1 text-sm leading-6 text-[#4B5563]">
                油炸类还有点多，下周可以控制在 2 次以内，搭配绿叶菜会更稳。
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-[#FFFDF7]">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-[#5BA7F7]" strokeWidth={1.75} />
            <h2 className="text-lg font-bold text-[#111827]">今日提醒</h2>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.title} className="flex items-start gap-3 rounded-[20px] border border-[#BFDBFE] bg-[#EFF7FF] p-3">
                {reminder.type === 'medication' && <Pill className="w-5 h-5 text-[#5BA7F7] mt-0.5" strokeWidth={1.75} />}
                {reminder.type === 'diet' && <AlertCircle className="w-5 h-5 text-[#FFB84D] mt-0.5" strokeWidth={1.75} />}
                {reminder.type === 'device' && <Calendar className="w-5 h-5 text-[#16A34A] mt-0.5" strokeWidth={1.75} />}

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-[#111827]">{reminder.title}</h3>
                    <span className="text-xs text-[#6B7280]">{reminder.time}</span>
                  </div>
                  <p className="text-sm text-[#4B5563]">{reminder.note}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setReminderDialogOpen(true)}
            className="w-full mt-4 rounded-full border border-[#BDEFC3] bg-[#F0FBEF] px-4 py-2.5 font-semibold text-[#15803D] transition-colors hover:bg-[#DCF8D8]"
          >
            管理提醒设置
          </button>
        </Card>

        <Card className="p-5 bg-[#FFFDF7]">
          <h2 className="text-lg font-bold text-[#111827] mb-4">关键指标</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[20px] bg-[#F0FBEF] p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-[#16A34A]" strokeWidth={1.75} />
                <span className="text-sm text-[#4B5563]">风险次数</span>
              </div>
              <p className="text-2xl font-bold text-[#15803D]">下降 35%</p>
              <p className="text-xs text-[#6B7280] mt-1">较上周少了一些</p>
            </div>

            <div className="rounded-[20px] bg-[#EFF7FF] p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#5BA7F7]" strokeWidth={1.75} />
                <span className="text-sm text-[#4B5563]">健康评分</span>
              </div>
              <p className="text-2xl font-bold text-[#2563EB]">提升 12%</p>
              <p className="text-xs text-[#6B7280] mt-1">饮食更稳定了</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-[#FFFDF7]">
          <h2 className="text-lg font-bold text-[#111827] mb-4">饮食风险趋势</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#FFB84D"
                strokeWidth={3}
                dot={{ fill: '#FFB84D', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 bg-[#FFFDF7]">
          <h2 className="text-lg font-bold text-[#111827] mb-4">体重变化趋势（kg）</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={healthIndicatorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[75, 79]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4CCB63"
                fill="#DCF8D8"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 bg-[#EFF7FF] border-[#BFDBFE] shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
          <h3 className="text-lg font-bold text-[#2563EB] mb-1">下周小目标</h3>
          <p className="text-sm leading-6 text-[#2563EB]">
            油炸类控制在 2 次以内，晚餐多加一份绿叶菜。目标不用太大，能坚持就很好。
          </p>
          <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2563EB] transition-colors hover:bg-[#F8FBFF]">
            查看月度报告
          </button>
        </Card>

        {/* 季节和节日推荐 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SeasonalRecommendationCard />
          <SolarTermCard />
        </div>

        {/* 导出提示 */}
        <Card className="p-4 bg-[#F0FBEF] border border-[#BDEFC3] rounded-[20px]">
          <div className="flex items-start gap-3">
            <Share2 className="w-5 h-5 text-[#15803D] mt-0.5 flex-shrink-0" strokeWidth={1.75} />
            <div>
              <h4 className="font-semibold text-[#15803D] mb-1">一键导出报告</h4>
              <p className="text-sm text-[#4B5563]">
                点击顶部导出按钮，下载本周完整健康报告为 CSV 格式，方便分享和存档。
              </p>
            </div>
          </div>
        </Card>

        <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>提醒设置</DialogTitle>
              <DialogDescription>在此查看并快速调整日常健康提醒开关。</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {reminders.map((reminder) => (
                <div key={reminder.title} className="rounded-2xl border border-[#BFDBFE] bg-[#EFF7FF] p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#111827]">{reminder.title}</p>
                      <p className="text-xs text-[#6B7280]">{reminder.time}</p>
                    </div>
                    <span className="rounded-full bg-[#DCF8D8] px-3 py-1 text-xs font-semibold text-[#15803D]">
                      已开启
                    </span>
                  </div>
                  <p className="text-sm text-[#4B5563]">{reminder.note}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setReminderDialogOpen(false)}
                className="rounded-full border border-[#D1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAF7]"
              >
                关闭
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
