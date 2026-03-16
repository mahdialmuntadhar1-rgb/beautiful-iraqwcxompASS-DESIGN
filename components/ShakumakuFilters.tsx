import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { governorates } from '../constants';

interface ShakumakuFiltersProps {
  selectedGovernorate: string;
  onGovernorateChange: (id: string) => void;
  feedFilter: 'all' | 'business' | 'people';
  onFeedFilterChange: (filter: 'all' | 'business' | 'people') => void;
}

export const ShakumakuFilters: React.FC<ShakumakuFiltersProps> = ({
  selectedGovernorate,
  onGovernorateChange,
  feedFilter,
  onFeedFilterChange,
}) => {
  const { t, lang } = useTranslations();

  const currentGov = governorates.find(g => g.id === selectedGovernorate) || governorates[0];

  return (
    <div className="px-4 py-4 space-y-4 bg-dark-bg">
      {/* Governorate Strip */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[#e8dcc8]/60 px-1">
          {t('common.whatsHappeningIn')} <span className="text-[#d4af37]">{currentGov.name[lang]}</span>
        </h3>
        <div className="flex overflow-x-auto scrollbar-hide gap-2 -mx-4 px-4">
          {governorates.map((gov) => (
            <button
              key={gov.id}
              onClick={() => onGovernorateChange(gov.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedGovernorate === gov.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#f4cf57] text-[#0a0e1a] shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-chip-pulse'
                  : 'bg-white/5 text-[#e8dcc8]/60'
              }`}
            >
              {gov.id === 'all' ? '🌍' : ''} {gov.name[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Filter Toggle */}
      <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
        <button
          onClick={() => onFeedFilterChange('all')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            feedFilter === 'all' ? 'bg-[#d4af37] text-[#0a0e1a]' : 'text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60'
          }`}
        >
          {t('shakumaku.filters.allPosts')}
        </button>
        <button
          onClick={() => onFeedFilterChange('business')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            feedFilter === 'business' ? 'bg-[#d4af37] text-[#0a0e1a]' : 'text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60'
          }`}
        >
          🏢 {t('shakumaku.filters.businesses')}
        </button>
        <button
          onClick={() => onFeedFilterChange('people')}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            feedFilter === 'people' ? 'bg-[#d4af37] text-[#0a0e1a]' : 'text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60'
          }`}
        >
          👤 {t('shakumaku.filters.people')}
        </button>
      </div>
    </div>
  );
};
