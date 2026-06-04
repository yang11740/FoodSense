import { ArrowLeft, CirclePlus, Mic } from 'lucide-react';

interface MascotChatProps {
  onBack: () => void;
}

const messages = [
  {
    id: 1,
    from: 'bot',
    text: '为了给你搭配更合胃口的饮食方案，说说你的饮食习惯吧～'
  },
  {
    id: 2,
    from: 'bot',
    text: '平时喜欢清淡一点，还是更爱川湘、红烧、糖醋这些口味？'
  },
  {
    id: 3,
    from: 'user',
    text: '希望三餐搭配合理，吃得健康又均衡～'
  },
  {
    id: 4,
    from: 'bot',
    text: '收到！我会优先帮你看热量、油盐糖和蛋白质搭配，建议会尽量说得简单一点。'
  },
  {
    id: 5,
    from: 'user',
    text: '没啥特别需求，正常吃就好啦～'
  },
  {
    id: 6,
    from: 'bot',
    text: '那我先按日常中式饮食来帮你记录。拍照之后，我会告诉你这顿适不适合多吃。'
  }
];

export default function MascotChat({ onBack }: MascotChatProps) {
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
              <h1 className="text-[25px] font-extrabold tracking-[0.01em] text-[#17221B]">小膳青</h1>
              <img src="/mascot/5.png" alt="小膳青" className="h-9 w-9 rounded-full object-cover" />
            </div>
            <span />
          </div>
        </header>

        <main className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4 pt-2">
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

                <div
                  className={`relative max-w-[78%] rounded-[22px] border-2 px-4 py-3 text-[17px] leading-7 shadow-[0_7px_0_rgba(93,50,37,0.10)] ${
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
              </div>
            );
          })}
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
