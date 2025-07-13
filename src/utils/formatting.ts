export const formatCurrency = (amount: number, currencyCode?: string): string => {
  if (amount === null || amount === undefined) return '0.00';
  
  if (!currencyCode) {
    return amount.toFixed(2);
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback if currency code is invalid
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
};

export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined) return '0.00%';
  return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  if (value === null || value === undefined) return '0';
  return value.toFixed(decimals);
};