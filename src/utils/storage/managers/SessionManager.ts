
import { LocalStorageManager } from '../LocalStorageManager';

interface SessionData {
  seekerOrganizationName: string;
  seekerEntityType: string;
  seekerCountry: string;
  seekerUserId: string;
}

export class SessionManager {
  private sessionManager: LocalStorageManager<SessionData>;

  constructor() {
    this.sessionManager = new LocalStorageManager<SessionData>({
      key: 'seeker_session_data',
      version: 1,
      validateData: (data: any) => {
        return data &&
               typeof data.seekerOrganizationName === 'string' &&
               typeof data.seekerEntityType === 'string' &&
               typeof data.seekerCountry === 'string' &&
               typeof data.seekerUserId === 'string' &&
               data.seekerOrganizationName.length > 0 &&
               data.seekerUserId.length > 0;
      },
      enableBackup: true
    });
  }

  saveSession(sessionData: SessionData): boolean {
    console.log('💾 === SESSION SAVE START ===');
    const result = this.sessionManager.save(sessionData);
    
    if (result.success) {
      // Also save individual keys for backward compatibility
      Object.entries(sessionData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      console.log('✅ Session saved successfully');
      console.log('💾 === SESSION SAVE END ===');
      return true;
    } else {
      console.error('❌ Session save failed:', result.error);
      console.log('💾 === SESSION SAVE END ===');
      return false;
    }
  }

  loadSession(): SessionData | null {
    console.log('📤 === SESSION LOAD START ===');
    const result = this.sessionManager.load();
    
    if (result.success && result.data) {
      console.log('✅ Session loaded successfully:', result.data);
      console.log('📤 === SESSION LOAD END ===');
      return result.data;
    }

    // Fallback: try to load from individual keys
    console.log('⚠️ Trying fallback session recovery...');
    const fallbackSession = this.loadSessionFromIndividualKeys();
    
    if (fallbackSession) {
      console.log('✅ Session recovered from individual keys');
      // Save the recovered session for future use
      this.saveSession(fallbackSession);
      console.log('📤 === SESSION LOAD END ===');
      return fallbackSession;
    }

    console.log('❌ No session data found');
    console.log('📤 === SESSION LOAD END ===');
    return null;
  }

  private loadSessionFromIndividualKeys(): SessionData | null {
    const keys = ['seekerOrganizationName', 'seekerEntityType', 'seekerCountry', 'seekerUserId'];
    const sessionData: Partial<SessionData> = {};
    
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (!value) {
        return null;
      }
      sessionData[key as keyof SessionData] = value;
    }
    
    return sessionData as SessionData;
  }

  clearSession(): void {
    console.log('🧹 === SESSION CLEAR START ===');
    
    // Clear managed session data
    this.sessionManager.remove();
    
    // Clear individual keys for backward compatibility
    const keys = ['seekerOrganizationName', 'seekerEntityType', 'seekerCountry', 'seekerUserId'];
    keys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🧹 Cleared ${key}`);
    });
    
    console.log('✅ Session cleared successfully');
    console.log('🧹 === SESSION CLEAR END ===');
  }

  getSessionHealth(): any {
    return this.sessionManager.getHealth();
  }
}
