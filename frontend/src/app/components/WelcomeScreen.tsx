import { Camera, ShieldCheck, TrendingUp, X } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface WelcomeScreenProps {
  onClose: () => void;
}

export default function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/35 p-5 backdrop-blur-sm">
      <Card className="relative w-full max-w-md bg-[#FFFDF7] p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F0FBEF] hover:text-[#15803D]"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#DCF8D8] text-[#15803D] shadow-[0_10px_24px_rgba(76,203,99,0.18)]">
            <span className="text-4xl">菜</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[#111827]">欢迎使用食知</h2>
          <p className="text-[15px] leading-6 text-[#4B5563]">
            一个会用简单语言解释饮食风险的中式健康小助手。
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {[
            {
              icon: Camera,
              title: '拍照看风险',
              text: '拍一下菜品，快速知道今天适不适合多吃。',
              color: 'bg-[#F0FBEF] text-[#15803D]',
            },
            {
              icon: ShieldCheck,
              title: '说清楚原因',
              text: '高盐、高脂、高糖来自哪里，尽量讲得明白一点。',
              color: 'bg-[#EFF7FF] text-[#2563EB]',
            },
            {
              icon: TrendingUp,
              title: '慢慢养成习惯',
              text: '用周报和小目标陪你把饮食调整得更稳。',
              color: 'bg-[#FFF7E6] text-[#B7791F]',
            },
          ].map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="flex gap-3 rounded-[20px] bg-white/80 p-3">
              <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-full ${color}`}>
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-[#111827]">{title}</h3>
                <p className="text-sm leading-6 text-[#4B5563]">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-[20px] border border-[#BFDBFE] bg-[#EFF7FF] p-4 text-sm leading-6 text-[#2563EB]">
          分析结果用于饮食风险感知与辅助决策，不构成医疗诊断或治疗建议。
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-[#4CCB63] px-4 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(76,203,99,0.28)] transition-all hover:bg-[#16A34A] active:scale-[0.98]"
        >
          开始使用
        </button>
      </Card>
    </div>
  );
}
