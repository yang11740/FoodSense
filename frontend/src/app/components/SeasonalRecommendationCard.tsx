import React from 'react';
import { Leaf, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { getSeasonalAdvice, getUpcomingFestival } from '@/app/types/seasonalRecommendation';

/**
 * 季节和节日推荐卡片组件
 * 在健康报告页面展示当前季节和即将到来的节日的饮食建议
 */
export default function SeasonalRecommendationCard() {
  const seasonalAdvice = getSeasonalAdvice();
  const upcomingFestival = getUpcomingFestival();

  return (
    <div className="space-y-4">
      {/* 季节建议 */}
      <Card className="rounded-[28px] border border-[#BDEFC3] bg-gradient-to-br from-[#F0FBEF] to-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
        <div className="flex items-start gap-3 mb-4">
          <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#DCF8D8] text-[#15803D] flex-shrink-0">
            <Leaf className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <div>
            <Badge variant="outline" className="mb-2 bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]">
              季节养生
            </Badge>
            <h3 className="text-lg font-bold text-[#1D2A22]">{seasonalAdvice.displayName}</h3>
            <p className="text-sm text-[#6B7280] mt-1">{seasonalAdvice.advice}</p>
          </div>
        </div>

        {/* 推荐食物 */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-[#15803D] mb-2">✓ 推荐食物</h4>
          <div className="space-y-2">
            {seasonalAdvice.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] mt-0.5 flex-shrink-0" strokeWidth={2} />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 应避免的食物 */}
        <div>
          <h4 className="text-sm font-semibold text-[#B7791F] mb-2">✗ 应避免</h4>
          <div className="space-y-1">
            {seasonalAdvice.avoidFoods.map((food, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D]"></span>
                <span className="text-sm text-[#B7791F]">{food}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 节日建议 */}
      {upcomingFestival && (
        <Card className="rounded-[28px] border border-[#FFD88A] bg-gradient-to-br from-[#FFF7E6] to-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3 mb-4">
            <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#FFE4CC] text-[#B7791F] flex-shrink-0">
              <Calendar className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <div>
              <Badge variant="outline" className="mb-2 bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]">
                节日提醒
              </Badge>
              <h3 className="text-lg font-bold text-[#1D2A22]">{upcomingFestival.displayName}</h3>
              <p className="text-sm text-[#6B7280] mt-1">{upcomingFestival.date}</p>
            </div>
          </div>

          <p className="mb-4 text-sm text-[#4B5563] leading-6">{upcomingFestival.advice}</p>

          {/* 传统食物 */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#B7791F] mb-2">🍲 传统食物</h4>
            <div className="space-y-2">
              {upcomingFestival.traditionalFoods.map((food, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                  <span className="w-4 h-4 rounded bg-[#FFE4CC] text-[#B7791F] text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{food}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 健康贴士 */}
          <div className="p-3 rounded-lg bg-[#FFF9F0] border border-[#FFD88A]">
            <h4 className="text-sm font-semibold text-[#B7791F] mb-2">💡 健康贴士</h4>
            <div className="space-y-1">
              {upcomingFestival.healthTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#B7791F]">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 全年节日提示 */}
      <Card className="rounded-[28px] border border-[#BFDBFE] bg-[#EFF7FF] p-4 shadow-sm">
        <h4 className="text-sm font-bold text-[#2563EB] mb-3">📅 全年节气提醒</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-[#2563EB]">
          <div>🎆 春节（1-2月）</div>
          <div>🌲 清明（4月）</div>
          <div>🏮 端午（5-6月）</div>
          <div>☀️ 夏至（6月）</div>
          <div>🌕 中秋（9月）</div>
          <div>❄️ 冬至（12月）</div>
        </div>
      </Card>
    </div>
  );
}
