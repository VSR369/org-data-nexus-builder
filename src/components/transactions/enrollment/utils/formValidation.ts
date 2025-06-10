
import { FormData } from '../types';

export const validateRequiredFields = (
  formData: FormData,
  providerType: string,
  selectedIndustrySegments: string[]
): boolean => {
  // Check provider roles
  if (!formData.providerRoles || formData.providerRoles.length === 0) return false;
  
  // Check provider type
  if (!providerType) return false;

  // Check industry segments - at least one should be selected
  if (selectedIndustrySegments.length === 0) return false;

  // Check institution fields if provider type is institution
  if (providerType === 'organization') {
    const institutionFields = ['orgName', 'orgType', 'orgCountry', 'regAddress', 'departmentCategory', 'departmentSubCategory'];
    if (institutionFields.some(field => !formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '')) {
      return false;
    }
  }

  // Check required provider details
  const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword', 'providerCountry', 'pinCode', 'address'];
  if (requiredFields.some(field => !formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '')) {
    return false;
  }

  // Check password confirmation
  if (formData.password !== formData.confirmPassword) {
    return false;
  }

  return true;
};
