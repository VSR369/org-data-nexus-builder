import { useState } from 'react';
import { FormData } from '../types';

export const useFieldValidation = () => {
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  const getFieldDisplayName = (field: string): string => {
    const fieldNameMap: { [key: string]: string } = {
      'providerRoles': 'Contributor Role',
      'providerType': 'Representation (Individual/Organization)',
      'industrySegment': 'Industry Segment',
      'orgName': 'Organization Name',
      'orgType': 'Organization Type',
      'orgCountry': 'Organization Country',
      'regAddress': 'Registered Address',
      'departmentCategory': 'Department Category',
      'departmentSubCategory': 'Department Sub Category',
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'email': 'Email',
      'mobile': 'Mobile',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'providerCountry': 'Provider Country',
      'pinCode': 'Pin Code',
      'address': 'Address',
      'bankAccount': 'Bank Account Number',
      'bankName': 'Bank Name',
      'branch': 'Branch',
      'ifsc': 'IFSC Code',
      'userId': 'User ID'
    };
    
    return fieldNameMap[field] || field;
  };

  const validateAndHighlightFields = (
    formData: FormData,
    providerType: string,
    selectedIndustrySegments: string[]
  ) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'confirmPassword', 'providerCountry', 'pinCode', 'address'];
    const missingFields: string[] = [];
    const newInvalidFields = new Set<string>();

    // Check if provider roles are selected
    if (!formData.providerRoles || formData.providerRoles.length === 0) {
      missingFields.push(getFieldDisplayName('providerRoles'));
      newInvalidFields.add('providerRoles');
    }

    // Check provider type
    if (!providerType) {
      missingFields.push(getFieldDisplayName('providerType'));
      newInvalidFields.add('providerType');
    }

    // Check industry segments
    if (selectedIndustrySegments.length === 0) {
      missingFields.push(getFieldDisplayName('industrySegment'));
      newInvalidFields.add('industrySegment');
    }

    // Check institution fields if provider type is organization
    if (providerType === 'organization') {
      const institutionFields = ['orgName', 'orgType', 'orgCountry', 'regAddress', 'departmentCategory', 'departmentSubCategory'];
      institutionFields.forEach(field => {
        if (!formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '') {
          missingFields.push(getFieldDisplayName(field));
          newInvalidFields.add(field);
        }
      });
    }

    // Check required provider details
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '') {
        missingFields.push(getFieldDisplayName(field));
        newInvalidFields.add(field);
      }
    });

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      missingFields.push('Password confirmation must match');
      newInvalidFields.add('confirmPassword');
    }

    // Check banking details - only if any banking field is filled, then all must be filled
    const bankingFields = ['bankAccount', 'bankName', 'branch', 'ifsc'];
    const filledBankingFields = bankingFields.filter(field => 
      formData[field as keyof FormData] && (formData[field as keyof FormData] as string).trim() !== ''
    );
    
    if (filledBankingFields.length > 0 && filledBankingFields.length < bankingFields.length) {
      bankingFields.forEach(field => {
        if (!formData[field as keyof FormData] || (formData[field as keyof FormData] as string).trim() === '') {
          missingFields.push(getFieldDisplayName(field));
          newInvalidFields.add(field);
        }
      });
    }

    console.log('Validation found these invalid fields:', Array.from(newInvalidFields));
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
