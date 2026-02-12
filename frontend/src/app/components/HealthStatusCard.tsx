import { LucideIcon } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

interface HealthStatusCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string;
  status?: 'good' | 'warning' | 'danger';
  description?: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function HealthStatusCard({
  icon: Icon,
  title,
  value,
  unit,
  status = 'good',
  description,
  trend
}: HealthStatusCardProps) {
  const statusColors = {
    good: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    danger: 'bg-red-50 border-red-200'
  };

  const iconColors = {
    good: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    danger: 'bg-red-100 text-red-600'
  };

  const valueColors = {
    good: 'text-green-700',
    warning: 'text-orange-700',
    danger: 'text-red-700'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  return (
    <Card className={`p-4 border ${statusColors[status]}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconColors[status]} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl ${valueColors[status]}`}>{value}</span>
            {unit && <span className="text-sm text-gray-500">{unit}</span>}
            {trend && (
              <Badge variant="outline" className="ml-auto">
                {trendIcons[trend]}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
