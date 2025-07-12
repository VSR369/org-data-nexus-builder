
export interface Currency {
  id?: string;
  code: string;
  name: string;
  symbol: string;
  country_id: string;
  countryName?: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

export interface StorageConfig {
  key: string;
  version: number;
  preserveUserData: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
}
