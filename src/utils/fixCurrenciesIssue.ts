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
    
    // Check current state
    const existing = localStorage.getItem('master_data_currencies');
    if (existing) {
      const parsed = JSON.parse(existing);
      console.log('Current currencies structure:', typeof parsed, parsed);
      
      // If it's wrapped in data manager format, unwrap it
      if (parsed && typeof parsed === 'object' && (parsed.data || parsed.version)) {
        console.log('🔧 Detected wrapped data manager format, unwrapping...');
        const unwrapped = parsed.data || CURRENCIES_DATA;
        localStorage.setItem('master_data_currencies', JSON.stringify(unwrapped));
      }
    }
    
    // Force overwrite with correct structure regardless
    localStorage.setItem('master_data_currencies', JSON.stringify(CURRENCIES_DATA));
    
    // Verify the fix worked
    const verification = localStorage.getItem('master_data_currencies');
    if (verification) {
      const parsed = JSON.parse(verification);
      console.log('After fix - currencies structure:', typeof parsed, Array.isArray(parsed), parsed);
      
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

// Force manual fix function
export function forceCurrenciesFixed(): void {
  console.log('🔧 Force-fixing currencies data structure...');
  
  // Remove existing data completely
  localStorage.removeItem('master_data_currencies');
  
  // Set the correct structure
  localStorage.setItem('master_data_currencies', JSON.stringify(CURRENCIES_DATA));
  
  console.log('✅ Currencies force-fixed - data structure corrected');
}

// Auto-run the fix
fixCurrenciesNow();

// Also run the force fix to ensure it's completely clean
forceCurrenciesFixed();

export default fixCurrenciesNow;