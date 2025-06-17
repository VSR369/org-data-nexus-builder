
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { debugStorageData } from '@/utils/debugStorageData';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useLoginFormValidation } from './useLoginFormValidation';

interface LoginFormData {
  userId: string;
  password: string;
}

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { errors, validateForm, clearFieldError } = useLoginFormValidation();

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 === LOGIN ATTEMPT START ===');
    console.log('🔐 Login attempt for userId:', formData.userId);
    
    // Run debug analysis first
    debugStorageData();
    
    if (!validateForm(formData)) {
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
      // Check storage health first
      const healthCheck = await unifiedUserStorageService.checkStorageHealth();
      console.log('🏥 Storage health check:', healthCheck);
      
      // Try to authenticate using unified service
      const authResult = await unifiedUserStorageService.authenticateUser(
        formData.userId.trim(), 
        formData.password
      );
      
      console.log('🔐 Authentication result:', authResult);
      
      if (!authResult.success || !authResult.user) {
        throw new Error(authResult.error || 'Authentication failed');
      }

      console.log('✅ Login successful for user:', authResult.user.userId);
      
      // Save session data
      await unifiedUserStorageService.saveSession({
        userId: authResult.user.userId,
        organizationName: authResult.user.organizationName,
        entityType: authResult.user.entityType,
        country: authResult.user.country,
        email: authResult.user.email,
        contactPersonName: authResult.user.contactPersonName,
        loginTimestamp: new Date().toISOString()
      });
      
      // Navigate to seeker dashboard
      navigate('/seeker-dashboard', { 
        state: { 
          userId: authResult.user.userId,
          organizationName: authResult.user.organizationName
        }
      });

      toast({
        title: "Login Successful",
        description: `Welcome back, ${authResult.user.contactPersonName}!`,
      });
      
      console.log('🔐 === LOGIN ATTEMPT SUCCESS ===');
      
    } catch (error: any) {
      console.log('❌ Login error:', error.message);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message === 'Invalid password') {
        errorMessage = "Incorrect password. Please check your password and try again.";
      } else if (error.message === 'User not found') {
        errorMessage = "User ID not found. Please check your User ID or register first.";
      } else if (error.message.includes('No users found')) {
        errorMessage = "No registered users found. Please register first or check if migration is needed.";
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
