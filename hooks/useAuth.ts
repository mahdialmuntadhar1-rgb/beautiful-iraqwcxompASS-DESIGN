import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user doesn't exist in public table yet, we might need to create it
        // but typically this should be handled by a trigger or after signup
      } else if (data) {
        setUser(data as User);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(phone: string) {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    return { error };
  }

  async function verifyOtp(phone: string, token: string, displayName: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (data.session) {
      // Check if user exists in public table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.session.user.id)
        .single();

      if (!existingUser) {
        // Create public user record
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.session.user.id,
            phone: phone,
            display_name: displayName,
            role: 'user',
          });
        
        if (insertError) console.error('Error creating public user:', insertError);
      }
      
      await fetchUserProfile(data.session.user.id);
    }

    return { error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    user,
    isLoggedIn,
    loading,
    signIn,
    verifyOtp,
    signOut,
  };
}
