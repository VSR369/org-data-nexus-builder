// Administrator Data Recovery Service
// Comprehensive recovery and reconstruction of administrator data

import { AdminDataManager, type UnifiedAdminData } from './adminDataManager';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';

interface RecoveryResult {
  success: boolean;
  recoveredCount: number;
  repairedCount: number;
  errors: string[];
  summary: string;
}

interface IncompleteAdmin {
  id: string;
  sourceSeekerId?: string;
  createdAt?: string;
  [key: string]: any;
}

export class AdminDataRecoveryService {
  private static readonly STORAGE_KEY = 'administrators';
  private static readonly LEGACY_KEYS = [
    'created_administrators',
    'seeker_admin_links',
    'admin_storage',
    'administrator_records'
  ];

  /**
   * Main recovery function - orchestrates the complete recovery process
   */
  static async performCompleteRecovery(): Promise<RecoveryResult> {
    console.log('🔧 === ADMINISTRATOR DATA RECOVERY START ===');
    
    const errors: string[] = [];
    let recoveredCount = 0;
    let repairedCount = 0;

    try {
      // Step 1: Gather all seeker data for reconstruction FIRST
      await unifiedUserStorageService.initialize();
      const allSeekers = await unifiedUserStorageService.getAllUsers();
      console.log('👥 Available seeker records:', allSeekers.length);

      if (allSeekers.length === 0) {
        throw new Error('No seeker data available for admin reconstruction. Please ensure seeker registrations exist first.');
      }

      // Step 2: Assess current data state
      const currentAdmins = this.getCurrentAdmins();
      console.log('📊 Current administrators found:', currentAdmins.length);

      // Step 3: Find incomplete records that need repair
      const incompleteAdmins = this.identifyIncompleteRecords(currentAdmins);
      console.log('🔍 Incomplete records identified:', incompleteAdmins.length);

      // Step 4: If NO admins exist at all, create them from seekers
      if (currentAdmins.length === 0) {
        console.log('🚨 No administrators found - creating from seeker data');
        const newAdmins = await this.createAdminsFromSeekers(allSeekers);
        recoveredCount = newAdmins.length;
        console.log('✅ Created', recoveredCount, 'administrators from seeker data');
        
        // Save and return early
        await this.saveRecoveredData(newAdmins);
        return {
          success: true,
          recoveredCount,
          repairedCount: 0,
          errors,
          summary: `Successfully created ${recoveredCount} administrator accounts from existing seeker registrations.`
        };
      }

      // Step 4: Reconstruct incomplete administrator records
      const reconstructedAdmins: UnifiedAdminData[] = [];
      
      for (const incompleteAdmin of incompleteAdmins) {
        try {
          const reconstructed = await this.reconstructAdminRecord(incompleteAdmin, allSeekers);
          if (reconstructed) {
            reconstructedAdmins.push(reconstructed);
            repairedCount++;
            console.log('✅ Reconstructed admin for seeker:', reconstructed.sourceSeekerId);
          }
        } catch (error) {
          const errorMsg = `Failed to reconstruct admin ${incompleteAdmin.id}: ${error}`;
          console.error('❌', errorMsg);
          errors.push(errorMsg);
        }
      }

      // Step 5: Recover from legacy storage
      const legacyRecovered = await this.recoverFromLegacySources(allSeekers);
      recoveredCount = legacyRecovered.length;
      
      // Step 6: Merge all valid administrator records
      const validCurrentAdmins = currentAdmins.filter(admin => 
        this.isCompleteAdminRecord(admin)
      );

      const finalAdmins = [
        ...validCurrentAdmins,
        ...reconstructedAdmins,
        ...legacyRecovered
      ];

      // Step 7: Remove duplicates
      const deduplicatedAdmins = this.removeDuplicates(finalAdmins);
      console.log('📊 Final administrators after deduplication:', deduplicatedAdmins.length);

      // Step 8: Save recovered data
      const saveResult = await this.saveRecoveredData(deduplicatedAdmins);
      
      if (!saveResult) {
        throw new Error('Failed to save recovered administrator data');
      }

      // Step 9: Verify the recovery
      const verification = this.getCurrentAdmins();
      const completeCount = verification.filter(admin => this.isCompleteAdminRecord(admin)).length;
      
      console.log('✅ === ADMINISTRATOR DATA RECOVERY COMPLETE ===');
      
      return {
        success: true,
        recoveredCount,
        repairedCount,
        errors,
        summary: `Recovery completed successfully. ${completeCount} complete administrator records available. ${repairedCount} records repaired, ${recoveredCount} recovered from legacy storage.`
      };

    } catch (error) {
      const errorMsg = `Recovery process failed: ${error}`;
      console.error('❌', errorMsg);
      errors.push(errorMsg);
      
      return {
        success: false,
        recoveredCount,
        repairedCount,
        errors,
        summary: `Recovery failed: ${errorMsg}`
      };
    }
  }

  /**
   * Create administrator records from seeker data (when no admins exist)
   */
  private static async createAdminsFromSeekers(seekers: any[]): Promise<UnifiedAdminData[]> {
    const newAdmins: UnifiedAdminData[] = [];
    
    console.log('🏗️ Creating administrators from', seekers.length, 'seeker records');
    
    for (const seeker of seekers) {
      try {
        if (!seeker.organizationName || !seeker.id) {
          console.warn('⚠️ Skipping seeker without organization name or ID:', seeker);
          continue;
        }

        // Generate admin details from seeker data
        const adminId = `admin_${seeker.id}_${Date.now()}`;
        const orgNameSlug = seeker.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        const newAdmin: UnifiedAdminData = {
          id: adminId,
          name: `${seeker.organizationName} Administrator`,
          email: `admin@${orgNameSlug}.com`,
          contactNumber: seeker.contactNumber || seeker.phoneNumber || '',
          userId: `admin_${seeker.id}`,
          password: 'NEEDS_RESET',
          organizationId: seeker.organizationId || `org_${seeker.id}`,
          organizationName: seeker.organizationName,
          sourceSeekerId: seeker.id,
          createdAt: new Date().toISOString(),
          isActive: true,
          role: 'administrator',
          adminCreatedBy: 'recovery_service',
          lastUpdated: new Date().toISOString(),
          updatedBy: 'recovery_service'
        };

        newAdmins.push(newAdmin);
        console.log('✅ Created admin for:', seeker.organizationName);
        
      } catch (error) {
        console.error('❌ Error creating admin for seeker:', seeker.organizationName, error);
      }
    }
    
    console.log('🏗️ Created', newAdmins.length, 'new administrator records');
    return newAdmins;
  }

  /**
   * Get current administrators from storage
   */
  private static getCurrentAdmins(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error reading current admins:', error);
      return [];
    }
  }

  /**
   * Identify incomplete administrator records
   */
  private static identifyIncompleteRecords(admins: any[]): IncompleteAdmin[] {
    return admins.filter(admin => !this.isCompleteAdminRecord(admin));
  }

  /**
   * Check if an administrator record is complete
   */
  private static isCompleteAdminRecord(admin: any): boolean {
    const requiredFields = ['id', 'name', 'email', 'userId', 'sourceSeekerId'];
    return requiredFields.every(field => admin[field] && admin[field].toString().trim().length > 0);
  }

  /**
   * Reconstruct incomplete administrator record using seeker data
   */
  private static async reconstructAdminRecord(
    incompleteAdmin: IncompleteAdmin, 
    seekers: any[]
  ): Promise<UnifiedAdminData | null> {
    try {
      if (!incompleteAdmin.sourceSeekerId) {
        console.warn('⚠️ No sourceSeekerId for admin:', incompleteAdmin.id);
        return null;
      }

      // Find the associated seeker
      const seeker = seekers.find(s => s.id === incompleteAdmin.sourceSeekerId);
      if (!seeker) {
        console.warn('⚠️ No seeker found for admin:', incompleteAdmin.sourceSeekerId);
        return null;
      }

      // Reconstruct the administrator record
      const reconstructed: UnifiedAdminData = {
        id: incompleteAdmin.id,
        name: incompleteAdmin.name || incompleteAdmin.adminName || `${seeker.organizationName} Admin`,
        email: incompleteAdmin.email || incompleteAdmin.adminEmail || `admin@${seeker.organizationName?.toLowerCase().replace(/\s+/g, '')}.com`,
        contactNumber: incompleteAdmin.contactNumber || seeker.contactNumber || '',
        userId: incompleteAdmin.userId || incompleteAdmin.adminId || `admin_${seeker.id}`,
        password: incompleteAdmin.password || 'NEEDS_RESET',
        organizationId: seeker.organizationId || `org_${seeker.id}`,
        organizationName: seeker.organizationName,
        sourceSeekerId: incompleteAdmin.sourceSeekerId,
        createdAt: incompleteAdmin.createdAt || new Date().toISOString(),
        isActive: true,
        role: 'administrator',
        adminCreatedBy: 'recovery_service',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'recovery_service'
      };

      console.log('🔧 Reconstructed admin:', reconstructed.name, 'for', seeker.organizationName);
      return reconstructed;

    } catch (error) {
      console.error('❌ Error reconstructing admin record:', error);
      return null;
    }
  }

  /**
   * Recover administrators from legacy storage sources
   */
  private static async recoverFromLegacySources(seekers: any[]): Promise<UnifiedAdminData[]> {
    const recovered: UnifiedAdminData[] = [];

    for (const legacyKey of this.LEGACY_KEYS) {
      try {
        const legacyData = localStorage.getItem(legacyKey);
        if (!legacyData) continue;

        const parsed = JSON.parse(legacyData);
        console.log(`🔍 Checking legacy storage: ${legacyKey}`, parsed.length || 'N/A', 'records');

        if (Array.isArray(parsed)) {
          for (const record of parsed) {
            const converted = await this.convertLegacyRecord(record, seekers);
            if (converted) {
              recovered.push(converted);
              console.log('✅ Recovered from', legacyKey, ':', converted.name);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error processing legacy storage ${legacyKey}:`, error);
      }
    }

    return recovered;
  }

  /**
   * Convert legacy record to unified format
   */
  private static async convertLegacyRecord(record: any, seekers: any[]): Promise<UnifiedAdminData | null> {
    try {
      // Skip if this record doesn't look like an admin
      if (!record.id || (!record.adminName && !record.name)) {
        return null;
      }

      // Find associated seeker if sourceSeekerId is available
      let seeker = null;
      if (record.sourceSeekerId) {
        seeker = seekers.find(s => s.id === record.sourceSeekerId);
      }

      const converted: UnifiedAdminData = {
        id: record.id,
        name: record.name || record.adminName || 'Legacy Admin',
        email: record.email || record.adminEmail || 'legacy@admin.com',
        contactNumber: record.contactNumber || '',
        userId: record.userId || record.adminId || `legacy_${record.id}`,
        password: record.password || 'NEEDS_RESET',
        organizationId: record.organizationId || (seeker ? `org_${seeker.id}` : `org_${record.id}`),
        organizationName: record.organizationName || seeker?.organizationName || 'Legacy Organization',
        sourceSeekerId: record.sourceSeekerId || '',
        createdAt: record.createdAt || record.adminCreatedAt || new Date().toISOString(),
        isActive: true,
        role: record.role || 'administrator',
        adminCreatedBy: record.adminCreatedBy || 'legacy_migration',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'recovery_service'
      };

      return converted;

    } catch (error) {
      console.error('❌ Error converting legacy record:', error);
      return null;
    }
  }

  /**
   * Remove duplicate administrator records
   */
  private static removeDuplicates(admins: UnifiedAdminData[]): UnifiedAdminData[] {
    const seen = new Set<string>();
    const unique: UnifiedAdminData[] = [];

    for (const admin of admins) {
      // Create unique key based on email and userId
      const uniqueKey = `${admin.email.toLowerCase()}_${admin.userId}`;
      
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        unique.push(admin);
      } else {
        console.log('🔄 Duplicate removed:', admin.name, admin.email);
      }
    }

    return unique;
  }

  /**
   * Save recovered data to storage
   */
  private static async saveRecoveredData(admins: UnifiedAdminData[]): Promise<boolean> {
    try {
      // Create backup before saving
      const currentData = localStorage.getItem(this.STORAGE_KEY);
      if (currentData) {
        localStorage.setItem(`${this.STORAGE_KEY}_pre_recovery_backup`, currentData);
      }

      // Save recovered data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(admins));
      
      // Verify save
      const verification = localStorage.getItem(this.STORAGE_KEY);
      const verified = verification ? JSON.parse(verification) : [];
      
      console.log('💾 Saved', admins.length, 'administrators, verified', verified.length);
      return verified.length === admins.length;

    } catch (error) {
      console.error('❌ Error saving recovered data:', error);
      return false;
    }
  }

  /**
   * Quick health check of administrator data
   */
  static getDataHealthStatus(): {
    totalCount: number;
    completeCount: number;
    incompleteCount: number;
    healthPercentage: number;
    issues: string[];
  } {
    const admins = this.getCurrentAdmins();
    const completeAdmins = admins.filter(admin => this.isCompleteAdminRecord(admin));
    const incompleteAdmins = admins.filter(admin => !this.isCompleteAdminRecord(admin));
    
    const issues: string[] = [];
    
    if (incompleteAdmins.length > 0) {
      issues.push(`${incompleteAdmins.length} administrators have incomplete data`);
    }
    
    // Check for missing critical fields
    const missingNames = admins.filter(admin => !admin.name && !admin.adminName).length;
    const missingEmails = admins.filter(admin => !admin.email && !admin.adminEmail).length;
    const missingUserIds = admins.filter(admin => !admin.userId && !admin.adminId).length;
    
    if (missingNames > 0) issues.push(`${missingNames} administrators missing names`);
    if (missingEmails > 0) issues.push(`${missingEmails} administrators missing emails`);
    if (missingUserIds > 0) issues.push(`${missingUserIds} administrators missing user IDs`);

    const healthPercentage = admins.length > 0 ? Math.round((completeAdmins.length / admins.length) * 100) : 100;

    return {
      totalCount: admins.length,
      completeCount: completeAdmins.length,
      incompleteCount: incompleteAdmins.length,
      healthPercentage,
      issues
    };
  }
}