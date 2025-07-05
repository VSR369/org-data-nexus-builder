import { 
  SolutionSeekingOrganization, 
  AuthSession, 
  LoginCredentials, 
  AuthResult, 
  RememberMeData,
  AuthConfig 
} from '@/types/authTypes';

class SolutionSeekingOrgAuthService {
  private config: AuthConfig = {
    sessionExpiryHours: 8, // 8 hours session expiry
    rememberMeDays: 30, // 30 days remember me
    storageKeys: {
      organizations: 'registered_users',
      session: 'current_seeking_org_session',
      rememberMe: 'seeking_org_remember_me'
    }
  };

  /**
   * Generate a secure session token
   */
  private generateSessionToken(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2);
    return `sso_${timestamp}_${randomStr}`;
  }

  /**
   * Get all solution seeking organizations from localStorage
   */
  private getAllOrganizations(): SolutionSeekingOrganization[] {
    try {
      console.log('📊 AUTH - Retrieving organizations from localStorage...');
      const data = localStorage.getItem(this.config.storageKeys.organizations);
      
      if (!data) {
        console.log('⚠️ AUTH - No organizations found in localStorage');
        return [];
      }

      const organizations = JSON.parse(data) as SolutionSeekingOrganization[];
      console.log(`📊 AUTH - Found ${organizations.length} organizations`);
      
      // Filter only solution seeking organizations
      const solutionSeekingOrgs = organizations.filter(org => 
        this.isSolutionSeekingOrganization(org)
      );
      
      console.log(`📊 AUTH - Filtered ${solutionSeekingOrgs.length} solution seeking organizations`);
      return solutionSeekingOrgs;
      
    } catch (error) {
      console.error('❌ AUTH - Error retrieving organizations:', error);
      return [];
    }
  }

  /**
   * Check if organization is a solution seeking organization
   */
  private isSolutionSeekingOrganization(org: SolutionSeekingOrganization): boolean {
    const entityType = org.entityType?.toLowerCase() || '';
    return entityType.includes('solution') || 
           entityType.includes('seeker') || 
           entityType === 'solution-seeker';
  }

  /**
   * Find organization by email or organization name (case-insensitive)
   */
  private findOrganization(identifier: string): SolutionSeekingOrganization | null {
    const organizations = this.getAllOrganizations();
    const searchTerm = identifier.toLowerCase().trim();
    
    console.log(`🔍 AUTH - Searching for organization with identifier: ${identifier}`);
    
    const organization = organizations.find(org => 
      org.email.toLowerCase() === searchTerm || 
      org.organizationName.toLowerCase() === searchTerm
    );
    
    if (organization) {
      console.log(`✅ AUTH - Organization found: ${organization.organizationName}`);
    } else {
      console.log('❌ AUTH - Organization not found');
    }
    
    return organization || null;
  }

  /**
   * Validate organization status
   */
  private validateOrganizationStatus(org: SolutionSeekingOrganization): AuthResult {
    // Check if organization is active
    if (org.status === 'inactive' || org.isActive === false) {
      return {
        success: false,
        error: 'Your account has been deactivated. Please contact support for assistance.',
        errorCode: 'ACCOUNT_INACTIVE'
      };
    }

    // Check if organization is approved
    if (org.status === 'pending' || org.isApproved === false) {
      return {
        success: false,
        error: 'Your account is pending approval. Please wait for admin approval or contact support.',
        errorCode: 'ACCOUNT_PENDING_APPROVAL'
      };
    }

    if (org.status === 'rejected') {
      return {
        success: false,
        error: 'Your account registration has been rejected. Please contact support for more information.',
        errorCode: 'ACCOUNT_PENDING_APPROVAL'
      };
    }

    return { success: true };
  }

  /**
   * Secure password comparison
   */
  private verifyPassword(providedPassword: string, storedPassword: string): boolean {
    // In a real application, you would use proper password hashing
    // For now, we'll do a direct comparison but log it securely
    console.log('🔐 AUTH - Verifying password...');
    const isValid = providedPassword === storedPassword;
    console.log(`🔐 AUTH - Password verification: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    return isValid;
  }

  /**
   * Create authentication session
   */
  private createAuthSession(org: SolutionSeekingOrganization): AuthSession {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + (this.config.sessionExpiryHours * 60 * 60 * 1000));
    
    const session: AuthSession = {
      userId: org.userId,
      email: org.email,
      organizationName: org.organizationName,
      organizationId: org.organizationId,
      entityType: org.entityType,
      loginTime: now.toISOString(),
      expiryTime: expiryTime.toISOString(),
      userType: 'solution-seeking-organization',
      sessionToken: this.generateSessionToken()
    };

    console.log('🔐 AUTH - Created session:', {
      userId: session.userId,
      organizationName: session.organizationName,
      expiryTime: session.expiryTime,
      sessionToken: session.sessionToken.substring(0, 10) + '...'
    });

    return session;
  }

  /**
   * Store session in sessionStorage
   */
  private storeSession(session: AuthSession): boolean {
    try {
      sessionStorage.setItem(this.config.storageKeys.session, JSON.stringify(session));
      console.log('💾 AUTH - Session stored in sessionStorage');
      return true;
    } catch (error) {
      console.error('❌ AUTH - Error storing session:', error);
      return false;
    }
  }

  /**
   * Handle remember me functionality
   */
  private handleRememberMe(identifier: string, remember: boolean): void {
    if (remember) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + this.config.rememberMeDays);
      
      const rememberData: RememberMeData = {
        identifier,
        expiryDate: expiryDate.toISOString()
      };
      
      localStorage.setItem(this.config.storageKeys.rememberMe, JSON.stringify(rememberData));
      console.log('💾 AUTH - Remember me data saved');
    } else {
      localStorage.removeItem(this.config.storageKeys.rememberMe);
      console.log('🗑️ AUTH - Remember me data cleared');
    }
  }

  /**
   * Main login function
   */
  async loginSolutionSeekingOrg(credentials: LoginCredentials): Promise<AuthResult> {
    console.log('🔐 AUTH - Starting login process...');
    
    try {
      // Find organization
      const organization = this.findOrganization(credentials.identifier);
      
      if (!organization) {
        return {
          success: false,
          error: 'Organization not found. Please check your email or organization name.',
          errorCode: 'ORGANIZATION_NOT_FOUND'
        };
      }

      // Validate organization status
      const statusValidation = this.validateOrganizationStatus(organization);
      if (!statusValidation.success) {
        return statusValidation;
      }

      // Verify password
      if (!this.verifyPassword(credentials.password, organization.password)) {
        return {
          success: false,
          error: 'Invalid password. Please check your password and try again.',
          errorCode: 'INVALID_PASSWORD'
        };
      }

      // Create session
      const session = this.createAuthSession(organization);
      
      // Store session
      if (!this.storeSession(session)) {
        return {
          success: false,
          error: 'Failed to create session. Please try again.',
          errorCode: 'STORAGE_ERROR'
        };
      }

      // Handle remember me
      this.handleRememberMe(credentials.identifier, credentials.rememberMe || false);

      console.log('✅ AUTH - Login successful');
      
      return {
        success: true,
        data: organization,
        session
      };

    } catch (error) {
      console.error('❌ AUTH - Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login. Please try again.',
        errorCode: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get current authenticated organization
   */
  getCurrentSolutionSeekingOrg(): AuthSession | null {
    try {
      const sessionData = sessionStorage.getItem(this.config.storageKeys.session);
      
      if (!sessionData) {
        console.log('📊 AUTH - No current session found');
        return null;
      }

      const session = JSON.parse(sessionData) as AuthSession;
      
      // Check if session is expired
      const now = new Date();
      const expiryTime = new Date(session.expiryTime);
      
      if (now > expiryTime) {
        console.log('⏰ AUTH - Session expired, clearing...');
        this.logoutSolutionSeekingOrg();
        return null;
      }

      console.log('✅ AUTH - Valid session found');
      return session;
      
    } catch (error) {
      console.error('❌ AUTH - Error getting current session:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const session = this.getCurrentSolutionSeekingOrg();
    return session !== null;
  }

  /**
   * Logout and clean up session
   */
  logoutSolutionSeekingOrg(): void {
    try {
      // Clear session storage
      sessionStorage.removeItem(this.config.storageKeys.session);
      
      console.log('🔓 AUTH - User logged out, session cleared');
    } catch (error) {
      console.error('❌ AUTH - Error during logout:', error);
    }
  }

  /**
   * Get remember me data
   */
  getRememberMeData(): RememberMeData | null {
    try {
      const rememberData = localStorage.getItem(this.config.storageKeys.rememberMe);
      
      if (!rememberData) {
        return null;
      }

      const data = JSON.parse(rememberData) as RememberMeData;
      const expiryDate = new Date(data.expiryDate);
      const now = new Date();
      
      if (now > expiryDate) {
        console.log('⏰ AUTH - Remember me data expired, clearing...');
        localStorage.removeItem(this.config.storageKeys.rememberMe);
        return null;
      }

      return data;
      
    } catch (error) {
      console.error('❌ AUTH - Error getting remember me data:', error);
      localStorage.removeItem(this.config.storageKeys.rememberMe);
      return null;
    }
  }

  /**
   * Clear all authentication data
   */
  clearAllAuthData(): void {
    try {
      sessionStorage.removeItem(this.config.storageKeys.session);
      localStorage.removeItem(this.config.storageKeys.rememberMe);
      console.log('🗑️ AUTH - All authentication data cleared');
    } catch (error) {
      console.error('❌ AUTH - Error clearing auth data:', error);
    }
  }

  /**
   * Get authentication service health status
   */
  getAuthServiceHealth(): any {
    const organizations = this.getAllOrganizations();
    const currentSession = this.getCurrentSolutionSeekingOrg();
    const rememberMeData = this.getRememberMeData();
    
    return {
      organizationsCount: organizations.length,
      hasActiveSession: currentSession !== null,
      hasRememberMeData: rememberMeData !== null,
      sessionExpiry: currentSession?.expiryTime || null,
      config: this.config
    };
  }
}

// Export singleton instance
export const solutionSeekingOrgAuthService = new SolutionSeekingOrgAuthService();