import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { categories, governorates } from '../constants';
import type { Business } from '../types';
import { Star, Grid3x3, List, MapPin, ArrowLeft } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { GlassCard } from './GlassCard';
import { supabase } from '../lib/supabase';

const PAGE_SIZE = 50;

interface BusinessCardProps {
  business: Business;
  viewMode: 'grid' | 'list';
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode }) => {
  const { t, lang } = useTranslations();

  const displayName = lang === 'ar' && business.nameAr ? business.nameAr :
                      lang === 'ku' && business.nameKu ? business.nameKu :
                      business.name;

  const phone = business.phone?.trim();

  if (viewMode === 'list') {
    return (
      <GlassCard className="p-4 flex gap-4 text-start rtl:text-right">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">{displayName}</h3>
          <p className="text-white/60 text-sm mb-2">{t(categories.find(c => c.id === business.category)?.nameKey || business.category)}</p>
          <div className="flex items-center gap-2 text-sm mb-3">
            <div className="flex items-center gap-1 text-white/70"><MapPin className="w-4 h-4" />{business.city || business.governorate || 'Iraq'}</div>
          </div>
          {phone ? (
            <a href={`tel:${phone}`} className="text-teal-400 hover:underline">{phone}</a>
          ) : (
            <span className="text-gray-500 italic text-sm">Phone not available</span>
          )}
          <div className="mt-2">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${phone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'}`}>
              {phone ? '✓ Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden group text-start p-0">
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2">{displayName}</h3>
        <p className="text-white/60 text-sm mb-2">{t(categories.find(c => c.id === business.category)?.nameKey || business.category)}</p>
        <div className="flex items-center gap-1 text-white/60 text-sm mb-3"><MapPin className="w-4 h-4" />{business.city || business.governorate || 'Iraq'}</div>
        {phone ? (
          <a href={`tel:${phone}`} className="text-teal-400 hover:underline">{phone}</a>
        ) : (
          <span className="text-gray-500 italic text-sm">Phone not available</span>
        )}
        <div className="mt-3">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${phone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-300'}`}>
            {phone ? '✓ Verified' : 'Unverified'}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

interface BusinessDirectoryProps {
  initialFilter?: { categoryId: string };
  onBack?: () => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ initialFilter, onBack }) => {
  const [filters, setFilters] = useState({
    category: initialFilter?.categoryId || 'all',
    governorate: 'all',
    rating: 0,
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    setFilters(prev => ({ ...prev, category: initialFilter?.categoryId || 'all' }));
  }, [initialFilter]);

  const loadBusinesses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    let query = supabase
      .from('directory')
      .select('id, name, city, governorate, category, phone, lat, lng', { count: 'exact' });

    if (filters.governorate !== 'all') {
      query = query.eq('governorate', filters.governorate);
    }

    if (filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error: fetchError, count } = await query.range(from, to);

    if (fetchError) {
      setError(fetchError.message);
      setBusinesses([]);
      setTotalCount(0);
    } else {
      setBusinesses((data ?? []).map((business) => ({
        ...business,
        rating: 0,
      })) as Business[]);
      setTotalCount(count ?? 0);
    }

    setIsLoading(false);
  }, [filters.category, filters.governorate, page]);

  useEffect(() => {
    setPage(0);
  }, [filters.category, filters.governorate]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => business.rating >= filters.rating);
  }, [businesses, filters.rating]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center relative mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute start-0 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">{t('header.backToHome')}</span>
            </button>
          )}
          <h2 className="text-3xl font-bold text-white text-center">{t('directory.title')}</h2>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4 text-start rtl:text-right">
            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-between">{t('directory.filters')}<button onClick={() => setFilters({ category: 'all', governorate: 'all', rating: 0 })} className="text-xs text-secondary hover:text-secondary/80">{t('directory.reset')}</button></h3>
              <div className="mb-6">
                <label className="block text-white/80 text-sm mb-2">{t('directory.category')}</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white outline-none appearance-none bg-no-repeat bg-right-4" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'left 0.75rem center', backgroundSize: '1.5em 1.5em' }}>
                  <option value="all" className="bg-dark-bg">{t('directory.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-dark-bg">{t(category.nameKey)}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-white/80 text-sm mb-2">{t('filter.governorate')}</label>
                <select value={filters.governorate} onChange={(e) => setFilters({ ...filters, governorate: e.target.value })} className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white outline-none">
                  {governorates.map((gov) => (
                    <option key={gov.id} value={gov.id === 'all' ? 'all' : t(gov.nameKey)} className="bg-dark-bg">
                      {t(gov.nameKey)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/80 text-sm mb-2 block">{t('directory.minimumRating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} onClick={() => setFilters({ ...filters, rating })} className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${filters.rating >= rating ? 'bg-gradient-to-br from-accent to-primary' : 'backdrop-blur-xl bg-white/10 hover:bg-white/20'}`}>
                      <Star className={`w-5 h-5 ${filters.rating >= rating ? 'text-white fill-white' : 'text-white/50'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/80">{totalCount} {t('directory.businessesFound')}</p>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary' : 'hover:bg-white/10'}`}><Grid3x3 className="w-5 h-5 text-white" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary' : 'hover:bg-white/10'}`}><List className="w-5 h-5 text-white" /></button>
              </div>
            </div>
            {isLoading && <p className="text-white/70 mb-4">Loading businesses...</p>}
            {error && <p className="text-red-300 mb-4">{error}</p>}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredBusinesses.map((business) => (<BusinessCard key={business.id} business={business} viewMode={viewMode} />))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-white/80">
              <button disabled={page === 0} onClick={() => setPage((prev) => Math.max(0, prev - 1))} className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-50">Previous</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))} className="px-4 py-2 rounded-lg bg-white/10 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
