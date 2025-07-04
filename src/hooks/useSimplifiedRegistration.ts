// Simplified registration hook using the corrected UserDataManager

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserDataManager, type UserRecord } from '@/utils/userDataManager';
import { useSeekerFormData } from './useSeekerFormData';
import { useSeekerValidation } from './useSeekerValidation';
import { useSeekerMasterData } from './useSeekerMasterData';

export const useSimplifiedRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { validateForm } = useSeekerValidation();
  const {
    formData,
    errors,
    setErrors,
    handleInputChange,
    handleFileUpload,
    handleFileRemove
  } = useSeekerFormData();

  const {
    countries,
    industrySegments,
    organizationTypes,
    entityTypes
  } = useSeekerMasterData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 === SIMPLIFIED REGISTRATION SUBMISSION ===');
    console.log('📊 Form data:', {
      userId: formData.userId,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      entityType: formData.entityType,
      email: formData.email,
      contactPersonName: formData.contactPersonName
    });

    // Prevent double submission
    if (isSubmitting) {
      console.log('⚠️ Submission already in progress');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Validate form data
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        console.log('❌ Form validation failed:', validationErrors);
        toast.error('Please correct the errors in the form');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Prepare user record
      const userRecord: UserRecord = {
        userId: formData.userId.trim(),
        password: formData.password,
        organizationName: formData.organizationName.trim(),
        organizationType: formData.organizationType,
        entityType: formData.entityType,
        country: formData.country,
        email: formData.email.trim().toLowerCase(),
        contactPersonName: formData.contactPersonName.trim(),
        industrySegment: formData.industrySegment,
        organizationId: formData.organizationId,
        registrationTimestamp: new Date().toISOString()
      };

      console.log('💾 Attempting to save user registration...');

      // Step 3: Save registration using simplified UserDataManager
      const saveResult = UserDataManager.saveRegistrationData(userRecord);
      
      if (!saveResult.success) {
        console.log('❌ Registration save failed:', saveResult.error);
        
        if (saveResult.error?.includes('already exists')) {
          setErrors({ userId: "This User ID is already taken" });
        }
        
        toast.error(saveResult.error || 'Registration failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Registration completed successfully');
      
      // Step 4: Show success message and navigate
      toast.success('Registration Successful!', {
        description: `Welcome ${formData.contactPersonName}! You can now login with User ID: ${formData.userId}`
      });

      // Navigate to login page after brief delay
      setTimeout(() => {
        navigate('/seeking-org-admin-login');
      }, 2000);

    } catch (error) {
      console.error('❌ Registration submission error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiresRegistrationDocuments = ['Non-Profit Organization', 'Society', 'Trust'].includes(formData.entityType);

  return {
    // Form data and handlers
    formData,
    errors,
    countries,
    industrySegments,
    organizationTypes,
    entityTypes,
    requiresRegistrationDocuments,
    handleInputChange,
    handleFileUpload,
    handleFileRemove,
    
    // Submission
    handleSubmit,
    isSubmitting,
    
    // Utility functions
    validateRegistrationData: () => {
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    },
    
    clearForm: () => {
      // Reset form data if needed
      console.log('🔄 Form cleared');
    }
  };
};