
import { useState } from 'react';
import { FormData } from '@/types/seekerRegistration';
import { generateOrganizationId } from '@/utils/seekerUserStorage';

export const useSeekerRegistration = () => {
  const [formData, setFormData] = useState<FormData>({
    industrySegment: '',
    organizationName: '',
    organizationId: generateOrganizationId(),
    organizationType: '',
    entityType: '',
    registrationDocuments: [],
    companyProfile: [],
    companyLogo: [],
    website: '',
    country: '',
    address: '',
    contactPersonName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setFormData(prev => ({ 
      ...prev, 
      [field]: [...prev[field], ...newFiles]
    }));
  };

  const handleFileRemove = (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', index?: number) => {
    if (index !== undefined) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.industrySegment) newErrors.industrySegment = 'Industry segment is required';
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const submitRegistration = async () => {
    console.log('Submitting seeker registration with data:', { ...formData, password: '[REDACTED]' });
    // Implementation will be handled by the main SignUpForm component
    return { success: true };
  };

  return {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload,
    handleFileRemove,
    validateForm,
    submitRegistration
  };
};
