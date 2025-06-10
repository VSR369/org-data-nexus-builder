
import { useState } from 'react';
import { FormData } from '../types';

export const useFieldValidation = () => {
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  const validateAndHighlightFields = (
    formData: FormData,
    providerType: string,
    selectedIndustrySegment: string,
    hasCompetencyRatings: boolean
  ): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    const newInvalidFields = new Set<string>();

    // Check if industry segment and provider type are selected
    if (!selectedIndustrySegment) {
      missingFields.push('Industry Segment');
    }
    
    if (!providerType) {
      missingFields.push('Provider Type');
      newInvalidFields.add('providerType');
    }

    const requiredFields: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name', 
      email: 'Email',
      mobile: 'Mobile',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      providerCountry: 'Provider Country',
      pinCode: 'Pin Code'
    };

    // Add institution fields if provider type is institution
    if (providerType === 'institution') {
      requiredFields.orgName = 'Organization Name';
      requiredFields.orgType = 'Organization Type';
      requiredFields.orgCountry = 'Organization Country';
      requiredFields.regAddress = 'Registered Address';
    }

    // Check all required fields
    for (const [field, label] of Object.entries(requiredFields)) {
      const value = formData[field as keyof FormData];
      if (Array.isArray(value)) {
        continue; // Skip array fields
      }
      if (!value || value.trim() === '') {
        missingFields.push(label);
        newInvalidFields.add(field);
      }
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword && formData.password && formData.confirmPassword) {
      missingFields.push('Password confirmation must match');
      newInvalidFields.add('confirmPassword');
    }

    // Check competency ratings
    if (!hasCompetencyRatings) {
      missingFields.push('Competency ratings in Core Competencies tab');
    }

    setInvalidFields(newInvalidFields);
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const clearFieldValidation = (fieldName: string) => {
    setInvalidFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const clearAllValidation = () => {
    setInvalidFields(new Set());
  };

  return {
    invalidFields,
    validateAndHighlightFields,
    clearFieldValidation,
    clearAllValidation
  };
};
