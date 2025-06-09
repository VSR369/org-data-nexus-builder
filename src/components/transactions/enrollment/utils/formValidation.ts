
import { FormData } from '../types';

export const validateRequiredFields = (
  formData: FormData,
  providerType: string,
  selectedIndustrySegment: string
): boolean => {
  console.log('Validation check:', { formData, providerType, selectedIndustrySegment });
  
  // Check if industry segment and provider type are selected first
  if (!selectedIndustrySegment || !providerType) {
    console.log('Missing industry segment or provider type');
    return false;
  }

  const requiredFields = [
    'firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword',
    'providerCountry', 'pinCode'
  ];

  // Add institution fields if provider type is institution
  if (providerType === 'institution') {
    requiredFields.push('orgName', 'orgType', 'orgCountry', 'regAddress');
  }

  // Check all required fields
  for (const field of requiredFields) {
    const value = formData[field as keyof FormData];
    if (!value || value.trim() === '') {
      console.log(`Missing required field: ${field}`);
      return false;
    }
  }

  // Check password confirmation
  if (formData.password !== formData.confirmPassword) {
    console.log('Password confirmation mismatch');
    return false;
  }

  console.log('All validation checks passed');
  return true;
};
