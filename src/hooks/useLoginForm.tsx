
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

    if (!formData.userId) newErrors.userId = 'User ID is required';
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

  const findRegisteredUser = (userId: string, password: string): RegisteredUser | null => {
    try {
      // Get all registered users from localStorage
      const registeredUsersData = localStorage.getItem('registered_users');
      console.log('🔍 Raw localStorage data for registered_users:', registeredUsersData);
      
      if (!registeredUsersData) {
        console.log('❌ No registered users found in localStorage');
        return null;
      }

      const registeredUsers: RegisteredUser[] = JSON.parse(registeredUsersData);
      console.log('🔍 Parsed registered users:', registeredUsers);
      console.log('🔍 Number of registered users found:', registeredUsers.length);

      // Find user by userId and password
      const user = registeredUsers.find(user => {
        console.log(`🔍 Checking user: ${user.userId} === ${userId} && password match`);
        return user.userId === userId && user.password === password;
      });

      if (user) {
        console.log('✅ Found registered user:', user);
        return user;
      } else {
        console.log('❌ User not found or password mismatch');
        console.log('🔍 Available userIds:', registeredUsers.map(u => u.userId));
        return null;
      }
    } catch (error) {
      console.error('❌ Error reading registered users:', error);
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Login attempt:', formData);
      
      // Add debug information about localStorage
      const allKeys = Object.keys(localStorage);
      console.log('🔍 All localStorage keys:', allKeys);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the registered user
      const registeredUser = findRegisteredUser(formData.userId, formData.password);
      
      if (!registeredUser) {
        throw new Error('Invalid credentials');
      }

      // Save the actual registered user details to seeker localStorage keys
      localStorage.setItem('seekerOrganizationName', registeredUser.organizationName);
      localStorage.setItem('seekerEntityType', registeredUser.entityType);
      localStorage.setItem('seekerCountry', registeredUser.country);
      localStorage.setItem('seekerUserId', registeredUser.userId);
      
      console.log('💾 Saved actual seeker details to localStorage:', {
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
    } catch (error) {
      console.log('❌ Login error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please check your User ID and password.",
        variant: "destructive",
      });
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
