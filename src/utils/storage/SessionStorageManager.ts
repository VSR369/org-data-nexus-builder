
import { SessionManager } from './managers/SessionManager';
import { UserManager } from './managers/UserManager';
import { StorageHealthManager } from './managers/StorageHealthManager';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

interface RegisteredUser {
  userId: string;
  password: string;
  organizationName: string;
  entityType: string;
  country: string;
  email: string;
  contactPersonName: string;
  industrySegment: string;
  organizationId: string;
  registrationTimestamp?: string;
}

class SessionStorageManager {
  private sessionManager: SessionManager;
  private userManager: UserManager;
  private healthManager: StorageHealthManager;

  constructor() {
    this.sessionManager = new SessionManager();
    this.userManager = new UserManager();
    this.healthManager = new StorageHealthManager(this.sessionManager, this.userManager);
  }

  saveSession(sessionData: SessionData): boolean {
    return this.sessionManager.saveSession(sessionData);
  }

  loadSession(): SessionData | null {
    return this.sessionManager.loadSession();
  }

  clearSession(): void {
    this.sessionManager.clearSession();
  }

  saveUser(user: RegisteredUser): boolean {
    return this.userManager.saveUser(user);
  }

  findUser(userId: string, password: string): RegisteredUser | null {
    return this.userManager.findUser(userId, password);
  }

  getStorageHealth(): {
    session: any;
    users: any;
    directUsersCount: number;
  } {
    return this.healthManager.getStorageHealth();
  }
}

export const sessionStorageManager = new SessionStorageManager();
