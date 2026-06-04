import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Flame,
  Sparkles,
  Utensils
} from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import CameraRecognition from '@/app/components/CameraRecognition';
import LoadingAnalysis from '@/app/components/LoadingAnalysis';
import type { FoodRecommendation, MealTag, RecipeRecord } from '@/app/types/food';

interface AnalysisResult {
  foodName: string;
  recommendation: FoodRecommendation;
  riskTags: string[];
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface HomeProps {
  onAddRecipeRecord: (record: RecipeRecord) => void;
}

const dailyTargets = {
  calories: 1800,
  carbs: 220,
  protein: 90,
  fat: 60
};

const mealTags: MealTag[] = ['早餐', '午餐', '晚餐', '夜宵', '零食', '其他'];

export default function Home({ onAddRecipeRecord }: HomeProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealTag>('午餐');
  const [todayIntake, setTodayIntake] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    count: 0
  });

  const getProgress = (current: number, target: number) => ({
    percent: Math.min((current / target) * 100, 100),
    isOverTarget: current > target
  });

  const todayStats = [
    {
      label: '碳水',
      value: `${todayIntake.carbs}/${dailyTargets.carbs}g`,
      progress: getProgress(todayIntake.carbs, dailyTargets.carbs)
    },
    {
      label: '蛋白质',
      value: `${todayIntake.protein}/${dailyTargets.protein}g`,
      progress: getProgress(todayIntake.protein, dailyTargets.protein)
    },
    {
      label: '脂肪',
      value: `${todayIntake.fat}/${dailyTargets.fat}g`,
      progress: getProgress(todayIntake.fat, dailyTargets.fat)
    }
  ];

  const calorieProgress = getProgress(todayIntake.calories, dailyTargets.calories);

  const mockAnalysis = (_imageDataUrl?: string) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          foodName: '红烧肉',
          recommendation: 'not-recommended',
          riskTags: ['高脂', '高热量', '高盐'],
          calories: 520,
          carbs: 18,
          protein: 24,
          fat: 39
        },
        {
          foodName: '清蒸鲈鱼',
          recommendation: 'recommended',
          riskTags: [],
          calories: 260,
          carbs: 3,
          protein: 35,
          fat: 11
        },
        {
          foodName: '糖醋里脊',
          recommendation: 'caution',
          riskTags: ['高糖', '油炸'],
          calories: 430,
          carbs: 46,
          protein: 21,
          fat: 18
        }
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const addAnalysisToToday = () => {
    if (!analysisResult) return;

    const config = getRecommendationConfig(analysisResult.recommendation);
    onAddRecipeRecord({
      id: `${Date.now()}-${analysisResult.foodName}`,
      date: '2026-06-04',
      meal: selectedMeal,
      name: analysisResult.foodName,
      calories: analysisResult.calories,
      carbs: analysisResult.carbs,
      protein: analysisResult.protein,
      fat: analysisResult.fat,
      recommendation: analysisResult.recommendation,
      summary: config.hint,
      reasons: [
        config.hint,
        analysisResult.riskTags.length > 0
          ? `主要标签：${analysisResult.riskTags.join('、')}`
          : '暂未识别到明显风险标签'
      ],
      tags: analysisResult.riskTags.length > 0 ? analysisResult.riskTags : ['清淡']
    });

    setTodayIntake((current) => ({
      calories: current.calories + analysisResult.calories,
      carbs: current.carbs + analysisResult.carbs,
      protein: current.protein + analysisResult.protein,
      fat: current.fat + analysisResult.fat,
      count: current.count + 1
    }));
    setAnalysisResult(null);
  };

  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case 'recommended':
        return {
          label: '比较适合今天吃',
          hint: '这道菜整体比较清爽，放心搭配一份主食就好。',
          color: 'bg-[#F0FBEF] text-[#15803D] border-[#BDEFC3]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
        };
      case 'caution':
        return {
          label: '可以吃，建议少量',
          hint: '甜口和油炸带来一点负担，今天可以尝几口解馋。',
          color: 'bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]',
          icon: <AlertTriangle className="w-5 h-5 text-[#FFB84D]" />
        };
      case 'not-recommended':
        return {
          label: '今天不太建议多吃噢',
          hint: '风险主要来自油脂、盐分和浓酱汁，可以夹两块尝味道。',
          color: 'bg-[#FFF1F1] text-[#D94A4A] border-[#FFC6C6]',
          icon: <AlertCircle className="w-5 h-5 text-[#FF6B6B]" />
        };
      default:
        return {
          label: '正在看一看',
          hint: '小助手正在识别菜品和主要风险来源。',
          color: 'bg-[#EFF7FF] text-[#2563EB] border-[#BFDBFE]',
          icon: <AlertCircle className="w-5 h-5 text-[#5BA7F7]" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#DDFCD6_0%,#F7FFF4_42%,#F3FAF0_100%)] pb-28">
      {showCamera && (
        <CameraRecognition
          onClose={() => setShowCamera(false)}
          onCaptured={(imageDataUrl) => {
            setShowCamera(false);
            mockAnalysis(imageDataUrl);
          }}
        />
      )}

      <div className="px-5 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-[#4BAE5F]">知膳 FoodSense</p>
            <div className="mt-2 flex items-center gap-2">
              <h1 className="text-[28px] font-semibold leading-none tracking-normal text-[#1D2A22]">
                我的今日记录
              </h1>
              <Sparkles className="h-6 w-6 text-[#1D2A22]" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <Card className="relative overflow-hidden rounded-[30px] border border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_12px_30px_rgba(76,203,99,0.14)]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-[#6B7280]">今日已摄入</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[38px] font-semibold leading-none text-[#243129]">{todayIntake.calories}</span>
                <span className="pb-1 text-lg font-medium text-[#6B7280]">/{dailyTargets.calories} kcal</span>
              </div>
              <div className="mt-3 h-2 w-[180px] overflow-hidden rounded-full bg-[#E6E9E6]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    calorieProgress.isOverTarget ? 'bg-[#FF6B6B]' : 'bg-[#4CCB63]'
                  }`}
                  style={{ width: `${calorieProgress.percent}%` }}
                />
              </div>
              <div className="relative mt-4 inline-flex whitespace-nowrap rounded-full bg-[#FFEFA6] px-5 py-2.5 text-[16px] font-semibold text-[#5B5E52] shadow-[0_6px_14px_rgba(255,232,138,0.20)]">
                今天吃了什么？拍给我看看～
                <span className="absolute -bottom-1.5 left-7 h-3 w-3 rotate-45 bg-[#FFEFA6]" />
              </div>
            </div>
            <div className="mr-2 shrink-0 whitespace-nowrap rounded-full bg-[#4CCB63] px-3 py-2 text-[14px] font-semibold leading-none tracking-[-0.01em] text-white">
              06 月 04 日
            </div>
          </div>

          <div className="relative mt-1 h-[258px]">
            <div className="absolute left-1/2 top-2 h-[176px] w-[86%] -translate-x-1/2 rounded-t-full border-[12px] border-b-0 border-[#E7EFE6]" />
            <img
              src="/mascot/3.png"
              alt="知膳饮食小助手"
              className="absolute left-1/2 top-[42px] z-10 h-[150px] w-[150px] -translate-x-1/2 rounded-full object-cover object-center scale-[1.22] shadow-[0_16px_18px_rgba(76,203,99,0.16)]"
            />

            <div className="absolute bottom-0 left-1/2 z-20 w-[72%] -translate-x-1/2 rounded-[18px] bg-[#F7FFF4] px-4 py-3 text-center">
              <p className="text-base font-semibold text-[#1F2933]">
                {todayIntake.count > 0 ? `已记录 ${todayIntake.count} 份饮食` : '尚未记录饮食'}
              </p>
              <p className="mt-2 text-xs font-medium text-[#6B7280]">
                {todayIntake.count > 0 ? '继续拍照可补充今日摄入' : '拍照后自动估算摄入'}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-dashed border-[#DDE6DD] pt-4">
            <p className="mb-3 text-sm font-medium text-[#6B7280]">今日营养概览</p>
            <div className="grid grid-cols-3 gap-3">
              {todayStats.map((item) => (
                <div key={item.label} className="rounded-[16px] bg-white/70 p-3">
                  <p className="text-sm font-medium text-[#1F2933]">{item.label}</p>
                  <div className="my-2 h-1.5 overflow-hidden rounded-full bg-[#E6E9E6]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.progress.isOverTarget ? 'bg-[#FF6B6B]' : 'bg-[#4CCB63]'
                      }`}
                      style={{ width: `${item.progress.percent}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-[#6B7280]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[28px] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-[16px] bg-[#FFE88A] text-[#B7791F]">
                <Utensils className="h-5 w-5" strokeWidth={2} />
              </span>
              <h2 className="text-xl font-semibold text-[#1D2A22]">饮食记录</h2>
            </div>
            <Camera className="h-8 w-8 text-[#4CCB63]" strokeWidth={2} />
          </div>

          <button
            onClick={() => setShowCamera(true)}
            disabled={isAnalyzing}
            className="mx-auto flex h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#4CCB63] bg-[#F7FFF4] text-lg font-semibold text-[#16A34A] transition-all hover:bg-[#F0FBEF] active:scale-[0.98] disabled:opacity-60"
          >
            <Flame className="h-5 w-5" strokeWidth={2} />
            拍照识别
          </button>
        </Card>

        {isAnalyzing && <LoadingAnalysis />}

        {analysisResult && !isAnalyzing && (
          <Card className="p-5 bg-[#FFFDF7]">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-[#6B7280]">即时分析结果</p>
                <h3 className="mt-1 text-xl font-semibold text-[#111827]">{analysisResult.foodName}</h3>
              </div>
              <Badge className="bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]">待确认</Badge>
            </div>

            <div className="mb-4 grid grid-cols-4 gap-2">
              {[
                ['热量', `${analysisResult.calories} kcal`],
                ['碳水', `${analysisResult.carbs}g`],
                ['蛋白质', `${analysisResult.protein}g`],
                ['脂肪', `${analysisResult.fat}g`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] bg-[#F7FFF4] px-2 py-3 text-center">
                  <p className="text-xs font-medium text-[#6B7280]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1D2A22]">{value}</p>
                </div>
              ))}
            </div>

            {(() => {
              const config = getRecommendationConfig(analysisResult.recommendation);
              return (
                <div className={`flex items-start gap-3 rounded-[20px] border p-4 ${config.color}`}>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/75">
                    {config.icon}
                  </span>
                  <div>
                    <p className="font-semibold">{config.label}</p>
                    <p className="mt-1 text-sm leading-6 opacity-90">{config.hint}</p>
                  </div>
                </div>
              );
            })()}

            {analysisResult.riskTags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-[#4B5563] mb-2">主要风险标签</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.riskTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-[#FFF7E6] text-[#B7791F] border-[#FFD88A]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-[#4B5563]">选择餐次标签</p>
              <div className="grid grid-cols-3 gap-2">
                {mealTags.map((meal) => {
                  const selected = selectedMeal === meal;
                  return (
                    <button
                      key={meal}
                      onClick={() => setSelectedMeal(meal)}
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-[#4CCB63] bg-[#DCF8D8] text-[#15803D]'
                          : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                      }`}
                    >
                      {meal}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={addAnalysisToToday}
              className="relative mt-5 w-full rounded-full bg-[#4CCB63] px-4 py-3 text-base font-semibold text-white shadow-[0_10px_24px_rgba(76,203,99,0.24)] transition-all hover:bg-[#16A34A] active:scale-[0.98]"
            >
              添加到今日记录
              <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#4CCB63]" />
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
