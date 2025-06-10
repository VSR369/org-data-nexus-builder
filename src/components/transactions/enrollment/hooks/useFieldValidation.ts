
import { useState } from 'react';
import { FormData } from '../types';

export const useFieldValidation = () => {
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  const validateAndHighlightFields = (
    formData: FormData,
    providerType: string,
    selectedIndustrySegments: string[],
    hasCompetencyRatings: boolean
  ) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword', 'providerCountry', 'pinCode', 'address'];
    const missingFields: string[] = [];
    const newInvalidFields = new Set<string>();

    // Check provider type
    if (!providerType) {
      missingFields.push('Provider Type');
      newInvalidFields.add('providerType');
    }

    // Check industry segments
    if (selectedIndustrySegments.length === 0) {
      missingFields.push('Industry Segment');
      newInvalidFields.add('industrySegment');
    }

    // Check institution fields if provider type is institution
    if (providerType === 'institution') {
      const institutionFields = ['orgName', 'orgType', 'orgCountry', 'regAddress', 'departmentCategory', 'departmentSubCategory'];
      institutionFields.forEach(field => {
        if (!formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '') {
          missingFields.push(field);
          newInvalidFields.add(field);
        }
      });
    }

    // Check required provider details
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '') {
        missingFields.push(field);
        newInvalidFields.add(field);
      }
    });

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      missingFields.push('Password confirmation');
      newInvalidFields.add('confirmPassword');
    }

    // Check if competency ratings exist for selected industry segments
    if (!hasCompetencyRatings && selectedIndustrySegments.length > 0) {
      missingFields.push('Core Competency Ratings for selected industry segments');
      newInvalidFields.add('competencyRatings');
    }

    setInvalidFields(newInvalidFields);

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  const clearFieldValidation = (field: string) => {
    setInvalidFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
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
