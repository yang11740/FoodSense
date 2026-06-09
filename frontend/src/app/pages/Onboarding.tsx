'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Sparkles, User, Heart, Leaf, SunMedium, MessageSquare } from 'lucide-react';

interface OnboardingData {
  goal: string;
  age: string;
  gender: string;
  dietStyle: string;
  mood: string;
}

interface OnboardingProps {
  userName: string;
  onComplete: (profile: OnboardingData) => void;
}

const steps = [
  {
    id: 'goal',
    question: '小膳青：为了更好帮助你，请问你的健康目标是什么？',
    icon: User,
    options: ['减脂瘦身', '增肌塑形', '体重稳定', '提升精力', '改善肠胃']
  },
  {
    id: 'age',
    question: '小膳青：你现在属于哪个年龄段？',
    icon: Heart,
    options: ['18-25', '26-35', '36-50', '50 以上']
  },
  {
    id: 'gender',
    question: '小膳青：你的性别更倾向于？',
    icon: SunMedium,
    options: ['女', '男', '其他']
  },
  {
    id: 'dietStyle',
    question: '小膳青：你平常更偏好哪种饮食风格？',
    icon: Leaf,
    options: ['清淡少盐', '低糖低脂', '高蛋白', '素食轻食', '家常热菜']
  },
  {
    id: 'mood',
    question: '小膳青：今天你希望吃得是什么样的感觉？',
    icon: MessageSquare,
    options: ['暖心健康', '清爽轻盈', '轻松不油腻', '随性满足']
  }
];

export default function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = steps[currentStep];
  const progressText = `${currentStep + 1}/${steps.length}`;
  const selectedAnswer = answers[step.id] ?? '';
  const isCompleted = steps.every((step) => Boolean(answers[step.id]));

  const handleSelect = (option: string) => {
    setAnswers((current) => ({ ...current, [step.id]: option }));
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1)), 160);
    }
  };

  const handleFinish = () => {
    if (!isCompleted) return;
    onComplete({
      goal: answers.goal || '',
      age: answers.age || '',
      gender: answers.gender || '',
      dietStyle: answers.dietStyle || '',
      mood: answers.mood || ''
    });
  };

  const chatMessages = useMemo(() => {
    const baseMessages = [
      {
        id: 'welcome',
        from: 'assistant',
        text: `嗨 ${userName}，我是小膳青，来陪你完成一个简短的新手问题吧！`
      },
      {
        id: `question-${step.id}`,
        from: 'assistant',
        text: step.question
      }
    ];

    const answeredSteps = steps.slice(0, currentStep).map((item) => ({
      id: `answer-${item.id}`,
      from: 'user',
      text: answers[item.id] || ''
    }));

    return [...answeredSteps, ...baseMessages];
  }, [currentStep, step.question, step.id, userName, answers]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#E9F9E9_0%,#F7FFF4_40%,#ECF8E6_100%)] text-[#1D2A22]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,203,99,0.18)_0%,transparent_52%)]" />
      <div className="relative px-5 pt-8 pb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[26px] bg-[#DCF8D8] text-[#15803D] shadow-[0_18px_36px_rgba(76,203,99,0.18)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#15803D]">新手指引</p>
            <h1 className="text-3xl font-bold leading-tight">和小膳青聊聊吧</h1>
          </div>
        </div>

        <Card className="mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-[#D0E9D0] bg-white/95 shadow-[0_20px_60px_rgba(76,203,99,0.15)]">
          <div className="border-b border-[#E6F2E7] bg-[#F7FFF4] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#4B5563]">当前进度</p>
                <p className="mt-1 text-lg font-semibold text-[#1D2A22]">{progressText}</p>
              </div>
              <span className="rounded-full bg-[#DCF8D8] px-3 py-2 text-sm font-semibold text-[#15803D]">{step.id}</span>
            </div>
          </div>

          <div className="max-h-[520px] space-y-4 overflow-y-auto px-5 py-6">
            {chatMessages.map((message) => {
              const isUser = message.from === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2`}>
                  <div className={`relative max-w-[78%] rounded-[26px] border px-5 py-4 text-sm leading-7 shadow-sm ${
                    isUser
                      ? 'border-[#2C5565] bg-[#D4F1FB] text-[#1F3B47]'
                      : 'border-[#DBD9B3] bg-[#FFF8D4] text-[#1E2A18]'
                  }`}>
                    {!isUser && (
                      <>
                        <span className="absolute -left-2 top-2 h-3 w-3 rounded-full bg-[#FFB85A]" />
                        <span className="absolute -left-1 top-4 h-2 w-2 rounded-full bg-[#8BC6FF]" />
                      </>
                    )}
                    <p>{message.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#E6F2E7] px-5 py-5">
            <div className="mb-4 text-sm font-medium text-[#4B5563]">请选择你最符合的答案：</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {step.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition shadow-sm ${
                    selectedAnswer === option
                      ? 'border-[#4CCB63] bg-[#ECFEE9] text-[#154F29] shadow-[0_10px_24px_rgba(76,203,99,0.18)]'
                      : 'border-[#D1D5DB] bg-white text-[#374151] hover:border-[#BDEFC3] hover:bg-[#F7FFF4]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#6B7280]">
                已回答：{Object.keys(answers).length}/{steps.length}
              </p>
              <button
                type="button"
                onClick={handleFinish}
                disabled={!isCompleted}
                className="inline-flex items-center justify-center rounded-full bg-[#15803D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12702E] disabled:cursor-not-allowed disabled:bg-[#A7D7AF]"
              >
                {isCompleted ? '完成新手引导' : '继续回答下一题'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
