import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, RefreshCw } from 'lucide-react';
import { Post, postService } from '../services/postService';
import { useTranslations } from '../hooks/useTranslations';
import { useAuth } from '../hooks/useAuth';

interface CommentSheetProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ post, isOpen, onClose }) => {
  const { lang } = useTranslations();
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dir = lang === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    if (isOpen && post) {
      fetchComments();
    }
  }, [isOpen, post]);

  const fetchComments = async () => {
    if (!post) return;
    setIsLoading(true);
    const { data, error } = await postService.getComments(post.id);
    setIsLoading(false);
    if (!error && data) {
      setComments(data);
    }
  };

  const handleSubmit = async () => {
    if (!post || !user || !newComment.trim()) return;
    setIsSubmitting(true);
    const { data, error } = await postService.addComment(post.id, user.id, newComment);
    setIsSubmitting(false);
    if (!error && data) {
      setNewComment('');
      setComments([{ ...data, author: { display_name: user.display_name, avatar_url: user.avatar_url } }, ...comments]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && post && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[130]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[140] bg-[#0a0e1a] border-t border-white/10 rounded-t-[32px] flex flex-col max-h-[90vh]"
            dir={dir}
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/5">
              <div className="w-12 h-1 bg-white/20 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
              <h3 className="text-lg font-bold text-white">
                {lang === 'en' ? 'Comments' : lang === 'ar' ? 'التعليقات' : 'کۆمێنتەکان'}
              </h3>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/60">
                <X size={20} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-[300px]">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="animate-spin text-[#d4af37]" size={24} />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-10 text-[#e8dcc8]/40">
                  {lang === 'en' ? 'No comments yet. Be the first!' : 'لا توجد تعليقات بعد. كن أول من يعلق!'}
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      src={comment.author?.avatar_url || `https://ui-avatars.com/api/?name=${comment.author?.display_name}&background=random`} 
                      alt={comment.author?.display_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-white/5 rounded-2xl p-3">
                        <div className="font-bold text-white text-sm mb-1">{comment.author?.display_name}</div>
                        <p className="text-[#e8dcc8]/80 text-sm">{comment.content}</p>
                      </div>
                      <div className="text-[10px] text-[#e8dcc8]/40 mt-1 px-2">
                        {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-[#0a0e1a] pb-8">
              {isLoggedIn ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={lang === 'en' ? 'Write a comment...' : 'اكتب تعليقاً...'}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#d4af37] focus:outline-none transition-all"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !newComment.trim()}
                    className="p-3 rounded-xl bg-[#d4af37] text-[#0a0e1a] disabled:opacity-50 transition-all"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-[#e8dcc8]/60 text-sm mb-2">
                    {lang === 'en' ? 'Sign in to join the conversation' : 'سجل الدخول للانضمام إلى المحادثة'}
                  </p>
                  <button className="text-[#d4af37] font-bold hover:underline">
                    {lang === 'en' ? 'Sign In' : 'تسجيل الدخول'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
