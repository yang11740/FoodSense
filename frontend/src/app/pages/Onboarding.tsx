'use client';

import { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import ChatThread from '@/app/components/ChatThread';
import { Card } from '@/app/components/ui/card';
import type { ChatMessage } from '@/app/types/chat';

interface OnboardingData {
  goal: string;
  age: string;
  gender: string;
  dietStyle: string;
  mood: string;
}

interface OnboardingProps {
  userName: string;
  chatMessages: ChatMessage[];
  onAppendChatMessages: (messages: ChatMessage[]) => void;
  onComplete: (profile: OnboardingData) => void;
}

const steps: Array<{
  id: keyof OnboardingData;
  label: string;
  question: string;
  options: string[];
}> = [
  {
    id: 'goal',
    label: '健康目标',
    question: '为了更好地帮助你，先告诉我你的健康目标是什么？',
    options: ['减脂瘦身', '增肌塑形', '体重稳定', '提升精力', '改善肠胃']
  },
  {
    id: 'age',
    label: '年龄阶段',
    question: '你现在属于哪个年龄阶段？',
    options: ['18-25', '26-35', '36-50', '50 以上']
  },
  {
    id: 'gender',
    label: '性别',
    question: '你的性别更倾向于？',
    options: ['女', '男', '其他']
  },
  {
    id: 'dietStyle',
    label: '饮食风格',
    question: '你平时更偏好哪种饮食风格？',
    options: ['清淡少盐', '低糖低脂', '高蛋白', '素食轻食', '家常热菜']
  },
  {
    id: 'mood',
    label: '今日感觉',
    question: '今天你希望吃得是什么样的感觉？',
    options: ['暖心健康', '清爽轻盈', '轻松不油腻', '随性满足']
  }
];

const createMessage = (id: string, from: ChatMessage['from'], text: string): ChatMessage => ({
  id,
  from,
  text,
  createdAt: new Date().toISOString()
});

export default function Onboarding({
  userName,
  chatMessages,
  onAppendChatMessages,
  onComplete
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({});

  const step = steps[currentStep];
  const selectedAnswer = answers[step.id] ?? '';
  const isCompleted = steps.every((item) => Boolean(answers[item.id]));
  const progressText = `${currentStep + 1}/${steps.length}`;
  const onboardingMessages = useMemo(
    () => chatMessages.filter((message) => message.id.startsWith('onboarding-')),
    [chatMessages]
  );

  useEffect(() => {
    onAppendChatMessages([
      createMessage('onboarding-welcome', 'assistant', `嗨，${userName}，我是小膳青。我们先用几个小问题认识一下你的饮食目标。`),
      createMessage(`onboarding-question-${steps[0].id}`, 'assistant', steps[0].question)
    ]);
  }, [onAppendChatMessages, userName]);

  const handleSelect = (option: string) => {
    if (selectedAnswer) return;

    const nextAnswers = { ...answers, [step.id]: option };
    setAnswers(nextAnswers);

    const nextStep = currentStep + 1;
    const messages: ChatMessage[] = [
      createMessage(`onboarding-answer-${step.id}`, 'user', option)
    ];

    if (nextStep < steps.length) {
      messages.push(createMessage(`onboarding-question-${steps[nextStep].id}`, 'assistant', steps[nextStep].question));
      setCurrentStep(nextStep);
    } else {
      messages.push(createMessage('onboarding-finished', 'assistant', '收到，我已经记下来了。之后我会按这些偏好帮你看饮食记录。'));
    }

    onAppendChatMessages(messages);
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

  return (
    <div className="relative h-full overflow-hidden bg-[#EAF9E5] text-[#17221B]">
      <div className="absolute inset-0">
        <img
          src="/mascot/background.png"
          alt=""
          className="absolute inset-0 h-full w-full object-contain object-center opacity-95 blur-[0.1px]"
        />
        <div className="absolute inset-0 bg-[#F4FFF0]/58 backdrop-blur-[0.8px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.34)_0%,rgba(244,255,240,0.66)_58%,rgba(221,252,214,0.78)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,#D8FBD3_0%,rgba(216,251,211,0.82)_58%,rgba(244,255,240,0)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <header className="shrink-0 px-5 pb-4 pt-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-[22px] bg-white/65 text-[#15803D] shadow-[0_10px_24px_rgba(76,203,99,0.16)]">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#15803D]">新手引导</p>
                <h1 className="text-2xl font-extrabold text-[#17221B]">和小膳青聊聊</h1>
              </div>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-[#15803D]">
              {progressText}
            </span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
          <ChatThread messages={onboardingMessages} />
        </main>

        <footer className="shrink-0 rounded-t-[34px] bg-[#D3F9D6]/92 px-5 pb-5 pt-5 shadow-[0_-10px_28px_rgba(76,203,99,0.16)] backdrop-blur-md">
          <Card className="border-[#BDEFC3] bg-white/92 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#15803D]" />
                <p className="font-semibold text-[#17221B]">{step.label}</p>
              </div>
              <span className="text-sm font-medium text-[#6B7280]">请选择一个答案</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {step.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={Boolean(selectedAnswer)}
                  className={`rounded-[18px] border px-4 py-3 text-left text-sm font-semibold transition ${
                    selectedAnswer === option
                      ? 'border-[#4CCB63] bg-[#ECFEE9] text-[#154F29]'
                      : 'border-[#D1D5DB] bg-white text-[#374151] hover:border-[#BDEFC3] hover:bg-[#F7FFF4]'
                  } disabled:cursor-default`}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleFinish}
              disabled={!isCompleted}
              className="mt-4 w-full rounded-full bg-[#15803D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#12702E] disabled:cursor-not-allowed disabled:bg-[#A7D7AF]"
            >
              {isCompleted ? '完成新手引导' : '回答完后继续'}
            </button>
          </Card>
        </footer>
      </div>
    </div>
  );
}
