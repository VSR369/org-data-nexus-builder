
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  return {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload
  };
};
