
import { useState } from 'react';
import { FormData } from '@/types/seekerRegistration';
import { generateOrganizationId } from '@/utils/seekerUserStorage';

export const useSeekerFormData = () => {
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
    userId: '',
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

  return {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload,
    handleFileRemove
  };
};
