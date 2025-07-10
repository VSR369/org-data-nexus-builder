
import { FormData } from '@/types/seekerRegistration';

export const generateOrganizationId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `ORG-${timestamp}-${random}`.toUpperCase();
};

export const generateUserId = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `USER-${timestamp}-${random}`.toUpperCase();
};

export const saveFormDataToStorage = (formData: FormData): void => {
  try {
    const dataToStore = {
      ...formData,
      password: '', // Don't store password
      confirmPassword: '', // Don't store confirm password
      timestamp: Date.now()
    };
    localStorage.setItem('seekerRegistrationData', JSON.stringify(dataToStore));
    console.log('✅ Form data saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving form data to localStorage:', error);
  }
};

export const loadFormDataFromStorage = (): Partial<FormData> | null => {
  try {
    const stored = localStorage.getItem('seekerRegistrationData');
    if (stored) {
      const parsedData = JSON.parse(stored);
      console.log('✅ Form data loaded from localStorage');
      return parsedData;
    }
  } catch (error) {
    console.error('❌ Error loading form data from localStorage:', error);
  }
  return null;
};

export const clearFormDataFromStorage = (): void => {
  try {
    localStorage.removeItem('seekerRegistrationData');
    console.log('✅ Form data cleared from localStorage');
  } catch (error) {
    console.error('❌ Error clearing form data from localStorage:', error);
  }
};

export const validateFormData = (formData: FormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!formData.industrySegment) errors.push('Industry segment is required');
  if (!formData.organizationName) errors.push('Organization name is required');
  if (!formData.organizationType) errors.push('Organization type is required');
  if (!formData.entityType) errors.push('Entity type is required');
  if (!formData.country) errors.push('Country is required');
  if (!formData.contactPersonName) errors.push('Contact person name is required');
  if (!formData.email) errors.push('Email is required');
  if (!formData.password) errors.push('Password is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (formData.password && formData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
