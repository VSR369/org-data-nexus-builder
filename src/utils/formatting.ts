
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0';
  }

  // Handle Indian Rupee specially
  if (currency === 'INR' || currency === 'Rs' || currency === '₹') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Handle other currencies
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency codes
    return `${currency || '$'} ${amount.toLocaleString()}`;
  }
};

export const formatPercentage = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number, decimals: number = 0) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
