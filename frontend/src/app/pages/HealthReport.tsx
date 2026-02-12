import { Bell, TrendingDown, TrendingUp, Calendar, Pill, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  { date: '第1周', value: 78 },
  { date: '第2周', value: 77.5 },
  { date: '第3周', value: 77 },
  { date: '第4周', value: 76.5 }
];

export default function HealthReport() {
  const reminders = [
    {
      type: 'medication',
      title: '降压药提醒',
      time: '每日 08:00',
      note: '饭后服用',
      status: 'active'
    },
    {
      type: 'diet',
      title: '饮食注意',
      time: '每日 12:00',
      note: '避免高盐高脂食物',
      status: 'active'
    },
    {
      type: 'device',
      title: '血压测量',
      time: '每日 20:00',
      note: '同步至健康数据',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl text-gray-900">健康提醒与报告</h1>
          <p className="text-sm text-gray-500 mt-1">阶段性健康分析</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* 今日提醒 */}
        <Card className="p-5 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg text-gray-900">今日提醒</h2>
          </div>

          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {reminder.type === 'medication' && <Pill className="w-5 h-5 text-blue-600 mt-0.5" />}
                {reminder.type === 'diet' && <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />}
                {reminder.type === 'device' && <Calendar className="w-5 h-5 text-green-600 mt-0.5" />}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-gray-900">{reminder.title}</h3>
                    <span className="text-xs text-gray-500">{reminder.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{reminder.note}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            管理提醒设置
          </button>
        </Card>

        {/* 语音与设备提醒 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">智能提醒</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-900">语音提醒</p>
                  <p className="text-sm text-gray-500">定时语音播报</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-gray-900">可穿戴设备联动</p>
                  <p className="text-sm text-gray-500">同步健康数据</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* 本周健康报告 */}
        <Card className="p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">本周健康报告</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              2026年第5周
            </Badge>
          </div>

          {/* 核心指标 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">风险次数</span>
              </div>
              <p className="text-2xl text-green-600">↓ 35%</p>
              <p className="text-xs text-gray-500 mt-1">较上周下降</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">健康评分</span>
              </div>
              <p className="text-2xl text-blue-600">↑ 12%</p>
              <p className="text-xs text-gray-500 mt-1">较上周提升</p>
            </div>
          </div>

          {/* 饮食风险变化趋势 */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">饮食风险变化趋势</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 健康指标变化趋势 */}
          <div>
            <h3 className="text-gray-900 mb-3">体重变化趋势（kg）</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthIndicatorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#888" />
                <YAxis tick={{ fontSize: 12 }} stroke="#888" domain={[75, 79]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#d1fae5"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 总结性文字 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-blue-900 mb-2">本周总结</h4>
            <p className="text-sm text-blue-800 leading-relaxed">
              本周饮食风险次数显著下降，健康评分有所提升。体重控制效果良好，建议继续保持低脂低糖饮食习惯，适当增加运动量。
            </p>
          </div>
        </Card>

        {/* 月度报告入口 */}
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg text-purple-900 mb-1">本月健康报告</h3>
              <p className="text-sm text-purple-700">查看详细的月度健康分析</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              查看
            </button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm">
              导出数据
            </button>
            <button className="flex-1 px-3 py-2 bg-white text-purple-700 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors text-sm">
              分享报告
            </button>
          </div>
        </Card>

        {/* 系统价值说明 */}
        <Card className="p-4 bg-green-50 border border-green-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="mb-1">长期健康管理价值</p>
              <p className="text-green-700">
                通过持续的饮食分析和健康提醒，帮助您建立更健康的生活习惯，实现长期健康目标。系统提供辅助决策支持，不构成医疗诊断。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
