
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  // Handle Indian Rupee formatting to match your reference image format
  if (currency === 'INR') {
    return `INR${amount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  }
  
  // Handle other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
