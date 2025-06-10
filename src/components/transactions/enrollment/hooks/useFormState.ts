
import { useState, useEffect, useCallback } from 'react';
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

// Function to force save data immediately
const forceSaveData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Force saved draft data:', data);
  } catch (error) {
    console.error('Error force saving data:', error);
  }
};

export const useFormState = () => {
  const { toast } = useToast();
  
  // Load saved data synchronously during initialization
  const savedData = loadSavedData();
  
  const [providerType, setProviderType] = useState(savedData?.providerType || '');
  const [selectedIndustrySegments, setSelectedIndustrySegments] = useState<string[]>(savedData?.selectedIndustrySegments || []);
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
    
    // Provider role selection
    providerRoles: [],
    
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

  // Enhanced auto-save with immediate persistence
  const saveToStorage = useCallback(() => {
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
      forceSaveData(saveData);
      console.log('Auto-saved draft data with submission status:', isSubmitted);
      console.log('Auto-saved industry segments:', selectedIndustrySegments);
    }
  }, [formData, providerType, selectedIndustrySegments, isSubmitted]);

  // Auto-save functionality with debounced saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [saveToStorage]);

  // Save on page unload/navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveToStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveToStorage]);

  // Show toast notification if data was restored
  useEffect(() => {
    if (savedData) {
      console.log('Restored draft data - Industry segments:', savedData.selectedIndustrySegments);
      console.log('Restored submission status:', savedData.isSubmitted);
      toast({
        title: "Draft Restored",
        description: "Your enrollment data has been restored from previous session",
      });
    } else {
      console.log('New provider registration started');
    }
  }, [toast]);

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
    // Force immediate save on critical field changes
    setTimeout(saveToStorage, 0);
  };

  const addIndustrySegment = (segmentId: string) => {
    if (!selectedIndustrySegments.includes(segmentId)) {
      setSelectedIndustrySegments(prev => {
        const newSegments = [...prev, segmentId];
        // Force save immediately after adding segment
        setTimeout(() => {
          const saveData = {
            formData,
            providerType,
            selectedIndustrySegments: newSegments,
            isSubmitted,
            lastSaved: new Date().toISOString()
          };
          forceSaveData(saveData);
        }, 0);
        return newSegments;
      });
    }
  };

  const removeIndustrySegment = (segmentId: string) => {
    setSelectedIndustrySegments(prev => {
      const newSegments = prev.filter(id => id !== segmentId);
      // Force save immediately after removing segment
      setTimeout(() => {
        const saveData = {
          formData,
          providerType,
          selectedIndustrySegments: newSegments,
          isSubmitted,
          lastSaved: new Date().toISOString()
        };
        forceSaveData(saveData);
      }, 0);
      return newSegments;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Draft cleared from storage');
  };

  const saveDraft = () => {
    saveToStorage();
    
    toast({
      title: "Draft Saved",
      description: "Your enrollment has been saved as a draft and will persist across all navigation",
    });
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
    
    // Store the submitted provider in a separate list to track enrollments
    try {
      const existingProviders = localStorage.getItem('enrolled-providers');
      const providers = existingProviders ? JSON.parse(existingProviders) : [];
      
      const providerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        providerType,
        selectedIndustrySegments,
        submittedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      providers.push(providerData);
      localStorage.setItem('enrolled-providers', JSON.stringify(providers));
      console.log('Added new provider enrollment');
      
      // Force save the updated submission status
      setTimeout(saveToStorage, 0);
    } catch (error) {
      console.error('Error storing provider enrollment:', error);
    }
  };

  const resetSubmissionStatus = () => {
    setIsSubmitted(false);
    setTimeout(saveToStorage, 0);
  };

  return {
    formData,
    updateFormData,
    providerType,
    setProviderType: (type: string) => {
      setProviderType(type);
      setTimeout(saveToStorage, 0);
    },
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
