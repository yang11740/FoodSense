import { Calendar, Search, Filter } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import FoodRecommendationCard from '@/app/components/FoodRecommendationCard';

const historyData = [
  {
    date: '2026-01-31',
    time: '12:30',
    foodName: '红烧肉',
    recommendation: 'not-recommended' as const,
    tags: ['高脂', '高热量', '高盐']
  },
  {
    date: '2026-01-31',
    time: '08:00',
    foodName: '全麦面包配牛奶',
    recommendation: 'recommended' as const,
    tags: ['高纤维', '低脂']
  },
  {
    date: '2026-01-30',
    time: '18:45',
    foodName: '糖醋里脊',
    recommendation: 'caution' as const,
    tags: ['高糖', '油炸']
  },
  {
    date: '2026-01-30',
    time: '12:15',
    foodName: '清蒸鲈鱼',
    recommendation: 'recommended' as const,
    tags: ['高蛋白', '低脂']
  },
  {
    date: '2026-01-29',
    time: '19:20',
    foodName: '宫保鸡丁',
    recommendation: 'caution' as const,
    tags: ['高盐', '油炸']
  }
];

export default function History() {
  // 按日期分组
  const groupedByDate = historyData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = [];
    }
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof historyData>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl text-gray-900 mb-3">分析记录</h1>
          
          {/* 搜索栏 */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索菜品..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* 统计概览 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-white shadow-sm text-center">
            <p className="text-lg text-green-600 mb-0.5">15</p>
            <p className="text-xs text-gray-600">推荐</p>
          </Card>
          <Card className="p-3 bg-white shadow-sm text-center">
            <p className="text-lg text-orange-600 mb-0.5">8</p>
            <p className="text-xs text-gray-600">谨慎</p>
          </Card>
          <Card className="p-3 bg-white shadow-sm text-center">
            <p className="text-lg text-red-600 mb-0.5">5</p>
            <p className="text-xs text-gray-600">不推荐</p>
          </Card>
        </div>

        {/* 分组历史记录 */}
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm text-gray-700">{formatDate(date)}</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-1 top-0 text-xs text-gray-400">
                    {item.time}
                  </div>
                  <div className="ml-12">
                    <FoodRecommendationCard
                      foodName={item.foodName}
                      recommendation={item.recommendation}
                      tags={item.tags}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 加载更多 */}
        <button className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors">
          加载更多记录
        </button>
      </div>
    </div>
  );
}
