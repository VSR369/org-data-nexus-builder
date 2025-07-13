// Legacy storage utilities - deprecated
// These functions now return empty/default values since we use Supabase only

import { FormData } from '@/types/seekerRegistration';

export const generateOrganizationId = (): string => {
  return `ORG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

export const generateUserId = (): string => {
  return `USER-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

export const saveFormDataToStorage = (formData: FormData): void => {
  // No-op - we use Supabase now
  console.warn('saveFormDataToStorage is deprecated - use Supabase instead');
};

export const loadFormDataFromStorage = (): Partial<FormData> | null => {
  // Return null - we use Supabase now
  return null;
};

export const clearFormDataFromStorage = (): void => {
  // No-op - we use Supabase now
};

export const validateFormData = (formData: FormData): { isValid: boolean; errors: string[] } => {
  return { isValid: true, errors: [] };
};