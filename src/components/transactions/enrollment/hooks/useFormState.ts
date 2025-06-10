
import { useState, useEffect } from 'react';
import { FormData } from '../types';
import { validateRequiredFields } from '../utils/formValidation';
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'solution-provider-enrollment-draft';

export const useFormState = () => {
  const { toast } = useToast();
  const [providerType, setProviderType] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    // Institution fields (conditional)
    orgName: '',
    orgType: '',
    orgCountry: '',
    regAddress: '',
    
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
    profileDocument: ''
  });

  const [isBasicDetailsComplete, setIsBasicDetailsComplete] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('Loading saved draft data:', parsedData);
        
        if (parsedData.formData) {
          setFormData(parsedData.formData);
        }
        if (parsedData.providerType) {
          setProviderType(parsedData.providerType);
        }
        if (parsedData.selectedIndustrySegment) {
          setSelectedIndustrySegment(parsedData.selectedIndustrySegment);
        }
        
        toast({
          title: "Draft Restored",
          description: "Your previously saved draft has been restored.",
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [toast]);

  // Auto-save functionality
  useEffect(() => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegment,
      lastSaved: new Date().toISOString()
    };
    
    // Only save if there's some meaningful data
    const hasData = providerType || selectedIndustrySegment || 
      Object.values(formData).some(value => value.trim() !== '');
    
    if (hasData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      console.log('Auto-saved draft data');
    }
  }, [formData, providerType, selectedIndustrySegment]);

  // Check validation whenever form data, provider type, or industry segment changes
  useEffect(() => {
    const isValid = validateRequiredFields(formData, providerType, selectedIndustrySegment);
    setIsBasicDetailsComplete(isValid);
    console.log('Validation result changed:', isValid);
  }, [formData, providerType, selectedIndustrySegment]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Draft cleared from storage');
  };

  const saveDraft = () => {
    const saveData = {
      formData,
      providerType,
      selectedIndustrySegment,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    
    toast({
      title: "Draft Saved",
      description: "Your enrollment has been saved as a draft",
    });
  };

  return {
    formData,
    updateFormData,
    providerType,
    setProviderType,
    selectedIndustrySegment,
    setSelectedIndustrySegment,
    isBasicDetailsComplete,
    clearDraft,
    saveDraft
  };
};
