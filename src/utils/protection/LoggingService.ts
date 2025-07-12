// Logging Service for Protection Actions
export class LoggingService {
  private static readonly PROTECTION_LOG_KEY = 'pricing_protection_log';

  // Log protection actions for audit trail
  static logProtectionAction(action: string, details: any): void {
    try {
      const log = JSON.parse(localStorage.getItem(this.PROTECTION_LOG_KEY) || '[]');
      log.push({
        timestamp: new Date().toISOString(),
        action,
        details
      });
      
      // Keep only last 100 log entries
      if (log.length > 100) {
        log.splice(0, log.length - 100);
      }
      
      localStorage.setItem(this.PROTECTION_LOG_KEY, JSON.stringify(log));
    } catch (error) {
      console.warn('Failed to log protection action:', error);
    }
  }

  // Get protection log
  static getProtectionLog(): Array<{ timestamp: string; action: string; details: any }> {
    try {
      return JSON.parse(localStorage.getItem(this.PROTECTION_LOG_KEY) || '[]');
    } catch (error) {
      console.error('Failed to get protection log:', error);
      return [];
    }
  }
}
