
import React from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Database, RefreshCw, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import OrganizationInfoCards from "@/components/dashboard/OrganizationInfoCards";
import MembershipStatusCard from "@/components/dashboard/MembershipStatusCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserDataProvider, useUserData } from "@/components/dashboard/UserDataProvider";
import { useToast } from "@/hooks/use-toast";
import { useMembershipData } from "@/hooks/useMembershipData";
import { usePricingData } from "@/hooks/usePricingData";

const DashboardContent = () => {
  const { userData, isLoading, showLoginWarning } = useUserData();
  const { toast } = useToast();

  // Load membership data
  const { membershipData, countryPricing, loading: membershipLoading } = useMembershipData(
    userData.entityType, 
    userData.country, 
    userData.organizationType
  );

  // Load pricing data
  const { pricingConfigs } = usePricingData(
    userData.organizationType, 
    userData.country
  );

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

  // Get specific pricing configuration for this organization
  const organizationPricingConfig = pricingConfigs.find(config => 
    config.organizationType === userData.organizationType && 
    (config.country === userData.country || config.country === 'Global')
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Seeking Organization Administrator Dashboard
            </h2>
            <p className="text-gray-600">
              Read-only view of organization details, membership status, and pricing information.
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
      
      {/* Admin Debug info */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Database className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700 font-medium">
            Administrator View - Data Status
          </p>
        </div>
        <div className="text-xs text-blue-600 space-y-1">
          <p>• Admin User ID: {userData.userId || 'Not found'}</p>
          <p>• Organization: {userData.organizationName || 'Not found'}</p>
          <p>• Entity Type: {userData.entityType}</p>
          <p>• Country: {userData.country}</p>
          <p>• Organization Type: {userData.organizationType}</p>
          <p>• Membership Data: {membershipData ? 'Available' : 'Not configured'}</p>
          <p>• Pricing Config: {organizationPricingConfig ? 'Available' : 'Not found'}</p>
        </div>
      </div>

      {/* Membership Status - Read Only */}
      <MembershipStatusCard membershipStatus={membershipStatus} />

      {/* Organization's Pricing Model - Read Only Display */}
      <Card className="shadow-xl border-0 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-green-600" />
            Selected Pricing Model (Read Only)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {organizationPricingConfig ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-900">
                  {organizationPricingConfig.engagementModel || 'Default Pricing Model'}
                </h4>
                <Badge variant="default" className="bg-green-600">
                  Active Configuration
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organization Type:</span>
                    <span className="font-medium text-green-900">{organizationPricingConfig.organizationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium text-green-900">{organizationPricingConfig.country || 'Global'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium text-green-900">{organizationPricingConfig.currency}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement Fee:</span>
                    <span className="font-medium text-green-900">{organizationPricingConfig.engagementModelFee || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Fee:</span>
                    <span className="font-medium text-green-900">
                      {organizationPricingConfig.currency} {organizationPricingConfig.annualFee || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Membership Status:</span>
                    <span className="font-medium text-green-900 capitalize">
                      {organizationPricingConfig.membershipStatus?.replace('-', ' ') || 'Active'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Platform as a Service Pricing if available */}
              {organizationPricingConfig.internalPaasPricing && organizationPricingConfig.internalPaasPricing.length > 0 && (
                <div className="mt-4 pt-4 border-t border-green-300">
                  <h5 className="font-medium text-green-900 mb-3">Platform as a Service Pricing</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {organizationPricingConfig.internalPaasPricing
                      .filter(pricing => pricing.country === userData.country || pricing.country === 'Global')
                      .slice(0, 1)
                      .map((pricing) => (
                      <div key={pricing.id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quarterly:</span>
                          <span className="font-medium text-green-900">
                            {pricing.currency} {pricing.quarterlyPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Half-Yearly:</span>
                          <span className="font-medium text-green-900">
                            {pricing.currency} {pricing.halfYearlyPrice}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Annual:</span>
                          <span className="font-medium text-green-900">
                            {pricing.currency} {pricing.annualPrice}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-900">No Pricing Configuration Found</h4>
              </div>
              <p className="text-sm text-yellow-800">
                No pricing configuration is available for organization type "{userData.organizationType}" in "{userData.country}".
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                Please contact the administrator to configure pricing for this organization type and country.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
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
                  <Link to="/seeking-org-admin-login">
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
                        Organization Management Portal - Read Only Administrative View
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Administrator Access (Read Only)</span>
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
