
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSessionManager } from '@/hooks/useSessionManager';
import { usePricingData } from '@/hooks/usePricingData';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { CheckCircle, Clock } from 'lucide-react';

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
  const { handleLogout, recoverSession } = useSessionManager();
  
  // Screen variables with default values
  const [organizationName, setOrganizationName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [country, setCountry] = useState("");
  const [userId, setUserId] = useState("");
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

  // Load seeker details from localStorage on screen load
  useEffect(() => {
    const loadSeekerDetails = () => {
      console.log('📋 === DASHBOARD LOAD START ===');
      
      // First try to recover session data
      const sessionData = recoverSession();
      
      if (sessionData) {
        // Use recovered session data
        setOrganizationName(sessionData.seekerOrganizationName);
        setEntityType(sessionData.seekerEntityType);
        setCountry(sessionData.seekerCountry);
        setUserId(sessionData.seekerUserId);
        
        console.log('✅ Loaded seeker details from session recovery:', sessionData);
      } else {
        // Fallback to individual localStorage reads
        const storedOrgName = localStorage.getItem('seekerOrganizationName') || '';
        const storedEntityType = localStorage.getItem('seekerEntityType') || '';
        const storedCountry = localStorage.getItem('seekerCountry') || '';
        const storedUserId = localStorage.getItem('seekerUserId') || '';
        
        setOrganizationName(storedOrgName);
        setEntityType(storedEntityType);
        setCountry(storedCountry);
        setUserId(storedUserId);
        
        console.log('⚠️ Fallback: Loaded seeker details from individual localStorage:', {
          organizationName: storedOrgName,
          entityType: storedEntityType,
          country: storedCountry,
          userId: storedUserId
        });
      }

      // Load organization type from localStorage
      const storedOrgType = localStorage.getItem('seekerOrganizationType') || '';
      setOrganizationType(storedOrgType);
      console.log('✅ Loaded organization type:', storedOrgType);

      // Load selected membership plan
      const savedPlan = localStorage.getItem('selectedMembershipPlan');
      if (savedPlan) {
        setSelectedMembershipPlan(savedPlan);
        console.log('✅ Loaded saved membership plan:', savedPlan);
      }
      
      console.log('📋 === DASHBOARD LOAD END ===');
    };

    loadSeekerDetails();
  }, [recoverSession]);

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
