
import { useState, useEffect, useCallback } from 'react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { MasterDataPersistenceManager } from '@/utils/masterDataPersistenceManager';
import { PricingDataManager } from '@/utils/pricingDataManager';
import { useToast } from "@/hooks/use-toast";

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

interface DashboardData {
  membershipData: {
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
  };
  masterDataPricing?: {
    currency: string;
    amount: number;
    paymentFrequency: string;
  };
  isLoading: boolean;
  error?: string;
}

const membershipFeeConfig = {
  key: 'master_data_seeker_membership_fees',
  version: 2,
  preserveUserData: true
};

export const useDashboardData = (userData: any) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    membershipData: {
      status: 'not-member',
      hasActualSelection: false
    },
    isLoading: true
  });
  
  const { toast } = useToast();

  const loadDashboardData = useCallback(async () => {
    if (!userData?.userId) {
      setDashboardData(prev => ({ ...prev, isLoading: false }));
      return;
    }

      console.log('🔄 Loading unified dashboard data for user:', userData.userId);
      console.log('📍 User country:', userData.country);
      console.log('🏢 User org type:', userData.organizationType);
      console.log('🏛️ User entity type:', userData.entityType);
      
      // Check if this is a new user with no stored data
      const completedPayment = localStorage.getItem('completed_membership_payment');
      const engagementSelection = localStorage.getItem('engagement_model_selection');
      
      console.log('💳 Completed payment data exists:', !!completedPayment);
      console.log('🎯 Engagement selection data exists:', !!engagementSelection);
      
      if (completedPayment) {
        try {
          const paymentData = JSON.parse(completedPayment);
          console.log('💳 Payment data user ID:', paymentData.userId, 'vs current user:', userData.userId);
        } catch (e) {
          console.log('💳 Error parsing payment data');
        }
      }
      
      if (engagementSelection) {
        try {
          const selectionData = JSON.parse(engagementSelection);
          console.log('🎯 Selection data user ID:', selectionData.userId, 'vs current user:', userData.userId);
        } catch (e) {
          console.log('🎯 Error parsing selection data');
        }
      }
    
    try {
      await unifiedUserStorageService.initialize();
      
      // Load membership payment data
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
      
      // Load engagement model selection
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
      
      // Load master data pricing if needed
      let masterDataPricing = null;
      if (!engagementModelInfo?.pricingDetails && !hasActiveMembership) {
        try {
          // First check pricing configurations in master data
          const pricingConfigs = PricingDataManager.getPricingForCountry(
            userData.country,
            userData.organizationType,
            userData.entityType
          );
          
          console.log('💰 Found pricing configs for country:', pricingConfigs.length);
          
          if (pricingConfigs.length > 0) {
            // Use the first matching config (prioritize more specific matches)
            const bestMatch = pricingConfigs[0];
            console.log('✅ Using pricing config:', bestMatch);
            
            masterDataPricing = {
              currency: bestMatch.currency || 'USD',
              amount: bestMatch.quarterlyFee || 0,
              paymentFrequency: 'quarterly'
            };
          } else {
            // Fallback to membership fees
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
          }
        } catch (error) {
          console.log('❌ Error loading master data pricing:', error);
        }
      }
      
      // Combine the data
      const combinedData: DashboardData = {
        membershipData: {
          status: hasActiveMembership ? 'active' : 'not-member',
          selectedPlan: membershipInfo?.selectedPlan || engagementModelInfo?.selectedPlan,
          selectedEngagementModel: engagementModelInfo?.selectedEngagementModel,
          pricingDetails: membershipInfo?.pricingDetails || engagementModelInfo?.pricingDetails,
          activationDate: membershipInfo?.activationDate,
          paymentStatus: membershipInfo?.paymentStatus || 'not-paid',
          hasActualSelection: !!(hasActiveMembership || engagementModelInfo)
        },
        masterDataPricing,
        isLoading: false
      };
      
      console.log('📋 Final unified dashboard data:', combinedData);
      setDashboardData(combinedData);
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setDashboardData({
        membershipData: {
          status: 'not-member',
          hasActualSelection: false
        },
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [userData?.userId, userData?.entityType, userData?.country, userData?.organizationType]);

  // Custom event system for real-time updates
  const handleDataChange = useCallback(() => {
    console.log('🔄 Dashboard data change detected, reloading...');
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();

    // Listen for custom data change events
    window.addEventListener('dashboardDataChange', handleDataChange);
    
    // Listen for storage changes (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'engagement_model_selection' || e.key === 'completed_membership_payment') {
        console.log('🔄 Storage changed, refreshing dashboard data:', e.key);
        handleDataChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('dashboardDataChange', handleDataChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadDashboardData, handleDataChange]);

  const triggerDataRefresh = useCallback(() => {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('dashboardDataChange'));
  }, []);

  return {
    dashboardData,
    refreshData: loadDashboardData,
    triggerDataRefresh
  };
};

// Utility function to trigger data refresh from anywhere in the app
export const triggerDashboardDataRefresh = () => {
  window.dispatchEvent(new CustomEvent('dashboardDataChange'));
};
