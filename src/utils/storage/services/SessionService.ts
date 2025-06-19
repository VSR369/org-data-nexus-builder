
import { SessionDataService } from './SessionDataService';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export class SessionService {
  private sessionData: SessionDataService;

  constructor() {
    this.sessionData = new SessionDataService();
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
}
