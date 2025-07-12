

// Administrator data structure 
interface AdminData {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  userId: string;
  password: string; // Hashed
  organizationId: string;
  createdAt: string;
  isActive: boolean;
  organizationName: string;
  sourceSeekerId: string;
  role: string;
  adminCreatedBy: string;
  lastUpdated?: string;
  updatedBy?: string;
}

interface LoginAttempt {
  timestamp: string;
  success: boolean;
  identifier: string; // email or userId used
}

interface SessionData {
  adminId: string;
  adminName: string;
  adminEmail: string;
  userId: string;
  organizationName: string;
  organizationId: string;
  role: string;
  loginTimestamp: string;
  sessionId: string;
  expiryTime: string;
  rememberMe: boolean;
}

interface AuthResult {
  success: boolean;
  admin?: AdminData;
  error?: string;
  errorCode?: 'USER_NOT_FOUND' | 'INVALID_PASSWORD' | 'ACCOUNT_INACTIVE' | 'STORAGE_ERROR' | 'UNKNOWN_ERROR';
}

export class SeekingOrgAdminAuthService {
  private static readonly STORAGE_KEY = 'administrators';
  private static readonly SESSION_KEY = 'seeking_org_admin_session';
  private static readonly REMEMBER_KEY = 'seeking_org_admin_remember';
  private static readonly LOGIN_ATTEMPTS_KEY = 'admin_login_attempts';
  private static readonly PASSWORD_SALT = 'admin_salt_2024';
  private static readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  private static readonly REMEMBER_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  /**
   * Simple password comparison (no hashing)
   */
  private static comparePassword(inputPassword: string, storedPassword: string): boolean {
    return inputPassword === storedPassword;
  }

  /**
   * Generate session ID
   */
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Safely retrieve administrators from localStorage
   */
  private static getAdministrators(): AdminData[] {
    try {
      console.log('🔍 Attempting to retrieve administrators from localStorage...');
      const data = localStorage.getItem(this.STORAGE_KEY);
      console.log('📋 Raw administrator data:', data ? 'Data found' : 'No data found');
      
      if (!data) {
        console.log('📭 No administrators found in localStorage');
        return [];
      }

      const parsed = JSON.parse(data);
      console.log('📊 Parsed administrator data:', parsed);
      
      if (!Array.isArray(parsed)) {
        console.warn('⚠️ Invalid administrator data format - not an array');
        return [];
      }

      // Validate each administrator object
      const validAdmins = parsed.filter(admin => {
        const isValid = admin && 
          typeof admin === 'object' && 
          admin.id && 
          admin.name && 
          admin.email && 
          admin.userId &&
          admin.password;
        
        if (!isValid) {
          console.warn('⚠️ Invalid administrator object:', admin);
        }
        
        return isValid;
      });

      console.log(`✅ Found ${validAdmins.length} valid administrators out of ${parsed.length} total`);
      console.log('👥 Valid administrators:', validAdmins.map(a => ({ 
        name: a.name, 
        email: a.email, 
        userId: a.userId,
        organizationName: a.organizationName 
      })));

      return validAdmins;

    } catch (error) {
      console.error('❌ Error reading administrators:', error);
      return [];
    }
  }

  /**
   * Find administrator by email or userId (case-insensitive for email)
   */
  private static findAdministrator(identifier: string): AdminData | null {
    const administrators = this.getAdministrators();
    
    // Try to find by email (case-insensitive)
    let admin = administrators.find(admin => 
      admin.email.toLowerCase() === identifier.toLowerCase()
    );

    // If not found by email, try by userId (case-sensitive)
    if (!admin) {
      admin = administrators.find(admin => admin.userId === identifier);
    }

    return admin || null;
  }

  /**
   * Log login attempt for security tracking
   */
  private static logLoginAttempt(identifier: string, success: boolean): void {
    try {
      const attempts = JSON.parse(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '[]');
      const newAttempt: LoginAttempt = {
        timestamp: new Date().toISOString(),
        success,
        identifier
      };
      
      // Keep only last 10 attempts
      attempts.push(newAttempt);
      if (attempts.length > 10) {
        attempts.shift();
      }
      
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.warn('⚠️ Failed to log login attempt:', error);
    }
  }

  /**
   * Authenticate administrator
   */
  static async authenticate(identifier: string, password: string): Promise<AuthResult> {
    try {
      console.log('🔐 Starting admin authentication for:', identifier);

      // First, let's check what administrators we have
      const allAdmins = this.getAdministrators();
      console.log(`📊 Retrieved ${allAdmins.length} administrators from storage`);

      // Find administrator
      const admin = this.findAdministrator(identifier);
      
      if (!admin) {
        console.log(`❌ Administrator not found for identifier: ${identifier}`);
        console.log('Available administrators:', allAdmins.map(a => ({ 
          email: a.email, 
          userId: a.userId,
          name: a.name 
        })));
        
        this.logLoginAttempt(identifier, false);
        return {
          success: false,
          error: 'Administrator not found. Please check your email/user ID.',
          errorCode: 'USER_NOT_FOUND'
        };
      }

      console.log('✅ Administrator found:', {
        name: admin.name,
        email: admin.email,
        userId: admin.userId,
        isActive: admin.isActive,
        organizationName: admin.organizationName
      });

      // Check if account is active
      if (!admin.isActive) {
        console.log('❌ Administrator account is inactive:', admin.userId);
        this.logLoginAttempt(identifier, false);
        return {
          success: false,
          error: 'Your administrator account has been deactivated. Please contact support.',
          errorCode: 'ACCOUNT_INACTIVE'
        };
      }

      // Simple password comparison
      if (!this.comparePassword(password, admin.password)) {
        console.log('❌ Password verification failed for:', admin.userId);
        this.logLoginAttempt(identifier, false);
        return {
          success: false,
          error: 'Invalid password. Please try again.',
          errorCode: 'INVALID_PASSWORD'
        };
      }

      console.log('✅ Password verified successfully');
      this.logLoginAttempt(identifier, true);
      console.log('✅ Admin authentication successful:', admin.userId);
      
      return {
        success: true,
        admin
      };

    } catch (error) {
      console.error('❌ Authentication error:', error);
      this.logLoginAttempt(identifier, false);
      
      return {
        success: false,
        error: 'Login failed due to a system error. Please try again.',
        errorCode: 'STORAGE_ERROR'
      };
    }
  }

  /**
   * Create and save session
   */
  static createSession(admin: AdminData, rememberMe: boolean = false): SessionData {
    const sessionId = this.generateSessionId();
    const now = Date.now();
    const expiryTime = new Date(now + (rememberMe ? this.REMEMBER_DURATION : this.SESSION_DURATION));
    
    const sessionData: SessionData = {
      adminId: admin.id,
      adminName: admin.name,
      adminEmail: admin.email,
      userId: admin.userId,
      organizationName: admin.organizationName,
      organizationId: admin.organizationId,
      role: admin.role,
      loginTimestamp: new Date().toISOString(),
      sessionId,
      expiryTime: expiryTime.toISOString(),
      rememberMe
    };

    // Save session
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    
    // Save remember me preference
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, JSON.stringify({
        userId: admin.userId,
        email: admin.email,
        timestamp: new Date().toISOString()
      }));
    }

    console.log('✅ Session created successfully:', sessionId);
    return sessionData;
  }

  /**
   * Get current session
   */
  static getCurrentSession(): SessionData | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;

      const session: SessionData = JSON.parse(sessionData);
      
      // Check if session is expired
      const now = new Date();
      const expiryTime = new Date(session.expiryTime);
      
      if (now > expiryTime) {
        console.log('⏰ Session expired, clearing...');
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('❌ Error reading session:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear session and logout
   */
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    console.log('🗑️ Session cleared');
  }

  /**
   * Get remember me data
   */
  static getRememberMeData(): { userId: string; email: string; timestamp: string } | null {
    try {
      const data = localStorage.getItem(this.REMEMBER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error reading remember me data:', error);
      return null;
    }
  }

  /**
   * Clear remember me data
   */
  static clearRememberMe(): void {
    localStorage.removeItem(this.REMEMBER_KEY);
  }

  /**
   * Check if session is valid
   */
  static isSessionValid(): boolean {
    const session = this.getCurrentSession();
    return session !== null;
  }

  /**
   * Get login attempts (for security monitoring)
   */
  static getLoginAttempts(): LoginAttempt[] {
    try {
      return JSON.parse(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '[]');
    } catch (error) {
      console.error('❌ Error reading login attempts:', error);
      return [];
    }
  }
}
