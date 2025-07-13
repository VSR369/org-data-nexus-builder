export const formatCurrency = (amount: number, currencyCode?: string): string => {
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
  return `${value.toFixed(2)}%`;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};