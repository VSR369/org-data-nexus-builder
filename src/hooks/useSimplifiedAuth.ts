// Simplified authentication hook using the corrected UserDataManager

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserDataManager, type UserRecord, type SessionData } from '@/utils/userDataManager';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserRecord | null;
  sessionData: SessionData | null;
}

export const useSimplifiedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    sessionData: null
  });
  
  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('🔄 === INITIALIZING AUTH STATE ===');
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Try to load existing session
      const sessionResult = UserDataManager.loadSession();
      
      if (sessionResult.success && sessionResult.sessionData) {
        console.log('✅ Existing session found');
        
        // Verify user still exists in registration data
        const user = UserDataManager.findUserById(sessionResult.sessionData.userId);
        
        if (user) {
          console.log('✅ User verified, authentication restored');
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
            sessionData: sessionResult.sessionData
          });
        } else {
          console.log('❌ User not found, clearing invalid session');
          UserDataManager.logout();
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            sessionData: null
          });
        }
      } else {
        console.log('📱 No valid session found');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          sessionData: null
        });
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        sessionData: null
      });
    }
  };

  const login = async (userId: string, password: string): Promise<boolean> => {
    console.log('🔐 === LOGIN ATTEMPT ===');
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Step 1: Authenticate user
      const authResult = UserDataManager.authenticateUser(userId, password);
      
      if (!authResult.success || !authResult.user) {
        console.log('❌ Authentication failed');
        toast.error(authResult.error || 'Login failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Step 2: Create session
      const sessionResult = UserDataManager.createSession(authResult.user);
      
      if (!sessionResult.success || !sessionResult.sessionData) {
        console.log('❌ Session creation failed');
        toast.error(sessionResult.error || 'Session creation failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Step 3: Update auth state
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: authResult.user,
        sessionData: sessionResult.sessionData
      });

      console.log('✅ Login successful');
      toast.success(`Welcome back, ${authResult.user.contactPersonName}!`);
      
      // Navigate to dashboard
      navigate('/seeking-org-admin-dashboard');
      return true;

    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Login failed. Please try again.');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 === LOGOUT ===');
    
    try {
      UserDataManager.logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        sessionData: null
      });
      
      toast.success('Successfully logged out');
      navigate('/signin');
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const register = async (userData: Omit<UserRecord, 'registrationTimestamp'>): Promise<boolean> => {
    console.log('📝 === REGISTRATION ATTEMPT ===');
    
    try {
      const userRecord: UserRecord = {
        ...userData,
        registrationTimestamp: new Date().toISOString()
      };

      const saveResult = UserDataManager.saveRegistrationData(userRecord);
      
      if (!saveResult.success) {
        console.log('❌ Registration failed');
        toast.error(saveResult.error || 'Registration failed');
        return false;
      }

      console.log('✅ Registration successful');
      toast.success(`Registration successful! Welcome, ${userData.contactPersonName}!`);
      
      // Navigate to login page
      navigate('/seeking-org-admin-login');
      return true;

    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  return {
    // Auth state
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    sessionData: authState.sessionData,
    
    // Auth actions
    login,
    logout,
    register,
    
    // Utility functions
    refreshAuth: initializeAuth,
    
    // User data access
    currentUser: authState.user,
    currentSession: authState.sessionData
  };
};