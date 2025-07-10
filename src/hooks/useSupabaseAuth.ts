
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileData {
  custom_user_id: string;
  organization_name: string;
  organization_type: string;
  entity_type: string;
  industry_segment?: string;
  organization_id?: string;
  country: string;
  address?: string;
  website?: string;
  contact_person_name: string;
  phone_number?: string;
  country_code?: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Load user profile after authentication
          setTimeout(async () => {
            await loadUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
      console.log('✅ Profile loaded:', data?.custom_user_id);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email: string, password: string, profileData: ProfileData) => {
    console.log('📝 Starting Supabase signup for:', email);
    
    try {
      // Check if custom_user_id already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('custom_user_id')
        .eq('custom_user_id', profileData.custom_user_id)
        .maybeSingle();

      if (existingProfile) {
        throw new Error(`User ID "${profileData.custom_user_id}" is already taken. Please choose a different User ID.`);
      }

      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      console.log('✅ Supabase user created:', authData.user.id);

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          ...profileData
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile');
      }

      console.log('✅ Profile created successfully');

      toast.success('Registration Successful!', {
        description: `Welcome ${profileData.contact_person_name}! Please check your email to verify your account.`
      });

      return { success: true };

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      console.log('✅ Sign in successful');
      toast.success('Welcome back!');
      
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      toast.error(error.message || 'Sign in failed');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setProfile(null);
      toast.success('Signed out successfully');
      navigate('/');
      
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      toast.error('Sign out failed');
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    loadUserProfile
  };
};
