
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { clearUserSession } from '@/utils/unifiedAuthUtils';

export const useSessionManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async (userId?: string) => {
    console.log('🚪 === LOGOUT PROCESS START ===');
    console.log('🚪 Logging out user:', userId);
    
    // Clear session data using unified service
    await clearUserSession();
    
    // Also clear any legacy localStorage session data
    localStorage.removeItem('seekerOrganizationName');
    localStorage.removeItem('seekerEntityType');
    localStorage.removeItem('seekerCountry');
    localStorage.removeItem('seekerUserId');
    localStorage.removeItem('seekerOrganizationType');
    
    // Navigate to signin page
    navigate('/signin');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    console.log('🚪 === LOGOUT PROCESS COMPLETE ===');
  };

  return {
    handleLogout
  };
};
