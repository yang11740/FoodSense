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
    default: 'bg-gray-50 border-gray-200 text-gray-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconColors = {
    default: 'text-gray-500',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };

  return (
    <Card className={`p-3 border ${variantStyles[variant]}`}>
      <div className="flex gap-2 items-start">
        <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColors[variant]}`} />
        <p className="text-xs">{message}</p>
      </div>
    </Card>
  );
}
