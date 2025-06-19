
import { DatabaseHealthService } from './DatabaseHealthService';

export class HealthCheckService {
  private healthService: DatabaseHealthService;

  constructor() {
    this.healthService = new DatabaseHealthService();
  }

  async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    return await this.healthService.checkDatabaseHealth();
  }
}
