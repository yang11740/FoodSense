'use client';

import { useState } from 'react';
import { ArrowLeft, Leaf, SunMedium } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface PreferencesProps {
  onBack?: () => void;
  preferences: string[];
  onAddPreference: (preference: string) => void;
  onRemovePreference: (preference: string) => void;
}

export default function Preferences({
  onBack,
  preferences,
  onAddPreference,
  onRemovePreference
}: PreferencesProps) {
  const [inputValue, setInputValue] = useState('');

  const addPreference = () => {
    const value = inputValue.trim();
    if (value && !preferences.includes(value)) {
      onAddPreference(value);
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
            <h1 className="text-xl font-bold text-[#111827]">饮食偏好</h1>
            <p className="text-sm text-[#6B7280]">设置你的口味和饮食习惯，系统将给出更符合你的推荐。</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-6">
        <Card className="bg-[#EFF7FF] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#DCF8D8] text-[#15803D]">
              <Leaf className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#17221B]">我的偏好</h2>
              <p className="text-sm text-[#4B5563]">点击移除不再适用的饮食偏好。</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.length === 0 && <p className="text-sm text-[#6B7280]">还没有饮食偏好。</p>}
            {preferences.map((preference) => (
              <button
                key={preference}
                type="button"
                onClick={() => onRemovePreference(preference)}
                className="rounded-full bg-white px-3 py-2 text-sm text-[#1F2937] shadow-sm transition hover:bg-[#F0FDF4]"
              >
                {preference} ×
              </button>
            ))}
          </div>
        </Card>

        <Card className="bg-[#FFFDF7] p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#FFF3D6] text-[#B7791F]">
              <SunMedium className="h-5 w-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-[#17221B]">新增偏好</h2>
              <p className="text-sm text-[#4B5563]">例如：少油、清淡、素食、低糖。</p>
            </div>
          </div>
          <div className="space-y-3">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="添加新的饮食偏好"
              className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#4BAE5F] focus:ring-2 focus:ring-[#DCF8D8]"
            />
            <button
              type="button"
              onClick={addPreference}
              className="w-full rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12702E]"
            >
              添加偏好
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
