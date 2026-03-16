import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, Send, CheckCircle2, MapPin, MoreHorizontal } from 'lucide-react';
import { Post, postService } from '../services/postService';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

interface PostCardProps {
  post: Post;
  onCommentClick: (post: Post) => void;
  onBusinessClick?: (businessId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onCommentClick, onBusinessClick }) => {
  const { lang } = useTranslations();
  const { user, isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState(false); // Should ideally come from a separate check or join
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [isExpanded, setIsExpanded] = useState(false);

  const dir = lang === 'en' ? 'ltr' : 'rtl';
  const content = post[`content_${lang}` as keyof Post] as string || post.content_en || '';
  
  const handleLike = async () => {
    if (!isLoggedIn || !user) return;
    const { liked, error } = await postService.toggleLike(post.id, user.id);
    if (!error) {
      setIsLiked(liked);
      setLikeCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'platinum': return 'bg-blue-100 text-blue-800';
      case 'gold': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-200 text-gray-800';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const timeAgo = new Date(post.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'ar' ? 'ar-EG' : 'ku-IQ', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-[20px] overflow-hidden shadow-soft mb-4"
      dir={dir}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div 
            className={`w-[52px] h-[52px] rounded-full p-0.5 cursor-pointer ${post.post_type === 'business' ? 'bg-gradient-to-br from-[#d4af37] to-[#f4cf57]' : 'bg-white/10'}`}
            onClick={() => post.business_id && onBusinessClick?.(post.business_id)}
          >
            <img 
              src={post.author?.avatar_url || `https://ui-avatars.com/api/?name=${post.author?.display_name}&background=random`} 
              alt={post.author?.display_name}
              className="w-full h-full rounded-full object-cover border-2 border-[#0a0e1a]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span 
                className="font-bold text-white cursor-pointer hover:text-[#d4af37] transition-colors"
                onClick={() => post.business_id && onBusinessClick?.(post.business_id)}
              >
                {post.post_type === 'business' ? post.business?.[`name_${lang}` as keyof typeof post.business] : post.author?.display_name}
              </span>
              {post.business?.verified && <CheckCircle2 size={14} className="text-blue-400" />}
              {post.business?.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${getBadgeColor(post.business.badge)}`}>
                  {post.business.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#e8dcc8]/40 text-xs mt-0.5">
              <MapPin size={10} />
              <span className="capitalize">{post.governorate}</span>
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="text-white/40 p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className={`text-white/90 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {content}
        </p>
        {content.length > 120 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#d4af37] text-sm font-medium mt-1"
          >
            {isExpanded ? (lang === 'en' ? 'Show less' : 'عرض أقل') : (lang === 'en' ? 'Read more...' : 'اقرأ المزيد...')}
          </button>
        )}
      </div>

      {/* Media */}
      {post.media_url && (
        <div className="px-4 pb-4">
          <div className="rounded-2xl overflow-hidden bg-white/5 aspect-video relative">
            <img 
              src={post.media_url} 
              alt="Post media" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Engagement Bar */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-white/60 hover:text-red-500'}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>
          <button 
            onClick={() => onCommentClick(post)}
            className="flex items-center gap-1.5 text-white/60 hover:text-[#d4af37] transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{post.comment_count}</span>
          </button>
          <button className="flex items-center gap-1.5 text-white/60 hover:text-[#d4af37] transition-colors">
            <Share2 size={20} />
            <span className="text-sm font-medium">{post.share_count}</span>
          </button>
        </div>
        
        {post.post_type === 'business' && (
          <button className="flex items-center gap-1.5 text-green-500 font-bold text-sm bg-green-500/10 px-3 py-1.5 rounded-full">
            <Send size={16} />
            WhatsApp
          </button>
        )}
      </div>
    </motion.div>
  );
};
