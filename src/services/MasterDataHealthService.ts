// Master Data Health Check Service
// Runs on every page load to ensure data integrity

import { FALLBACK_COUNTRIES, FALLBACK_ORGANIZATION_TYPES, FALLBACK_ENTITY_TYPES, FALLBACK_INDUSTRY_SEGMENTS } from '@/hooks/useRobustMasterData';
import { LegacyDataManager } from '@/utils/core/DataManager';
import { industrySegmentDataManager } from '@/components/master-data/industry-segments/industrySegmentDataManager';
import { Country } from '@/types/seekerRegistration';
import { IndustrySegment, IndustrySegmentData } from '@/types/industrySegments';

interface HealthCheckResult {
  isHealthy: boolean;
  fixedIssues: string[];
  checkedKeys: string[];
  errors: string[];
  timestamp: string;
}

export class MasterDataHealthService {
  private static instance: MasterDataHealthService;
  private lastHealthCheck: HealthCheckResult | null = null;
  private isRunning = false;

  static getInstance(): MasterDataHealthService {
    if (!MasterDataHealthService.instance) {
      MasterDataHealthService.instance = new MasterDataHealthService();
    }
    return MasterDataHealthService.instance;
  }

  private constructor() {}

  /**
   * Run comprehensive health check on all master data
   */
  async runHealthCheck(): Promise<HealthCheckResult> {
    if (this.isRunning) {
      console.log('🔍 Health check already running, skipping...');
      return this.lastHealthCheck || this.getDefaultResult();
    }

    console.log('🏥 === MASTER DATA HEALTH CHECK START ===');
    this.isRunning = true;

    const result: HealthCheckResult = {
      isHealthy: true,
      fixedIssues: [],
      checkedKeys: [],
      errors: [],
      timestamp: new Date().toISOString()
    };

    try {
      // Check and fix each master data category
      await this.checkAndFixCountries(result);
      await this.checkAndFixOrganizationTypes(result);
      await this.checkAndFixEntityTypes(result);
      await this.checkAndFixIndustrySegments(result);

      result.isHealthy = result.errors.length === 0;

      console.log('🏥 Health check completed:', {
        healthy: result.isHealthy,
        fixedIssues: result.fixedIssues.length,
        errors: result.errors.length
      });

      this.lastHealthCheck = result;
      return result;

    } catch (error) {
      console.error('❌ Critical error during health check:', error);
      result.isHealthy = false;
      result.errors.push(`Critical health check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    } finally {
      this.isRunning = false;
    }
  }

  private async checkAndFixCountries(result: HealthCheckResult): Promise<void> {
    const key = 'master_data_countries';
    result.checkedKeys.push(key);

    try {
      const dataManager = new LegacyDataManager<Country[]>({
        key,
        defaultData: FALLBACK_COUNTRIES,
        version: 1
      });

      const countries = dataManager.loadData();
      
      if (!countries || !Array.isArray(countries) || countries.length === 0) {
        console.log('🔧 Fixing countries data...');
        dataManager.saveData(FALLBACK_COUNTRIES);
        result.fixedIssues.push('Countries: Restored fallback data');
      } else {
        // Validate structure
        const validCountries = countries.filter(c => 
          c && typeof c === 'object' && c.id && c.name && c.code
        );
        
        if (validCountries.length !== countries.length) {
          console.log('🔧 Fixing corrupted countries data...');
          dataManager.saveData(FALLBACK_COUNTRIES);
          result.fixedIssues.push(`Countries: Fixed ${countries.length - validCountries.length} corrupted entries`);
        }
      }
    } catch (error) {
      console.error('❌ Error checking countries:', error);
      result.errors.push(`Countries check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkAndFixOrganizationTypes(result: HealthCheckResult): Promise<void> {
    const key = 'master_data_organization_types';
    result.checkedKeys.push(key);

    try {
      const dataManager = new LegacyDataManager<string[]>({
        key,
        defaultData: FALLBACK_ORGANIZATION_TYPES,
        version: 1
      });

      const orgTypes = dataManager.loadData();
      
      if (!orgTypes || !Array.isArray(orgTypes) || orgTypes.length === 0) {
        console.log('🔧 Fixing organization types data...');
        dataManager.saveData(FALLBACK_ORGANIZATION_TYPES);
        result.fixedIssues.push('Organization Types: Restored fallback data');
      } else {
        // Validate all are strings
        const validTypes = orgTypes.filter(type => typeof type === 'string' && type.trim().length > 0);
        
        if (validTypes.length !== orgTypes.length) {
          console.log('🔧 Fixing corrupted organization types data...');
          dataManager.saveData(FALLBACK_ORGANIZATION_TYPES);
          result.fixedIssues.push(`Organization Types: Fixed ${orgTypes.length - validTypes.length} corrupted entries`);
        }
      }
    } catch (error) {
      console.error('❌ Error checking organization types:', error);
      result.errors.push(`Organization Types check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkAndFixEntityTypes(result: HealthCheckResult): Promise<void> {
    const key = 'master_data_entity_types';
    result.checkedKeys.push(key);

    try {
      const dataManager = new LegacyDataManager<string[]>({
        key,
        defaultData: FALLBACK_ENTITY_TYPES,
        version: 1
      });

      const entityTypes = dataManager.loadData();
      
      if (!entityTypes || !Array.isArray(entityTypes) || entityTypes.length === 0) {
        console.log('🔧 Fixing entity types data...');
        dataManager.saveData(FALLBACK_ENTITY_TYPES);
        result.fixedIssues.push('Entity Types: Restored fallback data');
      } else {
        // Validate all are strings
        const validTypes = entityTypes.filter(type => typeof type === 'string' && type.trim().length > 0);
        
        if (validTypes.length !== entityTypes.length) {
          console.log('🔧 Fixing corrupted entity types data...');
          dataManager.saveData(FALLBACK_ENTITY_TYPES);
          result.fixedIssues.push(`Entity Types: Fixed ${entityTypes.length - validTypes.length} corrupted entries`);
        }
      }
    } catch (error) {
      console.error('❌ Error checking entity types:', error);
      result.errors.push(`Entity Types check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async checkAndFixIndustrySegments(result: HealthCheckResult): Promise<void> {
    const key = 'master_data_industry_segments';
    result.checkedKeys.push(key);

    try {
      const industryData: IndustrySegmentData = industrySegmentDataManager.loadData();
      
      if (!industryData || !industryData.industrySegments || !Array.isArray(industryData.industrySegments) || industryData.industrySegments.length === 0) {
        console.log('🔧 Fixing industry segments data...');
        industrySegmentDataManager.saveData({ industrySegments: FALLBACK_INDUSTRY_SEGMENTS });
        result.fixedIssues.push('Industry Segments: Restored fallback data');
      } else {
        // Validate structure
        const validSegments = industryData.industrySegments.filter((segment: any) => 
          segment && typeof segment === 'object' && segment.id && segment.industrySegment
        );
        
        if (validSegments.length !== industryData.industrySegments.length) {
          console.log('🔧 Fixing corrupted industry segments data...');
          industrySegmentDataManager.saveData({ industrySegments: FALLBACK_INDUSTRY_SEGMENTS });
          result.fixedIssues.push(`Industry Segments: Fixed ${industryData.industrySegments.length - validSegments.length} corrupted entries`);
        }
      }
    } catch (error) {
      console.error('❌ Error checking industry segments:', error);
      result.errors.push(`Industry Segments check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Quick health check - just verifies data exists without deep validation
   */
  quickHealthCheck(): boolean {
    try {
      const keys = [
        'master_data_countries',
        'master_data_organization_types',
        'master_data_entity_types',
        'master_data_industry_segments'
      ];

      for (const key of keys) {
        const data = localStorage.getItem(key);
        if (!data) {
          console.log(`⚠️ Quick check failed: ${key} missing`);
          return false;
        }

        try {
          const parsed = JSON.parse(data);
          if (!parsed || (Array.isArray(parsed) && parsed.length === 0)) {
            console.log(`⚠️ Quick check failed: ${key} empty`);
            return false;
          }
        } catch (parseError) {
          console.log(`⚠️ Quick check failed: ${key} corrupted`);
          return false;
        }
      }

      console.log('✅ Quick health check passed');
      return true;
    } catch (error) {
      console.error('❌ Quick health check error:', error);
      return false;
    }
  }

  /**
   * Get the last health check result
   */
  getLastHealthCheck(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  /**
   * Clear the health check cache
   */
  clearHealthCheckCache(): void {
    this.lastHealthCheck = null;
  }

  private getDefaultResult(): HealthCheckResult {
    return {
      isHealthy: false,
      fixedIssues: [],
      checkedKeys: [],
      errors: ['No health check has been performed yet'],
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const masterDataHealthService = MasterDataHealthService.getInstance();

// Export convenience functions
export const runMasterDataHealthCheck = () => masterDataHealthService.runHealthCheck();
export const quickMasterDataCheck = () => masterDataHealthService.quickHealthCheck();
export const getLastHealthCheck = () => masterDataHealthService.getLastHealthCheck();