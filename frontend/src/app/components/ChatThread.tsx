import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/app/types/chat';

interface ChatThreadProps {
  messages: ChatMessage[];
}

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ChatThread({ messages }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  return (
    <div className="space-y-5">
      {messages.map((message) => {
        const isUser = message.from === 'user';

        return (
          <div key={message.id} className={`flex items-start gap-3 ${isUser ? 'justify-end pl-12' : 'pr-8'}`}>
            {!isUser && (
              <img
                src="/mascot/5.png"
                alt="小膳青"
                className="mt-1 h-12 w-12 shrink-0 rounded-full border-2 border-white bg-[#E6FFD9] object-cover shadow-[0_4px_12px_rgba(76,203,99,0.18)]"
              />
            )}

            <div className={`flex max-w-[78%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`relative rounded-[22px] border-2 px-4 py-3 text-[17px] leading-7 shadow-[0_7px_0_rgba(93,50,37,0.10)] ${
                  isUser
                    ? 'border-[#6D2B24] bg-[#BDEFF5] text-[#244149]'
                    : 'border-[#6D2B24] bg-[#FFF1B9] text-[#22251F]'
                }`}
              >
                {!isUser && (
                  <>
                    <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#FF8FBA]" />
                    <span className="absolute left-2 -top-3 h-4 w-4 rounded-full bg-[#8BC6FF]" />
                    <span className="absolute left-6 -top-2 h-5 w-5 rounded-full bg-[#FFF480]" />
                  </>
                )}
                <span className="absolute -right-2 -top-2 text-lg text-[#F2C84B]">★</span>
                <span className="absolute -bottom-2 -left-1 h-5 w-5 rounded-bl-[14px] rounded-tr-[16px] bg-[#A8D864]" />
                {isUser && <span className="absolute -right-2 -bottom-2 h-5 w-5 rounded-full bg-[#F7B663]" />}
                <p>{message.text}</p>
              </div>
              <span className="mt-2 px-1 text-xs font-medium text-[#6B7D70]">{formatMessageTime(message.createdAt)}</span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
