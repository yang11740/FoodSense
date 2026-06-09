'use client';

import { AlertCircle, Edit2, History, Sparkles, Target, UserRound } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import BodyPartOverlay from '@/app/components/BodyPartOverlay';
import HumanModel from '@/app/components/3d/HumanModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { useEffect, useState } from 'react';

interface HealthProfileProps {
  user: { name: string; email: string } | null;
  userProfile: {
    goal: string;
    age: string;
    gender: string;
    dietStyle: string;
    mood: string;
  } | null;
}

const defaultGoals = ['完善个人资料', '让小膳青更懂你'];

export default function HealthProfile({ user, userProfile }: HealthProfileProps) {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  useEffect(() => {
    setHealthGoals(userProfile?.goal ? [userProfile.goal] : defaultGoals);
  }, [userProfile]);

  const profileName = user?.name ?? '小伙伴';
  const profileAge = userProfile?.age ? `${userProfile.age} 岁` : '未设置';
  const profileGender = userProfile?.gender ?? '未设置';
  const profileDiet = userProfile?.dietStyle ?? '未设置';
  const profileMood = userProfile?.mood ?? '未设置';
  const profileStatus = userProfile
    ? [
        { area: '饮食风格', description: profileDiet },
        { area: '当前心情', description: profileMood }
      ]
    : [{ area: '新手引导', description: '请完成个人资料以生成更精准推荐' }];

  const healthIssues = profileStatus.map((issue) => issue.description);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#DDFCD6_0%,#F7FFF4_42%,#F3FAF0_100%)] pb-28">
      <div className="px-5 pt-6">
        <p className="text-sm font-semibold text-[#4BAE5F]">知膳 FoodSense</p>
        <div className="mt-2 flex items-center gap-2">
          <h1 className="text-[28px] font-semibold leading-none tracking-normal text-[#1D2A22]">
            我的健康小地图
          </h1>
          <Sparkles className="h-6 w-6 text-[#1D2A22]" strokeWidth={2} />
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <Card className="rounded-[30px] border border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_12px_30px_rgba(76,203,99,0.14)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#DCF8D8] text-[#15803D]">
                <UserRound className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#1D2A22]">饮食画像正在成长</h2>
                <p className="mt-1 text-sm text-[#6B7280]">L1，还差 2 项就能更贴合你</p>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0 border-[#FFD88A] bg-[#FFF7E6] text-[#B7791F]">
              需关注
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#F0FBEF] shadow-inner">
              <HumanModel />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#F0FBEF] shadow-inner">
              <BodyPartOverlay
                healthIssues={healthIssues}
                onPartClick={(part) => {
                  setSelectedBodyPart(part);
                  console.log('Selected body part:', part);
                }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {profileStatus.map((issue) => (
              <div key={issue.area} className="flex items-center gap-3 rounded-[18px] border border-[#FFD88A] bg-[#FFF7E6] p-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#FFB84D]" strokeWidth={1.8} />
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-[#7C4A03]">{issue.area}：</span>
                  <span className="text-sm text-[#B7791F]">{issue.description}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-[#6B7280]">
            健康状态为饮食记录辅助提示，不构成医学诊断。
          </p>
        </Card>

        <Card className="rounded-[28px] border border-[#E2F4DE] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1D2A22]">基础信息</h2>
            <button className="grid h-9 w-9 place-items-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F0FBEF] hover:text-[#15803D]" aria-label="编辑基础信息">
              <Edit2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['姓名', profileName],
              ['年龄', profileAge],
              ['性别', profileGender],
              ['饮食风格', profileDiet],
              ['当前心情', profileMood]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] bg-[#F0FBEF] p-3">
                <p className="mb-1 text-sm text-[#6B7280]">{label}</p>
                <p className="font-semibold text-[#1D2A22]">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[28px] border border-[#E2F4DE] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#16A34A]" strokeWidth={1.8} />
            <h2 className="text-lg font-semibold text-[#1D2A22]">健康目标</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {healthGoals.map((goal) => (
              <Badge key={goal} className="border-[#BDEFC3] bg-[#DCF8D8] text-[#15803D]">
                {goal}
              </Badge>
            ))}
          </div>

          <button
            onClick={() => setGoalDialogOpen(true)}
            className="mt-4 w-full rounded-full border border-[#BDEFC3] bg-[#F0FBEF] px-4 py-3 font-semibold text-[#15803D] transition-colors hover:bg-[#DCF8D8]"
          >
            编辑健康目标
          </button>
        </Card>

        <Card className="rounded-[28px] border border-[#E2F4DE] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <h2 className="mb-4 text-lg font-semibold text-[#1D2A22]">当前状态小结</h2>

          <div className="space-y-3">
            {[
              ['整体状态', '需改善', 'border-[#FFD88A] bg-[#FFF7E6] text-[#B7791F]'],
              ['饮食习惯', '尚可', 'border-[#BDEFC3] bg-[#F0FBEF] text-[#15803D]'],
              ['运动状态', '再加一点', 'border-[#BFDBFE] bg-[#EFF7FF] text-[#2563EB]'],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-[18px] bg-[#F7FFF4] p-3">
                <span className="text-sm text-[#4B5563]">{label}</span>
                <Badge variant="outline" className={tone}>{value}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[28px] border border-[#E2F4DE] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-[#5BA7F7]" strokeWidth={1.8} />
            <h2 className="text-lg font-semibold text-[#1D2A22]">历史记录</h2>
          </div>

          <div className="space-y-2">
            {[
              ['饮食分析记录', '28 条'],
              ['健康报告', '4 份'],
            ].map(([label, count]) => (
              <button key={label} className="flex w-full items-center justify-between rounded-full px-4 py-3 text-left transition-colors hover:bg-[#F0FBEF]">
                <span className="text-[#4B5563]">{label}</span>
                <span className="text-sm text-[#6B7280]">{count}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑健康目标</DialogTitle>
            <DialogDescription>更新你的目标，帮助系统给出更精准的饮食建议。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2 rounded-2xl bg-[#F7FFF4] p-4 border border-[#BDEFC3]">
              <p className="text-sm text-[#4B5563]">当前目标</p>
              <div className="flex flex-wrap gap-2">
                {healthGoals.map((goal) => (
                  <span key={goal} className="rounded-full bg-[#DCF8D8] px-3 py-1 text-sm text-[#15803D]">
                    {goal}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D2A22]">新增目标</label>
              <input
                value={goalInput}
                onChange={(event) => setGoalInput(event.target.value)}
                placeholder="例如：每天多吃一份蔬菜"
                className="w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#4BAE5F] focus:ring-2 focus:ring-[#DCF8D8]"
              />
              <button
                type="button"
                onClick={() => {
                  const text = goalInput.trim();
                  if (text && !healthGoals.includes(text)) {
                    setHealthGoals((current) => [...current, text]);
                    setGoalInput('');
                  }
                }}
                className="w-full rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12702E]"
              >
                添加目标
              </button>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setGoalDialogOpen(false)}
              className="rounded-full border border-[#D1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAF7]"
            >
              关闭
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
