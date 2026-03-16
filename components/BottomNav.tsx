import React from 'react';
import { Home, MapPin, Search, User } from './icons';
import { useTranslations } from '../hooks/useTranslations';

interface BottomNavProps {
  activeTab: 'feed' | 'city' | 'search' | 'profile';
  onTabChange: (tab: 'feed' | 'city' | 'search' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslations();

  const navItems = [
    { id: 'feed', icon: <Home />, labelKey: 'nav.feed' },
    { id: 'city', icon: <MapPin />, labelKey: 'nav.city' },
    { id: 'search', icon: <Search />, labelKey: 'nav.search' },
    { id: 'profile', icon: <User />, labelKey: 'nav.profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-xl border-t border-white/5 pb-safe">
      <div className="max-w-[480px] mx-auto flex items-center justify-around py-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === item.id ? 'text-[#d4af37]' : 'text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all duration-300 ${
              activeTab === item.id ? 'bg-[#d4af37]/10 scale-110' : ''
            }`}>
              {React.cloneElement(item.icon as React.ReactElement, {
                className: "w-6 h-6",
                strokeWidth: activeTab === item.id ? 2.5 : 2
              })}
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase">
              {t(item.labelKey)}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};
