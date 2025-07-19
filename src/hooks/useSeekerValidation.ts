
import { FormData } from '@/types/seekerRegistration';
import { useMembershipFeeDataSupabase } from '@/components/master-data/seeker-membership/useMembershipFeeDataSupabase';
import { useSupabaseMasterData } from '@/hooks/useSupabaseMasterData';
import { useOrganizationTypes, useEntityTypes } from '@/hooks/useMasterDataCRUD';

export const useSeekerValidation = () => {
  // Access Supabase data for validation
  const { membershipFees, countries, entityTypes } = useMembershipFeeDataSupabase();

  const validateForm = (formData: any): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    // Basic validation
    if (!formData.industrySegment) errors.industrySegment = 'Industry segment is required';
    if (!formData.organizationName) errors.organizationName = 'Organization name is required';
    if (!formData.organizationType) errors.organizationType = 'Organization type is required';
    if (!formData.entityType) errors.entityType = 'Entity type is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.contactPersonName) errors.contactPersonName = 'Contact person name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.countryCode) errors.countryCode = 'Country code is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Password confirmation is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Password confirmation validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  return {
    validateForm
  };
};
