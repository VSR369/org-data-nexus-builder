export interface MasterDataItem {
  id: string;
  name: string;
  code?: string;
}

export interface OrganizationFormData {
  organizationName: string;
  organizationId: string;
  organizationTypeId: string;
  entityTypeId: string;
  industrySegmentId: string;
  companyProfileDocument: File | null;
  companyLogo: File | null;
  website: string;
  countryId: string;
  address: string;
  contactPersonName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface OrganizationFormErrors {
  [key: string]: string;
}

export interface FileUploadProgress {
  companyProfileDocument?: number;
  companyLogo?: number;
}