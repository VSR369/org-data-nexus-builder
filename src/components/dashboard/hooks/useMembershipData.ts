
import { useState, useEffect } from 'react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { useUserData } from "@/components/dashboard/UserDataProvider";

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

export const useMembershipData = () => {
  const { userData } = useUserData();
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembershipData = async () => {
      console.log('🔍 Loading membership data for organization:', userData.organizationName);
      
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
        
        // Check for confirmed engagement model selection (only if properly submitted)
        let engagementModelInfo = null;
        const engagementSelection = localStorage.getItem('engagement_model_selection');
        if (engagementSelection) {
          try {
            const selectionData = JSON.parse(engagementSelection);
            // Only consider it a real selection if it has submittedAt and matches current user
            if (selectionData.submittedAt && 
                selectionData.userId === userData.userId && 
                selectionData.engagementModel) {
              engagementModelInfo = {
                selectedEngagementModel: selectionData.engagementModel.name || selectionData.engagementModel,
                pricingDetails: selectionData.pricing ? {
                  currency: selectionData.pricing.currency || 'USD',
                  amount: selectionData.pricing.amount || 0,
                  paymentFrequency: selectionData.pricingPlan || 'monthly'
                } : undefined
              };
              console.log('✅ Found confirmed engagement model selection:', engagementModelInfo);
            }
          } catch (error) {
            console.log('❌ Error parsing engagement model selection:', error);
          }
        }
        
        // Combine the data with proper flags
        const combinedData: MembershipData = {
          status: hasActiveMembership ? 'active' : 'not-member',
          selectedPlan: membershipInfo?.selectedPlan,
          selectedEngagementModel: engagementModelInfo?.selectedEngagementModel,
          pricingDetails: membershipInfo?.pricingDetails || engagementModelInfo?.pricingDetails,
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
