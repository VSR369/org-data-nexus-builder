
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export const useSessionManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const clearSessionData = () => {
    sessionStorageManager.clearSession();
  };

  const validateSession = (): SessionData | null => {
    return sessionStorageManager.loadSession();
  };

  const handleLogout = (userId?: string) => {
    console.log('🚪 === LOGOUT PROCESS START ===');
    console.log('🚪 Logging out user:', userId);
    
    // Clear all session data using robust storage manager
    sessionStorageManager.clearSession();
    
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
      const sessionData = sessionStorageManager.loadSession();
      
      if (!sessionData) {
        console.log('⚠️ Session recovery failed: no valid data found');
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

  const getStorageHealth = () => {
    return sessionStorageManager.getStorageHealth();
  };

  return {
    clearSessionData,
    validateSession,
    handleLogout,
    recoverSession,
    getStorageHealth
  };
};
