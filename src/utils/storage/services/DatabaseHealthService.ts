
import { IndexedDBService } from '../IndexedDBService';

export class DatabaseHealthService {
  private healthService: IndexedDBService<any>;

  constructor() {
    this.healthService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
  }

  async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      // Test basic database operations
      const testRecord = {
        id: 'health_check',
        timestamp: new Date().toISOString()
      };

      await this.healthService.put(testRecord);
      const retrieved = await this.healthService.getById('health_check');
      await this.healthService.delete('health_check');

      if (retrieved) {
        console.log('✅ Database health check passed');
        return { healthy: true };
      } else {
        console.log('❌ Database health check failed: record not retrieved');
        return { healthy: false, error: 'Record not retrieved after save' };
      }
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }
}
