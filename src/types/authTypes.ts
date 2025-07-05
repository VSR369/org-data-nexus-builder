export interface SolutionSeekingOrganization {
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
  registrationTimestamp?: string;
  status?: 'active' | 'pending' | 'inactive' | 'approved' | 'rejected';
  isActive?: boolean;
  isApproved?: boolean;
}

export interface AuthSession {
  userId: string;
  email: string;
  organizationName: string;
  organizationId: string;
  entityType: string;
  loginTime: string;
  expiryTime: string;
  userType: 'solution-seeking-organization';
  sessionToken: string;
}

export interface LoginCredentials {
  identifier: string; // email or organization name
  password: string;
  rememberMe?: boolean;
}

export interface AuthResult {
  success: boolean;
  data?: SolutionSeekingOrganization;
  session?: AuthSession;
  error?: string;
  errorCode?: 
    | 'ORGANIZATION_NOT_FOUND'
    | 'INVALID_PASSWORD' 
    | 'ACCOUNT_PENDING_APPROVAL'
    | 'ACCOUNT_INACTIVE'
    | 'STORAGE_ERROR'
    | 'NETWORK_ERROR'
    | 'INVALID_CREDENTIALS'
    | 'SESSION_EXPIRED';
}

export interface RememberMeData {
  identifier: string;
  expiryDate: string;
}

export interface AuthConfig {
  sessionExpiryHours: number;
  rememberMeDays: number;
  storageKeys: {
    organizations: string;
    session: string;
    rememberMe: string;
  };
}