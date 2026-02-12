import { 
  BarChart3, 
  FileText, 
  AlertTriangle, 
  Bell, 
  Activity,
  Utensils,
  Calendar,
  Settings,
  ChevronRight 
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';

const toolItems = [
  {
    icon: <Utensils className="w-6 h-6" />,
    title: '营养分析记录',
    description: '查看历史饮食分析记录',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: '健康报告',
    description: '周报 / 月报查看',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: '饮食风险记录',
    description: '查看风险提示历史',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: '用药与饮食提醒',
    description: '设置健康提醒',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: '设备健康数据',
    description: '同步可穿戴设备数据',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: '数据统计分析',
    description: '查看健康数据趋势',
    color: 'bg-teal-50 text-teal-600'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: '饮食计划',
    description: '制定个性化饮食计划',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: '设置',
    description: '应用设置与偏好',
    color: 'bg-gray-50 text-gray-600'
  }
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl text-gray-900">健康工具</h1>
          <p className="text-sm text-gray-500 mt-1">功能中心</p>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* 快捷统计 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm text-center">
            <p className="text-2xl text-green-700 mb-1">28</p>
            <p className="text-xs text-green-600">分析次数</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm text-center">
            <p className="text-2xl text-blue-700 mb-1">7</p>
            <p className="text-xs text-blue-600">连续天数</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm text-center">
            <p className="text-2xl text-orange-700 mb-1">3</p>
            <p className="text-xs text-orange-600">风险提醒</p>
          </Card>
        </div>

        {/* 功能列表 */}
        <div className="space-y-3">
          {toolItems.map((item, index) => (
            <Card 
              key={index}
              className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 p-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* 底部提示 */}
        <Card className="mt-6 p-4 bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            更多功能持续开发中，敬请期待
          </p>
        </Card>
      </div>
    </div>
  );
}
