import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from '../hooks/useTranslations';
import { governorates, madinatyCategories } from '../constants';
import { ChevronDown } from './icons';

interface MadinatyFiltersProps {
  selectedGovernorate: string;
  onGovernorateChange: (id: string) => void;
  selectedCategory: string;
  onCategoryChange: (id: string) => void;
  resultCount: number;
}

export const MadinatyFilters: React.FC<MadinatyFiltersProps> = ({
  selectedGovernorate,
  onGovernorateChange,
  selectedCategory,
  onCategoryChange,
  resultCount,
}) => {
  const { t, lang } = useTranslations();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentGov = governorates.find(g => g.id === selectedGovernorate) || governorates[0];

  return (
    <div className="px-4 py-4 space-y-4 bg-dark-bg">
      {/* Row 1: Governorate Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-[#d4af37]/30 rounded-xl text-[#e8dcc8] hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            📍 {currentGov.name[lang]}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0a0e1a] border border-[#d4af37]/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-2">
                {governorates.map((gov) => (
                  <button
                    key={gov.id}
                    onClick={() => {
                      onGovernorateChange(gov.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-6 py-3 transition-all duration-200 flex items-center justify-between group ${
                      selectedGovernorate === gov.id ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#e8dcc8]/80 hover:bg-white/5 hover:text-[#e8dcc8]'
                    }`}
                  >
                    <span className="font-medium">{gov.name[lang]}</span>
                    {selectedGovernorate === gov.id && <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Row 2: Category Pills */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 -mx-4 px-4">
        {madinatyCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f4cf57] text-[#0a0e1a] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                : 'bg-white/5 text-[#e8dcc8]/60 border border-white/10'
            }`}
          >
            <span className="mr-1">{cat.icon}</span>
            {t(cat.nameKey)}
          </button>
        ))}
      </div>

      {/* Result Count */}
      <div className="text-xs text-[#d4af37] font-medium px-1">
        {resultCount} {t('common.businessesFound')}
      </div>
    </div>
  );
};
