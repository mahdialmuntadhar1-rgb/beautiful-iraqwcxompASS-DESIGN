import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import type { TabType } from '../types';

interface MainTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslations();

  return (
    <div className="sticky top-[64px] z-40 bg-dark-bg/80 backdrop-blur-md border-b border-glass-border">
      <div className="flex max-w-md mx-auto">
        <button
          onClick={() => onTabChange('shakumaku')}
          className={`flex-1 py-4 text-center transition-all duration-200 relative ${
            activeTab === 'shakumaku' ? 'text-[#d4af37]' : 'text-[#e8dcc8]/40'
          }`}
        >
          <span className="text-lg font-medium">⚡ {t('common.shakumaku')}</span>
          {activeTab === 'shakumaku' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
          )}
        </button>
        <button
          onClick={() => onTabChange('madinaty')}
          className={`flex-1 py-4 text-center transition-all duration-200 relative ${
            activeTab === 'madinaty' ? 'text-[#d4af37]' : 'text-[#e8dcc8]/40'
          }`}
        >
          <span className="text-lg font-medium">🏙 {t('common.madinaty')}</span>
          {activeTab === 'madinaty' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
          )}
        </button>
      </div>
    </div>
  );
};
