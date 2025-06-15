
// Get currency from master data based on country
export const getCurrencyByCountry = (countryName: string): string => {
  const countryCurrencyMap: { [key: string]: string } = {
    'India': 'INR',
    'United States of America': 'USD',
    'United Arab Emirates': 'AED',
    'United Kingdom': 'GBP',
    'Germany': 'EUR',
    'France': 'EUR',
    'Japan': 'JPY',
    'Australia': 'AUD',
    'China': 'CNY',
    'Brazil': 'BRL',
    'Canada': 'CAD',
    'Mexico': 'MXN'
  };
  
  return countryCurrencyMap[countryName] || '';
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
