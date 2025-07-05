// Administrator Data Management Utility
// Handles data migration, validation, and conversion between different administrator data formats

export interface UnifiedAdminData {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  userId: string;
  password: string;
  organizationId: string;
  organizationName: string;
  sourceSeekerId: string;
  createdAt: string;
  isActive: boolean;
  role: string;
  adminCreatedBy: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface LegacyAdminRecord {
  id: string;
  sourceSeekerId: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

export interface MainStorageAdmin {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  userId: string;
  password: string;
  organizationId: string;
  organizationName: string;
  sourceSeekerId: string;
  createdAt: string;
  isActive: boolean;
  role: string;
  adminCreatedBy: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export class AdminDataManager {
  private static readonly STORAGE_KEY = 'administrators';
  
  /**
   * Convert legacy admin record to unified format
   */
  static convertLegacyToUnified(legacy: LegacyAdminRecord, seekerData?: any): UnifiedAdminData {
    console.log('🔄 Converting legacy admin to unified format:', legacy.adminName);
    
    return {
      id: legacy.id,
      name: legacy.adminName,
      email: legacy.adminEmail,
      contactNumber: '', // Not available in legacy format
      userId: legacy.adminId || '', // Use adminId as fallback
      password: '', // Don't expose password
      organizationId: seekerData?.organizationId || `org_${legacy.sourceSeekerId}`,
      organizationName: seekerData?.organizationName || 'Unknown Organization',
      sourceSeekerId: legacy.sourceSeekerId,
      createdAt: legacy.createdAt,
      isActive: true,
      role: 'administrator',
      adminCreatedBy: 'system',
      lastUpdated: undefined,
      updatedBy: undefined
    };
  }

  /**
   * Convert main storage admin to unified format
   */
  static convertMainToUnified(main: MainStorageAdmin): UnifiedAdminData {
    console.log('🔄 Converting main storage admin to unified format:', main.name);
    
    return {
      id: main.id,
      name: main.name,
      email: main.email,
      contactNumber: main.contactNumber || '',
      userId: main.userId || '',
      password: '', // Don't expose password
      organizationId: main.organizationId,
      organizationName: main.organizationName,
      sourceSeekerId: main.sourceSeekerId,
      createdAt: main.createdAt,
      isActive: main.isActive,
      role: main.role,
      adminCreatedBy: main.adminCreatedBy,
      lastUpdated: main.lastUpdated,
      updatedBy: main.updatedBy
    };
  }

  /**
   * Find administrator for a specific seeker ID
   */
  static findAdminForSeeker(seekerId: string, seekerData?: any): UnifiedAdminData | null {
    console.log('🔍 Searching for administrator for seeker ID:', seekerId);
    
    try {
      const storageData = localStorage.getItem(this.STORAGE_KEY);
      if (storageData) {
        const admins: MainStorageAdmin[] = JSON.parse(storageData);
        console.log('🔍 Found', admins.length, 'administrators in storage');
        
        const admin = admins.find(admin => admin.sourceSeekerId === seekerId);
        if (admin) {
          console.log('✅ Found administrator:', admin.name);
          return this.convertMainToUnified(admin);
        }
      }
    } catch (error) {
      console.error('❌ Error reading administrator storage:', error);
    }

    console.log('❌ No administrator found for seeker ID:', seekerId);
    return null;
  }

  /**
   * Get all administrators in unified format
   */
  static getAllAdministrators(): UnifiedAdminData[] {
    console.log('📊 Loading all administrators in unified format');
    const admins: UnifiedAdminData[] = [];

    try {
      const storageData = localStorage.getItem(this.STORAGE_KEY);
      if (storageData) {
        const storageAdmins: MainStorageAdmin[] = JSON.parse(storageData);
        console.log('📊 Found', storageAdmins.length, 'administrators in storage');
        
        storageAdmins.forEach(admin => {
          admins.push(this.convertMainToUnified(admin));
        });
      }
    } catch (error) {
      console.error('❌ Error reading administrator storage:', error);
    }

    console.log('✅ Total administrators loaded:', admins.length);
    return admins;
  }

  /**
   * Validate administrator data
   */
  static validateAdminData(admin: Partial<UnifiedAdminData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!admin.name || admin.name.trim().length < 2) {
      errors.push('Administrator name must be at least 2 characters');
    }

    if (!admin.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email)) {
      errors.push('Valid email address is required');
    }

    if (!admin.userId || admin.userId.trim().length < 3) {
      errors.push('User ID must be at least 3 characters');
    }

    if (!admin.sourceSeekerId) {
      errors.push('Source seeker ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate legacy data from 'created_administrators' to main storage
   */
  static async migrateLegacyData(): Promise<{ success: boolean; migratedCount: number; errors: string[] }> {
    console.log('🔄 Starting legacy data migration...');
    const errors: string[] = [];
    let migratedCount = 0;

    try {
      // Get existing main storage data
      const mainData = localStorage.getItem(this.STORAGE_KEY);
      const existingMainAdmins: MainStorageAdmin[] = mainData ? JSON.parse(mainData) : [];
      
      // Get legacy data from 'created_administrators'
      const legacyData = localStorage.getItem('created_administrators');
      if (!legacyData) {
        console.log('📭 No legacy data to migrate from created_administrators');
        return { success: true, migratedCount: 0, errors: [] };
      }

      const legacyAdmins: any[] = JSON.parse(legacyData);
      console.log('🔄 Found', legacyAdmins.length, 'legacy administrators to migrate');

      // Convert and migrate each legacy admin
      for (const legacyAdmin of legacyAdmins) {
        try {
          // Check if already migrated
          const existsInMain = existingMainAdmins.some(admin => 
            admin.sourceSeekerId === legacyAdmin.sourceSeekerId ||
            admin.id === legacyAdmin.id
          );

          if (!existsInMain) {
            // Convert legacy format to unified format
            const mainAdmin: MainStorageAdmin = {
              id: legacyAdmin.id,
              name: legacyAdmin.adminName || legacyAdmin.name,
              email: legacyAdmin.adminEmail || legacyAdmin.email,
              contactNumber: legacyAdmin.contactNumber || '',
              userId: legacyAdmin.userId || legacyAdmin.adminId,
              password: legacyAdmin.password,
              organizationId: legacyAdmin.organizationId,
              organizationName: legacyAdmin.organizationName,
              sourceSeekerId: legacyAdmin.sourceSeekerId,
              createdAt: legacyAdmin.adminCreatedAt || legacyAdmin.createdAt || new Date().toISOString(),
              isActive: legacyAdmin.status === 'active' || true,
              role: legacyAdmin.role || 'administrator',
              adminCreatedBy: legacyAdmin.adminCreatedBy || 'system'
            };

            existingMainAdmins.push(mainAdmin);
            migratedCount++;
            console.log('✅ Migrated administrator:', mainAdmin.name);
          }
        } catch (error) {
          const errorMsg = `Failed to migrate admin ${legacyAdmin.adminName || legacyAdmin.name}: ${error}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
        }
      }

      // Save migrated data
      if (migratedCount > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingMainAdmins));
        console.log('✅ Migration complete -', migratedCount, 'administrators migrated');
        
        // Remove legacy storage after successful migration
        localStorage.removeItem('created_administrators');
        console.log('🧹 Legacy storage removed after successful migration');
      }

      return {
        success: true,
        migratedCount,
        errors
      };

    } catch (error) {
      const errorMsg = `Migration failed: ${error}`;
      console.error('❌', errorMsg);
      return {
        success: false,
        migratedCount,
        errors: [...errors, errorMsg]
      };
    }
  }

  /**
   * Get storage health information
   */
  static getStorageHealth() {
    console.log('🏥 Checking administrator storage health...');
    
    const health = {
      storage: { exists: false, count: 0, valid: true, error: null as string | null },
      totalCount: 0
    };

    // Check main storage
    try {
      const storageData = localStorage.getItem(this.STORAGE_KEY);
      if (storageData) {
        const admins = JSON.parse(storageData);
        health.storage.exists = true;
        health.storage.count = Array.isArray(admins) ? admins.length : 0;
        health.storage.valid = Array.isArray(admins);
        health.totalCount = health.storage.count;
      }
    } catch (error) {
      health.storage.error = `Parse error: ${error}`;
      health.storage.valid = false;
    }

    console.log('🏥 Storage health check complete:', health);
    return health;
  }
}