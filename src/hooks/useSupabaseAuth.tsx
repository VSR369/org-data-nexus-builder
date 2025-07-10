
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  custom_user_id: string;
  organization_name: string;
  contact_person_name: string;
  organization_type: string;
  entity_type: string;
  country: string;
  industry_segment?: string;
  address?: string;
  phone_number?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, additionalData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with a slight delay to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error);
        return;
      }

      console.log('✅ Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUp = async (email: string, password: string, additionalData?: any) => {
    console.log('📝 Signing up user:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (!error && data.user && additionalData) {
      console.log('👤 Creating profile for user:', data.user.id);
      
      // Create profile record
      const customUserId = `ORG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          custom_user_id: customUserId,
          organization_name: additionalData.organizationName,
          organization_id: additionalData.organizationId,
          contact_person_name: additionalData.contactPersonName,
          organization_type: additionalData.organizationType,
          entity_type: additionalData.entityType,
          country: additionalData.country,
          country_code: additionalData.countryCode,
          industry_segment: additionalData.industrySegment,
          address: additionalData.address,
          phone_number: additionalData.phoneNumber,
          website: additionalData.website
        });

      if (profileError) {
        console.error('❌ Error creating profile:', profileError);
        return { error: profileError };
      }
      
      console.log('✅ Profile created successfully');
    }

    return { error };
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
};
