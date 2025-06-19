
import { IndexedDBService } from '../IndexedDBService';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export class SessionDataService {
  private sessionService: IndexedDBService<any>;

  constructor() {
    this.sessionService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      console.log('💾 Saving session data to IndexedDB:', sessionData);
      
      const sessionRecord = {
        id: 'seeker_session_data',
        ...sessionData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.sessionService.put(sessionRecord);

      console.log('✅ Session data saved successfully to IndexedDB');
      return true;
    } catch (error) {
      console.error('❌ Error saving session data to IndexedDB:', error);
      return false;
    }
  }

  async loadSession(): Promise<SessionData | null> {
    try {
      const sessionRecord = await this.sessionService.getById('seeker_session_data');
      if (sessionRecord) {
        const sessionData = sessionRecord.data || sessionRecord;
        console.log('✅ Session loaded from IndexedDB');
        return sessionData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading session from IndexedDB:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      await this.sessionService.delete('seeker_session_data');
      console.log('✅ Session cleared from IndexedDB');
    } catch (error) {
      console.error('❌ Error clearing session from IndexedDB:', error);
    }
  }
}
