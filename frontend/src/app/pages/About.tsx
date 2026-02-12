import { Camera, Shield, TrendingUp, Heart, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';

export default function About() {
  const features = [
    {
      icon: Camera,
      title: '智能识别',
      description: '基于图像识别技术，快速识别菜品并分析营养成分',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Shield,
      title: '风险提示',
      description: '根据个人健康画像，提供个性化的饮食风险提示',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: TrendingUp,
      title: '健康管理',
      description: '长期跟踪饮食数据，生成健康趋势报告',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Heart,
      title: '辅助决策',
      description: '提供饮食建议，辅助用户做出更健康的选择',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg text-gray-900">关于食知</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Logo 和应用名称 */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg mb-4">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl text-gray-900 mb-2">食知 FoodSense</h2>
          <p className="text-gray-600">智能饮食决策辅助系统</p>
          <p className="text-sm text-gray-500 mt-2">版本 1.0.0</p>
        </div>

        {/* 核心功能 */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">核心功能</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 bg-white shadow-sm">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg ${feature.color} flex-shrink-0`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 使用场景 */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">适用场景</h3>
          <Card className="p-5 bg-white shadow-sm">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900">日常餐饮选择</p>
                  <p className="text-sm text-gray-600">在餐厅点餐或家庭用餐时，快速了解菜品营养信息</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900">健康目标管理</p>
                  <p className="text-sm text-gray-600">减脂、控糖、改善饮食习惯等健康目标的辅助工具</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <p className="text-gray-900">饮食习惯跟踪</p>
                  <p className="text-sm text-gray-600">长期记录和分析饮食数据，形成健康洞察</p>
                </div>
              </li>
            </ul>
          </Card>
        </div>

        {/* 重要声明 */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">重要声明</h3>
          <Card className="p-5 bg-yellow-50 border border-yellow-200">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-900 mb-2">系统定位</h4>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  食知（FoodSense）是一款<strong>饮食决策辅助工具</strong>，旨在帮助用户更好地了解食物营养信息和潜在健康风险，辅助用户做出更健康的饮食选择。
                </p>
              </div>
            </div>

            <div className="bg-yellow-100 rounded-lg p-4 space-y-2">
              <p className="text-sm text-yellow-900">
                <strong>本系统不提供以下服务：</strong>
              </p>
              <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                <li>• 疾病诊断或治疗建议</li>
                <li>• 专业医疗咨询或指导</li>
                <li>• 营养师专业处方</li>
                <li>• 药物使用建议</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>使用建议：</strong>
                所有分析结果仅供参考，最终饮食决策应结合个人实际情况、医生建议和专业营养师指导综合判断。如有健康问题，请及时咨询专业医疗机构。
              </p>
            </div>
          </Card>
        </div>

        {/* 数据隐私 */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">数据与隐私</h3>
          <Card className="p-5 bg-white shadow-sm">
            <div className="space-y-3 text-sm text-gray-600">
              <p>• 所有健康数据仅存储在您的设备本地</p>
              <p>• 我们不会收集、存储或分享您的个人健康信息</p>
              <p>• 您可以随时删除应用及其所有数据</p>
              <p>• 建议不要在本应用中记录敏感医疗信息</p>
            </div>
          </Card>
        </div>

        {/* 联系方式 */}
        <div>
          <h3 className="text-lg text-gray-900 mb-4">联系我们</h3>
          <Card className="p-5 bg-white shadow-sm">
            <div className="space-y-2 text-sm text-gray-600">
              <p>反馈与建议：feedback@foodsense.app</p>
              <p>技术支持：support@foodsense.app</p>
            </div>
          </Card>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>© 2026 FoodSense. All rights reserved.</p>
          <p className="mt-1">Made with ❤️ for healthy living</p>
        </div>
      </div>
    </div>
  );
}
