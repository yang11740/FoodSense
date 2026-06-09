import React from 'react';
import { Calendar, Sun, CloudRain } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { getCurrentSolarTerm } from '@/app/types/solarTermRecommendation';

export default function SolarTermCard() {
  const term = getCurrentSolarTerm();

  return (
    <Card className="rounded-[28px] border border-[#E2F4DE] bg-gradient-to-br from-[#FFFDF7] to-[#F7FFF4] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3 mb-3">
        <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#EFF7FF] text-[#2563EB] flex-shrink-0">
          <Calendar className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <div>
          <h3 className="text-lg font-bold text-[#1D2A22]">当前节气：{term.term}</h3>
          <p className="text-sm text-[#6B7280] mt-1">近似日期：{term.dateApprox}</p>
        </div>
      </div>

      <p className="mb-3 text-sm text-[#4B5563]">{term.advice}</p>

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-[#15803D] mb-2">✓ 推荐食物</h4>
        <div className="flex flex-wrap gap-2">
          {term.recommendedFoods.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-[#DCF8D8] text-sm text-[#15803D] font-medium">{f}</span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-[#B7791F] mb-2">✗ 忌食</h4>
        <div className="flex flex-wrap gap-2">
          {term.avoidFoods.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-[#FFE4CC] text-sm text-[#B7791F] font-medium">{f}</span>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[#EFF7FF] border border-[#BFDBFE] text-sm text-[#2563EB]">
        <h4 className="font-semibold">小贴士</h4>
        <ul className="mt-2 list-inside list-disc" style={{ paddingLeft: 12 }}>
          {term.tips.map((tip, idx) => (
            <li key={idx} className="text-sm text-[#4B5563]">{tip}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
