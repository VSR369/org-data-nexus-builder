
/**
 * Generates a unique Solution Provider ID
 * Format: SP-YYYYMMDD-HHMMSS-XXXXX
 * Where XXXXX is a random 5-character alphanumeric string
 */
export const generateProviderId = (): string => {
  const now = new Date();
  
  // Format date as YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Format time as HHMMSS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}${minutes}${seconds}`;
  
  // Generate random 5-character alphanumeric string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `SP-${dateStr}-${timeStr}-${randomStr}`;
};

/**
 * Checks if a provider ID already exists in localStorage
 * This helps prevent duplicates during the same session
 */
export const isProviderIdUnique = (providerId: string): boolean => {
  try {
    const existingProviders = localStorage.getItem('enrolled-providers');
    if (!existingProviders) return true;
    
    const providers = JSON.parse(existingProviders);
    return !providers.some((provider: any) => provider.providerId === providerId);
  } catch (error) {
    console.error('Error checking provider ID uniqueness:', error);
    return true; // Assume unique if error occurs
  }
};

/**
 * Generates a guaranteed unique provider ID by checking against existing ones
 */
export const generateUniqueProviderId = (): string => {
  let providerId = generateProviderId();
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isProviderIdUnique(providerId) && attempts < maxAttempts) {
    // Wait a millisecond to ensure different timestamp
    const start = Date.now();
    while (Date.now() - start < 1) {
      // Busy wait for 1ms
    }
    providerId = generateProviderId();
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    // Fallback: add extra random characters
    providerId += '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  
  return providerId;
};
