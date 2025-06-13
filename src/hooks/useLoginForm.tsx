
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface LoginFormData {
  userId: string;
  password: string;
}

interface RegisteredUser {
  userId: string;
  password: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp?: string;
}

// Debug function to analyze localStorage data
function debugLocalStorage(): void {
  console.log('🔍 === LOGIN DEBUG SESSION START ===');
  
  // Check all localStorage keys
  const allKeys = Object.keys(localStorage);
  console.log('🔍 All localStorage keys:', allKeys);
  
  // Focus on user-related keys
  const userKeys = allKeys.filter(key => 
    key.toLowerCase().includes('user') || 
    key.toLowerCase().includes('registered') ||
    key.toLowerCase().includes('seeker')
  );
  console.log('🔍 User-related keys:', userKeys);
  
  // Check registered_users specifically
  const registeredUsersData = localStorage.getItem('registered_users');
  console.log('🔍 Raw registered_users data:', registeredUsersData);
  
  if (registeredUsersData) {
    try {
      const parsedUsers = JSON.parse(registeredUsersData);
      console.log('🔍 Parsed users count:', parsedUsers.length);
      console.log('🔍 User details:', parsedUsers.map((u: any) => ({
        userId: u.userId,
        organizationName: u.organizationName,
        hasPassword: !!u.password,
        registrationTime: u.registrationTimestamp
      })));
    } catch (error) {
      console.log('❌ Error parsing registered users data:', error);
    }
  }
  
  console.log('🔍 === LOGIN DEBUG SESSION END ===');
}

// Enhanced user search with detailed logging
function findRegisteredUser(userId: string, password: string): RegisteredUser | null {
  console.log('🔍 === USER SEARCH START ===');
  console.log('🔍 Searching for userId:', userId);
  console.log('🔍 Password provided:', password ? 'Yes' : 'No');
  
  try {
    const registeredUsersData = localStorage.getItem('registered_users');
    
    if (!registeredUsersData) {
      console.log('❌ No registered_users data found in localStorage');
      return null;
    }

    const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersData);
    console.log('🔍 Total registered users found:', registeredUsers.length);
    
    if (registeredUsers.length === 0) {
      console.log('❌ No users in the registered users array');
      return null;
    }

    // Log all available userIds for comparison
    const availableUserIds = registeredUsers.map(u => u.userId);
    console.log('🔍 Available userIds:', availableUserIds);
    
    // Try exact match first
    let user = registeredUsers.find(user => {
      const userIdMatch = user.userId === userId;
      const passwordMatch = user.password === password;
      console.log(`🔍 Checking user ${user.userId}: userIdMatch=${userIdMatch}, passwordMatch=${passwordMatch}`);
      return userIdMatch && passwordMatch;
    });

    if (user) {
      console.log('✅ Found user with exact match:', {
        userId: user.userId,
        organizationName: user.organizationName,
        entityType: user.entityType,
        country: user.country
      });
      return user;
    }

    // Try case-insensitive match
    user = registeredUsers.find(user => {
      const userIdMatch = user.userId.toLowerCase() === userId.toLowerCase();
      const passwordMatch = user.password === password;
      console.log(`🔍 Checking user ${user.userId} (case-insensitive): userIdMatch=${userIdMatch}, passwordMatch=${passwordMatch}`);
      return userIdMatch && passwordMatch;
    });

    if (user) {
      console.log('✅ Found user with case-insensitive match:', {
        userId: user.userId,
        organizationName: user.organizationName
      });
      return user;
    }

    // Check if userId exists but password is wrong
    const userWithSameId = registeredUsers.find(user => 
      user.userId.toLowerCase() === userId.toLowerCase()
    );
    
    if (userWithSameId) {
      console.log('⚠️ Found user with matching ID but wrong password');
      return null;
    }

    console.log('❌ No user found with matching credentials');
    return null;

  } catch (error) {
    console.error('❌ Error during user search:', error);
    return null;
  } finally {
    console.log('🔍 === USER SEARCH END ===');
  }
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 === LOGIN ATTEMPT START ===');
    console.log('🔐 Login attempt for userId:', formData.userId);
    
    // Run debug analysis
    debugLocalStorage();
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the registered user
      const registeredUser = findRegisteredUser(formData.userId.trim(), formData.password);
      
      if (!registeredUser) {
        console.log('❌ Login failed: Invalid credentials');
        
        // Check if user exists to provide better error message
        const usersData = localStorage.getItem('registered_users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const userExists = users.find((u: any) => 
            u.userId.toLowerCase() === formData.userId.toLowerCase()
          );
          
          if (userExists) {
            throw new Error('Invalid password');
          } else {
            throw new Error('User not found');
          }
        } else {
          throw new Error('No registered users found');
        }
      }

      console.log('✅ Login successful for user:', registeredUser.userId);
      
      // Save the actual registered user details to seeker localStorage keys
      localStorage.setItem('seekerOrganizationName', registeredUser.organizationName);
      localStorage.setItem('seekerEntityType', registeredUser.entityType);
      localStorage.setItem('seekerCountry', registeredUser.country);
      localStorage.setItem('seekerUserId', registeredUser.userId);
      
      console.log('💾 Saved seeker details to localStorage:', {
        organizationName: registeredUser.organizationName,
        entityType: registeredUser.entityType,
        country: registeredUser.country,
        userId: registeredUser.userId
      });
      
      // Navigate to seeker dashboard with user context
      navigate('/seeker-dashboard', { 
        state: { 
          userId: registeredUser.userId,
          organizationName: registeredUser.organizationName
        }
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${registeredUser.contactPersonName}!`,
      });
      
      console.log('🔐 === LOGIN ATTEMPT SUCCESS ===');
      
    } catch (error: any) {
      console.log('❌ Login error:', error.message);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message === 'Invalid password') {
        errorMessage = "Incorrect password. Please check your password and try again.";
      } else if (error.message === 'User not found') {
        errorMessage = "User ID not found. Please check your User ID or register first.";
      } else if (error.message === 'No registered users found') {
        errorMessage = "No registered users found. Please register first.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.log('🔐 === LOGIN ATTEMPT FAILED ===');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleLogin
  };
};
