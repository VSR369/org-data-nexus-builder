
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSessionManager } from '@/hooks/useSessionManager';
import { usePricingData } from '@/hooks/usePricingData';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { CheckCircle, Clock } from 'lucide-react';
import { loadUserSession } from '@/utils/unifiedAuthUtils';

// Import our new components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoginWarning from '@/components/dashboard/LoginWarning';
import SeekerDetailsCard from '@/components/dashboard/SeekerDetailsCard';
import MembershipStatusCard from '@/components/dashboard/MembershipStatusCard';
import PricingModelCard from '@/components/dashboard/PricingModelCard';
import MembershipActionCard from '@/components/dashboard/MembershipActionCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';

interface SeekerDashboardProps {
  userId?: string;
  organizationName?: string;
}

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useSessionManager();
  
  // Screen variables with default values
  const [organizationName, setOrganizationName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [country, setCountry] = useState("");
  const [userId, setUserId] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMembershipPlan, setSelectedMembershipPlan] = useState<string>("");
  
  // Pricing model selection state
  const [showPricingSelector, setShowPricingSelector] = useState(false);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState<string>("");
  const [engagementModels, setEngagementModels] = useState<EngagementModel[]>([]);

  // Load pricing data
  const { getConfigByOrgTypeAndEngagement } = usePricingData();

  const handleJoinAsMember = () => {
    navigate('/membership-registration', { 
      state: { 
        userId,
        organizationName,
        entityType,
        country
      }
    });
  };

  // Load engagement models
  useEffect(() => {
    const loadEngagementModels = () => {
      try {
        const models = engagementModelsDataManager.getEngagementModels();
        const activeModels = models.filter(model => model.isActive);
        setEngagementModels(activeModels);
      } catch (error) {
        console.error('Error loading engagement models:', error);
      }
    };

    loadEngagementModels();
  }, []);

  // Load seeker details from session data or location state
  useEffect(() => {
    const loadSeekerDetails = async () => {
      console.log('📋 === DASHBOARD LOAD START ===');
      
      // First check if we have user data from navigation state (fresh login)
      if (location.state) {
        const stateData = location.state as any;
        if (stateData.userId && stateData.organizationName) {
          console.log('✅ Loading data from navigation state (fresh login):', stateData);
          setUserId(stateData.userId);
          setOrganizationName(stateData.organizationName);
          setEntityType(stateData.entityType || '');
          setCountry(stateData.country || '');
          setEmail(stateData.email || '');
          setContactPersonName(stateData.contactPersonName || '');
          return;
        }
      }
      
      // Fallback: Try to load from session data using unified service
      try {
        const sessionData = await loadUserSession();
        if (sessionData) {
          console.log('✅ Loading data from unified session:', sessionData);
          setUserId(sessionData.userId);
          setOrganizationName(sessionData.organizationName);
          setEntityType(sessionData.entityType);
          setCountry(sessionData.country);
          setEmail(sessionData.email);
          setContactPersonName(sessionData.contactPersonName);
        } else {
          console.log('⚠️ No session data found');
        }
      } catch (error) {
        console.error('❌ Error loading session data:', error);
      }

      // Load organization type from localStorage (legacy)
      const storedOrgType = localStorage.getItem('seekerOrganizationType') || '';
      setOrganizationType(storedOrgType);

      // Load selected membership plan
      const savedPlan = localStorage.getItem('selectedMembershipPlan');
      if (savedPlan) {
        setSelectedMembershipPlan(savedPlan);
        console.log('✅ Loaded saved membership plan:', savedPlan);
      }
      
      console.log('📋 === DASHBOARD LOAD END ===');
    };

    loadSeekerDetails();
  }, [location.state]);

  // Check if user needs to log in again
  const showLoginWarning = !organizationName || !userId;

  // Determine membership status for testing
  const getMembershipStatus = () => {
    if (selectedMembershipPlan) {
      return {
        status: 'active' as const,
        plan: selectedMembershipPlan,
        message: `Active ${selectedMembershipPlan.charAt(0).toUpperCase() + selectedMembershipPlan.slice(1)} Membership`,
        badgeVariant: 'default' as const,
        icon: CheckCircle,
        iconColor: 'text-green-600'
      };
    } else {
      return {
        status: 'inactive' as const,
        plan: '',
        message: 'No Active Membership',
        badgeVariant: 'secondary' as const,
        icon: Clock,
        iconColor: 'text-gray-500'
      };
    }
  };

  const membershipStatus = getMembershipStatus();

  // Get pricing configuration for selected engagement model
  const getPricingForEngagementModel = () => {
    if (!selectedEngagementModel || !organizationName) return null;
    
    // For demo purposes, we'll use the first organization type from pricing configs
    // In a real app, this would come from the user's organization data
    const orgType = 'All Organizations'; // This should be dynamic based on user data
    
    return getConfigByOrgTypeAndEngagement(orgType, selectedEngagementModel);
  };

  const currentPricingConfig = getPricingForEngagementModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <DashboardHeader onLogout={handleLogout} userId={userId} />
        
        <LoginWarning show={showLoginWarning} />

        <SeekerDetailsCard
          organizationName={organizationName}
          organizationType={organizationType}
          entityType={entityType}
          country={country}
          userId={userId}
        />

        <MembershipStatusCard membershipStatus={membershipStatus} />

        <PricingModelCard
          showPricingSelector={showPricingSelector}
          setShowPricingSelector={setShowPricingSelector}
          selectedEngagementModel={selectedEngagementModel}
          setSelectedEngagementModel={setSelectedEngagementModel}
          engagementModels={engagementModels}
          currentPricingConfig={currentPricingConfig}
          membershipStatus={membershipStatus}
          showLoginWarning={showLoginWarning}
        />

        <MembershipActionCard
          membershipStatus={membershipStatus}
          onJoinAsMember={handleJoinAsMember}
          showLoginWarning={showLoginWarning}
        />

        <QuickActionsCard />
      </div>
    </div>
  );
};

export default SeekerDashboard;
