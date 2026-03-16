import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Filter, Star, Clock, Map as MapIcon, List } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { businesses } from '../constants';

interface SearchPageProps {
  onBusinessClick: (id: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onBusinessClick }) => {
  const { lang, t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeFilter, setActiveFilter] = useState('all');

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const filteredResults = businesses.filter(biz => {
    const matchesSearch = 
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (biz.nameAr && biz.nameAr.includes(searchQuery)) ||
      biz.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'top') return matchesSearch && biz.rating >= 4.5;
    if (activeFilter === 'open') return matchesSearch; // Placeholder for open status
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] px-4 pt-6 pb-24" dir={dir}>
      {/* Search Header */}
      <div className="sticky top-0 z-20 bg-[#0a0e1a]/80 backdrop-blur-md pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search for places, food, shops...' : 'ابحث عن أماكن، طعام، متاجر...'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-[#d4af37] focus:outline-none transition-all"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: lang === 'en' ? 'All' : 'الكل', icon: Filter },
            { id: 'top', label: lang === 'en' ? 'Top Rated' : 'الأعلى تقييماً', icon: Star },
            { id: 'open', label: lang === 'en' ? 'Open Now' : 'مفتوح الآن', icon: Clock },
            { id: 'near', label: lang === 'en' ? 'Near Me' : 'قريب مني', icon: MapPin },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                activeFilter === filter.id 
                ? 'bg-[#d4af37] text-[#0a0e1a] border-[#d4af37]' 
                : 'bg-white/5 text-white/60 border-white/10'
              }`}
            >
              <filter.icon size={14} />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold">
          {filteredResults.length} {lang === 'en' ? 'Results' : 'نتائج'}
        </h2>
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#d4af37] text-[#0a0e1a]' : 'text-white/40'}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-[#d4af37] text-[#0a0e1a]' : 'text-white/40'}`}
          >
            <MapIcon size={20} />
          </button>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredResults.map((biz, idx) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onBusinessClick(biz.id)}
              className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${biz.id}/200/200`} 
                  alt={biz.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold">
                    {lang === 'en' ? biz.name : lang === 'ar' ? (biz.nameAr || biz.name) : (biz.nameKu || biz.name)}
                  </h3>
                  <div className="flex items-center gap-1 text-[#d4af37]">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{biz.rating}</span>
                  </div>
                </div>
                <p className="text-[#e8dcc8]/40 text-xs mt-1">{biz.category} • {biz.governorate}</p>
                <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold mt-2 uppercase tracking-wider">
                  <Clock size={10} />
                  {lang === 'en' ? 'Open Now' : 'مفتوح الآن'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-3xl h-[500px] flex flex-col items-center justify-center text-center p-10 space-y-4">
          <div className="w-20 h-20 bg-[#d4af37]/20 rounded-full flex items-center justify-center text-[#d4af37]">
            <MapIcon size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">Map View</h3>
          <p className="text-[#e8dcc8]/40 text-sm">
            Interactive map coming soon. You'll be able to explore Iraq's best spots geographically.
          </p>
        </div>
      )}
    </div>
  );
};
