// Seeker form validation utilities
export const useSeekerValidation = () => {
  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};

    // Required field validations
    if (!formData.userId?.trim()) {
      errors.userId = 'User ID is required';
    }

    if (!formData.organizationName?.trim()) {
      errors.organizationName = 'Organization name is required';
    }

    if (!formData.contactPersonName?.trim()) {
      errors.contactPersonName = 'Contact person name is required';
    }

    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.organizationType) {
      errors.organizationType = 'Organization type is required';
    }

    if (!formData.entityType) {
      errors.entityType = 'Entity type is required';
    }

    if (!formData.industrySegment) {
      errors.industrySegment = 'Industry segment is required';
    }

    if (!formData.country) {
      errors.country = 'Country is required';
    }

    return errors;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return {
    validateForm,
    validateEmail,
    validateUrl
  };
};