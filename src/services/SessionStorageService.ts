
import { IndexedDBService } from '@/utils/storage/IndexedDBService';
import { SessionData } from './types';

export class SessionStorageService {
  private sessionService: IndexedDBService<any>;

  constructor() {
    this.sessionService = new IndexedDBService<any>({
      storeName: 'userProfiles'
    });
  }

  async saveSession(sessionData: SessionData): Promise<boolean> {
    try {
      console.log('💾 Saving session data:', sessionData);
      
      const sessionRecord = {
        id: 'seeker_session_data',
        ...sessionData,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.sessionService.put(sessionRecord);
      console.log('✅ Session saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving session:', error);
      return false;
    }
  }

  async loadSession(): Promise<SessionData | null> {
    try {
      const sessionRecord = await this.sessionService.getById('seeker_session_data');
      if (sessionRecord) {
        console.log('✅ Session loaded from storage');
        return sessionRecord;
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading session:', error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      await this.sessionService.delete('seeker_session_data');
      console.log('✅ Session cleared');
    } catch (error) {
      console.error('❌ Error clearing session:', error);
    }
  }
}
