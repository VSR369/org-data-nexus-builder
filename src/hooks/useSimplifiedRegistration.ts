
import { useState } from 'react';
import { FormData } from '@/types/seekerRegistration';
import { generateOrganizationId } from '@/utils/seekerUserStorage';

export const useSimplifiedRegistration = () => {
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

  const [currentStep, setCurrentStep] = useState(1);
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

  const validateCurrentStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.industrySegment) newErrors.industrySegment = 'Industry segment is required';
      if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
      if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    } else if (currentStep === 2) {
      // Document validation if needed
    } else if (currentStep === 3) {
      if (!formData.country) newErrors.country = 'Country is required';
    } else if (currentStep === 4) {
      if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitRegistration = async () => {
    console.log('Submitting simplified registration with data:', { ...formData, password: '[REDACTED]' });
    return { success: true };
  };

  return {
    formData,
    currentStep,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload,
    handleFileRemove,
    validateCurrentStep,
    nextStep,
    prevStep,
    submitRegistration
  };
};
