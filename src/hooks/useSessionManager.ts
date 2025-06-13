
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export const useSessionManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Session keys that should be cleared on logout
  const SESSION_KEYS = [
    'seekerOrganizationName',
    'seekerEntityType', 
    'seekerCountry',
    'seekerUserId'
  ];

  const clearSessionData = () => {
    console.log('🧹 === SESSION CLEANUP START ===');
    
    SESSION_KEYS.forEach(key => {
      const existingValue = localStorage.getItem(key);
      if (existingValue) {
        localStorage.removeItem(key);
        console.log(`🧹 Cleared session key: ${key} (was: ${existingValue})`);
      }
    });
    
    console.log('✅ All session data cleared successfully');
    console.log('🧹 === SESSION CLEANUP END ===');
  };

  const validateSession = (): SessionData | null => {
    console.log('🔍 === SESSION VALIDATION START ===');
    
    const sessionData: Partial<SessionData> = {};
    let isComplete = true;
    
    SESSION_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        sessionData[key as keyof SessionData] = value;
        console.log(`✅ Found session data for ${key}: ${value}`);
      } else {
        console.log(`❌ Missing session data for ${key}`);
        isComplete = false;
      }
    });
    
    if (!isComplete) {
      console.log('⚠️ Incomplete session data found');
      return null;
    }
    
    console.log('✅ Session validation successful');
    console.log('🔍 === SESSION VALIDATION END ===');
    
    return sessionData as SessionData;
  };

  const handleLogout = (userId?: string) => {
    console.log('🚪 === LOGOUT PROCESS START ===');
    console.log('🚪 Logging out user:', userId);
    
    // Clear all session data
    clearSessionData();
    
    // Navigate to signin page
    navigate('/signin');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    console.log('🚪 === LOGOUT PROCESS COMPLETE ===');
  };

  const recoverSession = (): SessionData | null => {
    console.log('🔄 === SESSION RECOVERY START ===');
    
    try {
      const sessionData = validateSession();
      
      if (!sessionData) {
        console.log('⚠️ Session recovery failed: incomplete data');
        return null;
      }
      
      console.log('✅ Session recovered successfully:', {
        userId: sessionData.seekerUserId,
        organizationName: sessionData.seekerOrganizationName
      });
      
      return sessionData;
    } catch (error) {
      console.error('❌ Session recovery error:', error);
      return null;
    } finally {
      console.log('🔄 === SESSION RECOVERY END ===');
    }
  };

  return {
    clearSessionData,
    validateSession,
    handleLogout,
    recoverSession
  };
};
