
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface ContributorLoginFormData {
  email: string;
  password: string;
}

export const useContributorLoginForm = () => {
  const [formData, setFormData] = useState<ContributorLoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<ContributorLoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof ContributorLoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContributorLoginFormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 === CONTRIBUTOR LOGIN ATTEMPT START ===');
    console.log('🔐 Contributor login attempt for email:', formData.email);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsLoading(true);

    try {
      // For now, simulate login with basic validation
      // In a real app, this would check against a contributor database
      if (formData.email === 'contributor@example.com' && formData.password === 'password') {
        console.log('✅ Contributor login successful');
        
        // Navigate to contributor dashboard (to be created)
        navigate('/contributor-dashboard', { 
          state: { 
            email: formData.email,
            userType: 'contributor'
          }
        });

        toast({
          title: "Login Successful",
          description: "Welcome to the Contributor Portal!",
        });
      } else {
        // Check if this might be an enrolled contributor
        const enrolledProviders = localStorage.getItem('enrolled-providers');
        if (enrolledProviders) {
          const providers = JSON.parse(enrolledProviders);
          const foundProvider = providers.find((p: any) => p.email === formData.email);
          
          if (foundProvider) {
            console.log('✅ Found enrolled contributor:', foundProvider);
            
            navigate('/contributor-dashboard', { 
              state: { 
                email: formData.email,
                userType: 'contributor',
                providerData: foundProvider
              }
            });

            toast({
              title: "Login Successful",
              description: `Welcome back, ${foundProvider.firstName}!`,
            });
          } else {
            throw new Error('Invalid credentials');
          }
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      console.log('🔐 === CONTRIBUTOR LOGIN SUCCESS ===');
      
    } catch (error: any) {
      console.log('❌ Contributor login error:', error.message);
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please check your credentials or contact admin.",
        variant: "destructive",
      });
      
      console.log('🔐 === CONTRIBUTOR LOGIN FAILED ===');
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
