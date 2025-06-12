
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkExistingMembership } from '@/utils/membershipUtils';

interface UseMembershipFormProps {
  userId?: string;
  organizationName?: string;
  isEditing?: boolean;
  existingEntityType?: string;
  existingMembershipPlan?: string;
}

interface MembershipFeeEntry {
  id: string;
  country: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
}

export const useMembershipForm = ({
  userId,
  organizationName,
  isEditing,
  existingEntityType,
  existingMembershipPlan
}: UseMembershipFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [entityTypes] = useState<string[]>([
    'Startup',
    'SME',
    'Corporation',
    'Non-Profit',
    'Government',
    'Educational Institution'
  ]);

  const [membershipFees] = useState<MembershipFeeEntry[]>([
    {
      id: 'fee-1',
      country: 'Global',
      entityType: 'Startup',
      quarterlyAmount: 99,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 189,
      halfYearlyCurrency: 'USD',
      annualAmount: 359,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-2',
      country: 'Global',
      entityType: 'SME',
      quarterlyAmount: 199,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 379,
      halfYearlyCurrency: 'USD',
      annualAmount: 719,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-3',
      country: 'Global',
      entityType: 'Corporation',
      quarterlyAmount: 499,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 949,
      halfYearlyCurrency: 'USD',
      annualAmount: 1799,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-4',
      country: 'Global',
      entityType: 'Non-Profit',
      quarterlyAmount: 49,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 94,
      halfYearlyCurrency: 'USD',
      annualAmount: 179,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-5',
      country: 'Global',
      entityType: 'Government',
      quarterlyAmount: 299,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 569,
      halfYearlyCurrency: 'USD',
      annualAmount: 1079,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-6',
      country: 'Global',
      entityType: 'Educational Institution',
      quarterlyAmount: 149,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 284,
      halfYearlyCurrency: 'USD',
      annualAmount: 539,
      annualCurrency: 'USD'
    }
  ]);

  // Initialize form state with existing data if editing
  const [selectedEntityType, setSelectedEntityType] = useState<string>(() => {
    if (isEditing && existingEntityType) {
      console.log('🔄 Pre-filling entity type:', existingEntityType);
      return existingEntityType;
    }
    
    // Try to get from localStorage if no props passed
    if (isEditing && userId) {
      const membershipDetails = checkExistingMembership(userId);
      if (membershipDetails.entityType) {
        console.log('🔄 Loading entity type from localStorage:', membershipDetails.entityType);
        return membershipDetails.entityType;
      }
    }
    
    return '';
  });

  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    if (isEditing && existingMembershipPlan) {
      console.log('🔄 Pre-filling membership plan:', existingMembershipPlan);
      return existingMembershipPlan;
    }
    
    // Try to get from localStorage if no props passed
    if (isEditing && userId) {
      const membershipDetails = checkExistingMembership(userId);
      if (membershipDetails.membershipPlan) {
        console.log('🔄 Loading membership plan from localStorage:', membershipDetails.membershipPlan);
        return membershipDetails.membershipPlan;
      }
    }
    
    return '';
  });

  const [isLoading, setIsLoading] = useState(false);

  // Effect to handle editing mode initialization
  useEffect(() => {
    if (isEditing && userId) {
      console.log('🔄 Editing mode detected, checking for existing membership data...');
      const membershipDetails = checkExistingMembership(userId);
      
      // Only update if we don't already have the data from props
      if (!existingEntityType && membershipDetails.entityType) {
        console.log('🔄 Setting entity type from localStorage:', membershipDetails.entityType);
        setSelectedEntityType(membershipDetails.entityType);
      }
      
      if (!existingMembershipPlan && membershipDetails.membershipPlan) {
        console.log('🔄 Setting membership plan from localStorage:', membershipDetails.membershipPlan);
        setSelectedPlan(membershipDetails.membershipPlan);
      }
    }
  }, [isEditing, userId, existingEntityType, existingMembershipPlan]);

  const getMembershipOptions = () => {
    if (!selectedEntityType) return null;

    const feeConfig = membershipFees.find(
      fee => fee.entityType === selectedEntityType
    );

    if (!feeConfig) return null;

    return {
      quarterly: {
        amount: feeConfig.quarterlyAmount,
        currency: feeConfig.quarterlyCurrency,
        label: 'Quarterly'
      },
      halfYearly: {
        amount: feeConfig.halfYearlyAmount,
        currency: feeConfig.halfYearlyCurrency,
        label: 'Half-Yearly'
      },
      annual: {
        amount: feeConfig.annualAmount,
        currency: feeConfig.annualCurrency,
        label: 'Annual'
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEntityType || !selectedPlan) {
      toast({
        title: "Incomplete Information",
        description: "Please select both entity type and membership plan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const membershipOptions = getMembershipOptions();
      const selectedOption = membershipOptions?.[selectedPlan as keyof typeof membershipOptions];

      const membershipData = {
        userId: userId || '',
        organizationName: organizationName || '',
        entityType: selectedEntityType,
        membershipPlan: selectedPlan,
        amount: selectedOption?.amount || 0,
        currency: selectedOption?.currency || 'USD',
        isMember: true,
        joinedAt: isEditing ? undefined : new Date().toISOString(), // Don't update join date when editing
        lastUpdated: new Date().toISOString()
      };

      // Get existing data to preserve joinedAt date
      if (isEditing && userId) {
        const existingData = checkExistingMembership(userId);
        if (existingData.joinedAt) {
          membershipData.joinedAt = existingData.joinedAt;
        }
      }

      localStorage.setItem('seeker_membership_data', JSON.stringify(membershipData));
      console.log('💾 Saved membership data:', membershipData);

      toast({
        title: isEditing ? "Membership Updated" : "Membership Registration Successful",
        description: isEditing 
          ? "Your membership details have been updated successfully." 
          : "Welcome! Your membership has been activated.",
        variant: "default"
      });

      // Navigate back to dashboard with updated membership status
      navigate('/seeker-dashboard', {
        state: {
          userId,
          organizationName,
          isMember: true
        }
      });

    } catch (error) {
      console.error('❌ Error saving membership:', error);
      toast({
        title: "Error",
        description: "Failed to save membership information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    entityTypes,
    membershipFees,
    selectedEntityType,
    setSelectedEntityType,
    selectedPlan,
    setSelectedPlan,
    isLoading,
    getMembershipOptions,
    handleSubmit
  };
};
