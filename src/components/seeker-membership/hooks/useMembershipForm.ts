
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';

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

interface UseMembershipFormProps {
  userId?: string;
  organizationName?: string;
  isEditing?: boolean;
  existingEntityType?: string;
  existingMembershipPlan?: string;
}

const entityTypeDataManager = new DataManager<string[]>({
  key: 'master_data_entity_types',
  defaultData: ['Commercial', 'Non-Profit Organization', 'Society', 'Trust'],
  version: 1
});

const membershipFeeDataManager = new DataManager<MembershipFeeEntry[]>({
  key: 'master_data_seeker_membership_fees',
  defaultData: [],
  version: 1
});

export const useMembershipForm = ({
  userId,
  organizationName,
  isEditing,
  existingEntityType,
  existingMembershipPlan
}: UseMembershipFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [membershipFees, setMembershipFees] = useState<MembershipFeeEntry[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load master data
  useEffect(() => {
    console.log('🔄 Loading master data...');
    
    const loadedEntityTypes = entityTypeDataManager.loadData();
    const loadedMembershipFees = membershipFeeDataManager.loadData();
    
    console.log('🔍 Raw loaded entity types:', loadedEntityTypes);
    console.log('🔍 Raw loaded membership fees:', loadedMembershipFees);
    
    setEntityTypes(loadedEntityTypes);
    setMembershipFees(loadedMembershipFees);
    
    // Pre-fill form if editing with existing data
    if (isEditing && existingEntityType && existingMembershipPlan) {
      console.log('🔧 Pre-filling form for editing:', { existingEntityType, existingMembershipPlan });
      setSelectedEntityType(existingEntityType);
      setSelectedPlan(existingMembershipPlan);
    } else if (loadedEntityTypes.length > 0 && !isEditing) {
      // Auto-select first entity type only if not editing
      setSelectedEntityType(loadedEntityTypes[0]);
      console.log('🎯 Auto-selected entity type:', loadedEntityTypes[0]);
    }
  }, [isEditing, existingEntityType, existingMembershipPlan]);

  // Load existing membership data when editing (fallback method)
  useEffect(() => {
    if (isEditing && userId && !existingEntityType) {
      console.log('🔍 Loading existing membership data for editing (fallback)...');
      const existingMembershipData = localStorage.getItem('seeker_membership_data');
      
      if (existingMembershipData) {
        try {
          const parsedData = JSON.parse(existingMembershipData);
          console.log('📋 Existing membership data:', parsedData);
          
          if (parsedData.userId === userId) {
            console.log('✅ Found matching membership data, pre-filling form');
            setSelectedEntityType(parsedData.entityType || '');
            setSelectedPlan(parsedData.membershipPlan || '');
          }
        } catch (error) {
          console.log('❌ Error parsing existing membership data:', error);
        }
      }
    }
  }, [isEditing, userId, existingEntityType]);

  // Get membership fee options for selected entity type
  const getMembershipOptions = () => {
    console.log('🔍 Getting membership options for entity type:', selectedEntityType);
    
    if (!selectedEntityType) {
      console.log('❌ No entity type selected');
      return null;
    }
    
    const feeConfig = membershipFees.find(fee => {
      console.log(`🔍 Checking fee config: ${fee.entityType} === ${selectedEntityType}?`, fee.entityType === selectedEntityType);
      return fee.entityType === selectedEntityType;
    });
    
    if (!feeConfig) {
      console.log('❌ No membership fee configuration found for entity type:', selectedEntityType);
      return null;
    }
    
    console.log('✅ Found fee configuration:', feeConfig);
    
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
        title: "Validation Error",
        description: "Please select entity type and membership plan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save membership data to localStorage with all details preserved
      const membershipData = {
        userId,
        organizationName,
        entityType: selectedEntityType,
        membershipPlan: selectedPlan,
        isMember: true,
        joinedAt: isEditing ? 
          (JSON.parse(localStorage.getItem('seeker_membership_data') || '{}').joinedAt || new Date().toISOString()) : 
          new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('seeker_membership_data', JSON.stringify(membershipData));
      console.log('💾 Saved membership data to localStorage:', membershipData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: isEditing ? "Update Successful" : "Registration Successful",
        description: isEditing ? "Your membership has been updated successfully!" : "Your membership registration has been submitted successfully!",
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
      toast({
        title: isEditing ? "Update Failed" : "Registration Failed",
        description: isEditing ? "There was an error updating your membership." : "There was an error processing your membership registration.",
        variant: "destructive",
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
