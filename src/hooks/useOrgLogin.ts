import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';
import { sanitizeInput } from '@/utils/inputSanitization';
import { loginSchema, LoginFormData, LoginState } from '@/types/loginTypes';

interface UseOrgLoginProps {
  onSuccess?: (userData: any) => void;
  redirectUrl?: string;
}

export const useOrgLogin = ({ onSuccess, redirectUrl = '/seeking-org-admin-dashboard' }: UseOrgLoginProps) => {
  const [loginState, setLoginState] = useState<LoginState>({
    showPassword: false,
    isLoading: false,
    error: '',
    success: '',
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  // Load remember me data on component mount
  useEffect(() => {
    const rememberData = localStorage.getItem('seeking_org_remember_me');
    if (rememberData) {
      try {
        const data = JSON.parse(rememberData);
        const expiryDate = new Date(data.expiryDate);
        const now = new Date();
        
        if (now < expiryDate) {
          form.setValue('identifier', data.identifier || '');
          form.setValue('rememberMe', true);
        } else {
          localStorage.removeItem('seeking_org_remember_me');
        }
      } catch (error) {
        localStorage.removeItem('seeking_org_remember_me');
      }
    }
    
    setLoginState(prev => ({ ...prev, error: '', success: '' }));
  }, [form]);

  const onSubmit = async (data: LoginFormData) => {
    setLoginState(prev => ({ ...prev, error: '', success: '', isLoading: true }));
    
    console.log('🔄 Solution Seeking Organization Login - Form submitted');
    
    try {
      // Sanitize inputs
      const sanitizedIdentifier = sanitizeInput(data.identifier);
      const sanitizedPassword = sanitizeInput(data.password);
      
      // Check if user exists using SessionStorageManager
      console.log('🔍 Checking user credentials...');
      const loginResult = sessionStorageManager.findUser(sanitizedIdentifier, sanitizedPassword);
      
      if (!loginResult) {
        console.log('❌ Login failed - user not found or invalid credentials');
        setLoginState(prev => ({ 
          ...prev, 
          error: 'Invalid email/username or password. Please check your credentials and try again.',
          isLoading: false 
        }));
        return;
      }
      
      console.log('✅ User found:', loginResult);
      
      // Check if this is a solution seeking organization
      const userData = loginResult;
      const isSolutionSeeker = userData.entityType?.toLowerCase().includes('solution') ||
                              userData.entityType?.toLowerCase().includes('seeker') ||
                              userData.entityType === 'solution-seeker' ||
                              userData.entityType === 'Solution Seeker';
      
      if (!isSolutionSeeker) {
        console.log('❌ User is not a solution seeking organization');
        setLoginState(prev => ({ 
          ...prev, 
          error: 'This account is not registered as a Solution Seeking Organization. Please check your credentials or contact support.',
          isLoading: false 
        }));
        return;
      }
      
      console.log('✅ Valid solution seeking organization user');
      
      // Save remember me data if checked
      if (data.rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        const rememberData = {
          identifier: sanitizedIdentifier,
          expiryDate: expiryDate.toISOString()
        };
        
        localStorage.setItem('seeking_org_remember_me', JSON.stringify(rememberData));
        console.log('💾 Remember me data saved');
      } else {
        localStorage.removeItem('seeking_org_remember_me');
      }
      
      // Store current session
      const sessionData = {
        userId: userData.userId,
        email: userData.email,
        organizationName: userData.organizationName,
        organizationId: userData.organizationId,
        entityType: userData.entityType,
        loginTime: new Date().toISOString(),
        userType: 'solution-seeking-organization'
      };
      
      localStorage.setItem('current_seeking_org_session', JSON.stringify(sessionData));
      console.log('💾 Session data stored:', sessionData);
      
      // Show success message
      setLoginState(prev => ({ 
        ...prev, 
        success: `Welcome back, ${userData.organizationName}!`,
        isLoading: false 
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.organizationName}! Redirecting to your dashboard...`,
      });
      
      // Reset form
      form.reset();
      setLoginState(prev => ({ ...prev, showPassword: false }));
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userData);
      }
      
      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate(redirectUrl);
      }, 1500);
      
    } catch (error) {
      console.error('💥 Login error:', error);
      setLoginState(prev => ({ 
        ...prev, 
        error: 'An unexpected error occurred. Please try again.',
        isLoading: false 
      }));
    }
  };

  const resetForm = () => {
    form.reset();
    setLoginState({
      showPassword: false,
      isLoading: false,
      error: '',
      success: '',
    });
  };

  const togglePasswordVisibility = () => {
    setLoginState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return {
    form,
    loginState,
    onSubmit,
    resetForm,
    togglePasswordVisibility,
  };
};