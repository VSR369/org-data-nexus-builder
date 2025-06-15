
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, User, LogOut, Globe, AlertTriangle, CreditCard, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSessionManager } from '@/hooks/useSessionManager';
import { usePricingData } from '@/hooks/usePricingData';
import { engagementModelsDataManager } from '@/components/master-data/engagement-models/engagementModelsDataManager';
import { EngagementModel } from '@/components/master-data/engagement-models/types';

interface SeekerDashboardProps {
  userId?: string;
  organizationName?: string;
}

const SeekerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { validateSession, handleLogout, recoverSession } = useSessionManager();
  
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
  
  // Get user data from navigation state or props
  const navUserId = (location.state as SeekerDashboardProps)?.userId;

  // Load pricing data
  const { pricingConfigs, getConfigByOrgTypeAndEngagement } = usePricingData();

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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Seeker Dashboard</h1>
          <Button onClick={() => handleLogout(userId)} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Warning if no organization name */}
        {showLoginWarning && (
          <Card className="shadow-xl border-0 mb-6 border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Please log in again to access your dashboard.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seeker Details Card - MOVED TO FIRST POSITION */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              Seeker Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Organization Name */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Organization Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {organizationName || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Organization Type */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Organization Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {organizationType || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Entity Type */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Entity Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {entityType || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* Country */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Country</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {country || 'Not Available'}
                  </p>
                </div>
              </div>

              {/* User ID */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">User ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {userId || 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Membership Status Card - MOVED TO SECOND POSITION */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Membership Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <membershipStatus.icon className={`h-6 w-6 ${membershipStatus.iconColor}`} />
                <div>
                  <p className="font-medium text-gray-900">{membershipStatus.message}</p>
                  {membershipStatus.status === 'active' && (
                    <p className="text-sm text-gray-600">
                      Plan: {membershipStatus.plan.charAt(0).toUpperCase() + membershipStatus.plan.slice(1)}
                    </p>
                  )}
                  {membershipStatus.status === 'active' && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Testing Mode: Membership active without payment
                    </p>
                  )}
                </div>
              </div>
              <Badge variant={membershipStatus.badgeVariant}>
                {membershipStatus.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Model Selection Card - MOVED TO THIRD POSITION */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-green-600" />
              Pricing Models
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setShowPricingSelector(!showPricingSelector)}
              className="w-full h-12 flex items-center justify-center gap-3"
              variant="outline"
              disabled={showLoginWarning}
            >
              <DollarSign className="h-5 w-5" />
              Select Pricing Model
            </Button>

            {showPricingSelector && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Engagement Model
                    {membershipStatus.status === 'active' && (
                      <span className="text-green-600 text-xs ml-2">(Active Membership)</span>
                    )}
                    {membershipStatus.status === 'inactive' && (
                      <span className="text-gray-500 text-xs ml-2">(No Active Membership)</span>
                    )}
                  </label>
                  <Select
                    value={selectedEngagementModel}
                    onValueChange={setSelectedEngagementModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an engagement model" />
                    </SelectTrigger>
                    <SelectContent>
                      {engagementModels.map((model) => (
                        <SelectItem key={model.id} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEngagementModel && currentPricingConfig && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Pricing for {selectedEngagementModel}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Country:</span>
                        <span className="text-sm font-medium">{currentPricingConfig.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Currency:</span>
                        <span className="text-sm font-medium">{currentPricingConfig.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement Model Fee:</span>
                        <span className="text-sm font-medium">{currentPricingConfig.engagementModelFee}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Membership Status:</span>
                        <span className="text-sm font-medium capitalize">
                          {currentPricingConfig.membershipStatus.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEngagementModel && !currentPricingConfig && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      No pricing configuration found for the selected engagement model.
                    </p>
                  </div>
                )}

                {engagementModels.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      No engagement models found. Please configure them in master data first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Membership Action */}
        <Card className="shadow-xl border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              Membership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleJoinAsMember}
              className="w-full h-16 flex items-center justify-center gap-3 text-lg"
              disabled={showLoginWarning}
              variant={membershipStatus.status === 'active' ? 'outline' : 'default'}
            >
              <CreditCard className="h-6 w-6" />
              {membershipStatus.status === 'active' ? 'Manage Membership' : 'Join as Member'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/challenges">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>Browse Challenges</span>
                </Button>
              </Link>
              
              <Link to="/solutions">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center gap-2">
                  <Building className="h-5 w-5" />
                  <span>View Solutions</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerDashboard;
