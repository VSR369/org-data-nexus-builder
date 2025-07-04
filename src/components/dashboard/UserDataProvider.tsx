
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
      console.log('🔍 === DASHBOARD DATA RETRIEVAL ===');
      console.log('🔍 Current location:', location.pathname);
      console.log('🔍 Location state:', location.state);
      setIsLoading(true);
      
      try {
        // Initialize the unified storage service
        await unifiedUserStorageService.initialize();
        
        let targetUser = null;
        
        // Priority 1: Use complete location state from login (HIGHEST PRIORITY)
        const locationState = location.state as any;
        if (locationState && locationState.userId && locationState.organizationName) {
          console.log('🎯 PRIORITY 1: Using complete location state from login:', locationState);
          
          // Verify user exists in storage
          const storedUser = await unifiedUserStorageService.findUserById(locationState.userId);
          if (storedUser) {
            console.log('✅ Verified user exists in storage:', storedUser.userId);
            // Use location state data as it's most current
            targetUser = {
              ...storedUser,
              // Overlay login session data which is most current
              userId: locationState.userId,
              organizationName: locationState.organizationName,
              organizationType: locationState.organizationType || storedUser.organizationType,
              entityType: locationState.entityType || storedUser.entityType,
              country: locationState.country || storedUser.country,
              email: locationState.email || storedUser.email,
              contactPersonName: locationState.contactPersonName || storedUser.contactPersonName,
              industrySegment: locationState.industrySegment || storedUser.industrySegment,
              organizationId: locationState.organizationId || storedUser.organizationId
            };
          }
        }
        
        // Priority 2: Use session data if no location state
        if (!targetUser) {
          const sessionData = await unifiedUserStorageService.loadSession();
          console.log('🎯 PRIORITY 2: Using session data:', sessionData);
          
          if (sessionData && sessionData.userId) {
            // Get full user record from storage
            const storedUser = await unifiedUserStorageService.findUserById(sessionData.userId);
            if (storedUser) {
              console.log('✅ Found user from session:', storedUser.userId);
              // Combine session data with stored user data
              targetUser = {
                ...storedUser,
                // Use session data where available as it's more current
                organizationName: sessionData.organizationName || storedUser.organizationName,
                organizationType: sessionData.organizationType || storedUser.organizationType,
                entityType: sessionData.entityType || storedUser.entityType,
                country: sessionData.country || storedUser.country,
                contactPersonName: sessionData.contactPersonName || storedUser.contactPersonName,
                industrySegment: sessionData.industrySegment || storedUser.industrySegment,
                organizationId: sessionData.organizationId || storedUser.organizationId
              };
            }
          }
        }
        
        // Priority 3: Look for user by userId from location state only
        if (!targetUser && locationState?.userId) {
          console.log('🎯 PRIORITY 3: Looking for user by userId only:', locationState.userId);
          targetUser = await unifiedUserStorageService.findUserById(locationState.userId);
          console.log('🎯 User found by userId:', targetUser);
        }
        
        if (targetUser) {
          console.log('✅ FINAL TARGET USER SELECTED:', targetUser);
          
          const mappedData = {
            userId: targetUser.userId || 'N/A',
            organizationName: targetUser.organizationName || 'Organization Name Not Available',
            entityType: targetUser.entityType || 'Entity Type Not Available',
            country: targetUser.country || 'Country Not Available',
            email: targetUser.email || 'Email Not Available',
            contactPersonName: targetUser.contactPersonName || 'Contact Person Not Available',
            organizationType: targetUser.organizationType || targetUser.entityType || 'Organization Type Not Available',
            industrySegment: targetUser.industrySegment || 'Industry Segment Not Available',
            organizationId: targetUser.organizationId || targetUser.userId || 'Organization ID Not Available',
            registrationTimestamp: targetUser.registrationTimestamp || targetUser.createdAt || 'Registration Date Not Available'
          };
          
          console.log('📋 FINAL MAPPED USER DATA:', mappedData);
          setUserData(mappedData);
          setShowLoginWarning(false);
          
          // Update session with current data
          await unifiedUserStorageService.saveSession({
            userId: targetUser.userId,
            organizationName: targetUser.organizationName,
            organizationType: targetUser.organizationType || targetUser.entityType,
            entityType: targetUser.entityType,
            country: targetUser.country,
            email: targetUser.email,
            contactPersonName: targetUser.contactPersonName,
            industrySegment: targetUser.industrySegment || 'Not Specified',
            organizationId: targetUser.organizationId || targetUser.userId,
            loginTimestamp: new Date().toISOString()
          });
        } else {
          console.log('❌ NO USER DATA FOUND - Showing login warning');
          toast({
            title: "No User Data Found",
            description: "Please log in to access the dashboard.",
            variant: "destructive"
          });
          setShowLoginWarning(true);
        }
        
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive"
        });
        setShowLoginWarning(true);
      } finally {
        setIsLoading(false);
        console.log('✅ === DATA LOADING COMPLETED ===');
      }
    };

    loadUserData();
  }, [location.state, navigate, toast]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out user:', userId);
    unifiedUserStorageService.clearSession();
    navigate('/seeking-org-admin-login');
  };

  console.log('🔍 UserDataProvider rendering with userData:', userData);
  console.log('🔍 UserDataProvider isLoading:', isLoading);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, showLoginWarning, handleLogout }}>
      {children}
    </UserDataContext.Provider>
  );
};
