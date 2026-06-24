'use client';

import { useEffect, useState } from 'react';
import type { BodyImpact, BodyStatus, HealthProfileInsights } from '@/app/types/health';
import { AlertCircle, CheckCircle2, Edit2, LogOut, Sparkles, Target, UserRound } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import HumanModel from '@/app/components/3d/HumanModel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/components/ui/dialog';
import { getApiUrl } from '@/app/utils/apiConfig';

type ProfileData = {
  goal: string;
  age: string;
  gender: string;
  dietStyle: string;
  mood: string;
  height?: string;
  weight?: string;
};

type EditableProfile = ProfileData & {
  name: string;
};

type BodyImpactWithPosition = BodyImpact & {
  position: { left: string; top: string };
};

interface HealthProfileProps {
  user: { name: string; email: string } | null;
  userProfile: ProfileData | null;
  healthGoals: string[];
  recipeRecordCount: number;
  onAddHealthGoal: (goal: string) => void;
  onUpdateProfile: (profile: EditableProfile) => void;
  onLogout: () => void;
}

const defaultGoals = ['完善个人资料', '让小膳青更懂你'];

const statusMeta: Record<BodyStatus, { label: string; badge: string; dot: string; ring: string }> = {
  good: {
    label: '状态良好',
    badge: 'border-[#BDEFC3] bg-[#F0FBEF] text-[#15803D]',
    dot: 'bg-[#22C55E]',
    ring: 'ring-[#86EFAC]'
  },
  mild: {
    label: '轻度关注',
    badge: 'border-[#FDE68A] bg-[#FEFCE8] text-[#A16207]',
    dot: 'bg-[#FACC15]',
    ring: 'ring-[#FDE68A]'
  },
  attention: {
    label: '需关注',
    badge: 'border-[#FDBA74] bg-[#FFF7ED] text-[#C2410C]',
    dot: 'bg-[#F97316]',
    ring: 'ring-[#FDBA74]'
  },
  unknown: {
    label: '数据不足',
    badge: 'border-[#D1D5DB] bg-[#F9FAFB] text-[#6B7280]',
    dot: 'bg-[#9CA3AF]',
    ring: 'ring-[#D1D5DB]'
  }
};

const bodyPartPositions: Record<string, { left: string; top: string }> = {
  head: { left: '50%', top: '17%' },
  heart: { left: '45%', top: '34%' },
  gut: { left: '50%', top: '48%' },
  bone: { left: '58%', top: '62%' },
  muscle: { left: '32%', top: '45%' },
  skin: { left: '68%', top: '39%' }
};

export default function HealthProfile({
  user,
  userProfile,
  healthGoals,
  recipeRecordCount,
  onAddHealthGoal,
  onUpdateProfile,
  onLogout
}: HealthProfileProps) {
  const [insights, setInsights] = useState<HealthProfileInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [selectedPartId, setSelectedPartId] = useState('gut');
  const [goalInput, setGoalInput] = useState('');
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [draftProfile, setDraftProfile] = useState<EditableProfile>({
    name: user?.name ?? '',
    goal: userProfile?.goal ?? '',
    age: userProfile?.age ?? '',
    gender: userProfile?.gender ?? '',
    dietStyle: userProfile?.dietStyle ?? '',
    mood: userProfile?.mood ?? '',
    height: userProfile?.height ?? '',
    weight: userProfile?.weight ?? ''
  });

  useEffect(() => {
    if (!user?.email) {
      setInsights(null);
      return;
    }

    let cancelled = false;
    const loadInsights = async () => {
      setIsLoadingInsights(true);
      setInsightsError('');
      try {
        const response = await fetch(getApiUrl(`/api/health/profile?email=${encodeURIComponent(user.email)}`));
        if (!response.ok) {
          throw new Error('加载健康档案失败');
        }
        const data = (await response.json()) as HealthProfileInsights;
        if (!cancelled) {
          setInsights(data);
          if (data.bodyImpacts.length > 0) {
            const attentionPart = data.bodyImpacts.find((part) => part.status === 'attention') ?? data.bodyImpacts[0];
            setSelectedPartId(attentionPart.id);
          }
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setInsightsError('暂时无法加载个性化健康分析，请稍后重试。');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInsights(false);
        }
      }
    };

    loadInsights();
    return () => {
      cancelled = true;
    };
  }, [user?.email, recipeRecordCount]);

  const bodyImpacts: BodyImpactWithPosition[] = (insights?.bodyImpacts ?? []).map((part) => ({
    ...part,
    position: bodyPartPositions[part.id] ?? { left: '50%', top: '50%' }
  }));

  const displayedHealthGoals = healthGoals.length > 0 ? healthGoals : userProfile?.goal ? [userProfile.goal] : defaultGoals;
  const selectedPart = bodyImpacts.find((part) => part.id === selectedPartId) ?? bodyImpacts[0];
  const selectedMeta = selectedPart ? statusMeta[selectedPart.status] : statusMeta.unknown;
  const missingRecords = insights?.missingRecords ?? Math.max(3 - recipeRecordCount, 0);
  const profileLevel = insights?.profileLevel ?? (recipeRecordCount >= 8 ? 'L2' : 'L1');
  const overallStatus = insights?.overallStatus ?? (recipeRecordCount === 0 ? '数据不足' : missingRecords > 0 ? '需关注' : '状态良好');
  const todayTasks = insights?.todayTasks ?? ['补充一条饮食记录，让小膳青更懂你'];

  const openProfileEditor = () => {
    setDraftProfile({
      name: user?.name ?? '',
      goal: userProfile?.goal ?? '',
      age: userProfile?.age ?? '',
      gender: userProfile?.gender ?? '',
      dietStyle: userProfile?.dietStyle ?? '',
      mood: userProfile?.mood ?? '',
      height: userProfile?.height ?? '',
      weight: userProfile?.weight ?? ''
    });
    setProfileDialogOpen(true);
  };

  const saveProfile = () => {
    onUpdateProfile(draftProfile);
    setProfileDialogOpen(false);
  };

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
        {insightsError && (
          <Card className="border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#B91C1C]">
            {insightsError}
          </Card>
        )}

        <Card className="rounded-[30px] border border-[#BDEFC3] bg-[#FFFDF7] p-5 shadow-[0_12px_30px_rgba(76,203,99,0.14)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#DCF8D8] text-[#15803D]">
                <UserRound className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-[#1D2A22]">饮食画像正在成长</h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {isLoadingInsights
                    ? '正在根据你的饮食记录生成分析...'
                    : `${profileLevel}，${missingRecords > 0 ? `还差 ${missingRecords} 项记录可以生成更准确分析` : '已经可以生成更准确分析'}`}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={overallStatus === '状态良好' ? statusMeta.good.badge : overallStatus === '数据不足' ? statusMeta.unknown.badge : statusMeta.attention.badge}>
              {overallStatus}
            </Badge>
          </div>

          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#F0FBEF] shadow-inner">
            <HumanModel />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.12),rgba(15,23,42,0.02)_48%,rgba(76,203,99,0.08))]" />
            {bodyImpacts.length === 0 && !isLoadingInsights && (
              <div className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-[#6B7280]">
                记录几餐后，这里会根据你的实际摄入展示身体各部位的健康影响。
              </div>
            )}
            {bodyImpacts.map((part) => {
              const meta = statusMeta[part.status];
              const active = selectedPartId === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedPartId(part.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-xs font-bold text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] ring-4 transition hover:scale-105 ${meta.dot} ${active ? meta.ring : 'ring-white/70'}`}
                  style={{ left: part.position.left, top: part.position.top }}
                  aria-label={`查看${part.label}饮食影响`}
                >
                  {part.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#4B5563]">
            {Object.values(statusMeta).map((meta) => (
              <div key={meta.label} className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2">
                <span className={`h-3 w-3 rounded-full ${meta.dot}`} />
                {meta.label}
              </div>
            ))}
          </div>

          {selectedPart && (
            <Card className="mt-4 border-[#E2F4DE] bg-white p-4 shadow-none">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#1D2A22]">{selectedPart.label}</h3>
                  <Badge variant="outline" className={`mt-2 ${selectedMeta.badge}`}>{selectedMeta.label}</Badge>
                </div>
                <AlertCircle className="h-5 w-5 text-[#FFB84D]" />
              </div>
              <div className="space-y-3 text-sm leading-6 text-[#4B5563]">
                <p><span className="font-semibold text-[#1D2A22]">饮食原因：</span>{selectedPart.reason}</p>
                <p><span className="font-semibold text-[#1D2A22]">可能影响：</span>{selectedPart.impact}</p>
                <div>
                  <p className="font-semibold text-[#1D2A22]">推荐食物</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPart.foods.map((food) => (
                      <Badge key={food} variant="outline" className="border-[#BDEFC3] bg-[#F0FBEF] text-[#15803D]">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="rounded-[18px] bg-[#FFF7E6] p-3 text-[#B7791F]">
                  <span className="font-semibold">今日任务：</span>{selectedPart.task}
                </p>
              </div>
            </Card>
          )}
        </Card>

        <Card className="rounded-[28px] border border-[#E2F4DE] bg-[#FFFDF7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1D2A22]">基础信息</h2>
            <button
              onClick={openProfileEditor}
              className="grid h-9 w-9 place-items-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F0FBEF] hover:text-[#15803D]"
              aria-label="编辑基础信息"
            >
              <Edit2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['姓名', user?.name ?? '未设置'],
              ['年龄', userProfile?.age ? `${userProfile.age}` : '未设置'],
              ['性别', userProfile?.gender ?? '未设置'],
              ['身高', userProfile?.height ? `${userProfile.height} cm` : '未设置'],
              ['体重', userProfile?.weight ? `${userProfile.weight} kg` : '未设置'],
              ['饮食风格', userProfile?.dietStyle ?? '未设置'],
              ['当前心情', userProfile?.mood ?? '未设置']
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
            {displayedHealthGoals.map((goal) => (
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
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#16A34A]" strokeWidth={1.8} />
            <h2 className="text-lg font-semibold text-[#1D2A22]">今日健康任务</h2>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task, index) => (
              <div key={task} className="flex items-center gap-3 rounded-[18px] bg-[#F7FFF4] p-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#DCF8D8] text-sm font-bold text-[#15803D]">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-[#1D2A22]">{task}</span>
              </div>
            ))}
          </div>
        </Card>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FECACA] bg-white px-5 py-3 text-sm font-semibold text-[#B91C1C] shadow-[0_8px_20px_rgba(185,28,28,0.08)] transition-colors hover:bg-[#FEF2F2]"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          退出登录
        </button>
      </div>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑基础信息</DialogTitle>
            <DialogDescription>保存后会立即同步到数据库，用于生成更贴合你的饮食建议。</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {[
              ['name', '姓名', '例如：小食客'],
              ['goal', '健康目标', '例如：减脂瘦身'],
              ['age', '年龄', '例如：26-35'],
              ['gender', '性别', '例如：女'],
              ['height', '身高 (cm)', '例如：165'],
              ['weight', '体重 (kg)', '例如：58'],
              ['dietStyle', '饮食风格', '例如：清淡少盐'],
              ['mood', '当前心情', '例如：清爽轻盈']
            ].map(([key, label, placeholder]) => (
              <label key={key} className="text-sm font-medium text-[#1D2A22]">
                {label}
                <input
                  value={draftProfile[key as keyof EditableProfile]}
                  onChange={(event) => setDraftProfile((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder={placeholder}
                  className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#4BAE5F] focus:ring-2 focus:ring-[#DCF8D8]"
                />
              </label>
            ))}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setProfileDialogOpen(false)}
              className="rounded-full border border-[#D1D5DB] bg-white px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F8FAF7]"
            >
              取消
            </button>
            <button
              type="button"
              onClick={saveProfile}
              className="rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#12702E]"
            >
              保存基础信息
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑健康目标</DialogTitle>
            <DialogDescription>更新你的目标，帮助系统给出更精准的饮食建议。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2 rounded-2xl border border-[#BDEFC3] bg-[#F7FFF4] p-4">
              <p className="text-sm text-[#4B5563]">当前目标</p>
              <div className="flex flex-wrap gap-2">
                {displayedHealthGoals.map((goal) => (
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
                    onAddHealthGoal(text);
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
