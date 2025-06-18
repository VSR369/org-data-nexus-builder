
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, RefreshCw, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import OrganizationInfoCards from "@/components/dashboard/OrganizationInfoCards";
import MembershipStatusCard from "@/components/dashboard/MembershipStatusCard";
import PricingModelCard from "@/components/dashboard/PricingModelCard";
import { UserDataProvider, useUserData } from "@/components/dashboard/UserDataProvider";
import { useToast } from "@/hooks/use-toast";
import { useMembershipData } from "@/hooks/useMembershipData";
import { usePricingData } from "@/hooks/usePricingData";
import { useState } from 'react';

const DashboardContent = () => {
  const { userData, isLoading, showLoginWarning } = useUserData();
  const { toast } = useToast();
  const [showPricingSelector, setShowPricingSelector] = useState(false);
  const [selectedEngagementModel, setSelectedEngagementModel] = useState('');

  // Load membership data
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(
    userData.entityType, 
    userData.country, 
    userData.organizationType
  );

  // Load pricing data
  const { pricingConfigs, getConfigByOrgTypeAndEngagement } = usePricingData(
    userData.organizationType, 
    userData.country
  );

  // Mock engagement models for now with proper typing
  const engagementModels = [
    { 
      id: '1', 
      name: 'Market Place',
      description: 'Market Place engagement model',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Aggregator',
      description: 'Aggregator engagement model',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: '3', 
      name: 'Market Place & Aggregator',
      description: 'Combined Market Place & Aggregator engagement model',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: '4', 
      name: 'Platform as a Service',
      description: 'Platform as a Service engagement model',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const handleRefreshData = () => {
    window.location.reload();
  };

  if (showLoginWarning) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            No Organization Data Found
          </h3>
          <p className="text-red-700 mb-4">
            No seeking organization registration data was found. Please complete the registration process first.
          </p>
          <div className="space-x-4">
            <Link to="/seeker-registration">
              <Button className="bg-red-600 hover:bg-red-700">
                Complete Registration
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine membership status with proper typing
  const membershipStatus = {
    status: (countryPricing ? 'active' : 'inactive') as 'active' | 'inactive',
    plan: countryPricing ? 'annual' : 'none',
    message: countryPricing ? 'Active Membership' : 'No Active Membership',
    badgeVariant: (countryPricing ? 'default' : 'secondary') as 'default' | 'secondary',
    icon: countryPricing ? CheckCircle : Clock,
    iconColor: countryPricing ? 'text-green-600' : 'text-gray-600',
    paymentDate: countryPricing ? new Date().toISOString() : undefined,
    pricing: countryPricing ? {
      currency: countryPricing.currency,
      amount: countryPricing.annualPrice
    } : undefined
  };

  // Get current pricing config
  const currentPricingConfig = selectedEngagementModel ? 
    getConfigByOrgTypeAndEngagement(userData.organizationType, selectedEngagementModel) : null;

  const handleJoinAsMember = () => {
    toast({
      title: "Membership Action",
      description: "Redirecting to membership management...",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seeking Organization Dashboard
            </h2>
            <p className="text-gray-600">
              View your organization's details, membership status, and pricing information.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700 font-medium">
            Data Debug Information
          </p>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <p>• Loading Status: {isLoading ? 'Loading...' : 'Completed'}</p>
          <p>• User ID: {userData.userId || 'Not found'}</p>
          <p>• Organization: {userData.organizationName || 'Not found'}</p>
          <p>• Membership Data: {membershipData ? 'Available' : 'Not found'}</p>
          <p>• Pricing Configs: {pricingConfigs.length} available</p>
        </div>
      </div>

      {/* Membership Status */}
      <MembershipStatusCard membershipStatus={membershipStatus} />

      {/* Pricing Models */}
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
      
      {/* Organization Details */}
      <OrganizationInfoCards />
    </div>
  );
};

const SeekingOrgAdminDashboard = () => {
  console.log('🔍 SeekingOrgAdminDashboard rendering...');
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex w-full">
        {/* Sidebar */}
        <AppSidebar activeSection="solution-seekers" setActiveSection={() => {}} />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <Link to="/signin">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </Link>
                  <div className="h-6 w-px bg-gray-300" />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-xl text-gray-900">
                        Seeking Organization Administrator
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Organization Management Portal - Administrative View
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Administrator Access</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <UserDataProvider>
                <DashboardContent />
              </UserDataProvider>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SeekingOrgAdminDashboard;
