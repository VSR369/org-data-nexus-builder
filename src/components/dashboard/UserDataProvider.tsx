
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
      console.log('🔍 === DEBUGGING SEEKING ORG DATA RETRIEVAL ===');
      console.log('🔍 Current location:', location.pathname);
      setIsLoading(true);
      
      try {
        // Initialize the unified storage service
        await unifiedUserStorageService.initialize();
        
        // Check storage health first
        const healthCheck = await unifiedUserStorageService.checkStorageHealth();
        console.log('🔧 Storage health check:', healthCheck);
        
        // Get all users to see what data we have
        const allUsers = await unifiedUserStorageService.getAllUsers();
        console.log('👥 All registered users found:', allUsers);
        console.log('👥 Total users count:', allUsers.length);
        
        // Look for seeking organization data specifically
        const seekingOrgs = allUsers.filter(user => 
          user.entityType || user.organizationType || user.organizationName
        );
        console.log('🏢 Seeking organizations found:', seekingOrgs);
        
        // Try to get session data
        const sessionData = await unifiedUserStorageService.loadSession();
        console.log('📱 Current session data:', sessionData);
        
        let targetUser = null;
        
        // Strategy 1: Use session data to find user
        if (sessionData && sessionData.userId) {
          targetUser = await unifiedUserStorageService.findUserById(sessionData.userId);
          console.log('🎯 User found by session ID:', targetUser);
        }
        
        // Strategy 2: Use location state
        const locationUserId = (location.state as any)?.userId;
        if (!targetUser && locationUserId) {
          targetUser = await unifiedUserStorageService.findUserById(locationUserId);
          console.log('🎯 User found by location state:', targetUser);
        }
        
        // Strategy 3: Get the most recent seeking organization
        if (!targetUser && seekingOrgs.length > 0) {
          targetUser = seekingOrgs[seekingOrgs.length - 1];
          console.log('🎯 Using most recent seeking org:', targetUser);
        }
        
        // Strategy 4: Get any user with organization data
        if (!targetUser && allUsers.length > 0) {
          targetUser = allUsers.find(user => user.organizationName) || allUsers[0];
          console.log('🎯 Using any user with org data:', targetUser);
        }
        
        if (targetUser) {
          console.log('✅ Target user selected:', targetUser);
          
          const mappedData = {
            userId: targetUser.userId || targetUser.id || 'N/A',
            organizationName: targetUser.organizationName || 'Organization Name Not Available',
            entityType: targetUser.entityType || 'Entity Type Not Available',
            country: targetUser.country || 'Country Not Available',
            email: targetUser.email || 'Email Not Available',
            contactPersonName: targetUser.contactPersonName || 'Contact Person Not Available',
            organizationType: targetUser.organizationType || targetUser.entityType || 'Organization Type Not Available',
            industrySegment: targetUser.industrySegment || 'Industry Segment Not Available',
            organizationId: targetUser.organizationId || targetUser.userId || targetUser.id || 'Organization ID Not Available',
            registrationTimestamp: targetUser.registrationTimestamp || targetUser.createdAt || targetUser.updatedAt || 'Registration Date Not Available'
          };
          
          console.log('📋 Final mapped user data:', mappedData);
          setUserData(mappedData);
          
          // Update session if we found valid data
          if (targetUser.userId || targetUser.id) {
            await unifiedUserStorageService.saveSession({
              userId: targetUser.userId || targetUser.id,
              organizationName: targetUser.organizationName,
              entityType: targetUser.entityType,
              country: targetUser.country,
              email: targetUser.email,
              contactPersonName: targetUser.contactPersonName,
              loginTimestamp: new Date().toISOString()
            });
          }
        } else {
          console.log('❌ No user data found anywhere');
          toast({
            title: "No Data Found",
            description: "No seeking organization data found. Please complete registration first.",
            variant: "destructive"
          });
          setShowLoginWarning(true);
        }
        
      } catch (error) {
        console.error('❌ Error loading user data:', error);
        toast({
          title: "Data Loading Error",
          description: "Failed to load organization data. Please try again.",
          variant: "destructive"
        });
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
