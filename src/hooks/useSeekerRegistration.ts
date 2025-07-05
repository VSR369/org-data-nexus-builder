
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useSeekerValidation } from './useSeekerValidation';
import { useSeekerFormData } from './useSeekerFormData';
import { useSeekerMasterData } from './useSeekerMasterData';
import { saveUserDataSecurely, prepareRegistrationData } from '@/utils/seekerUserStorage';
import { sessionStorageManager } from '@/utils/storage/SessionStorageManager';

export const useSeekerRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateForm } = useSeekerValidation();
  
  const {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload,
    handleFileRemove
  } = useSeekerFormData();

  const {
    countries,
    industrySegments,
    organizationTypes,
    entityTypes
  } = useSeekerMasterData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Starting registration submission process...');
    console.log('📝 Form data to register:', {
      userId: formData.userId,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      entityType: formData.entityType,
      country: formData.country,
      email: formData.email,
      contactPersonName: formData.contactPersonName
    });
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      console.log('❌ Form validation failed:', validationErrors);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // The bulletproof service will handle all duplicate checking and validation

    // Prepare user data for storage
    const registeredUser = prepareRegistrationData(formData);

    console.log('💾 Attempting to save user data:', registeredUser);

    try {
      // Use bulletproof registration service with comprehensive data protection
      const saveSuccess = await saveUserDataSecurely(registeredUser);
      
      if (!saveSuccess) {
        console.log('❌ Bulletproof registration failed');
        toast({
          title: "Registration Error",
          description: "Failed to securely save your registration data. All information must be stored safely. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Bulletproof registration completed successfully');
      
      toast({
        title: "Registration Successful ✅",
        description: `Welcome ${formData.contactPersonName}! Your account has been created and all information is safely stored. You can now login with User ID: ${formData.userId}`,
      });

      // Navigate to seeker login page after successful registration
      setTimeout(() => {
        navigate('/seeker-login');
      }, 2000);
    } catch (error) {
      console.error('❌ Bulletproof registration error:', error);
      toast({
        title: "Registration Error",
        description: "Failed to securely save your registration data. Please try again to ensure all information is protected.",
        variant: "destructive",
      });
    }
  };

  const requiresRegistrationDocuments = ['Non-Profit Organization', 'Society', 'Trust'].includes(formData.entityType);

  return {
    formData,
    errors,
    countries,
    industrySegments,
    organizationTypes,
    entityTypes,
    requiresRegistrationDocuments,
    handleInputChange,
    handleFileUpload,
    handleFileRemove,
    handleSubmit
  };
};
