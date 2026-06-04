import { Card } from '@/app/components/ui/card';

export default function LoadingAnalysis() {
  return (
    <Card className="p-6 bg-[#FFFDF7]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-[#DCF8D8]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#4CCB63] border-t-transparent animate-spin"></div>
          <div className="absolute inset-4 grid place-items-center rounded-full bg-[#F0FBEF] text-xl">菜</div>
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-[#111827] mb-2">正在看这道菜...</p>
          <p className="text-sm text-[#6B7280] mb-3">识别食材、烹饪方式和可能的风险来源</p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-[#4CCB63] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#4CCB63] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#4CCB63] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        <div className="w-full space-y-3 mt-2">
          <div className="flex items-center gap-3 rounded-full bg-[#F0FBEF] px-3 py-2">
            <div className="w-6 h-6 bg-[#DCF8D8] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#4CCB63] rounded-full"></div>
            </div>
            <span className="text-sm text-[#4B5563]">识别菜品</span>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-[#F0FBEF] px-3 py-2">
            <div className="w-6 h-6 bg-[#DCF8D8] rounded-full flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-[#4CCB63] rounded-full"></div>
            </div>
            <span className="text-sm text-[#4B5563]">分析营养成分</span>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white/70 px-3 py-2">
            <div className="w-6 h-6 bg-[#E5E7EB] rounded-full"></div>
            <span className="text-sm text-[#6B7280]">生成一句好懂的建议</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
