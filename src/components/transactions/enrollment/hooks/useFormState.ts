
import { useState, useEffect } from 'react';
import { FormData } from '../types';
import { validateRequiredFields } from '../utils/formValidation';
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'solution-provider-enrollment-draft';

// Function to load saved data synchronously
const loadSavedData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('Loading saved draft data synchronously:', parsedData);
      return parsedData;
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
  return null;
};

export const useFormState = () => {
  const { toast } = useToast();
  
  // Load saved data synchronously during initialization
  const savedData = loadSavedData();
  
  const [providerType, setProviderType] = useState(savedData?.providerType || '');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState(savedData?.selectedIndustrySegment || '');
  const [isSubmitted, setIsSubmitted] = useState(savedData?.isSubmitted || false);
  
  const [formData, setFormData] = useState<FormData>(savedData?.formData || {
    // Institution fields (conditional)
    orgName: '',
    orgType: '',
    orgCountry: '',
    regAddress: '',
    departmentCategory: '',
    departmentSubCategory: '',
    
    // Provider details (required)
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    providerCountry: '',
    pinCode: '',
    address: '',
    
    // Optional fields
    website: '',
    bankAccount: '',
    bankName: '',
    branch: '',
    ifsc: '',
    linkedin: '',
    articles: '',
    websites: '',
    profileDocuments: []
  });

  const [isBasicDetailsComplete, setIsBasicDetailsComplete] = useState(false);

  // Show toast notification if data was restored
  useEffect(() => {
    if (savedData) {
      console.log('Restored draft data - Industry segment:', savedData.selectedIndustrySegment);
      console.log('Restored submission status:', savedData.isSubmitted);
      toast({
        title: "Draft Restored",
        description: "Your previously saved draft has been restored.",
      });
    }
  }, [toast]);

  // Auto-save functionality with industry segment and submission status
  useEffect(() => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegment,
      isSubmitted,
      lastSaved: new Date().toISOString()
    };
    
    // Only save if there's some meaningful data
    const hasData = providerType || selectedIndustrySegment || 
      Object.values(formData).some(value => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return typeof value === 'string' && value.trim() !== '';
      });
    
    if (hasData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      console.log('Auto-saved draft data with submission status:', isSubmitted);
    }
  }, [formData, providerType, selectedIndustrySegment, isSubmitted]);

  // Check validation whenever form data, provider type, or industry segment changes
  useEffect(() => {
    const isValid = validateRequiredFields(formData, providerType, selectedIndustrySegment);
    setIsBasicDetailsComplete(isValid);
    console.log('Validation result changed:', isValid);
  }, [formData, providerType, selectedIndustrySegment]);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsSubmitted(false);
    console.log('Draft cleared from storage');
  };

  const saveDraft = () => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegment,
      isSubmitted,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    console.log('Manual draft save with industry segment and submission status:', selectedIndustrySegment, isSubmitted);
    
    toast({
      title: "Draft Saved",
      description: "Your enrollment has been saved as a draft",
    });
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
  };

  const resetSubmissionStatus = () => {
    setIsSubmitted(false);
  };

  return {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    isBasicDetailsComplete,
    isSubmitted,
    markAsSubmitted,
    resetSubmissionStatus,
    clearDraft,
    saveDraft
  };
};
