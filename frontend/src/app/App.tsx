import { useCallback, useState } from 'react';
import { CalendarDays, ChartNoAxesColumn, ClipboardList, Plus, Smile } from 'lucide-react';
import Home from '@/app/pages/Home';
import FoodAnalysis from '@/app/pages/FoodAnalysis';
import Tools from '@/app/pages/Tools';
import HealthProfile from '@/app/pages/HealthProfile';
import MascotChat from '@/app/pages/MascotChat';
import Settings from '@/app/pages/Settings';
import Preferences from '@/app/pages/Preferences';
import Goals from '@/app/pages/Goals';
import Auth from '@/app/pages/Auth';
import Onboarding from '@/app/pages/Onboarding';
import WelcomeScreen from '@/app/components/WelcomeScreen';
import type { ChatMessage } from '@/app/types/chat';
import type { RecipeRecord } from '@/app/types/food';

type Page = 'auth' | 'onboarding' | 'home' | 'analysis' | 'chat' | 'tools' | 'profile' | 'report' | 'settings' | 'preferences' | 'goals';

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
    ingredients: ['鲈鱼', '姜丝', '葱段', '蒸鱼豉油'],
    cookingTechnique: '蒸',
    cookingMethod: '清蒸',
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
    ingredients: ['猪里脊', '鸡蛋', '淀粉', '糖醋汁'],
    cookingTechnique: '油炸',
    cookingMethod: '挂糊油炸后糖醋快炒',
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
    ingredients: ['五花肉', '冰糖', '酱油', '料酒'],
    cookingTechnique: '红烧',
    cookingMethod: '红烧慢炖',
    recommendation: 'not-recommended',
    summary: '今天不太建议多吃，可以夹两块尝味道。',
    reasons: ['高脂风险主要来自五花肉', '钠摄入风险可能来自酱油和红烧酱汁', '糖分风险可能来自冰糖'],
    tags: ['高脂', '高热量', '高盐']
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [showWelcome, setShowWelcome] = useState(false);
  const [recipeRecords, setRecipeRecords] = useState<RecipeRecord[]>(initialRecipeRecords);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<{
    goal: string;
    age: string;
    gender: string;
    dietStyle: string;
    mood: string;
    height?: string;
    weight?: string;
  } | null>(null);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isNewUser, setIsNewUser] = useState(false);

  const appendChatMessages = useCallback((messages: ChatMessage[]) => {
    setChatMessages((current) => {
      const existingIds = new Set(current.map((message) => message.id));
      const nextMessages = messages.filter((message) => !existingIds.has(message.id));
      return nextMessages.length > 0 ? [...current, ...nextMessages] : current;
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    setUserProfile(null);
    setRecipeRecords([]);
    setHealthGoals([]);
    setPreferences([]);
    setChatMessages([]);
    setIsNewUser(false);
    setCurrentPage('auth');
  };

  const saveUserProfile = async (profile: {
    goal: string;
    age: string;
    gender: string;
    dietStyle: string;
    mood: string;
    height?: string;
    weight?: string;
  }) => {
    if (!user) return;
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...profile })
      });
    } catch (error) {
      console.error('保存用户资料失败', error);
    }
  };

  const loadUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        setUserProfile(null);
        return;
      }
      const profile = await response.json();
      if (Object.keys(profile).length === 0) {
        setUserProfile(null);
        return;
      }
      setUserProfile(profile);
    } catch (error) {
      console.error('加载用户资料失败', error);
      setUserProfile(null);
    }
  };

  const updateProfileFromSettings = async (nextProfile: {
    name: string;
    goal: string;
    age: string;
    gender: string;
    dietStyle: string;
    mood: string;
    height?: string;
    weight?: string;
  }) => {
    if (!user) return;

    const nextUser = { ...user, name: nextProfile.name };
    const profilePayload = {
      goal: nextProfile.goal,
      age: nextProfile.age,
      gender: nextProfile.gender,
      dietStyle: nextProfile.dietStyle,
      mood: nextProfile.mood,
      height: nextProfile.height ?? '',
      weight: nextProfile.weight ?? ''
    };

    setUser(nextUser);
    setUserProfile(profilePayload);

    try {
      await Promise.all([
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, name: nextProfile.name })
        }),
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, ...profilePayload })
        })
      ]);
    } catch (error) {
      console.error('更新基础信息失败', error);
    }
  };

  const loadRecipeRecords = async (email: string) => {
    try {
      const response = await fetch(`/api/recipes?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        setRecipeRecords([]);
        return;
      }

      const records = await response.json();
      setRecipeRecords(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error('鍔犺浇椋熻氨璁板綍澶辫触', error);
      setRecipeRecords([]);
    }
  };

  const saveRecipeRecord = async (record: RecipeRecord) => {
    if (!user) return;

    setRecipeRecords((records) => [record, ...records]);

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, record })
      });

      if (!response.ok) {
        console.error('淇濆瓨椋熻氨璁板綍澶辫触', await response.json());
        setRecipeRecords((records) => records.filter((item) => item.id !== record.id));
      }
    } catch (error) {
      console.error('淇濆瓨椋熻氨璁板綍澶辫触', error);
      setRecipeRecords((records) => records.filter((item) => item.id !== record.id));
    }
  };

  const loadHealthGoals = async (email: string) => {
    try {
      const response = await fetch(`/api/goals?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        setHealthGoals([]);
        return;
      }

      const goals = await response.json();
      setHealthGoals(Array.isArray(goals) ? goals : []);
    } catch (error) {
      console.error('鍔犺浇鍋ュ悍鐩爣澶辫触', error);
      setHealthGoals([]);
    }
  };

  const addHealthGoal = async (goal: string) => {
    if (!user) return;
    const value = goal.trim();
    if (!value || healthGoals.includes(value)) return;

    setHealthGoals((current) => [...current, value]);

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, goal: value })
      });

      if (!response.ok) {
        setHealthGoals((current) => current.filter((item) => item !== value));
      }
    } catch (error) {
      console.error('淇濆瓨鍋ュ悍鐩爣澶辫触', error);
      setHealthGoals((current) => current.filter((item) => item !== value));
    }
  };

  const removeHealthGoal = async (goal: string) => {
    if (!user) return;
    setHealthGoals((current) => current.filter((item) => item !== goal));

    try {
      const response = await fetch(`/api/goals?email=${encodeURIComponent(user.email)}&goal=${encodeURIComponent(goal)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setHealthGoals((current) => current.includes(goal) ? current : [...current, goal]);
      }
    } catch (error) {
      console.error('鍒犻櫎鍋ュ悍鐩爣澶辫触', error);
      setHealthGoals((current) => current.includes(goal) ? current : [...current, goal]);
    }
  };

  const loadPreferences = async (email: string) => {
    try {
      const response = await fetch(`/api/preferences?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        setPreferences([]);
        return;
      }

      const loadedPreferences = await response.json();
      setPreferences(Array.isArray(loadedPreferences) ? loadedPreferences : []);
    } catch (error) {
      console.error('鍔犺浇楗鍋忓ソ澶辫触', error);
      setPreferences([]);
    }
  };

  const addPreference = async (preference: string) => {
    if (!user) return;
    const value = preference.trim();
    if (!value || preferences.includes(value)) return;

    setPreferences((current) => [...current, value]);

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, preference: value })
      });

      if (!response.ok) {
        setPreferences((current) => current.filter((item) => item !== value));
      }
    } catch (error) {
      console.error('淇濆瓨楗鍋忓ソ澶辫触', error);
      setPreferences((current) => current.filter((item) => item !== value));
    }
  };

  const removePreference = async (preference: string) => {
    if (!user) return;
    setPreferences((current) => current.filter((item) => item !== preference));

    try {
      const response = await fetch(
        `/api/preferences?email=${encodeURIComponent(user.email)}&preference=${encodeURIComponent(preference)}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        setPreferences((current) => current.includes(preference) ? current : [...current, preference]);
      }
    } catch (error) {
      console.error('鍒犻櫎楗鍋忓ソ澶辫触', error);
      setPreferences((current) => current.includes(preference) ? current : [...current, preference]);
    }
  };

  const handleOnboardingComplete = (profile: {
    goal: string;
    age: string;
    gender: string;
    dietStyle: string;
    mood: string;
  }) => {
    saveUserProfile(profile).catch((error) => console.error(error));
    addHealthGoal(profile.goal).catch((error) => console.error(error));
    setUserProfile(profile);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return (
          <Auth
            onLogin={(loginUser) => {
              setUser(loginUser);
              setIsNewUser(false);
              setRecipeRecords([]);
              setCurrentPage('home');
              loadUserProfile(loginUser.email);
              loadRecipeRecords(loginUser.email);
              loadHealthGoals(loginUser.email);
              loadPreferences(loginUser.email);
            }}
            onRegister={(newUser) => {
              setUser(newUser);
              setIsNewUser(true);
              setUserProfile(null);
              setRecipeRecords([]);
              setHealthGoals([]);
              setPreferences([]);
              setChatMessages([]);
              setCurrentPage('onboarding');
            }}
          />
        );
      case 'onboarding':
        if (!user) {
          return (
            <Auth
              onLogin={(loginUser) => {
                setUser(loginUser);
                setIsNewUser(false);
                setRecipeRecords([]);
                setCurrentPage('home');
                loadUserProfile(loginUser.email);
                loadRecipeRecords(loginUser.email);
                loadHealthGoals(loginUser.email);
                loadPreferences(loginUser.email);
              }}
              onRegister={(newUser) => {
                setUser(newUser);
                setIsNewUser(true);
                setUserProfile(null);
                setRecipeRecords([]);
                setHealthGoals([]);
                setPreferences([]);
                setChatMessages([]);
                setCurrentPage('onboarding');
              }}
            />
          );
        }
        return (
          <Onboarding
            userName={user?.name ?? '小伙伴'}
            chatMessages={chatMessages}
            onAppendChatMessages={appendChatMessages}
            onComplete={handleOnboardingComplete}
          />
        );
      case 'home':
        if (!user) {
          setCurrentPage('auth');
          return (
            <Auth
              onLogin={(loginUser) => {
                setUser(loginUser);
                setIsNewUser(false);
                setRecipeRecords([]);
                setCurrentPage('home');
                loadUserProfile(loginUser.email);
                loadRecipeRecords(loginUser.email);
                loadHealthGoals(loginUser.email);
                loadPreferences(loginUser.email);
              }}
              onRegister={(newUser) => {
                setUser(newUser);
                setIsNewUser(true);
                setUserProfile(null);
                setRecipeRecords([]);
                setHealthGoals([]);
                setPreferences([]);
                setChatMessages([]);
                setCurrentPage('onboarding');
              }}
            />
          );
        }
        return (
          <Home
            userEmail={user?.email}
            userName={user?.name}
            recipeRecords={recipeRecords}
            onAddRecipeRecord={saveRecipeRecord}
          />
        );
      case 'analysis':
        return <FoodAnalysis recipeRecords={recipeRecords} />;
      case 'tools':
        return (
          <Tools
            userEmail={user?.email}
            recipeRecordCount={recipeRecords.length}
            initialSection="overview"
            onNavigatePage={(page) => setCurrentPage(page)}
          />
        );
      case 'chat':
        return <MascotChat userEmail={user?.email} userName={user?.name} onBack={() => setCurrentPage('home')} />;
      case 'profile':
        return (
          <HealthProfile
            user={user}
            userProfile={userProfile}
            healthGoals={healthGoals}
            recipeRecordCount={recipeRecords.length}
            onAddHealthGoal={addHealthGoal}
            onUpdateProfile={updateProfileFromSettings}
            onLogout={handleLogout}
          />
        );
      case 'report':
        return (
          <Tools
            userEmail={user?.email}
            recipeRecordCount={recipeRecords.length}
            initialSection="weekly"
            onNavigatePage={(page) => setCurrentPage(page)}
          />
        );
      case 'settings':
        return <Settings onBack={() => setCurrentPage('tools')} onNavigatePage={(page) => setCurrentPage(page)} />;
      case 'preferences':
        return (
          <Preferences
            onBack={() => setCurrentPage('settings')}
            preferences={preferences}
            onAddPreference={addPreference}
            onRemovePreference={removePreference}
          />
        );
      case 'goals':
        return (
          <Goals
            onBack={() => setCurrentPage('settings')}
            goals={healthGoals}
            onAddGoal={addHealthGoal}
            onRemoveGoal={removeHealthGoal}
          />
        );
      default:
        if (!user) {
          setCurrentPage('auth');
          return (
            <Auth
              onLogin={(loginUser) => {
                setUser(loginUser);
                setIsNewUser(false);
                setRecipeRecords([]);
                setCurrentPage('home');
                loadUserProfile(loginUser.email);
                loadRecipeRecords(loginUser.email);
                loadHealthGoals(loginUser.email);
                loadPreferences(loginUser.email);
              }}
              onRegister={(newUser) => {
                setUser(newUser);
                setIsNewUser(true);
                setUserProfile(null);
                setRecipeRecords([]);
                setHealthGoals([]);
                setPreferences([]);
                setChatMessages([]);
                setCurrentPage('onboarding');
              }}
            />
          );
        }
        return (
          <Home
            userEmail={user?.email}
            userName={user?.name}
            recipeRecords={recipeRecords}
            onAddRecipeRecord={saveRecipeRecord}
          />
        );
    }
  };

  return (
    <div className="w-full h-full bg-[#F7FFF4] overflow-hidden flex flex-col text-[#111827]">
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} />}

      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>

      {currentPage !== 'chat' && currentPage !== 'auth' && currentPage !== 'onboarding' && <nav className="bg-[#FFFDF7]/96 border-t border-[rgba(76,203,99,0.14)] rounded-t-[30px] shadow-[0_-8px_24px_rgba(76,203,99,0.12)] backdrop-blur">
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
