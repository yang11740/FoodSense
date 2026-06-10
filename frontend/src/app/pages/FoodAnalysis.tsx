import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import type { RecipeRecord } from '@/app/types/food';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const pad = (value: number) => value.toString().padStart(2, '0');
const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

type KitchenAccentVariant = 'chopsticks' | 'steamer' | 'claypot';

function WatercolorKitchenAccent({
  variant,
  className
}: {
  variant: KitchenAccentVariant;
  className?: string;
}) {
  const shared = 'pointer-events-none absolute opacity-80';

  if (variant === 'chopsticks') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 88 88"
        className={`${shared} ${className}`}
        fill="none"
      >
        <ellipse cx="42" cy="48" rx="33" ry="25" fill="#D9F2D4" opacity="0.42" />
        <path d="M28 17L61 71" stroke="#6F5A3A" strokeWidth="5" strokeLinecap="round" opacity="0.62" />
        <path d="M39 13L70 64" stroke="#8A6A42" strokeWidth="4" strokeLinecap="round" opacity="0.58" />
        <path d="M31 21L57 63" stroke="#F7E1A3" strokeWidth="2.4" strokeLinecap="round" opacity="0.72" />
        <path d="M15 56C27 48 41 47 55 53" stroke="#4D8C57" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      </svg>
    );
  }

  if (variant === 'steamer') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 104 104"
        className={`${shared} ${className}`}
        fill="none"
      >
        <ellipse cx="52" cy="62" rx="38" ry="22" fill="#EAD5A9" opacity="0.44" />
        <path d="M18 52C23 39 36 31 52 31C68 31 82 39 86 52" stroke="#B7894F" strokeWidth="5" strokeLinecap="round" opacity="0.54" />
        <path d="M19 54H86V72C77 82 29 82 19 72V54Z" fill="#F4D9A7" opacity="0.54" />
        <path d="M20 57C35 64 69 64 85 57" stroke="#A87942" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        <path d="M30 68C42 72 62 72 75 68" stroke="#A87942" strokeWidth="2.5" strokeLinecap="round" opacity="0.38" />
        <path d="M39 25C34 18 42 15 38 9" stroke="#7AA984" strokeWidth="3" strokeLinecap="round" opacity="0.46" />
        <path d="M55 23C51 16 59 14 55 8" stroke="#7AA984" strokeWidth="3" strokeLinecap="round" opacity="0.42" />
        <path d="M70 26C65 19 73 17 70 11" stroke="#7AA984" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 104 104"
      className={`${shared} ${className}`}
      fill="none"
    >
      <ellipse cx="52" cy="67" rx="34" ry="20" fill="#E9C8B1" opacity="0.4" />
      <path d="M29 43H75L82 69C74 82 31 82 22 69L29 43Z" fill="#C98263" opacity="0.42" />
      <path d="M29 43H75L82 69C74 82 31 82 22 69L29 43Z" stroke="#9A5A40" strokeWidth="4" strokeLinejoin="round" opacity="0.52" />
      <path d="M35 42C39 32 65 32 70 42" stroke="#9A5A40" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <path d="M41 35C43 29 61 29 63 35" stroke="#C98263" strokeWidth="4" strokeLinecap="round" opacity="0.36" />
      <path d="M18 58H25" stroke="#9A5A40" strokeWidth="5" strokeLinecap="round" opacity="0.44" />
      <path d="M79 58H87" stroke="#9A5A40" strokeWidth="5" strokeLinecap="round" opacity="0.44" />
      <path d="M38 59C47 64 59 64 68 59" stroke="#FFF1D8" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

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

const cookingTechniqueInfo: Record<
  RecipeRecord['cookingTechnique'],
  {
    tone: string;
    impact: string;
    suggestion: string;
  }
> = {
  蒸: {
    tone: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
    impact: '少油、保留食材原味，整体负担较轻。',
    suggestion: '蘸汁可以少放酱油，多用葱姜和少量醋提味。'
  },
  煮: {
    tone: 'bg-[#EFF7FF] text-[#2563EB] border-[#BFDBFE]',
    impact: '油脂较低，但汤底或蘸料可能带来钠摄入。',
    suggestion: '喝汤少量即可，搭配绿叶菜和主食更稳。'
  },
  炖: {
    tone: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
    impact: '口感软烂，油脂会融入汤汁和酱汁中。',
    suggestion: '出锅前撇油，浓汤少喝，肉类控制份量。'
  },
  煲: {
    tone: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
    impact: '适合做汤菜，但长时间煲汤容易喝下更多盐和嘌呤。',
    suggestion: '少盐调味，汤量控制在一小碗。'
  },
  炒: {
    tone: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
    impact: '常见家常技法，油量和勾芡会影响热量。',
    suggestion: '热锅少油快炒，减少二次淋油和厚芡。'
  },
  爆炒: {
    tone: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
    impact: '油温高、调味重，容易带来油盐负担。',
    suggestion: '减少底油，搭配清炒或凉拌蔬菜平衡。'
  },
  红烧: {
    tone: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
    impact: '酱油、糖和油脂共同增加钠、糖与热量。',
    suggestion: '少收浓汁，瘦肉或豆制品替代一部分肥肉。'
  },
  卤: {
    tone: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
    impact: '卤汁入味明显，钠含量通常偏高。',
    suggestion: '卤味当配菜少量吃，搭配白灼青菜或杂粮饭。'
  },
  凉拌: {
    tone: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
    impact: '油脂通常较低，但酱料、辣油和糖醋汁会改变负担。',
    suggestion: '少辣油，多用醋、蒜泥和香菜提味。'
  },
  油炸: {
    tone: 'bg-[#FFF1F1] text-[#D94A4A] border-[#FFC6C6]',
    impact: '吸油较多，热量和脂肪更容易上升。',
    suggestion: '尽量少量尝味，搭配清蒸、凉拌或水煮菜。'
  }
};

interface FoodAnalysisProps {
  recipeRecords: RecipeRecord[];
}

export default function FoodAnalysis({ recipeRecords }: FoodAnalysisProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
      <div className="relative px-5 pt-6">
        <WatercolorKitchenAccent variant="chopsticks" className="right-5 top-5 h-20 w-20 rotate-6" />
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
        <Card className="relative overflow-hidden rounded-[30px] border border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_12px_30px_rgba(76,203,99,0.14)]">
          <WatercolorKitchenAccent variant="steamer" className="-right-4 -top-3 h-24 w-24 rotate-[-8deg]" />
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
              const techniqueInfo = cookingTechniqueInfo[record.cookingTechnique];
              const carbsEnd = macroBreakdown[0].percent;
              const proteinEnd = carbsEnd + macroBreakdown[1].percent;

              return (
                <Card
                  key={record.id}
                  className="border-[#D7EEF2] bg-[linear-gradient(145deg,#FFFFFF_0%,#F8FCFF_54%,#FFFDF7_100%)] p-4 shadow-[0_8px_22px_rgba(41,112,122,0.08)]"
                >
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
                    <div className="mt-4 space-y-3 border-t border-dashed border-[#B9D8C2] pt-4">
                      <div className="rounded-[22px] border border-[#D7EEF2] bg-[linear-gradient(145deg,#FFFFFF_0%,#F8FCFF_56%,#FFFDF7_100%)] p-4 shadow-[0_6px_18px_rgba(41,112,122,0.07)]">
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

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-[18px] border border-[#D7E8D2] bg-[#F4FAF1] p-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#4D8C57]" />
                            <p className="text-sm font-semibold text-[#31563A]">主要食材</p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {record.ingredients.map((ingredient) => (
                              <Badge
                                key={ingredient}
                                variant="outline"
                                className="bg-white text-[#31563A] border-[#B9D8C2]"
                              >
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[18px] bg-[#FFF7E6] p-4">
                          <p className="text-sm font-semibold text-[#4B5563]">烹饪技法</p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-[#B7791F]">
                            {record.cookingTechnique} · {record.cookingMethod}
                          </p>
                        </div>
                      </div>

                      <div className={`rounded-[18px] border p-4 ${techniqueInfo.tone}`}>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">技法影响</p>
                          <span className="-rotate-3 rounded-[5px] border border-[#B55A4A] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-[#B55A4A] opacity-85">
                            烹法
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6">{techniqueInfo.impact}</p>
                        <p className="mt-2 text-sm leading-6">{techniqueInfo.suggestion}</p>
                      </div>

                      <div className={`rounded-[18px] border p-4 ${tone.panel}`}>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">分析建议</p>
                          <span className="-rotate-3 rounded-[5px] border border-[#B55A4A] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-[#B55A4A] opacity-85">
                            知膳
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6">{record.summary}</p>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-medium text-[#4B5563]">风险/营养来源</p>
                        <div className="space-y-2">
                          {record.reasons.map((reason) => (
                            <div key={reason} className="flex items-start gap-2 rounded-[16px] bg-[#F4FAF1] p-3">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#4D8C57]" />
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
