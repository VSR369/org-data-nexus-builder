
// Comprehensive seeker form validation utilities
export const useSeekerValidation = () => {
  const validateForm = (formData: any) => {
    const errors: { [key: string]: string } = {};

    // Organization name validation
    if (!formData.organizationName?.trim()) {
      errors.organizationName = 'Organization name is required';
    }

    // Contact person name validation
    if (!formData.contactPersonName?.trim()) {
      errors.contactPersonName = 'Contact person name is required';
    }

    // Email validation
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Organization type validation
    if (!formData.organizationType) {
      errors.organizationType = 'Organization type is required';
    }

    // Entity type validation
    if (!formData.entityType) {
      errors.entityType = 'Entity type is required';
    }

    // Industry segment validation
    if (!formData.industrySegment) {
      errors.industrySegment = 'Industry segment is required';
    }

    // Country validation
    if (!formData.country) {
      errors.country = 'Country is required';
    }

    // Address validation
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Check if registration documents are required
    const requiresRegistrationDocuments = ['Non-Profit Organization', 'Society', 'Trust'].includes(formData.entityType);
    if (requiresRegistrationDocuments && (!formData.registrationDocuments || formData.registrationDocuments.length === 0)) {
      errors.registrationDocuments = 'Registration documents are required for this entity type';
    }

    return errors;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone);
  };

  return {
    validateForm,
    validateEmail,
    validateUrl,
    validatePassword,
    validatePhone
  };
};
