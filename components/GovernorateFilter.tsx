import React from 'react';
import { governorates } from '../constants';
import { useTranslations } from '../hooks/useTranslations';
import { Globe } from './icons';

interface GovernorateFilterProps {
    selectedGovernorate: string;
    onGovernorateChange: (governorateId: string) => void;
    onSearchGovernorate: () => void;
}

export const GovernorateFilter: React.FC<GovernorateFilterProps> = ({ selectedGovernorate, onGovernorateChange, onSearchGovernorate }) => {
    const { t } = useTranslations();
    const selectedGovernorateName = governorates.find((gov) => gov.id === selectedGovernorate);
    
    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-md mx-auto">
                 <label htmlFor="governorate-select" className="sr-only">{t('filter.governorate')}</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <Globe className="w-5 h-5 text-white/50" />
                    </div>
                    <select
                        id="governorate-select"
                        value={selectedGovernorate}
                        onChange={(e) => onGovernorateChange(e.target.value)}
                        className="w-full ps-10 p-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white outline-none appearance-none focus:border-primary transition-colors"
                    >
                        {governorates.map(gov => (
                            <option key={gov.id} value={gov.id} className="bg-dark-bg">
                                {t(gov.nameKey)}
                            </option>
                        ))}
                    </select>
                 </div>
                 {selectedGovernorate !== 'all' && (
                    <button
                        onClick={onSearchGovernorate}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-teal-500/30 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Show businesses in {selectedGovernorateName ? t(selectedGovernorateName.nameKey) : selectedGovernorate}
                    </button>
                 )}
            </div>
        </div>
    );
};
