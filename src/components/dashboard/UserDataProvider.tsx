
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

interface UserData {
  userId: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  organizationType: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp: string;
}

interface UserDataContextType {
  userData: UserData;
  isLoading: boolean;
  showLoginWarning: boolean;
  handleLogout: (userId?: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface UserDataProviderProps {
  children: React.ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<UserData>({
    userId: '',
    organizationName: '',
    entityType: '',
    country: '',
    email: '',
    contactPersonName: '',
    organizationType: '',
    industrySegment: '',
    organizationId: '',
    registrationTimestamp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('🔍 Loading user data for dashboard...');
      setIsLoading(true);
      
      try {
        // Get userId from location state
        const locationUserId = (location.state as any)?.userId;
        
        // First try to load from session
        const sessionData = await unifiedUserStorageService.loadSession();
        
        if (sessionData) {
          console.log('✅ Found session data:', sessionData);
          
          // Try to get full user data from storage
          const fullUserData = await unifiedUserStorageService.findUserById(sessionData.userId);
          
          if (fullUserData) {
            console.log('✅ Found full user data:', fullUserData);
            setUserData({
              userId: fullUserData.userId,
              organizationName: fullUserData.organizationName,
              entityType: fullUserData.entityType,
              country: fullUserData.country,
              email: fullUserData.email,
              contactPersonName: fullUserData.contactPersonName,
              organizationType: fullUserData.organizationType || fullUserData.entityType,
              industrySegment: fullUserData.industrySegment || 'Not Available',
              organizationId: fullUserData.organizationId || fullUserData.userId,
              registrationTimestamp: fullUserData.registrationTimestamp || fullUserData.createdAt || new Date().toISOString()
            });
          } else {
            // Fallback to session data only
            setUserData({
              userId: sessionData.userId,
              organizationName: sessionData.organizationName,
              entityType: sessionData.entityType,
              country: sessionData.country,
              email: sessionData.email,
              contactPersonName: sessionData.contactPersonName,
              organizationType: sessionData.entityType, // Fallback
              industrySegment: 'Not Available',
              organizationId: sessionData.userId, // Fallback
              registrationTimestamp: sessionData.loginTimestamp || new Date().toISOString()
            });
          }
        } else if (locationUserId) {
          // Try to find user by ID from location state
          console.log('🔍 No session, looking for user:', locationUserId);
          const user = await unifiedUserStorageService.findUserById(locationUserId);
          
          if (user) {
            console.log('✅ Found user:', user);
            setUserData({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              organizationType: user.organizationType || user.entityType,
              industrySegment: user.industrySegment || 'Not Available',
              organizationId: user.organizationId || user.userId,
              registrationTimestamp: user.registrationTimestamp || user.createdAt || new Date().toISOString()
            });
            
            // Save session for this user
            await unifiedUserStorageService.saveSession({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              loginTimestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ User not found');
            setShowLoginWarning(true);
          }
        } else {
          // Try to find user "vsr 369" specifically as fallback
          console.log('⚠️ No location userId or session, looking for user vsr369...');
          const user = await unifiedUserStorageService.findUserById('vsr369');
          
          if (user) {
            console.log('✅ Found user vsr369:', user);
            setUserData({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              organizationType: user.organizationType || user.entityType,
              industrySegment: user.industrySegment || 'Not Available',
              organizationId: user.organizationId || user.userId,
              registrationTimestamp: user.registrationTimestamp || user.createdAt || new Date().toISOString()
            });
            
            // Save session for this user
            await unifiedUserStorageService.saveSession({
              userId: user.userId,
              organizationName: user.organizationName,
              entityType: user.entityType,
              country: user.country,
              email: user.email,
              contactPersonName: user.contactPersonName,
              loginTimestamp: new Date().toISOString()
            });
          } else {
            console.log('❌ User vsr369 not found');
            setShowLoginWarning(true);
          }
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        setShowLoginWarning(true);
      } finally {
        setIsLoading(false);
      }
    };

    // Only load if we don't have complete user data
    if (!userData.userId || !userData.organizationName) {
      loadUserData();
    }
  }, [location.state, navigate, toast, userData.userId, userData.organizationName]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out user:', userId);
    // Clear session and navigate to login
    unifiedUserStorageService.clearSession();
    navigate('/seeker-login');
  };

  return (
    <UserDataContext.Provider value={{ userData, isLoading, showLoginWarning, handleLogout }}>
      {children}
    </UserDataContext.Provider>
  );
};
