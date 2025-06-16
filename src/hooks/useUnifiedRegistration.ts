
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSeekerValidation } from './useSeekerValidation';
import { useSeekerFormData } from './useSeekerFormData';
import { useSeekerMasterData } from './useSeekerMasterData';
import { registerUser, RegistrationData } from '@/utils/unifiedAuthUtils';

export const useUnifiedRegistration = () => {
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
    
    console.log('📝 Starting unified registration submission...');
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
      toast.error('Validation Error', {
        description: 'Please correct the errors in the form'
      });
      return;
    }

    // Prepare registration data
    const registrationData: RegistrationData = {
      userId: formData.userId.trim(),
      password: formData.password,
      organizationName: formData.organizationName.trim(),
      organizationType: formData.organizationType,
      entityType: formData.entityType,
      country: formData.country,
      email: formData.email.trim().toLowerCase(),
      contactPersonName: formData.contactPersonName.trim(),
      industrySegment: formData.industrySegment,
      organizationId: formData.organizationId
    };

    console.log('💾 Attempting unified registration...');

    // Register user with unified service
    const result = await registerUser(registrationData);
    
    if (!result.success) {
      console.log('❌ Unified registration failed:', result.error);
      toast.error('Registration Error', {
        description: result.error || 'Failed to register user. Please try again.'
      });
      
      if (result.error?.includes('already exists')) {
        setErrors({ userId: "This User ID is already taken" });
      }
      return;
    }

    console.log('✅ Unified registration completed successfully');
    
    toast.success('Registration Successful', {
      description: `Welcome ${formData.contactPersonName}! Your account has been created successfully. You can now login with User ID: ${formData.userId}`
    });

    // Navigate to login page after successful registration
    setTimeout(() => {
      navigate('/seeker-login');
    }, 3000);
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
