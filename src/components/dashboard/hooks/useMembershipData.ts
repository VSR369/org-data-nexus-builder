
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
    originalAmount?: number;
    discountPercentage?: number;
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
    if (!userData?.userId) {
      setLoading(false);
      return;
    }

    const loadMembershipData = async () => {
      console.log('🔍 Loading membership data for user:', userData.userId);
      
      try {
        await unifiedUserStorageService.initialize();
        
        // Check for completed membership payment
        const completedPayment = localStorage.getItem('completed_membership_payment');
        let hasActiveMembership = false;
        let membershipInfo = null;
        
        if (completedPayment) {
          try {
            const paymentData = JSON.parse(completedPayment);
            if (paymentData.userId === userData.userId && paymentData.membershipStatus === 'active') {
              hasActiveMembership = true;
              membershipInfo = {
                status: 'active' as const,
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
        
        // Check for engagement model selection
        let engagementModelInfo = null;
        const engagementSelection = localStorage.getItem('engagement_model_selection');
        
        if (engagementSelection) {
          try {
            const selectionData = JSON.parse(engagementSelection);
            
            if (selectionData.userId === userData.userId && selectionData.engagementModel) {
              let amount = 0;
              if (selectionData.pricing && selectionData.pricingPlan) {
                switch (selectionData.pricingPlan) {
                  case 'quarterly':
                    amount = selectionData.pricing.quarterlyFee || 0;
                    break;
                  case 'halfyearly':
                    amount = selectionData.pricing.halfYearlyFee || 0;
                    break;
                  case 'annual':
                    amount = selectionData.pricing.annualFee || 0;
                    break;
                  default:
                    amount = 0;
                }

                if (hasActiveMembership && selectionData.pricing.discountPercentage) {
                  amount = amount * (1 - selectionData.pricing.discountPercentage / 100);
                }
              }

              engagementModelInfo = {
                selectedEngagementModel: selectionData.engagementModel.name || selectionData.engagementModel,
                selectedPlan: selectionData.pricingPlan,
                pricingDetails: selectionData.pricing ? {
                  currency: selectionData.pricing.currency || 'USD',
                  amount: amount,
                  paymentFrequency: selectionData.pricingPlan || 'quarterly',
                  originalAmount: (() => {
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
                  discountPercentage: hasActiveMembership ? selectionData.pricing.discountPercentage : 0
                } : undefined
              };
              console.log('✅ Found engagement model selection:', engagementModelInfo);
            }
          } catch (error) {
            console.log('❌ Error parsing engagement model selection:', error);
          }
        }
        
        // Load membership pricing from master data if needed
        let masterDataPricing = null;
        if (!engagementModelInfo?.pricingDetails && !hasActiveMembership) {
          try {
            const membershipFees = MasterDataPersistenceManager.loadUserData<MembershipFeeEntry[]>(membershipFeeConfig);
            
            if (membershipFees && membershipFees.length > 0) {
              let matchingFee = membershipFees.find(fee => 
                fee.entityType === userData.entityType && 
                fee.country === userData.country &&
                fee.organizationType === userData.organizationType
              );
              
              if (!matchingFee) {
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
        
        // Combine the data
        const combinedData: MembershipData = {
          status: hasActiveMembership ? 'active' : 'not-member',
          selectedPlan: membershipInfo?.selectedPlan || engagementModelInfo?.selectedPlan,
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

    loadMembershipData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'engagement_model_selection' || e.key === 'completed_membership_payment') {
        console.log('🔄 Storage changed, refreshing membership data:', e.key);
        loadMembershipData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userData?.userId, userData?.entityType, userData?.country, userData?.organizationType]);

  return { membershipData, loading };
};
