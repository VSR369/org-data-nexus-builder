
import { useState, useEffect } from 'react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useUserData } from "@/components/dashboard/UserDataProvider";
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';

interface MembershipFeeEntry {
  id: string;
  country: string;
  organizationType: string;
  entityType: string;
  quarterlyAmount: number;
  quarterlyCurrency: string;
  halfYearlyAmount: number;
  halfYearlyCurrency: string;
  annualAmount: number;
  annualCurrency: string;
  createdAt: string;
  updatedAt: string;
  isUserCreated: boolean;
}

interface MembershipData {
  status: 'active' | 'inactive' | 'not-member';
  selectedPlan?: string;
  selectedEngagementModel?: string;
  pricingDetails?: {
    currency: string;
    amount: number;
    paymentFrequency: string;
  };
  activationDate?: string;
  paymentStatus?: string;
  hasActualSelection?: boolean;
}

const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};

export const useMembershipData = () => {
  const { userData } = useUserData();
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembershipData = async () => {
      console.log('🔍 Loading membership data for user:', userData.userId);
      console.log('🔍 User details:', { 
        entityType: userData.entityType, 
        country: userData.country, 
        organizationType: userData.organizationType 
      });
      
      try {
        await unifiedUserStorageService.initialize();
        
        // Check for completed membership payment (this indicates actual active membership)
        const completedPayment = localStorage.getItem('completed_membership_payment');
        let hasActiveMembership = false;
        let membershipInfo = null;
        
        if (completedPayment) {
          try {
            const paymentData = JSON.parse(completedPayment);
            if (paymentData.userId === userData.userId && paymentData.membershipStatus === 'active') {
              hasActiveMembership = true;
              membershipInfo = {
                status: 'active',
                selectedPlan: paymentData.selectedPlan,
                activationDate: paymentData.paidAt,
                paymentStatus: 'completed',
                pricingDetails: paymentData.pricing ? {
                  currency: paymentData.pricing.currency,
                  amount: paymentData.pricing[`${paymentData.selectedPlan}Price`] || 0,
                  paymentFrequency: paymentData.selectedPlan
                } : undefined
              };
              console.log('✅ Found active membership payment:', membershipInfo);
            }
          } catch (error) {
            console.log('❌ Error parsing membership payment data:', error);
          }
        }
        
        // Check for confirmed engagement model selection
        let engagementModelInfo = null;
        const engagementSelection = localStorage.getItem('engagement_model_selection');
        console.log('🔍 Checking engagement model selection:', engagementSelection);
        
        if (engagementSelection) {
          try {
            const selectionData = JSON.parse(engagementSelection);
            console.log('🔍 Parsed engagement selection data:', selectionData);
            
            // Check if it's a valid selection for the current user
            if (selectionData.userId === userData.userId && selectionData.engagementModel) {
              engagementModelInfo = {
                selectedEngagementModel: selectionData.engagementModel.name || selectionData.engagementModel,
                pricingDetails: selectionData.pricing ? {
                  currency: selectionData.pricing.currency || 'USD',
                  amount: (() => {
                    switch (selectionData.pricingPlan) {
                      case 'quarterly':
                        return selectionData.pricing.quarterlyFee || 0;
                      case 'halfyearly':
                        return selectionData.pricing.halfYearlyFee || 0;
                      case 'annual':
                        return selectionData.pricing.annualFee || 0;
                      default:
                        return 0;
                    }
                  })(),
                  paymentFrequency: selectionData.pricingPlan || 'monthly'
                } : undefined
              };
              console.log('✅ Found engagement model selection:', engagementModelInfo);
            }
          } catch (error) {
            console.log('❌ Error parsing engagement model selection:', error);
          }
        }
        
        // Load membership pricing data from master data if no engagement model pricing found
        let masterDataPricing = null;
        if (!engagementModelInfo?.pricingDetails && !hasActiveMembership) {
          console.log('🔍 Loading membership pricing from master data...');
          try {
            const membershipFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig);
            console.log('🔍 Master data membership fees:', membershipFees);
            
            if (membershipFees && membershipFees.length > 0) {
              // Find exact match for user data
              let matchingFee = membershipFees.find(fee => 
                fee.entityType === userData.entityType && 
                fee.country === userData.country &&
                fee.organizationType === userData.organizationType
              );
              
              if (!matchingFee) {
                // Try fallback matches
                matchingFee = membershipFees.find(fee => 
                  fee.entityType?.toLowerCase() === userData.entityType?.toLowerCase() && 
                  fee.organizationType?.toLowerCase() === userData.organizationType?.toLowerCase()
                );
              }
              
              if (matchingFee) {
                console.log('✅ Found matching membership fee config:', matchingFee);
                masterDataPricing = {
                  currency: matchingFee.quarterlyCurrency,
                  amount: matchingFee.quarterlyAmount,
                  paymentFrequency: 'quarterly'
                };
              }
            }
          } catch (error) {
            console.log('❌ Error loading master data pricing:', error);
          }
        }
        
        // Combine the data with proper flags
        const combinedData: MembershipData = {
          status: hasActiveMembership ? 'active' : 'not-member',
          selectedPlan: membershipInfo?.selectedPlan,
          selectedEngagementModel: engagementModelInfo?.selectedEngagementModel,
          pricingDetails: membershipInfo?.pricingDetails || engagementModelInfo?.pricingDetails || masterDataPricing,
          activationDate: membershipInfo?.activationDate,
          paymentStatus: membershipInfo?.paymentStatus || 'not-paid',
          hasActualSelection: !!(hasActiveMembership || engagementModelInfo)
        };
        
        console.log('📋 Final membership data:', combinedData);
        setMembershipData(combinedData);
        
      } catch (error) {
        console.error('❌ Error loading membership data:', error);
        setMembershipData({
          status: 'not-member',
          hasActualSelection: false
        });
      } finally {
        setLoading(false);
      }
    };

    if (userData.userId) {
      loadMembershipData();
    }
  }, [userData]);

  return { membershipData, loading };
};
