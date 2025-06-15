
import { Currency } from './interfaces';

// IMPORTANT: These are ONLY used when NO user data exists
export const emergencyFallbackCurrencies: Currency[] = [
  { 
    id: 'fallback_1', 
    code: 'USD', 
    name: 'US Dollar', 
    symbol: '$', 
    country: 'United States of America',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUserCreated: false
  },
  { 
    id: 'fallback_2', 
    code: 'EUR', 
    name: 'Euro', 
    symbol: '€', 
    country: 'European Union',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUserCreated: false
  }
];

export const emergencyFallbackEntityTypes: string[] = [
  'Commercial',
  'Non-Profit Organization'
];
