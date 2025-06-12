import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { checkExistingMembership, cleanMembershipData } from '@/utils/membershipUtils';
import { UniversalDataManager } from '@/utils/core/UniversalDataManager';

interface UseMembershipFormProps {
  userId?: string;
  organizationName?: string;
  isEditing?: boolean;
  existingEntityType?: string;
  existingMembershipPlan?: string;
  entityTypes?: string[];
  membershipFees?: MembershipFeeEntry[];
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

// Create data manager for entity types from master data
const entityTypesDataManager = new UniversalDataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: [],
  version: 1,
  seedFunction: () => [
    'Commercial',
    'Non-Profit Organization',
    'Society/ Trust'
  ],
  validationFunction: (data) => Array.isArray(data) && data.length > 0
});

export const useMembershipForm = ({
  userId,
  organizationName,
  isEditing,
  existingEntityType,
  existingMembershipPlan,
  entityTypes: overrideEntityTypes,
  membershipFees: overrideMembershipFees
}: UseMembershipFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load entity types from master data or use override
  const [entityTypes, setEntityTypes] = useState<string[]>([]);

  const [membershipFees] = useState<MembershipFeeEntry[]>(overrideMembershipFees || [
    {
      id: 'fee-1',
      country: 'Global',
      entityType: 'Commercial',
      quarterlyAmount: 199,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 379,
      halfYearlyCurrency: 'USD',
      annualAmount: 719,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-2',
      country: 'Global',
      entityType: 'Non-Profit Organization',
      quarterlyAmount: 49,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 94,
      halfYearlyCurrency: 'USD',
      annualAmount: 179,
      annualCurrency: 'USD'
    },
    {
      id: 'fee-3',
      country: 'Global',
      entityType: 'Society/ Trust',
      quarterlyAmount: 99,
      quarterlyCurrency: 'USD',
      halfYearlyAmount: 189,
      halfYearlyCurrency: 'USD',
      annualAmount: 359,
      annualCurrency: 'USD'
    }
  ]);

  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load entity types from master data on component mount or use override
  useEffect(() => {
    if (overrideEntityTypes) {
      console.log('🔍 Using override entity types:', overrideEntityTypes);
      setEntityTypes(overrideEntityTypes);
    } else {
      console.log('🔍 Loading entity types from master data...');
      const loadedEntityTypes = entityTypesDataManager.loadData();
      console.log('📋 Loaded entity types:', loadedEntityTypes);
      setEntityTypes(loadedEntityTypes);
    }
  }, [overrideEntityTypes]);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (isEditing && userId) {
      console.log('🔄 Editing mode - initializing form with existing data...');
      console.log('📥 Props received:', { 
        existingEntityType, 
        existingMembershipPlan,
        userId,
        organizationName 
      });

      // Clean any malformed data first
      cleanMembershipData(userId);

      // Get membership details from localStorage
      const membershipDetails = checkExistingMembership(userId);
      console.log('📋 Retrieved membership details from storage:', membershipDetails);

      // Set entity type - prefer props, fallback to localStorage
      const entityTypeToSet = existingEntityType || membershipDetails.entityType;
      console.log('🔍 Entity type to set:', entityTypeToSet, 'Type:', typeof entityTypeToSet);
      
      if (entityTypeToSet && typeof entityTypeToSet === 'string' && entityTypeToSet.trim() !== '') {
        console.log('✅ Setting entity type:', entityTypeToSet);
        setSelectedEntityType(entityTypeToSet);
      } else {
        console.warn('⚠️ No valid entity type found to pre-fill:', entityTypeToSet);
      }

      // Set membership plan - prefer props, fallback to localStorage
      const membershipPlanToSet = existingMembershipPlan || membershipDetails.membershipPlan;
      console.log('🔍 Membership plan to set:', membershipPlanToSet, 'Type:', typeof membershipPlanToSet);
      
      if (membershipPlanToSet && typeof membershipPlanToSet === 'string' && membershipPlanToSet.trim() !== '') {
        console.log('✅ Setting membership plan:', membershipPlanToSet);
        setSelectedPlan(membershipPlanToSet);
      } else {
        console.warn('⚠️ No valid membership plan found to pre-fill:', membershipPlanToSet);
      }
    } else {
      console.log('🆕 New membership mode - starting with empty form');
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

      // Get existing data to preserve joinedAt date
      const existingData = isEditing && userId ? checkExistingMembership(userId) : null;

      // Ensure we save clean string data
      const membershipData = {
        userId: userId || '',
        organizationName: organizationName || '',
        entityType: selectedEntityType, // Store as clean string
        membershipPlan: selectedPlan,   // Store as clean string
        amount: selectedOption?.amount || 0,
        currency: selectedOption?.currency || 'USD',
        isMember: true,
        joinedAt: existingData?.joinedAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      console.log('💾 Saving membership data:', membershipData);
      console.log('🔍 Entity type being saved:', selectedEntityType, 'Type:', typeof selectedEntityType);
      console.log('🔍 Membership plan being saved:', selectedPlan, 'Type:', typeof selectedPlan);

      localStorage.setItem('seeker_membership_data', JSON.stringify(membershipData));
      console.log('✅ Membership data saved to localStorage');

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
