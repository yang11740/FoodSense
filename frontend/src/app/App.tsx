import { useState } from 'react';
import { CalendarDays, ChartNoAxesColumn, ClipboardList, Plus, Smile } from 'lucide-react';
import Home from '@/app/pages/Home';
import FoodAnalysis from '@/app/pages/FoodAnalysis';
import Tools from '@/app/pages/Tools';
import HealthProfile from '@/app/pages/HealthProfile';
import MascotChat from '@/app/pages/MascotChat';
import WelcomeScreen from '@/app/components/WelcomeScreen';
import type { RecipeRecord } from '@/app/types/food';

type Page = 'home' | 'analysis' | 'chat' | 'tools' | 'profile' | 'report';

const navItems = [
  { page: 'home' as Page, label: '记录', icon: ClipboardList },
  { page: 'analysis' as Page, label: '统计', icon: CalendarDays },
  { page: 'chat' as Page, label: '', icon: Plus, center: true },
  { page: 'report' as Page, label: '健康', icon: ChartNoAxesColumn },
  { page: 'profile' as Page, label: '我的', icon: Smile },
];

const initialRecipeRecords: RecipeRecord[] = [
  {
    id: '2026-06-04-lunch',
    date: '2026-06-04',
    meal: '午餐',
    name: '清蒸鲈鱼',
    calories: 260,
    carbs: 3,
    protein: 35,
    fat: 11,
    recommendation: 'recommended',
    summary: '这道菜整体比较清淡，比较适合今天吃。',
    reasons: ['蛋白质主要来自鲜鱼', '脂肪含量较低', '清蒸方式相对少油'],
    tags: ['高蛋白', '少油', '清淡']
  },
  {
    id: '2026-06-04-dinner',
    date: '2026-06-04',
    meal: '晚餐',
    name: '糖醋里脊',
    calories: 430,
    carbs: 46,
    protein: 21,
    fat: 18,
    recommendation: 'caution',
    summary: '可以吃，但建议控制份量，甜口和油炸会带来一点负担。',
    reasons: ['糖分风险可能来自糖醋汁', '油脂风险来自油炸外壳', '建议搭配绿叶菜'],
    tags: ['高糖', '油炸']
  },
  {
    id: '2026-06-08-lunch',
    date: '2026-06-08',
    meal: '午餐',
    name: '红烧肉',
    calories: 520,
    carbs: 18,
    protein: 24,
    fat: 39,
    recommendation: 'not-recommended',
    summary: '今天不太建议多吃，可以夹两块尝味道。',
    reasons: ['高脂风险主要来自五花肉', '钠摄入风险可能来自酱油和红烧酱汁', '糖分风险可能来自冰糖'],
    tags: ['高脂', '高热量', '高盐']
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showWelcome, setShowWelcome] = useState(false);
  const [recipeRecords, setRecipeRecords] = useState<RecipeRecord[]>(initialRecipeRecords);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onAddRecipeRecord={(record) => setRecipeRecords((records) => [record, ...records])} />;
      case 'analysis':
        return <FoodAnalysis recipeRecords={recipeRecords} />;
      case 'tools':
        return <Tools initialSection="overview" />;
      case 'chat':
        return <MascotChat onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return <HealthProfile />;
      case 'report':
        return <Tools initialSection="weekly" />;
      default:
        return <Home onAddRecipeRecord={(record) => setRecipeRecords((records) => [record, ...records])} />;
    }
  };

  return (
    <div className="w-full h-full bg-[#F7FFF4] overflow-hidden flex flex-col text-[#111827]">
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}

      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>

      {currentPage !== 'chat' && <nav className="bg-[#FFFDF7]/96 border-t border-[rgba(76,203,99,0.14)] rounded-t-[30px] shadow-[0_-8px_24px_rgba(76,203,99,0.12)] backdrop-blur">
        <div className="flex items-end justify-around px-3 pt-2 pb-3">
          {navItems.map(({ page, label, icon: Icon, center }) => {
            const active = currentPage === page;
            if (center) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="relative -mt-7 flex h-20 w-20 flex-col items-center justify-end"
                >
                  <span className="absolute top-0 h-[72px] w-[72px] overflow-hidden rounded-[24px] shadow-[0_10px_24px_rgba(76,203,99,0.28)] transition-transform active:scale-95">
                    <img
                      src="/mascot/logo.png"
                      alt="知膳"
                      className="h-full w-full scale-[1.26] object-cover"
                    />
                  </span>
                </button>
              );
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative flex min-w-14 flex-col items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 ${
                  active
                    ? 'text-[#111827] -translate-y-0.5'
                    : 'text-[#A1A1AA] hover:text-[#15803D] hover:bg-[#F0FBEF]'
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-[12px] border-2 ${active ? 'border-[#14221A] bg-[#BFF4D0] text-[#15803D]' : 'border-transparent bg-transparent'}`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="text-xs font-bold">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
