
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
    handleFileUpload
  } = useSeekerFormData();

  const {
    countries,
    industrySegments,
    entityTypes
  } = useSeekerMasterData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Starting registration submission process...');
    console.log('📝 Form data to register:', {
      userId: formData.userId,
      organizationName: formData.organizationName,
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

    // Check for duplicate user using SessionStorageManager instead of direct localStorage
    console.log('🔍 Checking for duplicate user with SessionStorageManager...');
    const existingUser = sessionStorageManager.findUser(formData.userId.trim(), 'dummy_password_check');
    
    // If we get any result, it means user exists (regardless of password)
    const usersData = localStorage.getItem('registered_users');
    let userExists = false;
    
    if (usersData) {
      try {
        const users = JSON.parse(usersData);
        userExists = users.some((user: any) => 
          user.userId.toLowerCase() === formData.userId.trim().toLowerCase()
        );
      } catch (error) {
        console.error('Error checking existing users:', error);
      }
    }
    
    if (userExists) {
      console.log('❌ User already exists:', formData.userId);
      toast({
        title: "Registration Error",
        description: `User ID "${formData.userId}" already exists. Please choose a different User ID.`,
        variant: "destructive",
      });
      setErrors({ userId: "This User ID is already taken" });
      return;
    }

    // Prepare user data for storage
    const registeredUser = prepareRegistrationData(formData);

    console.log('💾 Attempting to save user data:', registeredUser);

    // Save user data with validation
    const saveSuccess = saveUserDataSecurely(registeredUser);
    
    if (!saveSuccess) {
      console.log('❌ Failed to save user data');
      toast({
        title: "Registration Error",
        description: "Failed to save registration data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ Registration completed successfully');
    
    toast({
      title: "Registration Successful",
      description: `Welcome ${formData.contactPersonName}! Your account has been created successfully. You can now login with User ID: ${formData.userId}`,
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
    entityTypes,
    requiresRegistrationDocuments,
    handleInputChange,
    handleFileUpload,
    handleSubmit
  };
};
