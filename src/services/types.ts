
export interface UserRecord {
  id: string;
  userId: string;
  password: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp: string;
  lastLoginTimestamp?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  // Membership-related properties
  membershipStatus?: 'active' | 'inactive' | 'not-member';
  selectedPlan?: string;
  selectedEngagementModel?: string;
  membershipActivationDate?: string;
  paymentStatus?: string;
}

export interface SessionData {
  userId: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  loginTimestamp: string;
}

export interface StorageHealthCheck {
  healthy: boolean;
  indexedDBWorking: boolean;
  localStorageWorking: boolean;
  migrationNeeded: boolean;
  userCount: number;
  error?: string;
}
