
import { DomainGroupsData } from '@/types/domainGroups';

export class DomainGroupsRecoveryUtils {
  static tryRecovery(): DomainGroupsData | null {
    console.log('🔧 Attempting data recovery...');
    
    // Try to recover from any remaining localStorage data
    const allKeys = Object.keys(localStorage);
    const domainKeys = allKeys.filter(key => 
      key.includes('domain') || key.includes('Domain') || 
      key.includes('hierarchy') || key.includes('life_sciences')
    );

    for (const key of domainKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && (Array.isArray(parsed) || (parsed.domainGroups && Array.isArray(parsed.domainGroups)))) {
            console.log(`🔧 Recovered data from ${key}:`, parsed);
            return Array.isArray(parsed) ? { domainGroups: parsed, categories: [], subCategories: [] } : parsed;
          }
        }
      } catch (error) {
        // Skip invalid data
      }
    }
    
    return null;
  }
}
