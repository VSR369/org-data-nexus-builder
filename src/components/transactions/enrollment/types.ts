
export interface FormData {
  // Unique identifier for the solution provider
  providerId: string;
  
  // Institution fields (conditional)
  orgName: string;
  orgType: string;
  orgCountry: string;
  regAddress: string;
  departmentCategory: string;
  departmentSubCategory: string;
  
  // Provider details (required)
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  providerCountry: string;
  pinCode: string;
  address: string;
  
  // Optional fields
  website: string;
  bankAccount: string;
  bankName: string;
  branch: string;
  ifsc: string;
  linkedin: string;
  articles: string;
  websites: string;
  profileDocuments: string[];
}

export interface FormValidationProps {
  formData: FormData;
  providerType: string;
  selectedIndustrySegment: string;
}

export interface SavedDraftData {
  formData: FormData;
  providerType: string;
  selectedIndustrySegment: string;
  activeTab: string;
  lastSaved: string;
}

export interface FormSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
  invalidFields?: Set<string>;
}
