import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import DisclaimerNote from '@/app/components/DisclaimerNote';
import NutritionChart from '@/app/components/NutritionChart';

export default function FoodAnalysis() {
  const foodData = {
    name: '红烧肉',
    cookingMethod: '红烧',
    ingredients: ['五花肉', '冰糖', '酱油', '料酒', '八角', '桂皮'],
    nutrition: {
      carbs: 15,
      protein: 25,
      fat: 60
    },
    calorieLevel: '高热量 (约400-500千卡/100克)',
    allergens: ['无明显过敏原'],
    recommendation: {
      level: 'not-recommended',
      label: '不推荐食用',
      reasons: [
        '脂肪含量过高，占比达60%',
        '热量密度较大，不利于体重管理',
        '含糖量较高，不适合控糖需求'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">菜品营养分析</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* 菜品图片 */}
        <Card className="overflow-hidden bg-white shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500 text-sm">菜品图片</p>
              <p className="text-2xl mt-2">{foodData.name}</p>
            </div>
          </div>
        </Card>

        {/* 基本信息 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-3">识别结果</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">菜品名称</span>
              <span className="text-gray-900">{foodData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">烹饪方式</span>
              <span className="text-gray-900">{foodData.cookingMethod}</span>
            </div>
          </div>
        </Card>

        {/* 主要食材 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-3">主要食材</h2>
          <div className="flex flex-wrap gap-2">
            {foodData.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                {ingredient}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 营养结构 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">营养结构分析</h2>
          
          {/* 饼图可视化 */}
          <div className="mb-6">
            <NutritionChart data={foodData.nutrition} />
          </div>

          <div className="space-y-4">
            {/* 碳水化合物 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">碳水化合物</span>
                <span className="text-sm text-blue-700">{foodData.nutrition.carbs}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${foodData.nutrition.carbs}%` }}
                ></div>
              </div>
            </div>

            {/* 蛋白质 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">蛋白质</span>
                <span className="text-sm text-green-700">{foodData.nutrition.protein}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${foodData.nutrition.protein}%` }}
                ></div>
              </div>
            </div>

            {/* 脂肪 */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">脂肪</span>
                <span className="text-sm text-red-600">{foodData.nutrition.fat}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${foodData.nutrition.fat}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 热量水平 */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-600">热量水平</span>
              <span className="text-red-600">{foodData.calorieLevel}</span>
            </div>
          </div>
        </Card>

        {/* 过敏原提示 */}
        <Card className="p-5 bg-white shadow-sm">
          <h2 className="text-lg text-gray-900 mb-3">过敏原提示</h2>
          <div className="flex flex-wrap gap-2">
            {foodData.allergens.map((allergen, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {allergen}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 饮食决策建议 */}
        <Card className="p-5 bg-red-50 border-red-200 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg text-red-900 mb-1">{foodData.recommendation.label}</h2>
              <p className="text-sm text-red-700">建议您谨慎考虑以下风险因素</p>
            </div>
          </div>

          <div className="space-y-2 ml-9">
            {foodData.recommendation.reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-red-800">{reason}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 免责声明 */}
        <DisclaimerNote 
          message="分析结果用于饮食风险感知与辅助决策，不构成医疗诊断。最终饮食选择请结合个人实际情况综合判断。"
        />
      </div>
    </div>
  );
}
