
export interface MembershipFeeEntry {
  id: string;
  country: string;
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

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  country: string;
  isUserCreated: boolean;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  region?: string;
}

export const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};
