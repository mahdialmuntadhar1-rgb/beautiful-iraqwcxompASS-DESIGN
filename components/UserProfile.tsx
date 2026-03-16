import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, MapPin, LogOut, Briefcase, Heart, Edit2, ChevronRight } from 'lucide-react';
import { User } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface UserProfileProps {
  user: User;
  onSignOut: () => void;
  onEdit: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut, onEdit }) => {
  const { t, lang } = useTranslations();
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const stats = [
    { label: lang === 'en' ? 'My Posts' : lang === 'ar' ? 'منشوراتي' : 'پۆستەکانم', value: '0', icon: <Edit2 size={18} /> },
    { label: lang === 'en' ? 'Following' : lang === 'ar' ? 'أتابع' : 'فۆڵۆو دەکەم', value: '0', icon: <Heart size={18} /> },
  ];

  return (
    <div className="px-6 py-8 space-y-8" dir={dir}>
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4cf57] p-1 shadow-glow">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.display_name} className="w-full h-full rounded-full object-cover border-2 border-[#0a0e1a]" />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0f1628] flex items-center justify-center text-2xl font-bold text-[#d4af37]">
                {user.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button onClick={onEdit} className="absolute bottom-0 right-0 p-2 rounded-full bg-[#d4af37] text-[#0a0e1a] border-2 border-[#0a0e1a] shadow-lg">
            <Edit2 size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user.display_name}</h2>
          <div className="flex items-center justify-center gap-1 text-[#e8dcc8]/60 text-sm mt-1">
            <MapPin size={14} />
            <span className="capitalize">{user.governorate || 'Sulaymaniyah'}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-1">
            <div className="text-[#d4af37] flex justify-center mb-1">{stat.icon}</div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[#e8dcc8]/40 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        {user.role === 'business_owner' && (
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] group transition-all">
            <div className="flex items-center gap-3">
              <Briefcase size={20} />
              <span className="font-bold">{lang === 'en' ? 'My Business' : lang === 'ar' ? 'عملي التجاري' : 'کارەکەم'}</span>
            </div>
            <ChevronRight size={20} className={`opacity-40 group-hover:opacity-100 transition-all ${lang !== 'en' ? 'rotate-180' : ''}`} />
          </button>
        )}

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-accent group hover:bg-accent/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span className="font-bold">{t('header.logout')}</span>
          </div>
          <ChevronRight size={20} className={`opacity-40 group-hover:opacity-100 transition-all ${lang !== 'en' ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
