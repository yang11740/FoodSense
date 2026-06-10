'use client';

import { useState } from 'react';
import { ArrowLeft, Target } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface GoalsProps {
  onBack?: () => void;
  goals: string[];
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (goal: string) => void;
}

export default function Goals({ onBack, goals, onAddGoal, onRemoveGoal }: GoalsProps) {
  const [inputValue, setInputValue] = useState('');

  const addGoal = () => {
    const value = inputValue.trim();
    if (value && !goals.includes(value)) {
      onAddGoal(value);
      setInputValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FFF4] pb-20">
      <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#EFF7EE] text-[#15803D]"
            aria-label="返回健康中心"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">健康目标</h1>
            <p className="text-sm text-[#6B7280]">添加你的自定义目标，系统会更准确地帮助你达成。</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-6">
        <Card className="bg-[#EFF7FF] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#DCF8D8] text-[#15803D]">
              <Target className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#17221B]">当前目标</h2>
              <p className="text-sm text-[#4B5563]">点击移除已完成或不再适用的目标。</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {goals.length === 0 && <p className="text-sm text-[#6B7280]">还没有健康目标。</p>}
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => onRemoveGoal(goal)}
                className="rounded-full bg-white px-3 py-2 text-sm text-[#1F2937] shadow-sm transition hover:bg-[#F0FDF4]"
              >
                {goal} ×
              </button>
            ))}
          </div>
        </Card>

        <Card className="bg-[#FFFDF7] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FEEBC8] text-[#B7791F]">
              <Target className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#17221B]">新增目标</h2>
              <p className="text-sm text-[#4B5563]">例如：一周三次散步、少吃甜点、晚餐少盐。</p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="添加新的健康目标"
              className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#4BAE5F] focus:ring-2 focus:ring-[#DCF8D8]"
            />
            <button
              type="button"
              onClick={addGoal}
              className="w-full rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12702E]"
            >
              添加目标
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
