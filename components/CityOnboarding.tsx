import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { governorates } from '../constants';

interface CityOnboardingProps {
  onComplete: (city: string, lang: 'en' | 'ar' | 'ku') => void;
}

export const CityOnboarding: React.FC<CityOnboardingProps> = ({ onComplete }) => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'ar' | 'ku'>('en');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    // Save to localStorage immediately as per prompt
    localStorage.setItem('iraq_compass_city', cityId);
    localStorage.setItem('iraq_compass_lang', selectedLang);
    
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onComplete(cityId, selectedLang);
      }, 400);
    }, 400);
  };

  const taglines = {
    en: "Where do you want to discover?",
    ar: "أين تريد أن تكتشف؟",
    ku: "دەتەوێت لەکوێ بدۆزیتەوە؟"
  };

  const exploreAll = {
    en: "I'll explore all of Iraq",
    ar: "سأستكشف كل العراق",
    ku: "هەموو عێراق دەگەڕێم"
  };

  const cityData: Record<string, { emoji: string; gov: Record<string, string> }> = {
    sulaymaniyah: { emoji: '🏙', gov: { en: 'Sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی' } },
    erbil: { emoji: '🌆', gov: { en: 'Erbil', ar: 'أربيل', ku: 'هەولێر' } },
    baghdad: { emoji: '🌃', gov: { en: 'Baghdad', ar: 'بغداد', ku: 'بەغدا' } },
    basra: { emoji: '🌊', gov: { en: 'Basra', ar: 'البصرة', ku: 'بەسرە' } },
    duhok: { emoji: '🏔', gov: { en: 'Duhok', ar: 'دهوك', ku: 'دهۆک' } },
    kirkuk: { emoji: '⛽', gov: { en: 'Kirkuk', ar: 'كركوك', ku: 'کەرکووک' } },
    najaf: { emoji: '🕌', gov: { en: 'Najaf', ar: 'النجف', ku: 'نەجەف' } },
    karbala: { emoji: '🕍', gov: { en: 'Karbala', ar: 'كربلاء', ku: 'کەربەلا' } },
    mosul: { emoji: '🏛', gov: { en: 'Mosul', ar: 'الموصل', ku: 'مووسڵ' } },
    anbar: { emoji: '🌴', gov: { en: 'Anbar', ar: 'الأنبار', ku: 'ئەنبار' } },
  };

  const citiesToShow = governorates.filter(g => g.id !== 'all' && cityData[g.id]);

  // Direction based on selected language
  const dir = selectedLang === 'en' ? 'ltr' : 'rtl';

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0a0e1a] overflow-y-auto"
          dir={dir}
        >
          <div className="max-w-[480px] mx-auto w-full px-6 py-12 flex flex-col items-center min-h-full">
            {/* Logo & Tagline */}
            <div className="text-center mb-10 mt-8">
              <motion.h1 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-[#d4af37] mb-2 tracking-tighter"
              >
                IRAQ COMPASS
              </motion.h1>
              <motion.p 
                key={selectedLang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#e8dcc8] opacity-80 text-lg"
              >
                {taglines[selectedLang]}
              </motion.p>
            </div>

            {/* Language Selector */}
            <div className="flex gap-3 mb-10">
              {(['en', 'ar', 'ku'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-6 py-2 rounded-full border transition-all font-medium ${
                    selectedLang === lang
                      ? 'bg-[#d4af37] text-[#0a0e1a] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                      : 'bg-white/5 text-[#e8dcc8] border-white/10 hover:border-white/30'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'ar' ? 'AR' : 'KU'}
                </button>
              ))}
            </div>

            {/* City Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              {citiesToShow.map((city, index) => (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCitySelect(city.id)}
                  className={`relative p-5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center min-h-[130px] group ${
                    selectedCity === city.id
                      ? 'bg-[#d4af37]/20 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.3)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {cityData[city.id].emoji}
                  </span>
                  <span className={`text-base font-bold leading-tight ${selectedCity === city.id ? 'text-[#d4af37]' : 'text-[#e8dcc8]'}`}>
                    {city.name[selectedLang]}
                  </span>
                  <span className="text-[10px] text-[#e8dcc8]/40 uppercase tracking-widest mt-1">
                    {cityData[city.id].gov[selectedLang]}
                  </span>
                  
                  {selectedCity === city.id && (
                    <motion.div
                      layoutId="glow"
                      className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explore All */}
            <button
              onClick={() => handleCitySelect('all')}
              className="text-[#d4af37] hover:underline transition-all opacity-70 hover:opacity-100 mb-12 text-sm font-medium tracking-wide"
            >
              {exploreAll[selectedLang]}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
