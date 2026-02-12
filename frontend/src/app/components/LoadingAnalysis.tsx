import { Card } from '@/app/components/ui/card';

export default function LoadingAnalysis() {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex flex-col items-center gap-4">
        {/* 加载动画 */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* 加载文字 */}
        <div className="text-center">
          <p className="text-lg text-gray-900 mb-2">正在分析菜品...</p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* 分析步骤 */}
        <div className="w-full space-y-3 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700">识别菜品</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700">分析营养成分</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
            <span className="text-sm text-gray-400">生成建议</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
