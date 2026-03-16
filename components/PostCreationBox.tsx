import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon, Video, MapPin, Send, RefreshCw } from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';
import { postService } from '../services/postService';

interface PostCreationBoxProps {
  governorate: string;
  onPostCreated: () => void;
}

export const PostCreationBox: React.FC<PostCreationBoxProps> = ({ governorate, onPostCreated }) => {
  const { lang, t } = useTranslations();
  const { user, isLoggedIn } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  const handleSubmit = async () => {
    if (!isLoggedIn || !user || !content.trim()) return;
    setIsSubmitting(true);
    
    const { error } = await postService.createPost({
      author_id: user.id,
      content_en: content, // For now just one field
      content_ar: content,
      content_ku: content,
      governorate: governorate === 'all' ? 'baghdad' : governorate,
      post_type: 'user',
    });

    setIsSubmitting(false);
    if (!error) {
      setContent('');
      onPostCreated();
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-[24px] p-4 mb-6 shadow-soft" dir={dir}>
      <div className="flex gap-3 mb-4">
        <img 
          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.display_name}&background=random`} 
          alt={user?.display_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={lang === 'en' ? `What's happening in ${governorate === 'all' ? 'Iraq' : governorate}?` : `ماذا يحدث في ${governorate === 'all' ? 'العراق' : governorate}؟`}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 resize-none py-2 text-sm min-h-[60px]"
        />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-1">
          <button className="p-2 rounded-full hover:bg-white/5 text-[#d4af37] transition-colors">
            <ImageIcon size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-[#d4af37] transition-colors">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-[#d4af37] transition-colors">
            <MapPin size={20} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-2 bg-[#d4af37] text-[#0a0e1a] px-5 py-2 rounded-full font-bold text-sm disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
          {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
          {lang === 'en' ? 'Post' : 'نشر'}
        </button>
      </div>
    </div>
  );
};
