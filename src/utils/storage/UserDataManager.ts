
import { UserStorageService } from './services/UserStorageService';
import { SessionDataService } from './services/SessionDataService';
import { DatabaseHealthService } from './services/DatabaseHealthService';

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
  private userStorage: UserStorageService;
  private sessionData: SessionDataService;
  private healthService: DatabaseHealthService;

  private constructor() {
    this.userStorage = new UserStorageService();
    this.sessionData = new SessionDataService();
    this.healthService = new DatabaseHealthService();
  }

  static getInstance(): UserDataManager {
    if (!UserDataManager.instance) {
      UserDataManager.instance = new UserDataManager();
    }
    return UserDataManager.instance;
  }

  async saveUser(userData: UserData): Promise<boolean> {
    return await this.userStorage.saveUser(userData);
  }

  async findUser(userId: string, password: string): Promise<UserData | null> {
    return await this.userStorage.findUser(userId, password);
  }

  async getAllUsers(): Promise<UserData[]> {
    return await this.userStorage.getAllUsers();
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    return await this.sessionData.saveSession(sessionData);
  }

  async loadSession(): Promise<SessionData | null> {
    return await this.sessionData.loadSession();
  }

  async clearSession(): Promise<void> {
    await this.sessionData.clearSession();
  }

  async checkDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    return await this.healthService.checkDatabaseHealth();
  }
}

export const userDataManager = UserDataManager.getInstance();
