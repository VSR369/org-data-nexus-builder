
/**
 * Utility functions for membership status management
 */

export interface MembershipStatus {
  isActive: boolean;
  status: string;
  displayText: string;
  variant: 'default' | 'destructive' | 'secondary';
}

/**
 * Determines if a user has an active membership
 */
export const isMembershipActive = (membershipData: any): boolean => {
  if (!membershipData) return false;
  
  return (
    membershipData.status === 'member_paid' ||
    membershipData.status === 'Active' ||
    membershipData.membership_status === 'active' ||
    (membershipData.paymentStatus === 'paid' && membershipData.membership_status === 'active') ||
    (membershipData.mem_payment_status === 'paid' && membershipData.membership_status === 'active')
  );
};

/**
 * Gets comprehensive membership status information
 */
export const getMembershipStatus = (membershipData: any): MembershipStatus => {
  const isActive = isMembershipActive(membershipData);
  
  if (isActive) {
    return {
      isActive: true,
      status: 'active',
      displayText: 'Premium Member',
      variant: 'default'
    };
  }
  
  return {
    isActive: false,
    status: 'inactive',
    displayText: 'Inactive Member',
    variant: 'destructive'
  };
};

/**
 * Validates payment data before processing
 */
export const validatePaymentData = (paymentData: {
  plan: string;
  amount: number;
  currency: string;
  method: string;
  termsAccepted: boolean;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!paymentData.plan) errors.push('Please select a membership plan');
  if (!paymentData.amount || paymentData.amount <= 0) errors.push('Invalid payment amount');
  if (!paymentData.currency) errors.push('Currency is required');
  if (!paymentData.method) errors.push('Please select a payment method');
  if (!paymentData.termsAccepted) errors.push('Please accept the terms and conditions');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats currency display
 */
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

/**
 * Generates a receipt number
 */
export const generateReceiptNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
};

/**
 * Calculates next payment due date based on frequency
 */
export const calculateNextDueDate = (lastPaymentDate: string, frequency: string): Date => {
  const lastDate = new Date(lastPaymentDate);
  const nextDate = new Date(lastDate);
  
  const frequencyMap: { [key: string]: number } = {
    'monthly': 1,
    'quarterly': 3,
    'half-yearly': 6,
    'annual': 12
  };
  
  const months = frequencyMap[frequency] || 12;
  nextDate.setMonth(nextDate.getMonth() + months);
  
  return nextDate;
};
