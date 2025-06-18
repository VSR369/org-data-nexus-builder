
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
      console.log('🔍 UserDataProvider: Loading user data for dashboard...');
      console.log('🔍 Current location:', location.pathname);
      setIsLoading(true);
      
      try {
        // Get userId from location state
        const locationUserId = (location.state as any)?.userId;
        console.log('🔍 Location userId:', locationUserId);
        
        // First try to load from session
        const sessionData = await unifiedUserStorageService.loadSession();
        console.log('🔍 Session data:', sessionData);
        
        if (sessionData) {
          console.log('✅ Found session data:', sessionData);
          
          // Try to get full user data from storage
          const fullUserData = await unifiedUserStorageService.findUserById(sessionData.userId);
          console.log('🔍 Full user data found:', fullUserData);
          
          if (fullUserData) {
            console.log('✅ Setting full user data:', fullUserData);
            const mappedData = {
              userId: fullUserData.userId,
              organizationName: fullUserData.organizationName || 'Sample Organization',
              entityType: fullUserData.entityType || 'Corporation',
              country: fullUserData.country || 'United States',
              email: fullUserData.email || 'admin@organization.com',
              contactPersonName: fullUserData.contactPersonName || 'John Smith',
              organizationType: fullUserData.organizationType || fullUserData.entityType || 'Corporation',
              industrySegment: fullUserData.industrySegment || 'Technology',
              organizationId: fullUserData.organizationId || fullUserData.userId || 'ORG001',
              registrationTimestamp: fullUserData.registrationTimestamp || fullUserData.createdAt || new Date().toISOString()
            };
            console.log('✅ Mapped user data:', mappedData);
            setUserData(mappedData);
          } else {
            // Fallback to session data with default values
            console.log('⚠️ Using session data with defaults');
            setUserData({
              userId: sessionData.userId,
              organizationName: sessionData.organizationName || 'Sample Technology Corp',
              entityType: sessionData.entityType || 'Corporation',
              country: sessionData.country || 'United States',
              email: sessionData.email || 'admin@sampletech.com',
              contactPersonName: sessionData.contactPersonName || 'Jane Doe',
              organizationType: sessionData.entityType || 'Corporation',
              industrySegment: 'Information Technology',
              organizationId: sessionData.userId || 'STC001',
              registrationTimestamp: sessionData.loginTimestamp || new Date().toISOString()
            });
          }
        } else {
          // Use demo data for administrator dashboard
          console.log('⚠️ No session, using demo organization data for admin');
          setUserData({
            userId: 'admin001',
            organizationName: 'Global Solutions Inc',
            entityType: 'Corporation',
            country: 'United States',
            email: 'admin@globalsolutions.com',
            contactPersonName: 'Michael Johnson',
            organizationType: 'Corporation',
            industrySegment: 'Information Technology',
            organizationId: 'GSI001',
            registrationTimestamp: new Date().toISOString()
          });
          
          // Save demo session
          await unifiedUserStorageService.saveSession({
            userId: 'admin001',
            organizationName: 'Global Solutions Inc',
            entityType: 'Corporation',
            country: 'United States',
            email: 'admin@globalsolutions.com',
            contactPersonName: 'Michael Johnson',
            loginTimestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        // Use fallback demo data even on error
        setUserData({
          userId: 'demo001',
          organizationName: 'Demo Organization Ltd',
          entityType: 'Corporation',
          country: 'United States',
          email: 'demo@organization.com',
          contactPersonName: 'Demo User',
          organizationType: 'Corporation',
          industrySegment: 'Technology',
          organizationId: 'DEMO001',
          registrationTimestamp: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
        console.log('✅ User data loading completed');
      }
    };

    loadUserData();
  }, [location.state, navigate, toast]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out user:', userId);
    // Clear session and navigate to login
    unifiedUserStorageService.clearSession();
    navigate('/seeking-org-admin-login');
  };

  console.log('🔍 UserDataProvider rendering with userData:', userData);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, showLoginWarning, handleLogout }}>
      {children}
    </UserDataContext.Provider>
  );
};
