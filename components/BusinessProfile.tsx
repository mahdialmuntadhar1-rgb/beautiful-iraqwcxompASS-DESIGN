import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Globe, 
  MessageCircle, 
  Share2, 
  Star,
  Users,
  Calendar,
  Info,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';
import { Business, businessService } from '../services/businessService';
import { PostCard } from './PostCard';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

interface BusinessProfileProps {
  businessId: string;
  onBack: () => void;
}

export const BusinessProfile: React.FC<BusinessProfileProps> = ({ businessId, onBack }) => {
  const { lang, t } = useTranslations();
  const { user, isLoggedIn } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'info' | 'photos'>('posts');
  const [isLoading, setIsLoading] = useState(true);

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    setIsLoading(true);
    const [bizRes, postsRes] = await Promise.all([
      businessService.getBusinessById(businessId),
      businessService.getBusinessPosts(businessId)
    ]);

    if (bizRes.data) {
      setBusiness(bizRes.data);
      if (user) {
        const { following } = await businessService.isFollowing(businessId, user.id);
        setIsFollowing(following);
      }
    }
    if (postsRes.data) {
      setPosts(postsRes.data);
    }
    setIsLoading(false);
  };

  const handleFollow = async () => {
    if (!isLoggedIn || !user || !business) return;
    const { followed, error } = await businessService.toggleFollow(business.id, user.id);
    if (!error) {
      setIsFollowing(followed);
      setBusiness({
        ...business,
        follower_count: followed ? business.follower_count + 1 : business.follower_count - 1
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-[#0a0e1a] pb-20" dir={dir}>
      {/* Header / Cover */}
      <div className="relative h-[240px]">
        <img 
          src={business.cover_url || 'https://picsum.photos/seed/iraq-biz/800/400'} 
          className="w-full h-full object-cover"
          alt="Cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] to-transparent" />
        
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10"
        >
          <ArrowLeft size={24} />
        </button>

        <button className="absolute top-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
          <Share2 size={24} />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-16 relative z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="w-32 h-32 rounded-[32px] p-1 bg-gradient-to-br from-[#d4af37] to-[#f4cf57] shadow-xl">
            <img 
              src={business.logo_url || `https://ui-avatars.com/api/?name=${business.name_en}&background=random`} 
              className="w-full h-full rounded-[28px] object-cover border-4 border-[#0a0e1a]"
              alt="Logo"
            />
          </div>
          <div className="flex gap-2 mb-2">
            <button 
              onClick={handleFollow}
              className={`px-6 py-2.5 rounded-full font-bold transition-all ${isFollowing ? 'bg-white/10 text-white border border-white/20' : 'bg-[#d4af37] text-[#0a0e1a]'}`}
            >
              {isFollowing ? (lang === 'en' ? 'Following' : 'متابع') : (lang === 'en' ? 'Follow' : 'متابعة')}
            </button>
            <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white">
              <MessageCircle size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              {business[`name_${lang}` as keyof Business] as string || business.name_en}
            </h1>
            {business.verified && <CheckCircle2 size={20} className="text-blue-400" />}
          </div>
          <p className="text-[#e8dcc8]/60 text-sm flex items-center gap-1">
            <MapPin size={14} />
            {business.governorate} • {business.category}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-6 py-4 border-y border-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{business.follower_count}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#e8dcc8]/40">{lang === 'en' ? 'Followers' : 'متابعون'}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white flex items-center gap-1">
              {business.rating} <Star size={14} fill="#d4af37" className="text-[#d4af37]" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#e8dcc8]/40">{business.review_count} {lang === 'en' ? 'Reviews' : 'تقييمات'}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{posts.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-[#e8dcc8]/40">{lang === 'en' ? 'Posts' : 'منشورات'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <a href={`tel:${business.phone}`} className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl text-white font-medium">
            <Phone size={18} />
            {lang === 'en' ? 'Call' : 'اتصال'}
          </a>
          <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3 rounded-2xl text-white font-medium">
            <Globe size={18} />
            {lang === 'en' ? 'Website' : 'الموقع'}
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-white/5">
          {[
            { id: 'posts', label: lang === 'en' ? 'Posts' : 'المنشورات', icon: LayoutGrid },
            { id: 'info', label: lang === 'en' ? 'Info' : 'معلومات', icon: Info },
            { id: 'photos', label: lang === 'en' ? 'Photos' : 'الصور', icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-[#d4af37]' : 'text-[#e8dcc8]/40'}`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="biz-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-10 text-[#e8dcc8]/40">
                  {lang === 'en' ? 'No posts yet' : 'لا توجد منشورات بعد'}
                </div>
              ) : (
                posts.map(post => (
                  <PostCard key={post.id} post={post} onCommentClick={() => {}} />
                ))
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Info size={18} className="text-[#d4af37]" />
                  {lang === 'en' ? 'About' : 'عن العمل'}
                </h3>
                <p className="text-[#e8dcc8]/80 text-sm leading-relaxed">
                  {business[`description_${lang}` as keyof Business] as string || business.description_en || 'No description available.'}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-[#d4af37]" />
                  {lang === 'en' ? 'Opening Hours' : 'ساعات العمل'}
                </h3>
                <div className="space-y-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-[#e8dcc8]/60">{day}</span>
                      <span className="text-white font-medium">09:00 AM - 10:00 PM</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                  <img 
                    src={`https://picsum.photos/seed/biz-photo-${i}/300/300`} 
                    className="w-full h-full object-cover"
                    alt="Gallery"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
