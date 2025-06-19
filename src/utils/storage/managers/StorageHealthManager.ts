
import { SessionManager } from './SessionManager';
import { UserManager } from './UserManager';

export class StorageHealthManager {
  private sessionManager: SessionManager;
  private userManager: UserManager;

  constructor(sessionManager: SessionManager, userManager: UserManager) {
    this.sessionManager = sessionManager;
    this.userManager = userManager;
  }

  getStorageHealth(): {
    session: any;
    users: any;
    directUsersCount: number;
  } {
    return {
      session: this.sessionManager.getSessionHealth(),
      users: this.userManager.getUsersHealth(),
      directUsersCount: this.userManager.getDirectUsersCount()
    };
  }
}
