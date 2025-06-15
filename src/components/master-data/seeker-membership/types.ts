
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isUserCreated?: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  isUserCreated?: boolean;
}

export interface MembershipFeeEntry {
  id: string;
  country: string;
  organizationType: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

export interface DataHealth {
  currencies: { isValid: boolean; issues: string[] };
  countries: { isValid: boolean; issues: string[] };
  entityTypes: { isValid: boolean; issues: string[] };
  membershipFees: { isValid: boolean; issues: string[] };
}

export const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};
