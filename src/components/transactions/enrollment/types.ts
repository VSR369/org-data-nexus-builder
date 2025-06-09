
export interface FormData {
  // Institution fields (conditional)
  orgName: string;
  orgType: string;
  orgCountry: string;
  regAddress: string;
  
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
}

export interface FormValidationProps {
  formData: FormData;
  providerType: string;
  selectedIndustrySegment: string;
}
