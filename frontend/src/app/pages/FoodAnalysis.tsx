import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import type { RecipeRecord } from '@/app/types/food';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const pad = (value: number) => value.toString().padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const getRecommendationTone = (recommendation: RecipeRecord['recommendation']) => {
  switch (recommendation) {
    case 'recommended':
      return {
        label: '比较适合',
        badge: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
        panel: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]'
      };
    case 'caution':
      return {
        label: '建议少量',
        badge: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
        panel: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]'
      };
    case 'not-recommended':
      return {
        label: '建议少量',
        badge: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
        panel: 'bg-[#FFF1F1] text-[#D94A4A] border-[#FFC6C6]'
      };
  }
};

const getMacroBreakdown = (record: RecipeRecord) => {
  const carbsCalories = record.carbs * 4;
  const proteinCalories = record.protein * 4;
  const fatCalories = record.fat * 9;
  const total = Math.max(carbsCalories + proteinCalories + fatCalories, 1);

  return [
    {
      label: '碳水',
      grams: record.carbs,
      color: '#8CC8F2',
      percent: Math.round((carbsCalories / total) * 100)
    },
    {
      label: '蛋白质',
      grams: record.protein,
      color: '#8DDB9C',
      percent: Math.round((proteinCalories / total) * 100)
    },
    {
      label: '脂肪',
      grams: record.fat,
      color: '#F6C985',
      percent: Math.round((fatCalories / total) * 100)
    }
  ];
};

interface FoodAnalysisProps {
  recipeRecords: RecipeRecord[];
}

export default function FoodAnalysis({ recipeRecords }: FoodAnalysisProps) {
  const today = new Date(2026, 5, 4);
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [expandedId, setExpandedId] = useState<string | null>('2026-06-04-lunch');

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1))
    ];
  }, [visibleMonth]);

  const selectedRecords = recipeRecords.filter((record) => record.date === selectedDate);
  const selectedDateLabel = selectedDate.replace(/-/g, '.');

  const changeMonth = (offset: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#DDFCD6_0%,#F7FFF4_42%,#F3FAF0_100%)] pb-28">
      <div className="px-5 pt-6">
        <p className="text-sm font-semibold text-[#4BAE5F]">知膳 FoodSense</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-[28px] font-semibold leading-none tracking-normal text-[#1D2A22]">
              我的食谱日历
            </h1>
            <Sparkles className="h-6 w-6 text-[#1D2A22]" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-5">
        <Card className="rounded-[30px] border border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_12px_30px_rgba(76,203,99,0.14)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#1D2A22]">
              <CalendarDays className="h-6 w-6" strokeWidth={2.1} />
              <span className="text-[21px] font-semibold leading-none">
                {visibleMonth.getFullYear()} 年 {pad(visibleMonth.getMonth() + 1)} 月
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => changeMonth(-1)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F0FBEF] text-[#15803D]"
                aria-label="上个月"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2} />
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F0FBEF] text-[#15803D]"
                aria-label="下个月"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center">
            {weekDays.map((day) => (
              <div key={day} className="text-sm font-medium text-[#7B827D]">
                {day}
              </div>
            ))}

            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-11" />;
              const dateKey = toDateKey(date);
              const isSelected = selectedDate === dateKey;
              const hasRecord = recipeRecords.some((record) => record.date === dateKey);

              return (
                <button
                  key={dateKey}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setExpandedId(null);
                  }}
                  className={`mx-auto grid h-11 w-11 place-items-center rounded-full text-[20px] font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#16A34A] text-white'
                      : 'text-[#111827] hover:bg-[#F0FBEF]'
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {hasRecord && !isSelected && <span className="mt-[-8px] h-1.5 w-1.5 rounded-full bg-[#4CCB63]" />}
                </button>
              );
            })}
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-[#1D2A22]">选中日期食谱</h2>
            <span className="text-sm font-medium text-[#6B7280]">{selectedDateLabel}</span>
          </div>

          <div className="space-y-3">
            {selectedRecords.length === 0 && (
              <Card className="bg-[#FFFDF7] p-5 text-center">
                <p className="text-base font-semibold text-[#1D2A22]">这天还没有食谱记录</p>
                <p className="mt-2 text-sm text-[#6B7280]">拍照识别并添加后，会显示在这里。</p>
              </Card>
            )}

            {selectedRecords.map((record) => {
              const tone = getRecommendationTone(record.recommendation);
              const expanded = expandedId === record.id;
              const macroBreakdown = getMacroBreakdown(record);
              const carbsEnd = macroBreakdown[0].percent;
              const proteinEnd = carbsEnd + macroBreakdown[1].percent;

              return (
                <Card key={record.id} className="bg-[#FFFDF7] p-4">
                  <button
                    onClick={() => setExpandedId(expanded ? null : record.id)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">
                          {record.meal}
                        </Badge>
                        <Badge variant="outline" className={tone.badge}>
                          {tone.label}
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-[#1D2A22]">{record.name}</h3>
                      {!expanded && (
                        <p className="mt-1 text-sm text-[#6B7280]">
                          {record.calories} kcal · 碳水 {record.carbs}g · 蛋白质 {record.protein}g · 脂肪 {record.fat}g
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform ${expanded ? 'rotate-180' : ''}`}
                      strokeWidth={2}
                    />
                  </button>

                  {expanded && (
                    <div className="mt-4 space-y-3 border-t border-dashed border-[#DDE6DD] pt-4">
                      <div className="rounded-[22px] bg-white/80 p-4 shadow-[0_6px_18px_rgba(76,203,99,0.08)]">
                        <div className="flex items-center gap-5">
                          <div
                            className="grid h-[132px] w-[132px] shrink-0 place-items-center rounded-full"
                            style={{
                              background: `conic-gradient(${macroBreakdown[0].color} 0% ${carbsEnd}%, ${macroBreakdown[1].color} ${carbsEnd}% ${proteinEnd}%, ${macroBreakdown[2].color} ${proteinEnd}% 100%)`
                            }}
                          >
                            <div className="grid h-[92px] w-[92px] place-items-center rounded-full bg-[#FFFDF7] text-center">
                              <div>
                                <p className="text-xs font-medium text-[#6B7280]">摄入热量</p>
                                <p className="mt-1 text-2xl font-semibold leading-none text-[#1D2A22]">{record.calories}</p>
                                <p className="mt-1 text-sm font-medium text-[#6B7280]">kcal</p>
                              </div>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-lg font-semibold text-[#1D2A22]">营养占比</h4>
                            <div className="mt-3 space-y-2.5">
                              {macroBreakdown.map((macro) => (
                                <div key={macro.label} className="grid grid-cols-[14px_1fr_auto] items-center gap-2">
                                  <span
                                    className="h-3.5 w-3.5 rounded-[5px]"
                                    style={{ backgroundColor: macro.color }}
                                  />
                                  <span className="truncate text-sm font-medium text-[#1D2A22]">
                                    {macro.label} {macro.percent}%
                                  </span>
                                  <span className="text-sm font-medium text-[#6B7280]">{macro.grams}g</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-[18px] border p-4 ${tone.panel}`}>
                        <p className="text-sm font-semibold">分析建议</p>
                        <p className="mt-1 text-sm leading-6">{record.summary}</p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-medium text-[#4B5563]">风险/营养来源</p>
                        <div className="space-y-2">
                          {record.reasons.map((reason) => (
                            <div key={reason} className="flex items-start gap-2 rounded-[16px] bg-[#F7FFF4] p-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#4CCB63]" />
                              <p className="text-sm leading-6 text-[#4B5563]">{reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {record.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="bg-[#EFF7FF] text-[#2563EB] border-[#BFDBFE]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
