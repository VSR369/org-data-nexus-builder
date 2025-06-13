
import { useState } from 'react';

interface LoginFormData {
  userId: string;
  password: string;
}

export const useLoginFormValidation = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: LoginFormData): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return {
    errors,
    setErrors,
    validateForm,
    clearFieldError
  };
};
