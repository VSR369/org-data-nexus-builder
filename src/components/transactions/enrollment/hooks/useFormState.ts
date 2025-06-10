import { useState, useEffect } from 'react';
import { FormData } from '../types';
import { validateRequiredFields } from '../utils/formValidation';
import { useToast } from "@/hooks/use-toast";
import { generateUniqueProviderId } from '@/utils/providerIdGenerator';

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
  const [selectedIndustrySegments, setSelectedIndustrySegments] = useState<string[]>(savedData?.selectedIndustrySegments || []);
  const [isSubmitted, setIsSubmitted] = useState(savedData?.isSubmitted || false);
  
  const [formData, setFormData] = useState<FormData>(savedData?.formData || {
    // Generate unique provider ID if not already present
    providerId: savedData?.formData?.providerId || generateUniqueProviderId(),
    
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
      console.log('Restored draft data - Industry segments:', savedData.selectedIndustrySegments);
      console.log('Restored submission status:', savedData.isSubmitted);
      console.log('Provider ID:', formData.providerId);
      toast({
        title: "Data Restored",
        description: `Your enrollment data has been restored. Provider ID: ${formData.providerId}`,
      });
    } else {
      console.log('New provider registration - Generated ID:', formData.providerId);
      toast({
        title: "New Registration",
        description: `New provider ID generated: ${formData.providerId}`,
      });
    }
  }, [toast, formData.providerId]);

  // Auto-save functionality with industry segments and submission status
  useEffect(() => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegments,
      isSubmitted,
      lastSaved: new Date().toISOString()
    };
    
    // Only save if there's some meaningful data
    const hasData = providerType || selectedIndustrySegments.length > 0 || 
      Object.values(formData).some(value => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return typeof value === 'string' && value.trim() !== '';
      });
    
    if (hasData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      console.log('Auto-saved draft data with submission status:', isSubmitted);
      console.log('Auto-saved industry segments:', selectedIndustrySegments);
    }
  }, [formData, providerType, selectedIndustrySegments, isSubmitted]);

  // Check validation whenever form data, provider type, or industry segments change
  useEffect(() => {
    const isValid = validateRequiredFields(formData, providerType, selectedIndustrySegments);
    setIsBasicDetailsComplete(isValid);
    console.log('Validation result changed:', isValid, 'for segments:', selectedIndustrySegments);
  }, [formData, providerType, selectedIndustrySegments]);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIndustrySegment = (segmentId: string) => {
    if (!selectedIndustrySegments.includes(segmentId)) {
      setSelectedIndustrySegments(prev => [...prev, segmentId]);
    }
  };

  const removeIndustrySegment = (segmentId: string) => {
    setSelectedIndustrySegments(prev => prev.filter(id => id !== segmentId));
  };

  const clearDraft = () => {
    // Only clear the draft data, don't reset the entire form if it's been submitted
    // This function should be used carefully - mainly for complete reset scenarios
    localStorage.removeItem(STORAGE_KEY);
    console.log('Draft cleared from storage');
  };

  const saveDraft = () => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegments,
      isSubmitted,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    console.log('Manual draft save with industry segments and submission status:', selectedIndustrySegments, isSubmitted);
    
    toast({
      title: "Draft Saved",
      description: "Your enrollment has been saved as a draft, including all industry segments and competency data",
    });
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
    
    // Store the submitted provider in a separate list to track enrollments
    try {
      const existingProviders = localStorage.getItem('enrolled-providers');
      const providers = existingProviders ? JSON.parse(existingProviders) : [];
      
      // Check if this provider ID already exists
      const existingIndex = providers.findIndex((p: any) => p.providerId === formData.providerId);
      
      const providerData = {
        providerId: formData.providerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        providerType,
        selectedIndustrySegments,
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      if (existingIndex >= 0) {
        // Update existing provider
        providers[existingIndex] = providerData;
        console.log('Updated existing provider enrollment:', formData.providerId);
      } else {
        // Add new provider
        providers.push(providerData);
        console.log('Added new provider enrollment:', formData.providerId);
      }
      
      localStorage.setItem('enrolled-providers', JSON.stringify(providers));
    } catch (error) {
      console.error('Error storing provider enrollment:', error);
    }
  };

  const resetSubmissionStatus = () => {
    setIsSubmitted(false);
  };

  return {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegments,
    addIndustrySegment,
    removeIndustrySegment,
    isBasicDetailsComplete,
    isSubmitted,
    markAsSubmitted,
    resetSubmissionStatus,
    clearDraft,
    saveDraft
  };
};
