import { Camera, Shield, TrendingUp, X } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface WelcomeScreenProps {
  onClose: () => void;
}

export default function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      <Card className="bg-white max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">欢迎使用食知</h2>
          <p className="text-gray-600">FoodSense 智能饮食决策辅助系统</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">智能识别</h3>
              <p className="text-sm text-gray-600">
                拍照即可快速识别菜品，分析营养结构
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">风险提示</h3>
              <p className="text-sm text-gray-600">
                实时提供饮食风险提示，辅助健康决策
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">健康管理</h3>
              <p className="text-sm text-gray-600">
                长期跟踪健康数据，生成阶段性报告
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <span className="block mb-1">重要提示：</span>
            本系统为饮食决策辅助工具，不提供医疗诊断或治疗建议。最终决策请结合个人实际情况综合判断。
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          开始使用
        </button>
      </Card>
    </div>
  );
}
