import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';

interface FoodRecommendationCardProps {
  foodName: string;
  recommendation: 'recommended' | 'caution' | 'not-recommended';
  tags: string[];
  reason?: string;
  onClick?: () => void;
}

export default function FoodRecommendationCard({
  foodName,
  recommendation,
  tags,
  reason,
  onClick
}: FoodRecommendationCardProps) {
  const config = {
    recommended: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-700'
    },
    caution: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700'
    },
    'not-recommended': {
      icon: <XCircle className="w-5 h-5" />,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-700'
    }
  }[recommendation];

  return (
    <Card 
      className={`p-4 border cursor-pointer hover:shadow-md transition-shadow ${config.color}`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={config.iconColor}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{foodName}</h3>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`text-xs ${config.textColor} bg-white/50`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {reason && (
            <p className="text-sm text-gray-600">{reason}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
