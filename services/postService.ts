import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  author_id: string;
  business_id?: string;
  content_en?: string;
  content_ar?: string;
  content_ku?: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  governorate: string;
  post_type: 'user' | 'business';
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  author?: {
    display_name: string;
    avatar_url?: string;
    role: string;
  };
  business?: {
    name_en: string;
    name_ar: string;
    name_ku: string;
    badge?: string;
    verified: boolean;
  };
}

export const postService = {
  async getPosts(governorate: string = 'all', type: 'all' | 'business' | 'people' = 'all', page: number = 0) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:users(display_name, avatar_url, role),
        business:businesses(name_en, name_ar, name_ku, badge, verified)
      `)
      .order('created_at', { ascending: false })
      .range(page * 10, (page + 1) * 10 - 1);

    if (governorate !== 'all') {
      query = query.eq('governorate', governorate);
    }

    if (type === 'business') {
      query = query.eq('post_type', 'business');
    } else if (type === 'people') {
      query = query.eq('post_type', 'user');
    }

    const { data, error } = await query;
    return { data: data as Post[] | null, error };
  },

  async createPost(post: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();
    return { data, error };
  },

  async toggleLike(postId: string, userId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (!error) {
        await supabase.rpc('decrement_like_count', { post_id: postId });
      }
      return { liked: false, error };
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId });
      
      if (!error) {
        await supabase.rpc('increment_like_count', { post_id: postId });
      }
      return { liked: true, error };
    }
  },

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async addComment(postId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, author_id: userId, content })
      .select()
      .single();
    
    if (!error) {
      await supabase.rpc('increment_comment_count', { post_id: postId });
    }
    return { data, error };
  }
};
