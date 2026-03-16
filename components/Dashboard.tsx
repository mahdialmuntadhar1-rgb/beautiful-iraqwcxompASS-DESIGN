import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus, 
  TrendingUp, 
  Award,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onBack?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onBack }) => {
  const { lang } = useTranslations();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'messages' | 'settings'>('overview');

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const stats = [
    { label: lang === 'en' ? 'Total Views' : 'إجمالي المشاهدات', value: '12.4K', icon: Users, color: 'text-blue-400' },
    { label: lang === 'en' ? 'Engagement' : 'التفاعل', value: '+18%', icon: TrendingUp, color: 'text-green-400' },
    { label: lang === 'en' ? 'Reviews' : 'التقييمات', value: '4.8', icon: Award, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-24" dir={dir}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-b from-[#d4af37]/10 to-transparent border-b border-white/5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-2 rounded-full bg-white/5 text-white">
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-white">
              {lang === 'en' ? 'Business Dashboard' : 'لوحة تحكم العمل'}
            </h1>
          </div>
          <button className="p-2 rounded-full bg-white/5 text-white">
            <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f4cf57] p-0.5">
            <img 
              src={user.avatar_url || 'https://ui-avatars.com/api/?name=Biz'} 
              className="w-full h-full rounded-[14px] object-cover border-2 border-[#0a0e1a]"
              alt="Avatar"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.display_name}</h2>
            <p className="text-[#e8dcc8]/40 text-xs uppercase tracking-widest">Platinum Partner</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 p-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
            <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-[10px] text-[#e8dcc8]/40 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Actions */}
      <div className="px-6 space-y-4">
        <button className="w-full bg-[#d4af37] text-[#0a0e1a] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20">
          <Plus size={20} />
          {lang === 'en' ? 'Create New Post' : 'إنشاء منشور جديد'}
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {[
            { label: lang === 'en' ? 'Manage Products' : 'إدارة المنتجات', icon: BarChart3 },
            { label: lang === 'en' ? 'Customer Reviews' : 'تقييمات العملاء', icon: MessageSquare },
            { label: lang === 'en' ? 'Promotions' : 'العروض الترويجية', icon: Award },
          ].map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all ${idx !== 2 ? 'border-b border-white/5' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/5 text-[#d4af37]">
                  <item.icon size={20} />
                </div>
                <span className="text-white font-medium">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Analytics Card */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[32px] p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white font-bold mb-1">{lang === 'en' ? 'Weekly Growth' : 'النمو الأسبوعي'}</h3>
            <p className="text-[#e8dcc8]/60 text-xs mb-4">{lang === 'en' ? 'Your business is trending!' : 'عملك في صعود!'}</p>
            <div className="flex items-end gap-2 h-20">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-1 bg-[#d4af37] rounded-t-sm opacity-80"
                />
              ))}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};
