
import { FormData } from '@/types/seekerRegistration';

export const useSeekerValidation = () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // URL is optional
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (formData: FormData): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    // Required field validations
    if (!formData.industrySegment) newErrors.industrySegment = 'Industry segment is required';
    if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
    if (!formData.entityType) newErrors.entityType = 'Entity type is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // URL validation
    if (formData.website && !validateUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    // Phone number validation
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must contain only digits';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  return {
    validateForm,
    validateEmail,
    validateUrl
  };
};
