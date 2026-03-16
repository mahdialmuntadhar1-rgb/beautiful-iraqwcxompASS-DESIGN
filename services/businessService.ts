import { supabase } from '../lib/supabase';

export interface Business {
  id: string;
  owner_id: string;
  name_en: string;
  name_ar: string;
  name_ku: string;
  category: string;
  subcategory?: string;
  governorate: string;
  address_en?: string;
  address_ar?: string;
  address_ku?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  description_en?: string;
  description_ar?: string;
  description_ku?: string;
  logo_url?: string;
  cover_url?: string;
  verified: boolean;
  badge?: 'platinum' | 'gold' | 'silver';
  rating: number;
  review_count: number;
  follower_count: number;
  created_at: string;
}

export const businessService = {
  async getBusinessById(id: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Business | null, error };
  },

  async getBusinessPosts(businessId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(display_name, avatar_url, role),
        business:businesses(name_en, name_ar, name_ku, badge, verified)
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async toggleFollow(businessId: string, userId: string) {
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single();

    if (existingFollow) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('business_id', businessId)
        .eq('user_id', userId);
      
      if (!error) {
        await supabase.rpc('decrement_follower_count', { business_id: businessId });
      }
      return { followed: false, error };
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({ business_id: businessId, user_id: userId });
      
      if (!error) {
        await supabase.rpc('increment_follower_count', { business_id: businessId });
      }
      return { followed: true, error };
    }
  },

  async isFollowing(businessId: string, userId: string) {
    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('business_id', businessId)
      .eq('user_id', userId)
      .single();
    return { following: !!data, error };
  }
};
