
export interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

export interface IndustrySegment {
  id: string;
  industrySegment: string;
  description?: string;
}

export interface FormData {
  industrySegment: string;
  organizationName: string;
  organizationId: string;
  organizationType: string;
  entityType: string;
  registrationDocuments: File[];
  companyProfile: File[];
  companyLogo: File[];
  website: string;
  country: string;
  address: string;
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  [key: string]: string;
}
