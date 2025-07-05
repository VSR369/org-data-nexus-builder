import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { sanitizeInput } from '@/utils/inputSanitization';
import { loginSchema, LoginFormData, LoginState } from '@/types/loginTypes';
import { loginSolutionSeekingOrg, getRememberMeData } from '@/utils/authUtils';

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
    const rememberData = getRememberMeData();
    if (rememberData) {
      form.setValue('identifier', rememberData.identifier || '');
      form.setValue('rememberMe', true);
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
      
      // Use the new authentication service
      console.log('🔍 AUTH - Calling unified authentication service...');
      const authResult = await loginSolutionSeekingOrg({
        identifier: sanitizedIdentifier,
        password: sanitizedPassword,
        rememberMe: data.rememberMe
      });
      
      if (!authResult.success) {
        console.log('❌ AUTH - Login failed:', authResult.error);
        setLoginState(prev => ({ 
          ...prev, 
          error: authResult.error || 'Login failed. Please try again.',
          isLoading: false 
        }));
        return;
      }
      
      console.log('✅ AUTH - Login successful');
      
      const userData = authResult.data!;
      const session = authResult.session!;
      
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
        onSuccess({
          ...userData,
          session
        });
      }
      
      // Navigate to dashboard after delay
      setTimeout(() => {
        navigate(redirectUrl);
      }, 1500);
      
    } catch (error) {
      console.error('💥 AUTH - Unexpected login error:', error);
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