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
  private static readonly MAIN_STORAGE_KEY = 'administrators';
  private static readonly LEGACY_STORAGE_KEY = 'created_administrators';
  
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
    
    // First, check main storage
    try {
      const mainData = localStorage.getItem(this.MAIN_STORAGE_KEY);
      if (mainData) {
        const mainAdmins: MainStorageAdmin[] = JSON.parse(mainData);
        console.log('🔍 Main storage - Found', mainAdmins.length, 'administrators');
        
        const mainAdmin = mainAdmins.find(admin => admin.sourceSeekerId === seekerId);
        if (mainAdmin) {
          console.log('✅ Found administrator in main storage:', mainAdmin.name);
          return this.convertMainToUnified(mainAdmin);
        }
      }
    } catch (error) {
      console.error('❌ Error reading main storage:', error);
    }

    // If not found, check legacy storage
    try {
      const legacyData = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (legacyData) {
        const legacyAdmins: LegacyAdminRecord[] = JSON.parse(legacyData);
        console.log('🔍 Legacy storage - Found', legacyAdmins.length, 'administrators');
        
        const legacyAdmin = legacyAdmins.find(admin => admin.sourceSeekerId === seekerId);
        if (legacyAdmin) {
          console.log('✅ Found administrator in legacy storage:', legacyAdmin.adminName);
          return this.convertLegacyToUnified(legacyAdmin, seekerData);
        }
      }
    } catch (error) {
      console.error('❌ Error reading legacy storage:', error);
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

    // Load from main storage
    try {
      const mainData = localStorage.getItem(this.MAIN_STORAGE_KEY);
      if (mainData) {
        const mainAdmins: MainStorageAdmin[] = JSON.parse(mainData);
        console.log('📊 Main storage - Found', mainAdmins.length, 'administrators');
        
        mainAdmins.forEach(admin => {
          admins.push(this.convertMainToUnified(admin));
        });
      }
    } catch (error) {
      console.error('❌ Error reading main storage:', error);
    }

    // Load from legacy storage (only if not already in main storage)
    try {
      const legacyData = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (legacyData) {
        const legacyAdmins: LegacyAdminRecord[] = JSON.parse(legacyData);
        console.log('📊 Legacy storage - Found', legacyAdmins.length, 'administrators');
        
        legacyAdmins.forEach(legacyAdmin => {
          // Only add if not already present from main storage
          const existsInMain = admins.some(admin => admin.sourceSeekerId === legacyAdmin.sourceSeekerId);
          if (!existsInMain) {
            admins.push(this.convertLegacyToUnified(legacyAdmin));
          }
        });
      }
    } catch (error) {
      console.error('❌ Error reading legacy storage:', error);
    }

    console.log('✅ Total unified administrators loaded:', admins.length);
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
   * Migrate legacy data to main storage
   */
  static async migrateLegacyData(): Promise<{ success: boolean; migratedCount: number; errors: string[] }> {
    console.log('🔄 Starting legacy data migration...');
    const errors: string[] = [];
    let migratedCount = 0;

    try {
      // Get existing main storage data
      const mainData = localStorage.getItem(this.MAIN_STORAGE_KEY);
      const existingMainAdmins: MainStorageAdmin[] = mainData ? JSON.parse(mainData) : [];
      
      // Get legacy data
      const legacyData = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (!legacyData) {
        console.log('📭 No legacy data to migrate');
        return { success: true, migratedCount: 0, errors: [] };
      }

      const legacyAdmins: LegacyAdminRecord[] = JSON.parse(legacyData);
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
            const unifiedAdmin = this.convertLegacyToUnified(legacyAdmin);
            
            // Convert to main storage format
            const mainAdmin: MainStorageAdmin = {
              ...unifiedAdmin,
              password: 'MIGRATED_FROM_LEGACY' // Placeholder - will need reset
            };

            existingMainAdmins.push(mainAdmin);
            migratedCount++;
            console.log('✅ Migrated administrator:', legacyAdmin.adminName);
          }
        } catch (error) {
          const errorMsg = `Failed to migrate admin ${legacyAdmin.adminName}: ${error}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
        }
      }

      // Save migrated data
      if (migratedCount > 0) {
        localStorage.setItem(this.MAIN_STORAGE_KEY, JSON.stringify(existingMainAdmins));
        console.log('✅ Migration complete -', migratedCount, 'administrators migrated');
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
      mainStorage: { exists: false, count: 0, valid: true, error: null as string | null },
      legacyStorage: { exists: false, count: 0, valid: true, error: null as string | null },
      unified: { totalCount: 0, duplicates: 0 }
    };

    // Check main storage
    try {
      const mainData = localStorage.getItem(this.MAIN_STORAGE_KEY);
      if (mainData) {
        const mainAdmins = JSON.parse(mainData);
        health.mainStorage.exists = true;
        health.mainStorage.count = Array.isArray(mainAdmins) ? mainAdmins.length : 0;
        health.mainStorage.valid = Array.isArray(mainAdmins);
      }
    } catch (error) {
      health.mainStorage.error = `Parse error: ${error}`;
      health.mainStorage.valid = false;
    }

    // Check legacy storage
    try {
      const legacyData = localStorage.getItem(this.LEGACY_STORAGE_KEY);
      if (legacyData) {
        const legacyAdmins = JSON.parse(legacyData);
        health.legacyStorage.exists = true;
        health.legacyStorage.count = Array.isArray(legacyAdmins) ? legacyAdmins.length : 0;
        health.legacyStorage.valid = Array.isArray(legacyAdmins);
      }
    } catch (error) {
      health.legacyStorage.error = `Parse error: ${error}`;
      health.legacyStorage.valid = false;
    }

    // Check for duplicates
    const allAdmins = this.getAllAdministrators();
    health.unified.totalCount = allAdmins.length;
    
    const seekerIds = allAdmins.map(admin => admin.sourceSeekerId);
    const uniqueSeekerIds = new Set(seekerIds);
    health.unified.duplicates = seekerIds.length - uniqueSeekerIds.size;

    console.log('🏥 Storage health check complete:', health);
    return health;
  }
}