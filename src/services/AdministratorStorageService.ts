import { indexedDBManager } from '@/utils/storage/IndexedDBManager';

export interface Administrator {
  id: string;
  adminId: string;
  password: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  permissions: string[];
  role: 'super_admin' | 'organization_admin' | 'system_admin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface AdminSession {
  adminId: string;
  organizationName: string;
  adminEmail: string;
  adminName: string;
  role: string;
  permissions: string[];
  loginTimestamp: string;
}

export class AdministratorStorageService {
  private static instance: AdministratorStorageService;
  private readonly ADMIN_STORE = 'administrators';
  private readonly ADMIN_SESSION_KEY = 'admin_session_data';

  private constructor() {}

  static getInstance(): AdministratorStorageService {
    if (!AdministratorStorageService.instance) {
      AdministratorStorageService.instance = new AdministratorStorageService();
    }
    return AdministratorStorageService.instance;
  }

  async initialize(): Promise<void> {
    console.log('🔧 Initializing Administrator Storage Service...');
    await indexedDBManager.initialize();
    console.log('✅ Administrator Storage Service initialized');
  }

  async registerAdministrator(adminData: Omit<Administrator, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; admin?: Administrator }> {
    console.log('📝 === ADMIN REGISTRATION START ===');
    console.log('📝 Registering administrator:', adminData.adminId);

    try {
      await this.initialize();

      // Check if admin already exists
      const existingAdmin = await this.findAdminById(adminData.adminId);
      if (existingAdmin) {
        console.log('❌ Admin already exists:', adminData.adminId);
        return { success: false, error: 'Administrator ID already exists' };
      }

      // Check if email already exists
      const existingByEmail = await this.findAdminByEmail(adminData.adminEmail);
      if (existingByEmail) {
        console.log('❌ Admin email already exists:', adminData.adminEmail);
        return { success: false, error: 'Administrator email already exists' };
      }

      const admin: Administrator = {
        ...adminData,
        id: `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };

      // Save to IndexedDB
      const saved = await indexedDBManager.saveItem(this.ADMIN_STORE, admin);
      
      if (saved) {
        console.log('✅ Administrator registered successfully:', admin.adminId);
        console.log('📝 === ADMIN REGISTRATION SUCCESS ===');
        return { success: true, admin };
      } else {
        console.log('❌ Failed to save administrator to IndexedDB');
        return { success: false, error: 'Failed to save administrator data' };
      }

    } catch (error) {
      console.error('❌ Administrator registration error:', error);
      console.log('📝 === ADMIN REGISTRATION ERROR ===');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown registration error' 
      };
    }
  }

  async authenticateAdmin(adminId: string, password: string): Promise<{ success: boolean; admin?: Administrator; error?: string }> {
    console.log('🔐 === ADMIN AUTHENTICATION START ===');
    console.log('🔐 Authenticating admin:', adminId);

    try {
      await this.initialize();
      
      const admin = await this.findAdminById(adminId);
      
      if (!admin) {
        console.log('❌ Admin not found:', adminId);
        return { success: false, error: 'Administrator not found' };
      }

      if (!admin.isActive) {
        console.log('❌ Admin account inactive:', adminId);
        return { success: false, error: 'Administrator account is inactive' };
      }

      if (admin.password !== password) {
        console.log('❌ Invalid password for admin:', adminId);
        return { success: false, error: 'Invalid password' };
      }

      // Update last login time
      admin.lastLoginAt = new Date().toISOString();
      admin.updatedAt = new Date().toISOString();
      await indexedDBManager.saveItem(this.ADMIN_STORE, admin);

      console.log('✅ Admin authentication successful:', adminId);
      console.log('🔐 === ADMIN AUTHENTICATION SUCCESS ===');
      return { success: true, admin };

    } catch (error) {
      console.error('❌ Admin authentication error:', error);
      console.log('🔐 === ADMIN AUTHENTICATION ERROR ===');
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  async findAdminById(adminId: string): Promise<Administrator | null> {
    try {
      await this.initialize();
      const admins = await indexedDBManager.getAllItems<Administrator>(this.ADMIN_STORE);
      return admins.find(admin => admin.adminId === adminId) || null;
    } catch (error) {
      console.error('❌ Error finding admin by ID:', error);
      return null;
    }
  }

  async findAdminByEmail(email: string): Promise<Administrator | null> {
    try {
      await this.initialize();
      const admins = await indexedDBManager.getAllItems<Administrator>(this.ADMIN_STORE);
      return admins.find(admin => admin.adminEmail.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('❌ Error finding admin by email:', error);
      return null;
    }
  }

  async getAllAdministrators(): Promise<Administrator[]> {
    try {
      await this.initialize();
      return await indexedDBManager.getAllItems<Administrator>(this.ADMIN_STORE);
    } catch (error) {
      console.error('❌ Error getting all administrators:', error);
      return [];
    }
  }

  async saveSession(sessionData: AdminSession): Promise<boolean> {
    try {
      console.log('💾 Saving admin session:', sessionData.adminId);
      const sessionToStore = {
        ...sessionData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(sessionToStore));
      
      // Verify the save
      const verification = localStorage.getItem(this.ADMIN_SESSION_KEY);
      console.log('✅ Admin session saved and verified');
      return !!verification;
    } catch (error) {
      console.error('❌ Error saving admin session:', error);
      return false;
    }
  }

  async loadSession(): Promise<AdminSession | null> {
    try {
      console.log('📖 Loading admin session...');
      const session = localStorage.getItem(this.ADMIN_SESSION_KEY);
      
      if (session) {
        const parsedSession = JSON.parse(session);
        console.log('✅ Admin session loaded:', parsedSession.adminId);
        return parsedSession;
      }
      
      console.log('📖 No admin session found');
      return null;
    } catch (error) {
      console.error('❌ Error loading admin session:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      console.log('🧹 Clearing admin session...');
      localStorage.removeItem(this.ADMIN_SESSION_KEY);
      console.log('✅ Admin session cleared');
    } catch (error) {
      console.error('❌ Error clearing admin session:', error);
    }
  }

  async getAdminHealthStatus(): Promise<{
    healthy: boolean;
    adminCount: number;
    indexedDBWorking: boolean;
    localStorageWorking: boolean;
    sessionExists: boolean;
    error?: string;
  }> {
    console.log('🏥 === ADMIN HEALTH CHECK START ===');
    
    try {
      let indexedDBWorking = false;
      let localStorageWorking = false;
      let sessionExists = false;
      let adminCount = 0;

      // Test IndexedDB
      try {
        await this.initialize();
        const admins = await this.getAllAdministrators();
        adminCount = admins.length;
        indexedDBWorking = true;
        console.log('✅ IndexedDB working, admin count:', adminCount);
      } catch (error) {
        console.error('❌ IndexedDB test failed:', error);
      }

      // Test localStorage
      try {
        localStorage.setItem('admin_health_test', 'test');
        const retrieved = localStorage.getItem('admin_health_test');
        localStorage.removeItem('admin_health_test');
        localStorageWorking = retrieved === 'test';
        
        // Check if session exists
        const session = await this.loadSession();
        sessionExists = !!session;
        
        console.log('✅ localStorage working:', localStorageWorking);
        console.log('📊 Session exists:', sessionExists);
      } catch (error) {
        console.error('❌ localStorage test failed:', error);
      }

      const healthy = indexedDBWorking || localStorageWorking;
      
      console.log('🏥 === ADMIN HEALTH CHECK END ===');
      
      return {
        healthy,
        adminCount,
        indexedDBWorking,
        localStorageWorking,
        sessionExists
      };

    } catch (error) {
      console.error('❌ Admin health check failed:', error);
      return {
        healthy: false,
        adminCount: 0,
        indexedDBWorking: false,
        localStorageWorking: false,
        sessionExists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const administratorStorageService = AdministratorStorageService.getInstance();