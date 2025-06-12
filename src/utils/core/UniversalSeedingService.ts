
import { UniversalDataManager } from './UniversalDataManager';

interface SeedingRegistry {
  [key: string]: () => any;
}

export class UniversalSeedingService {
  private static instance: UniversalSeedingService;
  private seedingRegistry: SeedingRegistry = {};
  private managers: Map<string, UniversalDataManager<any>> = new Map();

  static getInstance(): UniversalSeedingService {
    if (!UniversalSeedingService.instance) {
      UniversalSeedingService.instance = new UniversalSeedingService();
    }
    return UniversalSeedingService.instance;
  }

  registerManager<T>(key: string, manager: UniversalDataManager<T>): void {
    this.managers.set(key, manager);
    console.log(`📝 Registered manager for ${key}`);
  }

  registerSeedFunction(key: string, seedFunction: () => any): void {
    this.seedingRegistry[key] = seedFunction;
    console.log(`🌱 Registered seed function for ${key}`);
  }

  seedAll(): void {
    console.log('🌱 Seeding all registered data managers...');
    for (const [key, manager] of this.managers) {
      try {
        manager.forceReseed();
        console.log(`✅ Successfully seeded ${key}`);
      } catch (error) {
        console.error(`❌ Failed to seed ${key}:`, error);
      }
    }
  }

  seedSpecific(key: string): void {
    const manager = this.managers.get(key);
    if (manager) {
      manager.forceReseed();
      console.log(`✅ Successfully reseeded ${key}`);
    } else {
      console.error(`❌ No manager found for ${key}`);
    }
  }

  getSystemHealth(): { [key: string]: any } {
    const health: { [key: string]: any } = {};
    for (const [key, manager] of this.managers) {
      health[key] = manager.getDataHealth();
    }
    return health;
  }
}

export const seedingService = UniversalSeedingService.getInstance();
