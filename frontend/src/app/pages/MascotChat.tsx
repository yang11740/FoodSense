import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CirclePlus, Loader2, Mic, SendHorizontal } from 'lucide-react';
import ChatThread from '@/app/components/ChatThread';
import type { ChatMessage } from '@/app/types/chat';

interface MascotChatProps {
  userEmail?: string | null;
  userName?: string;
  onBack: () => void;
}

export default function MascotChat({ userEmail, userName, onBack }: MascotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userEmail) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    const loadMessages = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/chat/messages?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          throw new Error('加载聊天记录失败');
        }
        const data = (await response.json()) as ChatMessage[];
        if (!cancelled) {
          setMessages(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setError('暂时无法加载聊天记录，请稍后重试。');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || !userEmail || isSending) return;

    setInputValue('');
    setIsSending(true);
    setError('');

    const optimisticMessage: ChatMessage = {
      id: `pending-user-${Date.now()}`,
      from: 'user',
      text,
      createdAt: new Date().toISOString()
    };
    setMessages((current) => [...current, optimisticMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, message: text })
      });

      if (!response.ok) {
        throw new Error('发送失败');
      }

      const result = await response.json();
      setMessages((current) => [
        ...current.filter((message) => message.id !== optimisticMessage.id),
        result.userMessage,
        result.assistantMessage
      ]);
    } catch (sendError) {
      console.error(sendError);
      setMessages((current) => current.filter((message) => message.id !== optimisticMessage.id));
      setInputValue(text);
      setError('消息发送失败，请稍后重试。');
    } finally {
      setIsSending(false);
    }
  };

  const visibleMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: 'chat-empty-welcome',
            from: 'assistant' as const,
            text: userName
              ? `嗨 ${userName}，我是小膳青。我会结合你的饮食记录和健康目标陪你聊。`
              : '我是小膳青。登录后我会结合你的饮食记录和健康目标陪你聊。',
            createdAt: new Date().toISOString()
          }
        ];

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
          {isLoading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm font-semibold text-[#4B8B5A]">
              <Loader2 className="h-4 w-4 animate-spin" />
              正在加载你的专属对话...
            </div>
          ) : (
            <>
              <ChatThread messages={visibleMessages} />
              {isSending && (
                <div className="mt-3 flex items-center gap-2 px-2 text-sm text-[#6B7280]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  小膳青正在结合你的饮食记录思考...
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </main>

        <footer className="shrink-0 rounded-t-[34px] bg-[#D3F9D6]/92 px-5 pb-5 pt-5 shadow-[0_-10px_28px_rgba(76,203,99,0.16)] backdrop-blur-md">
          {error && <p className="mb-3 text-center text-xs font-semibold text-[#B91C1C]">{error}</p>}
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_7px_18px_rgba(15,23,42,0.08)]">
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#4E6B5B] text-[#4E6B5B]" aria-label="语音输入">
              <Mic className="h-6 w-6" strokeWidth={2} />
            </button>
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              disabled={!userEmail || isSending}
              className="min-w-0 flex-1 bg-transparent text-[17px] font-semibold text-[#17221B] outline-none placeholder:text-[#A1AAA4] disabled:opacity-60"
              placeholder={userEmail ? '输入对话记录饮食和运动' : '请先登录后再聊天'}
            />
            <button
              onClick={handleSend}
              disabled={!userEmail || !inputValue.trim() || isSending}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#4E6B5B] disabled:opacity-40"
              aria-label="发送"
            >
              {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <SendHorizontal className="h-7 w-7" strokeWidth={2} />}
            </button>
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
