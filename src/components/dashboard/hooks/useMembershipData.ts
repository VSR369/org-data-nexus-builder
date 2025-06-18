
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
}

export const useMembershipData = () => {
  const { userData } = useUserData();
  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembershipData = async () => {
      console.log('🔍 Loading actual membership data for organization:', userData.organizationName);
      
      try {
        // Initialize storage service
        await unifiedUserStorageService.initialize();
        
        // Look for membership data associated with this user/organization
        const userMembershipKey = `membership_${userData.userId}`;
        const orgMembershipKey = `membership_${userData.organizationId}`;
        
        // Try multiple storage keys to find membership data
        let membershipInfo = null;
        
        // Check localStorage for membership selections
        const possibleKeys = [
          userMembershipKey,
          orgMembershipKey,
          `${userData.organizationName}_membership`,
          `seeker_membership_${userData.userId}`,
          'selected_membership_plan',
          'membership_selection'
        ];
        
        for (const key of possibleKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus)) {
                membershipInfo = parsed;
                console.log(`✅ Found membership data in key: ${key}`, parsed);
                break;
              }
            } catch (e) {
              // Continue checking other keys
            }
          }
        }
        
        // Check for pricing selection data
        const pricingKeys = [
          `pricing_${userData.userId}`,
          `selected_pricing_${userData.organizationId}`,
          'selected_engagement_model',
          'pricing_selection'
        ];
        
        let pricingInfo = null;
        for (const key of pricingKeys) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.currency)) {
                pricingInfo = parsed;
                console.log(`✅ Found pricing data in key: ${key}`, parsed);
                break;
              }
            } catch (e) {
              // Continue checking other keys
            }
          }
        }
        
        // Try to get from unified storage service
        if (!membershipInfo) {
          try {
            const allUsers = await unifiedUserStorageService.getAllUsers();
            const currentUser = allUsers.find(u => u.userId === userData.userId || u.organizationId === userData.organizationId);
            
            if (currentUser && (currentUser.membershipStatus || currentUser.selectedPlan)) {
              membershipInfo = {
                status: currentUser.membershipStatus || 'not-member',
                selectedPlan: currentUser.selectedPlan,
                selectedEngagementModel: currentUser.selectedEngagementModel,
                activationDate: currentUser.membershipActivationDate,
                paymentStatus: currentUser.paymentStatus
              };
              console.log('✅ Found membership data in user profile', membershipInfo);
            }
          } catch (error) {
            console.log('⚠️ Error accessing unified storage:', error);
          }
        }
        
        // Combine membership and pricing data
        const combinedData: MembershipData = {
          status: membershipInfo?.status || membershipInfo?.membershipStatus || 'not-member',
          selectedPlan: membershipInfo?.selectedPlan || membershipInfo?.plan,
          selectedEngagementModel: pricingInfo?.engagementModel || pricingInfo?.selectedModel || membershipInfo?.selectedEngagementModel,
          pricingDetails: pricingInfo ? {
            currency: pricingInfo.currency || 'USD',
            amount: pricingInfo.amount || pricingInfo.price || 0,
            paymentFrequency: pricingInfo.frequency || pricingInfo.paymentFrequency || 'monthly'
          } : undefined,
          activationDate: membershipInfo?.activationDate || membershipInfo?.membershipDate,
          paymentStatus: membershipInfo?.paymentStatus || 'pending'
        };
        
        console.log('📋 Final combined membership data:', combinedData);
        setMembershipData(combinedData);
        
      } catch (error) {
        console.error('❌ Error loading membership data:', error);
        // Set default state if no data found
        setMembershipData({
          status: 'not-member'
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
