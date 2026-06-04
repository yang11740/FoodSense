import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  FileText,
  ImageIcon,
  RefreshCcw,
  ScanLine,
  Utensils,
  ZapOff
} from 'lucide-react';

interface CameraRecognitionProps {
  onClose: () => void;
  onCaptured: (imageDataUrl: string, mode: RecognitionMode) => void;
}

type CameraState = 'requesting' | 'ready' | 'denied' | 'unsupported' | 'capturing';
export type RecognitionMode = 'food' | 'nutrition-label' | 'takeout-order';

const recognitionModes: Array<{
  id: RecognitionMode;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  prompt: string;
}> = [
  {
    id: 'food',
    label: '识别食物',
    icon: Utensils,
    prompt: '请从正上方拍完整食物，方便准确估算'
  },
  {
    id: 'nutrition-label',
    label: '拍成分表',
    icon: FileText,
    prompt: '请对准营养成分表，保持文字清晰完整'
  },
  {
    id: 'takeout-order',
    label: '外卖订单',
    icon: ScanLine,
    prompt: '请拍完整订单信息，包含菜名和规格'
  }
];

export default function CameraRecognition({ onClose, onCaptured }: CameraRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('requesting');
  const [selectedMode, setSelectedMode] = useState<RecognitionMode>('food');

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }

    setCameraState('requesting');
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 1920 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('ready');
    } catch {
      setCameraState('denied');
    }
  };

  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || cameraState !== 'ready') return;

    setCameraState('capturing');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1440;
    const context = canvas.getContext('2d');
    if (!context) {
      setCameraState('ready');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    stopCamera();
    onCaptured(imageDataUrl, selectedMode);
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        stopCamera();
        onCaptured(result, selectedMode);
      }
    };
    reader.readAsDataURL(file);
  };

  const closeCamera = () => {
    stopCamera();
    onClose();
  };

  const selectedPrompt = recognitionModes.find((mode) => mode.id === selectedMode)?.prompt;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      <div className="flex h-[76px] shrink-0 items-center justify-between px-5 pt-3">
        <button
          onClick={closeCamera}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors active:bg-white/20"
          aria-label="返回"
        >
          <ArrowLeft className="h-7 w-7" strokeWidth={2.2} />
        </button>
        <h1 className="text-[24px] font-semibold tracking-normal">拍照识别</h1>
        <div className="h-11 w-11" />
      </div>

      <div className="relative flex-1 overflow-hidden bg-[#111]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />

        {(cameraState === 'requesting' || cameraState === 'denied' || cameraState === 'unsupported') && (
          <div className="absolute inset-0 grid place-items-center bg-black/82 px-7 text-center">
            <div className="rounded-[28px] bg-white p-6 text-[#1D2A22]">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#DCF8D8] text-[#16A34A]">
                <Camera className="h-7 w-7" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-semibold">
                {cameraState === 'requesting' && '正在请求相机权限'}
                {cameraState === 'denied' && '需要开启相机权限'}
                {cameraState === 'unsupported' && '当前环境不支持相机'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                {cameraState === 'requesting' && '请在系统弹窗中允许访问相机。'}
                {cameraState === 'denied' && '允许相机后，知膳才能拍摄食物并进行识别。'}
                {cameraState === 'unsupported' && '可以先从相册选择食物照片进行识别。'}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-full border border-[#BDEFC3] bg-[#F0FBEF] px-4 py-2.5 text-sm font-semibold text-[#15803D]"
                >
                  选照片
                </button>
                <button
                  onClick={startCamera}
                  className="flex-1 rounded-full bg-[#4CCB63] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  再试一次
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-6 top-[18%] h-[46%]">
          <div className="absolute left-0 top-0 h-20 w-20 rounded-tl-[28px] border-l-[6px] border-t-[6px] border-white" />
          <div className="absolute right-0 top-0 h-20 w-20 rounded-tr-[28px] border-r-[6px] border-t-[6px] border-white" />
          <div className="absolute bottom-0 left-0 h-20 w-20 rounded-bl-[28px] border-b-[6px] border-l-[6px] border-white" />
          <div className="absolute bottom-0 right-0 h-20 w-20 rounded-br-[28px] border-b-[6px] border-r-[6px] border-white" />
          <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/24 px-5 py-3 text-center text-[15px] font-medium leading-6 text-white">
            {selectedPrompt}
          </div>
        </div>

        {cameraState === 'capturing' && (
          <div className="absolute inset-0 grid place-items-center bg-black/55">
            <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1D2A22]">
              正在识别食物...
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-[#151A17] px-5 pb-7 pt-4">
        <div className="mx-auto mb-6 grid max-w-[360px] grid-cols-3 gap-2">
          {recognitionModes.map(({ id, label, icon: Icon }) => {
            const active = selectedMode === id;
            return (
              <button
                key={label}
                onClick={() => setSelectedMode(id)}
                className={`flex h-12 items-center justify-center gap-1 rounded-[12px] text-sm font-semibold transition-colors ${
                  active ? 'bg-white text-[#1D2A22]' : 'bg-white/70 text-[#4B5563]'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#16A34A]' : 'text-[#6B7280]'}`} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="grid h-[66px] w-[66px] place-items-center rounded-full bg-white/12 text-white transition-transform active:scale-95"
            aria-label="选择照片"
          >
            <ImageIcon className="h-8 w-8" strokeWidth={2} />
          </button>

          <button
            onClick={captureFrame}
            disabled={cameraState !== 'ready'}
            className="grid h-[86px] w-[86px] place-items-center rounded-full border-[3px] border-[#4CCB63] bg-[#22D978] text-white shadow-[0_0_0_8px_rgba(34,217,120,0.12)] transition-transform active:scale-95 disabled:opacity-50"
            aria-label="拍照"
          >
            <Camera className="h-10 w-10" strokeWidth={2.3} />
          </button>

          <button
            className="grid h-[66px] w-[66px] place-items-center rounded-full bg-white/12 text-white/70"
            aria-label="闪光灯"
          >
            <ZapOff className="h-8 w-8" strokeWidth={2} />
          </button>
        </div>

        <button
          onClick={startCamera}
          className="mx-auto mt-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white/60"
        >
          <RefreshCcw className="h-3.5 w-3.5" strokeWidth={2} />
          重新请求相机
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelected}
        />
      </div>
    </div>
  );
}
