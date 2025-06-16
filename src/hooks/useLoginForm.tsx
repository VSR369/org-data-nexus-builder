
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { debugLocalStorage } from '@/utils/loginDebugUtils';
import { findRegisteredUser, checkUserExistsForBetterError } from '@/utils/userAuthUtils';
import { clearPreviousSessionData, saveSessionData } from '@/utils/sessionDataUtils';
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
    
    // Clear any previous session data first
    clearPreviousSessionData();
    
    // Run debug analysis
    debugLocalStorage();
    
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the registered user (this is now async)
      const registeredUser = await findRegisteredUser(formData.userId.trim(), formData.password);
      
      if (!registeredUser) {
        console.log('❌ Login failed: Invalid credentials');
        
        // Check if user exists to provide better error message (this is now async)
        const userCheckResult = await checkUserExistsForBetterError(formData.userId);
        
        let errorType = 'User not found';
        if (userCheckResult === 'user_exists') {
          errorType = 'Invalid password';
        } else if (userCheckResult === 'no_users') {
          errorType = 'No registered users found';
        }
        
        throw new Error(errorType);
      }

      console.log('✅ Login successful for user:', registeredUser.userId);
      
      // Save session data with verification
      await saveSessionData(registeredUser);
      
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
      
      // Clear any partially saved session data on error
      clearPreviousSessionData();
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message === 'Invalid password') {
        errorMessage = "Incorrect password. Please check your password and try again.";
      } else if (error.message === 'User not found') {
        errorMessage = "User ID not found. Please check your User ID or register first.";
      } else if (error.message === 'No registered users found') {
        errorMessage = "No registered users found. Please register first.";
      } else if (error.message.includes('Session data save failed')) {
        errorMessage = "Failed to create session. Please try logging in again.";
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
