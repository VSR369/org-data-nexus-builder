
import { sessionStorageManager } from './storage/SessionStorageManager';

export function clearPreviousSessionData(): void {
  sessionStorageManager.clearSession();
}

export function saveSessionData(registeredUser: any): void {
  const sessionData = {
    seekerOrganizationName: registeredUser.organizationName,
    seekerEntityType: registeredUser.entityType,
    seekerCountry: registeredUser.country,
    seekerUserId: registeredUser.userId
  };
  
  const success = sessionStorageManager.saveSession(sessionData);
  if (!success) {
    throw new Error('Session data save failed');
  }
  
  console.log('💾 Session data saved and verified:', sessionData);
}
