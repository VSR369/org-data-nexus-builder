
import { UserDataService } from './services/UserDataService';
import { SessionService } from './services/SessionService';
import { HealthCheckService } from './services/HealthCheckService';

interface UserData {
  userId: string;
  password: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp: string;
}

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export class UserDataManager {
  private static instance: UserDataManager;
  private userDataService: UserDataService;
  private sessionService: SessionService;
  private healthCheckService: HealthCheckService;

  private constructor() {
    this.userDataService = new UserDataService();
    this.sessionService = new SessionService();
    this.healthCheckService = new HealthCheckService();
  }

  static getInstance(): UserDataManager {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  async saveUser(userData: UserData): Promise<boolean> {
    return await this.userDataService.saveUser(userData);
  }

  async findUser(userId: string, password: string): Promise<UserData | null> {
    return await this.userDataService.findUser(userId, password);
  }

  async getAllUsers(): Promise<UserData[]> {
    return await this.userDataService.getAllUsers();
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    return await this.sessionService.saveSession(sessionData);
  }

  async loadSession(): Promise<SessionData | null> {
    return await this.sessionService.loadSession();
  }

  async clearSession(): Promise<void> {
    await this.sessionService.clearSession();
  }

  async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    return await this.healthCheckService.checkDatabaseHealth();
  }
}

export const userDataManager = UserDataManager.getInstance();
