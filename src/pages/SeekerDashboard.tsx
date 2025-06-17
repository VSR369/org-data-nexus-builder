
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { useMembershipData } from '@/hooks/useMembershipData';
import { UserDataProvider, useUserData } from '@/components/dashboard/UserDataProvider';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoginWarning from '@/components/dashboard/LoginWarning';
import MembershipStatusCard from '@/components/dashboard/MembershipStatusCard';
import EngagementModelCard from '@/components/dashboard/EngagementModelCard';
import OrganizationInfoCards from '@/components/dashboard/OrganizationInfoCards';
import EngagementModelSelector from '@/components/dashboard/EngagementModelSelector';
import MembershipBenefitsCard from '@/components/dashboard/MembershipBenefitsCard';
import MembershipSelectionModal from '@/components/dashboard/MembershipSelectionModal';

const SeekerDashboardContent: React.FC = () => {
  const navigate = useNavigate();
  const { userData, isLoading, showLoginWarning, handleLogout } = useUserData();
  
  const [activeSection, setActiveSection] = useState('');
  const [showMembershipBenefits, setShowMembershipBenefits] = useState(false);
  const [showMembershipSelection, setShowMembershipSelection] = useState(false);
  const [showEngagementModelSelector, setShowEngagementModelSelector] = useState(false);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<EngagementModel | null>(null);
  const [membershipPaymentData, setMembershipPaymentData] = useState<any>(null);

  // Load membership data for the current user
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(
    userData.entityType, 
    userData.country, 
    userData.organizationType
  );

  useEffect(() => {
    // Load membership payment data
    const loadMembershipPaymentData = () => {
      try {
        const paymentData = localStorage.getItem('completed_membership_payment');
        if (paymentData) {
          const parsedData = JSON.parse(paymentData);
          setMembershipPaymentData(parsedData);
          console.log('✅ Loaded membership payment data:', parsedData);
        }
      } catch (error) {
        console.error('Error loading membership payment data:', error);
      }
    };
    
    loadMembershipPaymentData();
  }, []);

  const handleJoinAsMember = () => {
    console.log('Join as Member clicked - showing membership selection');
    setShowMembershipSelection(true);
  };

  const handleSelectEngagementModel = () => {
    console.log('Select Engagement Model clicked');
    setShowEngagementModelSelector(true);
  };

  const handleEngagementModelSelected = (model: EngagementModel) => {
    console.log('Engagement model selected:', model);
    setSelectedEngagementModel(model);
    setShowEngagementModelSelector(false);
  };

  const handleProceedToMembership = (membershipData: any) => {
    console.log('Proceeding with membership data:', membershipData);
    setShowMembershipSelection(false);
    
    navigate('/membership-registration', {
      state: {
        userId: userData.userId,
        organizationName: userData.organizationName,
        entityType: userData.entityType,
        country: userData.country,
        membershipData
      }
    });
  };

  // Determine membership status
  const getMembershipStatus = () => {
    if (membershipPaymentData && membershipPaymentData.membershipStatus === 'active') {
      // Get the correct amount based on the selected plan
      let paidAmount = 0;
      if (membershipPaymentData.pricing) {
        switch (membershipPaymentData.selectedPlan) {
          case 'quarterly':
            paidAmount = membershipPaymentData.pricing.quarterlyPrice;
            break;
          case 'halfyearly':
            paidAmount = membershipPaymentData.pricing.halfYearlyPrice;
            break;
          case 'annual':
            paidAmount = membershipPaymentData.pricing.annualPrice;
            break;
          default:
            paidAmount = 0;
        }
      }

      return {
        status: 'active' as const,
        plan: membershipPaymentData.selectedPlan,
        message: 'Your membership is active',
        badgeVariant: 'default' as const,
        icon: CheckCircle,
        iconColor: 'text-green-600',
        paymentDate: membershipPaymentData.paidAt,
        pricing: {
          currency: membershipPaymentData.pricing?.currency || 'USD',
          amount: paidAmount
        }
      };
    }
    
    return {
      status: 'inactive' as const,
      plan: '',
      message: 'No active membership found',
      badgeVariant: 'secondary' as const,
      icon: Clock,
      iconColor: 'text-gray-400'
    };
  };

  const membershipStatus = getMembershipStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      <DashboardHeader onLogout={handleLogout} userId={userData.userId} />
      
      <LoginWarning show={showLoginWarning} />

      {/* Membership Status Card */}
      <MembershipStatusCard membershipStatus={membershipStatus} />

      {/* Engagement Model Selection */}
      <div className="mt-6 mb-6">
        <EngagementModelCard
          selectedEngagementModel={selectedEngagementModel}
          onSelectEngagementModel={handleSelectEngagementModel}
          showLoginWarning={showLoginWarning}
        />
      </div>

      {/* Join as Member Button - Only show if membership is not active */}
      {membershipStatus.status !== 'active' && (
        <div className="mt-6 mb-6">
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to unlock premium features?</h3>
                  <p className="text-blue-100">
                    Join as a member to access exclusive benefits, priority support, and enhanced marketplace features.
                  </p>
                </div>
                <Button 
                  onClick={handleJoinAsMember}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 text-lg font-semibold"
                  size="lg"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Join as Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Organization Information Cards */}
      <OrganizationInfoCards />

      {/* Modals */}
      {showMembershipBenefits && (
        <MembershipBenefitsCard
          countryPricing={countryPricing}
          userData={{
            userId: userData.userId,
            organizationName: userData.organizationName,
            entityType: userData.entityType,
            country: userData.country
          }}
          onClose={() => setShowMembershipBenefits(false)}
        />
      )}

      {showMembershipSelection && (
        <MembershipSelectionModal
          countryPricing={countryPricing}
          userData={{
            userId: userData.userId,
            organizationName: userData.organizationName,
            entityType: userData.entityType,
            country: userData.country
          }}
          onClose={() => setShowMembershipSelection(false)}
          onProceed={handleProceedToMembership}
        />
      )}

      {showEngagementModelSelector && (
        <EngagementModelSelector
          onClose={() => setShowEngagementModelSelector(false)}
          onSelect={handleEngagementModelSelected}
        />
      )}
    </DashboardLayout>
  );
};

const SeekerDashboard: React.FC = () => {
  return (
    <UserDataProvider>
      <SeekerDashboardContent />
    </UserDataProvider>
  );
};

export default SeekerDashboard;
