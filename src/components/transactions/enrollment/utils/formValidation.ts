
import { FormData } from '../types';

export const validateRequiredFields = (
  formData: FormData,
  providerType: string,
  selectedIndustrySegment: string
): boolean => {
  const requiredFields = [
    'firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword',
    'providerCountry', 'pinCode'
  ];

  // Add institution fields if provider type is institution
  if (providerType === 'institution') {
    requiredFields.push('orgName', 'orgType', 'orgCountry', 'regAddress');
  }

  // Check if industry segment and provider type are selected
  if (!selectedIndustrySegment || !providerType) {
    return false;
  }

  // Check all required fields
  for (const field of requiredFields) {
    if (!formData[field as keyof FormData]) {
      return false;
    }
  }

  // Check password confirmation
  if (formData.password !== formData.confirmPassword) {
    return false;
  }

  return true;
};
