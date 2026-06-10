import { ArrowLeft, CirclePlus, Mic } from 'lucide-react';
import ChatThread from '@/app/components/ChatThread';
import type { ChatMessage } from '@/app/types/chat';

interface MascotChatProps {
  messages: ChatMessage[];
  onBack: () => void;
}

const fallbackMessages: ChatMessage[] = [
  {
    id: 'chat-empty-welcome',
    from: 'assistant',
    text: '我是小膳青。你可以把饮食习惯、健康目标或者今天想吃什么告诉我，我会帮你一起整理。',
    createdAt: new Date().toISOString()
  }
];

export default function MascotChat({ messages, onBack }: MascotChatProps) {
  const visibleMessages = messages.length > 0 ? messages : fallbackMessages;

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
        <header className="shrink-0 px-5 pb-5 pt-12">
          <div className="grid grid-cols-[44px_1fr_44px] items-center">
            <button
              onClick={onBack}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/55 text-[#17221B] active:scale-95"
              aria-label="返回"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
            </button>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-[25px] font-extrabold tracking-normal text-[#17221B]">小膳青</h1>
              <img src="/mascot/5.png" alt="小膳青" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <span />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-2">
          <ChatThread messages={visibleMessages} />
        </main>

        <footer className="shrink-0 rounded-t-[34px] bg-[#D3F9D6]/92 px-5 pb-5 pt-5 shadow-[0_-10px_28px_rgba(76,203,99,0.16)] backdrop-blur-md">
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_7px_18px_rgba(15,23,42,0.08)]">
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#4E6B5B] text-[#4E6B5B]" aria-label="语音输入">
              <Mic className="h-6 w-6" strokeWidth={2} />
            </button>
            <input
              className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold text-[#17221B] outline-none placeholder:text-[#A1AAA4]"
              placeholder="输入对话记录饮食和运动"
            />
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#4E6B5B]" aria-label="更多">
              <CirclePlus className="h-8 w-8" strokeWidth={1.9} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-semibold text-[#8DA293]">内容由智能助手生成，请结合自身情况参考</p>
        </footer>
      </div>
    </div>
  );
}
