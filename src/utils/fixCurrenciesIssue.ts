// Emergency fix for currencies issue
// Run this immediately to fix the specific currencies data structure problem

const CURRENCIES_DATA = [
  { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$', isUserCreated: false },
  { id: 'eur', code: 'EUR', name: 'Euro', symbol: '€', isUserCreated: false },
  { id: 'gbp', code: 'GBP', name: 'British Pound', symbol: '£', isUserCreated: false },
  { id: 'inr', code: 'INR', name: 'Indian Rupee', symbol: '₹', isUserCreated: false },
  { id: 'cad', code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', isUserCreated: false },
  { id: 'aud', code: 'AUD', name: 'Australian Dollar', symbol: 'A$', isUserCreated: false },
  { id: 'jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥', isUserCreated: false },
  { id: 'sgd', code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', isUserCreated: false }
];

export function fixCurrenciesNow(): boolean {
  try {
    console.log('🔧 Emergency fix for currencies data structure...');
    
    // Force overwrite with correct structure
    localStorage.setItem('master_data_currencies', JSON.stringify(CURRENCIES_DATA));
    
    // Verify the fix worked
    const verification = localStorage.getItem('master_data_currencies');
    if (verification) {
      const parsed = JSON.parse(verification);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].code) {
        console.log('✅ Currencies fix successful - data structure corrected');
        return true;
      }
    }
    
    console.log('❌ Currencies fix verification failed');
    return false;
  } catch (error) {
    console.error('❌ Currencies emergency fix failed:', error);
    return false;
  }
}

// Auto-run the fix
fixCurrenciesNow();

export default fixCurrenciesNow;