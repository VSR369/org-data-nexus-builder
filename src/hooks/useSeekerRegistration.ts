
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
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Save registered user data to localStorage for login authentication
    try {
      const registeredUser = {
        userId: formData.userId,
        password: formData.password,
        organizationName: formData.organizationName,
        entityType: formData.entityType,
        country: formData.country,
        email: formData.email,
        contactPersonName: formData.contactPersonName,
        industrySegment: formData.industrySegment,
        organizationId: formData.organizationId
      };

      // Get existing registered users or create new array
      const existingUsersData = localStorage.getItem('registered_users');
      const existingUsers = existingUsersData ? JSON.parse(existingUsersData) : [];
      
      console.log('📝 Before registration - existing users:', existingUsers);
      
      // Check if user already exists
      const userExists = existingUsers.find((user: any) => user.userId === formData.userId);
      if (userExists) {
        toast({
          title: "Registration Error",
          description: "User ID already exists. Please choose a different User ID.",
          variant: "destructive",
        });
        return;
      }

      // Add new user to the list
      existingUsers.push(registeredUser);
      
      // Save back to localStorage
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));
      
      console.log('💾 Successfully saved registered user to localStorage:', registeredUser);
      console.log('📋 All registered users after save:', existingUsers);
      
      // Verify the data was saved correctly
      const verifyData = localStorage.getItem('registered_users');
      console.log('🔍 Verification - data in localStorage after save:', verifyData);
      
    } catch (error) {
      console.error('❌ Error saving registration data:', error);
      toast({
        title: "Registration Error",
        description: "Failed to save registration data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically submit to your backend
    console.log('Form submitted:', formData);
    
    toast({
      title: "Registration Successful",
      description: "Your organization registration has been completed successfully! You can now login with your credentials.",
    });

    // Navigate to login page after successful registration
    setTimeout(() => {
      navigate('/seeker-login');
    }, 2000);
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
