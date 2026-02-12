import { User, Target, History, Edit2, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useState } from 'react';

export default function HealthProfile() {
  const [rotationY, setRotationY] = useState(0);

  const userData = {
    name: '张三',
    age: 35,
    gender: '男',
    height: 175,
    weight: 78,
    bmi: 25.5,
    healthGoals: ['控糖', '减脂', '改善睡眠'],
    healthStatus: {
      overall: 'caution',
      issues: [
        { area: '腹部', status: 'warning', description: '脂肪偏高' },
        { area: '睡眠', status: 'caution', description: '睡眠不足' }
      ]
    }
  };

  const handleModelDrag = (e: React.MouseEvent) => {
    const sensitivity = 0.5;
    setRotationY(prev => prev + e.movementX * sensitivity);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl text-gray-900">健康画像</h1>
          <p className="text-sm text-gray-500 mt-1">个人健康状态概览</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* 3D人体模型 */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">健康状态感知</h2>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              需关注
            </Badge>
          </div>

          {/* 3D模型展示区域 */}
          <div 
            className="relative aspect-[3/4] bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
            onMouseMove={handleModelDrag}
          >
            {/* 背景网格效果 */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>

            {/* 简化的3D人体模型 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative w-32 h-80 transition-transform duration-300 ease-out"
                style={{ 
                  transform: `perspective(1000px) rotateY(${rotationY}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 头部 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full border-2 border-blue-400 shadow-lg"></div>
                
                {/* 躯干 */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-24 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl border-2 border-blue-400 shadow-lg">
                  {/* 腹部高亮区域 - 表示脂肪偏高 */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-xl border-2 border-orange-500 opacity-80 animate-pulse shadow-lg">
                    <div className="absolute inset-0 bg-orange-400 rounded-xl opacity-30 blur-sm"></div>
                  </div>
                </div>
                
                {/* 手臂 */}
                <div className="absolute top-20 left-0 w-6 h-24 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full border-2 border-blue-400 shadow-md"></div>
                <div className="absolute top-20 right-0 w-6 h-24 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full border-2 border-blue-400 shadow-md"></div>
                
                {/* 腿部 */}
                <div className="absolute top-48 left-6 w-8 h-32 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full border-2 border-blue-400 shadow-md"></div>
                <div className="absolute top-48 right-6 w-8 h-32 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full border-2 border-blue-400 shadow-md"></div>
              </div>
            </div>

            {/* 拖动提示 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600 bg-white/90 px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
              拖动旋转查看
            </div>
          </div>

          {/* 状态标注 */}
          <div className="mt-4 space-y-2">
            {userData.healthStatus.issues.map((issue, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm text-orange-900">{issue.area}：</span>
                  <span className="text-sm text-orange-700">{issue.description}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            健康状态感知示意，不构成医学诊断
          </p>
        </Card>

        {/* 基础信息 */}
        <Card className="p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">基础信息</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">姓名</p>
              <p className="text-gray-900">{userData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">年龄</p>
              <p className="text-gray-900">{userData.age} 岁</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">性别</p>
              <p className="text-gray-900">{userData.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">身高</p>
              <p className="text-gray-900">{userData.height} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">体重</p>
              <p className="text-gray-900">{userData.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">BMI</p>
              <p className="text-orange-600">{userData.bmi}</p>
            </div>
          </div>
        </Card>

        {/* 健康目标 */}
        <Card className="p-5 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h2 className="text-lg text-gray-900">健康目标</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {userData.healthGoals.map((goal, index) => (
              <Badge key={index} className="bg-green-100 text-green-700 border-green-200">
                {goal}
              </Badge>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
            编辑健康目标
          </button>
        </Card>

        {/* 当前健康状态摘要 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">健康状态摘要</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-gray-700">整体状态</span>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                需改善
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">饮食习惯</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                尚可
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">运动状况</span>
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                不足
              </Badge>
            </div>
          </div>
        </Card>

        {/* 历史记录入口 */}
        <Card className="p-5 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg text-gray-900">历史记录</h2>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">饮食分析记录</span>
              <span className="text-sm text-gray-500">28 条</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <span className="text-gray-700">健康报告</span>
              <span className="text-sm text-gray-500">4 份</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
