import { AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

interface DisclaimerNoteProps {
  message?: string;
  variant?: 'default' | 'warning' | 'info';
}

export default function DisclaimerNote({ 
  message = '分析结果用于饮食风险感知与辅助决策，不构成医疗诊断。',
  variant = 'default'
}: DisclaimerNoteProps) {
  const variantStyles = {
    default: 'bg-[#F0FBEF] border-[#BDEFC3] text-[#15803D]',
    warning: 'bg-[#FFF7E6] border-[#FFD88A] text-[#B7791F]',
    info: 'bg-[#EFF7FF] border-[#BFDBFE] text-[#2563EB]'
  };

  const iconColors = {
    default: 'text-[#16A34A]',
    warning: 'text-[#FFB84D]',
    info: 'text-[#5BA7F7]'
  };

  return (
    <Card className={`p-4 border shadow-[0_4px_14px_rgba(15,23,42,0.06)] ${variantStyles[variant]}`}>
      <div className="flex gap-2 items-start">
        <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColors[variant]}`} strokeWidth={1.75} />
        <p className="text-xs leading-5">{message}</p>
      </div>
    </Card>
  );
}
