// Pricing Utility Functions

// Helper function to normalize country names for comparison
export const normalizeCountryName = (country: string): string => {
  if (!country) return '';
  
  // Handle common variations
  const normalizedCountry = country.trim();
  
  // India variations
  if (['India', 'IN', 'IND'].includes(normalizedCountry)) {
    return 'IN';
  }
  
  // UAE variations
  if (['UAE', 'AE', 'United Arab Emirates'].includes(normalizedCountry)) {
    return 'United Arab Emirates';
  }
  
  // USA variations  
  if (['USA', 'US', 'United States', 'United States of America'].includes(normalizedCountry)) {
    return 'United States of America';
  }
  
  return normalizedCountry;
};