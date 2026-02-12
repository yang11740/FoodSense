import { useState } from 'react';
import { Home as HomeIcon, Wrench, User, FileText, Camera } from 'lucide-react';
import Home from '@/app/pages/Home';
import FoodAnalysis from '@/app/pages/FoodAnalysis';
import Tools from '@/app/pages/Tools';
import HealthProfile from '@/app/pages/HealthProfile';
import HealthReport from '@/app/pages/HealthReport';
import WelcomeScreen from '@/app/components/WelcomeScreen';

type Page = 'home' | 'analysis' | 'tools' | 'profile' | 'report';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showWelcome, setShowWelcome] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'analysis':
        return <FoodAnalysis />;
      case 'tools':
        return <Tools />;
      case 'profile':
        return <HealthProfile />;
      case 'report':
        return <HealthReport />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* 欢迎屏幕 */}
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}

      {/* 页面内容区域 */}
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>

      {/* 底部导航栏 */}
      <nav className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-4 py-2">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'home' 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">识别</span>
          </button>

          <button
            onClick={() => setCurrentPage('analysis')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'analysis' 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">分析</span>
          </button>

          <button
            onClick={() => setCurrentPage('tools')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'tools' 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wrench className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">工具</span>
          </button>

          <button
            onClick={() => setCurrentPage('report')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'report' 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HomeIcon className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">报告</span>
          </button>

          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentPage === 'profile' 
                ? 'text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-6 h-6" strokeWidth={1.5} />
            <span className="text-xs">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
