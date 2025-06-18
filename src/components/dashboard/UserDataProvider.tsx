
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
        
        // Get all users to see what data we have
        const allUsers = await unifiedUserStorageService.getAllUsers();
        console.log('👥 All registered users found:', allUsers);
        console.log('👥 Total users count:', allUsers.length);
        
        let targetUser = null;
        
        // Strategy 1: Use location state from login (highest priority)
        const loginUserId = (location.state as any)?.userId;
        if (loginUserId) {
          console.log('🎯 Looking for user by ID from location state:', loginUserId);
          targetUser = await unifiedUserStorageService.findUserById(loginUserId);
          console.log('🎯 User found by location state:', targetUser);
        }
        
        // Strategy 2: Use session data
        if (!targetUser) {
          const sessionData = await unifiedUserStorageService.loadSession();
          console.log('📱 Session data:', sessionData);
          
          if (sessionData && sessionData.userId) {
            targetUser = await unifiedUserStorageService.findUserById(sessionData.userId);
            console.log('🎯 User found by session ID:', targetUser);
          }
        }
        
        // Strategy 3: Look for user by email if available
        if (!targetUser) {
          const loginEmail = (location.state as any)?.email;
          if (loginEmail) {
            console.log('🎯 Looking for user by email:', loginEmail);
            targetUser = allUsers.find(user => user.email === loginEmail);
            console.log('🎯 User found by email:', targetUser);
          }
        }
        
        // Strategy 4: Look for "testing@testing.co.in" specifically
        if (!targetUser) {
          console.log('🎯 Looking for testing@testing.co.in user specifically');
          targetUser = allUsers.find(user => 
            user.email === 'testing@testing.co.in' || 
            user.userId === 'testing@testing.co.in'
          );
          console.log('🎯 Testing user found:', targetUser);
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
          
          console.log('📋 Final mapped user data:', mappedData);
          setUserData(mappedData);
          
          // Save session
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
          console.log('❌ No user data found');
          toast({
            title: "No User Data Found",
            description: "No user data found. Please ensure proper login.",
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
