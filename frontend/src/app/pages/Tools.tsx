import { useState } from 'react';
import {
  AlertCircle,
  Bell,
  ChevronRight,
  FileText,
  Goal,
  LineChart as LineChartIcon,
  Pill,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Utensils
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '@/app/components/ui/card';

type HealthSection = 'overview' | 'weekly' | 'risk' | 'reminders' | 'goals' | 'privacy';

interface ToolsProps {
  initialSection?: HealthSection;
}

const riskTrendData = [
  { date: '周一', risk: 3 },
  { date: '周二', risk: 2 },
  { date: '周三', risk: 4 },
  { date: '周四', risk: 3 },
  { date: '周五', risk: 2 },
  { date: '周六', risk: 1 },
  { date: '周日', risk: 2 }
];

const intakeTrendData = [
  { date: '第 1 周', value: 76 },
  { date: '第 2 周', value: 82 },
  { date: '第 3 周', value: 79 },
  { date: '第 4 周', value: 86 }
];

const summaryStats = [
  { value: '28', label: '识别记录', tone: 'bg-[#F0FBEF] text-[#15803D]' },
  { value: '7', label: '连续记录', tone: 'bg-[#EFF7FF] text-[#2563EB]' },
  { value: '3', label: '风险提醒', tone: 'bg-[#FFF7E6] text-[#B7791F]' }
];

const sectionCards: Array<{
  id: HealthSection;
  icon: typeof Utensils;
  title: string;
  description: string;
  color: string;
}> = [
  {
    id: 'weekly',
    icon: FileText,
    title: '饮食周报',
    description: '用一句话看懂最近表现',
    color: 'bg-[#F0FBEF] text-[#15803D]'
  },
  {
    id: 'risk',
    icon: LineChartIcon,
    title: '风险趋势',
    description: '高盐、高糖、高脂变化',
    color: 'bg-[#FFF7E6] text-[#B7791F]'
  },
  {
    id: 'reminders',
    icon: Bell,
    title: '健康提醒',
    description: '饮食、用药和复查提醒',
    color: 'bg-[#EFF7FF] text-[#2563EB]'
  },
  {
    id: 'goals',
    icon: Goal,
    title: '下周小目标',
    description: '把建议变成可执行动作',
    color: 'bg-[#F5F3FF] text-[#7C3AED]'
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: '设置与隐私',
    description: '管理偏好、授权和数据',
    color: 'bg-[#F9FAFB] text-[#4B5563]'
  }
];

const reminders = [
  {
    type: 'medication',
    title: '降压药提醒',
    time: '每日 08:00',
    note: '建议饭后服用，避免空腹不适。'
  },
  {
    type: 'diet',
    title: '午餐小提醒',
    time: '每日 12:00',
    note: '今天少选油炸菜，主食可以换成杂粮饭。'
  },
  {
    type: 'review',
    title: '复盘今日摄入',
    time: '每日 20:30',
    note: '看看热量和三大营养素有没有明显超出目标。'
  }
];

const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(76, 203, 99, 0.16)',
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(76, 203, 99, 0.12)'
};

export default function Tools({ initialSection = 'overview' }: ToolsProps) {
  const [activeSection, setActiveSection] = useState<HealthSection>(initialSection);

  const visibleCards = sectionCards.filter((card) => card.id !== 'privacy');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#DDFCD6_0%,#F7FFF4_44%,#F3FAF0_100%)] pb-24">
      <div className="relative px-5 pt-6">
        <p className="text-sm font-semibold text-[#4BAE5F]">知膳 FoodSense</p>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-[28px] font-semibold leading-none tracking-normal text-[#1D2A22]">健康中心</h1>
          <Sparkles className="h-6 w-6 text-[#1D2A22]" strokeWidth={2} />
        </div>
        <button
          onClick={() => setActiveSection('privacy')}
          className="absolute right-5 top-7 grid h-9 w-9 place-items-center rounded-full border border-[#BDEFC3] bg-white/72 text-[#4B5563] shadow-[0_8px_18px_rgba(76,203,99,0.12)]"
          aria-label="设置与隐私"
        >
          <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="space-y-4 px-5 py-4">
        <Card className="overflow-hidden border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_10px_28px_rgba(76,203,99,0.12)]">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[20px] bg-[#DCF8D8] text-[#15803D]">
              <Sparkles className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#4B8B5A]">本周饮食小结</p>
              <h2 className="mt-1 text-xl font-extrabold leading-7 text-[#17221B]">
                高盐次数少了 2 次，晚餐更清淡了
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5F6F63]">
                油炸类还可以再降一点。下周优先把红烧、糖醋、炸物控制在 2 次以内，搭配绿叶菜会更稳。
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {summaryStats.map((stat) => (
            <Card key={stat.label} className={`rounded-[22px] p-3 text-center shadow-[0_6px_16px_rgba(15,23,42,0.06)] ${stat.tone}`}>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold opacity-80">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visibleCards.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`rounded-[24px] border bg-[#FFFDF7] p-4 text-left shadow-[0_8px_20px_rgba(76,203,99,0.10)] transition-all active:scale-[0.98] ${
                  active ? 'border-[#4CCB63] ring-2 ring-[#DCF8D8]' : 'border-transparent'
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-[18px] ${item.color}`}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#A7B3AA]" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-[#17221B]">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#6B7280]">{item.description}</p>
              </button>
            );
          })}
        </div>

        {activeSection === 'overview' && (
          <Card className="border-[#BDEFC3] bg-[#FFFDF7] p-5">
            <h2 className="mb-3 text-lg font-extrabold text-[#17221B]">今天可以先看这些</h2>
            <div className="space-y-3">
              {sectionCards.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex w-full items-center gap-3 rounded-[20px] bg-[#F7FFF4] p-3 text-left"
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-[16px] ${item.color}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-bold text-[#17221B]">{item.title}</span>
                      <span className="block text-sm text-[#6B7280]">{item.description}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#A7B3AA]" />
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {activeSection === 'weekly' && (
          <div className="space-y-4">
            <Card className="border-[#BDEFC3] bg-[#F0FBEF] p-5">
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#15803D]" strokeWidth={1.8} />
                <h2 className="text-lg font-extrabold text-[#15803D]">饮食周报</h2>
              </div>
              <p className="text-sm leading-6 text-[#4B5563]">
                本周清淡菜占比提升，晚餐热量更平稳。需要注意的是糖醋、红烧类菜品仍容易带来高糖和高脂风险。
              </p>
            </Card>

            <Card className="bg-[#FFFDF7] p-5">
              <h3 className="mb-4 text-lg font-extrabold text-[#17221B]">关键指标</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[20px] bg-[#F0FBEF] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[#16A34A]" strokeWidth={1.8} />
                    <span className="text-sm text-[#4B5563]">风险次数</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#15803D]">下降 35%</p>
                  <p className="mt-1 text-xs text-[#6B7280]">比上周少了一些</p>
                </div>
                <div className="rounded-[20px] bg-[#EFF7FF] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#5BA7F7]" strokeWidth={1.8} />
                    <span className="text-sm text-[#4B5563]">均衡程度</span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#2563EB]">提升 12%</p>
                  <p className="mt-1 text-xs text-[#6B7280]">饮食更稳定了</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeSection === 'risk' && (
          <div className="space-y-4">
            <Card className="bg-[#FFFDF7] p-5">
              <h2 className="mb-4 text-lg font-extrabold text-[#17221B]">饮食风险趋势</h2>
              <ResponsiveContainer width="100%" height={210}>
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

            <Card className="border-[#FFE1A6] bg-[#FFF7E6] p-5">
              <h3 className="mb-2 text-lg font-extrabold text-[#B7791F]">本周主要风险</h3>
              <div className="flex flex-wrap gap-2">
                {['高盐 3 次', '高脂 2 次', '高糖 2 次'].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/75 px-3 py-1 text-sm font-semibold text-[#B7791F]">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#7A5B24]">
                风险提示不是禁止吃，而是帮你知道哪里要少一点、换一种做法会更舒服。
              </p>
            </Card>
          </div>
        )}

        {activeSection === 'reminders' && (
          <Card className="bg-[#FFFDF7] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#5BA7F7]" strokeWidth={1.8} />
              <h2 className="text-lg font-extrabold text-[#17221B]">健康提醒</h2>
            </div>

            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.title} className="flex items-start gap-3 rounded-[20px] border border-[#BFDBFE] bg-[#EFF7FF] p-3">
                  {reminder.type === 'medication' && <Pill className="mt-0.5 h-5 w-5 text-[#5BA7F7]" strokeWidth={1.8} />}
                  {reminder.type === 'diet' && <AlertCircle className="mt-0.5 h-5 w-5 text-[#FFB84D]" strokeWidth={1.8} />}
                  {reminder.type === 'review' && <Utensils className="mt-0.5 h-5 w-5 text-[#16A34A]" strokeWidth={1.8} />}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h3 className="font-bold text-[#17221B]">{reminder.title}</h3>
                      <span className="shrink-0 text-xs text-[#6B7280]">{reminder.time}</span>
                    </div>
                    <p className="text-sm leading-5 text-[#4B5563]">{reminder.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full rounded-full border border-[#BDEFC3] bg-[#F0FBEF] px-4 py-3 font-bold text-[#15803D] transition-colors hover:bg-[#DCF8D8]">
              管理提醒设置
            </button>
          </Card>
        )}

        {activeSection === 'goals' && (
          <div className="space-y-4">
            <Card className="border-[#BDEFC3] bg-[#FFFDF7] p-5">
              <h2 className="mb-2 text-lg font-extrabold text-[#17221B]">下周小目标</h2>
              <p className="text-sm leading-6 text-[#5F6F63]">
                把油炸类控制在 2 次以内，晚餐多加一份绿叶菜。目标不用太大，能坚持就很好。
              </p>
              <div className="mt-4 space-y-3">
                {[
                  ['少油炸', '本周 4 次，目标 2 次以内', '70%'],
                  ['多蔬菜', '晚餐补一份绿叶菜', '55%'],
                  ['控甜口', '糖醋类换成清炒或蒸煮', '45%']
                ].map(([title, note, width]) => (
                  <div key={title} className="rounded-[18px] bg-[#F7FFF4] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-[#17221B]">{title}</span>
                      <span className="text-xs text-[#6B7280]">{note}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#E6EFE5]">
                      <div className="h-full rounded-full bg-[#4CCB63]" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#FFFDF7] p-5">
              <h3 className="mb-4 text-lg font-extrabold text-[#17221B]">均衡趋势</h3>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={intakeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" domain={[70, 90]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="#4CCB63" fill="#DCF8D8" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {activeSection === 'privacy' && (
          <Card className="border-[#E5E7EB] bg-[#FFFDF7] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#4B5563]" strokeWidth={1.8} />
              <h2 className="text-lg font-extrabold text-[#17221B]">设置与隐私</h2>
            </div>
            <div className="space-y-3">
              {['相机授权', '饮食偏好', '健康目标', '数据导出'].map((item) => (
                <button key={item} className="flex w-full items-center justify-between rounded-[18px] bg-[#F7FFF4] px-4 py-3 text-left">
                  <span className="font-bold text-[#17221B]">{item}</span>
                  <ChevronRight className="h-4 w-4 text-[#A7B3AA]" strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
