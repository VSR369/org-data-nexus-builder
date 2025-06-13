
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
  entityType: string;
  registrationDocuments: File[];
  companyProfile: File | null;
  companyLogo: File | null;
  website: string;
  country: string;
  address: string;
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  userId: string;
  password: string;
  confirmPassword: string;
}

export interface FormErrors {
  [key: string]: string;
}
