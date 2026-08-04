import React from 'react';
import { Home, Info, Package, Building2, ChefHat, Mail } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = React.memo(({
  currentTab,
  setCurrentTab,
  lang
}) => {
  const t = TRANSLATIONS[lang].nav;

  const items = React.useMemo(() => [
    {
      id: 'home',
      label: t.home,
      icon: Home
    },
    {
      id: 'about',
      label: t.about,
      icon: Info
    },
    {
      id: 'products',
      label: t.products,
      icon: Package
    },
    {
      id: 'industrial',
      label: t.industrial,
      icon: Building2
    },
    {
      id: 'recipes',
      label: t.recipes,
      icon: ChefHat
    },
    {
      id: 'contact',
      label: t.contact,
      icon: Mail
    }
  ], [t]);

  const handleTabClick = (id: string) => {
    setCurrentTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fdfaf5] border-t border-[#e8dcc4] lg:hidden shadow-[0_-4px_16px_rgba(61,37,22,0.08)] px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#603813] font-bold'
                : 'text-[#8d6e63] hover:text-[#3d2516] font-medium'
            }`}
          >
            {/* Active Highlight Indicator Bar */}
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-1 bg-[#b05d2e] rounded-full" />
            )}

            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#603813]' : ''}`} />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
});
