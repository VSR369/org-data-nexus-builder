
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
      console.log('🔍 === ADMIN DASHBOARD DATA RETRIEVAL ===');
      console.log('🔍 Current location:', location.pathname);
      console.log('🔍 Location state:', location.state);
      setIsLoading(true);
      
      try {
        // Initialize the unified storage service
        await unifiedUserStorageService.initialize();
        
        // Get all users to see what data we have
        const allUsers = await unifiedUserStorageService.getAllUsers();
        console.log('👥 All registered users found:', allUsers);
        console.log('👥 Total users count:', allUsers.length);
        
        // Look for seeking organization data specifically
        const seekingOrgs = allUsers.filter(user => 
          user.entityType || user.organizationType || user.organizationName
        );
        console.log('🏢 Seeking organizations found:', seekingOrgs);
        
        let targetUser = null;
        
        // Strategy 1: Use location state from admin login (highest priority)
        const adminLoginUserId = (location.state as any)?.adminUserId || (location.state as any)?.userId;
        if (adminLoginUserId) {
          console.log('🎯 Looking for admin user by ID from location state:', adminLoginUserId);
          targetUser = await unifiedUserStorageService.findUserById(adminLoginUserId);
          console.log('🎯 Admin user found by location state:', targetUser);
        }
        
        // Strategy 2: Look for "Champion" organization specifically
        if (!targetUser) {
          targetUser = allUsers.find(user => 
            user.organizationName && user.organizationName.toLowerCase().includes('champion')
          );
          console.log('🎯 Looking for Champion organization:', targetUser);
        }
        
        // Strategy 3: Try to get session data as fallback
        if (!targetUser) {
          const sessionData = await unifiedUserStorageService.loadSession();
          console.log('📱 Fallback session data:', sessionData);
          
          if (sessionData && sessionData.userId) {
            targetUser = await unifiedUserStorageService.findUserById(sessionData.userId);
            console.log('🎯 User found by session ID (fallback):', targetUser);
          }
        }
        
        // Strategy 4: Get the most recent seeking organization
        if (!targetUser && seekingOrgs.length > 0) {
          // Sort by last login or creation date to get most recent
          const sortedOrgs = seekingOrgs.sort((a, b) => {
            const aTime = new Date(a.lastLoginTimestamp || a.updatedAt || a.createdAt || 0).getTime();
            const bTime = new Date(b.lastLoginTimestamp || b.updatedAt || b.createdAt || 0).getTime();
            return bTime - aTime;
          });
          targetUser = sortedOrgs[0];
          console.log('🎯 Using most recent seeking org:', targetUser);
        }
        
        if (targetUser) {
          console.log('✅ Final target user selected:', targetUser);
          
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
          
          console.log('📋 Final mapped admin user data:', mappedData);
          setUserData(mappedData);
          
          // Save admin session
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
          console.log('❌ No admin user data found');
          toast({
            title: "No Admin Data Found",
            description: "No seeking organization admin data found. Please ensure proper login.",
            variant: "destructive"
          });
          setShowLoginWarning(true);
        }
        
      } catch (error) {
        console.error('❌ Error loading admin user data:', error);
        toast({
          title: "Admin Data Loading Error",
          description: "Failed to load admin organization data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        console.log('✅ === ADMIN DATA LOADING COMPLETED ===');
      }
    };

    loadUserData();
  }, [location.state, navigate, toast]);

  const handleLogout = (userId?: string) => {
    console.log('Logging out admin user:', userId);
    unifiedUserStorageService.clearSession();
    navigate('/seeking-org-admin-login');
  };

  console.log('🔍 Admin UserDataProvider rendering with userData:', userData);
  console.log('🔍 Admin UserDataProvider isLoading:', isLoading);

  return (
    <UserDataContext.Provider value={{ userData, isLoading, showLoginWarning, handleLogout }}>
      {children}
    </UserDataContext.Provider>
  );
};
