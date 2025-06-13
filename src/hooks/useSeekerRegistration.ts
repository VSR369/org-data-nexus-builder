
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { FormData, Country, IndustrySegment } from '@/types/seekerRegistration';
import { countriesDataManager } from '@/utils/sharedDataManagers';
import { DataManager } from '@/utils/dataManager';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';
import { useSeekerValidation } from './useSeekerValidation';

// Data manager for entity types
const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

// Generate unique organization ID
function generateOrganizationId(): string {
  return `ORG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

// Validate and clean user data before saving
function validateUserData(userData: any): boolean {
  console.log('🔍 Validating user data before save:', userData);
  
  const required = ['userId', 'password', 'organizationName', 'entityType', 'country', 'email', 'contactPersonName'];
  for (const field of required) {
    if (!userData[field] || userData[field].toString().trim() === '') {
      console.log(`❌ Missing required field: ${field}`);
      return false;
    }
  }
  
  console.log('✅ User data validation passed');
  return true;
}

// Save user data with multiple verification steps
function saveUserDataSecurely(userData: any): boolean {
  try {
    console.log('💾 Starting secure user data save process...');
    
    // Validate data first
    if (!validateUserData(userData)) {
      console.log('❌ User data validation failed, aborting save');
      return false;
    }

    // Get existing users
    const existingUsersData = localStorage.getItem('registered_users');
    const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
    
    console.log('📋 Current registered users count:', existingUsers.length);
    console.log('📋 Existing users:', existingUsers.map((u: any) => ({ userId: u.userId, org: u.organizationName })));
    
    // Check for duplicate user ID
    const userExists = existingUsers.find((user: any) => 
      user.userId.toLowerCase() === userData.userId.toLowerCase()
    );
    
    if (userExists) {
      console.log('❌ User ID already exists:', userData.userId);
      return false;
    }

    // Add new user
    existingUsers.push(userData);
    
    // Save to localStorage
    localStorage.setItem('registered_users', JSON.stringify(existingUsers));
    
    // Immediate verification
    const verificationData = localStorage.getItem('registered_users');
    if (!verificationData) {
      console.log('❌ Verification failed: No data found after save');
      return false;
    }
    
    const verifiedUsers = JSON.parse(verificationData);
    const savedUser = verifiedUsers.find((user: any) => 
      user.userId.toLowerCase() === userData.userId.toLowerCase()
    );
    
    if (!savedUser) {
      console.log('❌ Verification failed: User not found after save');
      return false;
    }
    
    console.log('✅ User data successfully saved and verified');
    console.log('✅ Saved user details:', {
      userId: savedUser.userId,
      organizationName: savedUser.organizationName,
      entityType: savedUser.entityType,
      country: savedUser.country
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error during secure user data save:', error);
    return false;
  }
}

export const useSeekerRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    industrySegment: '',
    organizationName: '',
    organizationId: generateOrganizationId(),
    entityType: '',
    registrationDocuments: [],
    companyProfile: null,
    companyLogo: null,
    website: '',
    country: '',
    address: '',
    contactPersonName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    userId: '',
    password: '',
    confirmPassword: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validateForm } = useSeekerValidation();

  // Load master data
  useEffect(() => {
    const loadedCountries = countriesDataManager.loadData();
    const loadedIndustrySegmentData = industrySegmentDataManager.loadData();
    const loadedEntityTypes = entityTypeDataManager.loadData();

    console.log('🔍 SeekerRegistration - Loaded industry segment data from master data:', loadedIndustrySegmentData);
    console.log('🔍 SeekerRegistration - Loaded countries from master data:', loadedCountries);
    console.log('🔍 SeekerRegistration - Loaded entity types from master data:', loadedEntityTypes);

    setCountries(loadedCountries);
    setIndustrySegments(loadedIndustrySegmentData.industrySegments || []);
    setEntityTypes(loadedEntityTypes);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => {
    if (!files) return;

    if (field === 'registrationDocuments') {
      const newFiles = Array.from(files).slice(0, 3);
      setFormData(prev => ({ ...prev, registrationDocuments: newFiles }));
    } else {
      setFormData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

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

    // Prepare user data for storage
    const registeredUser = {
      userId: formData.userId.trim(),
      password: formData.password,
      organizationName: formData.organizationName.trim(),
      entityType: formData.entityType,
      country: formData.country,
      email: formData.email.trim().toLowerCase(),
      contactPersonName: formData.contactPersonName.trim(),
      industrySegment: formData.industrySegment,
      organizationId: formData.organizationId,
      registrationTimestamp: new Date().toISOString()
    };

    console.log('💾 Attempting to save user data:', registeredUser);

    // Save user data with validation
    const saveSuccess = saveUserDataSecurely(registeredUser);
    
    if (!saveSuccess) {
      console.log('❌ Failed to save user data');
      toast({
        title: "Registration Error",
        description: "Failed to save registration data or User ID already exists. Please try again with a different User ID.",
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
