import { Camera, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import LoadingAnalysis from '@/app/components/LoadingAnalysis';

interface AnalysisResult {
  foodName: string;
  recommendation: 'recommended' | 'caution' | 'not-recommended';
  riskTags: string[];
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockAnalysis = () => {
    setIsAnalyzing(true);
    
    // 模拟拍照和分析过程
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          foodName: '红烧肉',
          recommendation: 'not-recommended',
          riskTags: ['高脂', '高热量', '高盐']
        },
        {
          foodName: '清蒸鲈鱼',
          recommendation: 'recommended',
          riskTags: []
        },
        {
          foodName: '糖醋里脊',
          recommendation: 'caution',
          riskTags: ['高糖', '油炸']
        }
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case 'recommended':
        return {
          label: '推荐食用',
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />
        };
      case 'caution':
        return {
          label: '谨慎食用',
          color: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />
        };
      case 'not-recommended':
        return {
          label: '不推荐食用',
          color: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="w-5 h-5 text-red-600" />
        };
      default:
        return {
          label: '分析中',
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: <AlertCircle className="w-5 h-5 text-gray-600" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-xl text-green-600">食知 FoodSense</h1>
          <p className="text-sm text-gray-500 mt-1">智能饮食决策辅助系统</p>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* 拍照识别区域 */}
        <div className="flex flex-col items-center justify-center mb-8">
          <button
            onClick={mockAnalysis}
            disabled={isAnalyzing}
            className="relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full p-12 shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-16 h-16" strokeWidth={1.5} />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
          
          <p className="mt-6 text-lg text-gray-700">
            {isAnalyzing ? '正在分析...' : '拍照识别菜品'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            拍摄菜品或菜单图片进行分析
          </p>
        </div>

        {/* 分析中状态 */}
        {isAnalyzing && (
          <div className="mt-8">
            <LoadingAnalysis />
          </div>
        )}

        {/* 即时分析结果 */}
        {analysisResult && !isAnalyzing && (
          <div className="mt-8">
            <h2 className="text-lg text-gray-800 mb-4">即时分析结果</h2>
            
            <Card className="p-5 bg-white shadow-sm border border-gray-200">
              {/* 菜品名称 */}
              <div className="mb-4">
                <h3 className="text-xl text-gray-900">{analysisResult.foodName}</h3>
              </div>

              {/* 决策建议等级 */}
              <div className="mb-4">
                {(() => {
                  const config = getRecommendationConfig(analysisResult.recommendation);
                  return (
                    <div className={`flex items-center gap-2 p-3 rounded-lg border ${config.color}`}>
                      {config.icon}
                      <span>{config.label}</span>
                    </div>
                  );
                })()}
              </div>

              {/* 风险标签 */}
              {analysisResult.riskTags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">主要风险标签</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.riskTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 查看详情按钮 */}
              <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                查看详细分析
              </button>
            </Card>
          </div>
        )}

        {/* 快速统计 */}
        {!analysisResult && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card className="p-4 bg-white shadow-sm text-center border border-gray-200">
              <p className="text-2xl text-green-600 mb-1">28</p>
              <p className="text-xs text-gray-600">已分析</p>
            </Card>
            <Card className="p-4 bg-white shadow-sm text-center border border-gray-200">
              <p className="text-2xl text-blue-600 mb-1">7</p>
              <p className="text-xs text-gray-600">连续天数</p>
            </Card>
            <Card className="p-4 bg-white shadow-sm text-center border border-gray-200">
              <p className="text-2xl text-orange-600 mb-1">85</p>
              <p className="text-xs text-gray-600">健康评分</p>
            </Card>
          </div>
        )}

        {/* 使用说明 */}
        <Card className="mt-6 p-4 bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="mb-1">系统定位说明</p>
              <p className="text-blue-700">
                食知（FoodSense）为饮食决策辅助工具，分析结果用于健康风险感知，不构成医疗诊断或治疗建议。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
