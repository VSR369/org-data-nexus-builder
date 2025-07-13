
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
    console.log('🔐 Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User authenticated, fetching profile...');
          // Fetch user profile with a slight delay to avoid issues
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
          console.log('👤 User signed out, clearing profile');
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    console.log('🔍 Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ Error getting session:', error);
      } else {
        console.log('🔐 Initial session check:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🔐 Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      
      // First try to get from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileError) {
        console.log('✅ Profile fetched from profiles table:', {
          name: profileData.contact_person_name,
          organization: profileData.organization_name,
          email: profileData.id
        });
        setProfile(profileData);
        return;
      }

      // If no profile found, try to get from organizations table and create profile
      console.log('ℹ️ No profile found, checking organizations table...');
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select(`
          *,
          organization_types:master_organization_types(name),
          entity_types:master_entity_types(name),
          countries:master_countries(name),
          industry_segments:master_industry_segments(name)
        `)
        .eq('user_id', userId)
        .single();

      if (orgData && !orgError) {
        console.log('✅ Organization data found, creating profile structure:', {
          name: orgData.contact_person_name,
          organization: orgData.organization_name
        });
        
        // Create a profile-like structure from organization data
        const profileFromOrg = {
          id: userId,
          custom_user_id: orgData.organization_id,
          organization_name: orgData.organization_name,
          organization_id: orgData.organization_id,
          contact_person_name: orgData.contact_person_name,
          organization_type: orgData.organization_types?.name || 'Unknown',
          entity_type: orgData.entity_types?.name || 'Unknown',
          country: orgData.countries?.name || 'Unknown',
          country_code: orgData.country_code,
          industry_segment: orgData.industry_segments?.name,
          address: orgData.address,
          phone_number: orgData.phone_number,
          website: orgData.website
        };
        
        setProfile(profileFromOrg);
        
        // Try to create the profile record for future use
        try {
          await supabase.from('profiles').insert(profileFromOrg);
          console.log('✅ Profile record created successfully');
        } catch (insertError) {
          console.log('ℹ️ Could not create profile record, but continuing with organization data');
        }
        return;
      }

      console.log('ℹ️ No organization or profile found for user');
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting to sign in user:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      if (data.user) {
        console.log('✅ Sign in successful for:', data.user.email);
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, additionalData?: any) => {
    console.log('📝 Attempting to sign up user:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        return { error };
      }

      if (data.user) {
        console.log('✅ Sign up successful for:', data.user.email);
        
        if (additionalData) {
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
      }

      return { error: null };
    } catch (error) {
      console.error('❌ Unexpected sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
      } else {
        console.log('✅ Sign out successful');
      }
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user && !!session,
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
