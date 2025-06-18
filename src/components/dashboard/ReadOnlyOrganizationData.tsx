
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, FileText, Calendar, Clock, CreditCard, DollarSign } from 'lucide-react';
import { useUserData } from "@/components/dashboard/UserDataProvider";
import { useMembershipData } from "@/hooks/useMembershipData";
import { usePricingData } from "@/hooks/usePricingData";
import { useEngagementModels } from "@/hooks/useEngagementModels";

const ReadOnlyOrganizationData: React.FC = () => {
  const { userData } = useUserData();
  
  // Load membership data for the current organization
  const { membershipData, countryPricing, loading: membershipLoading, error: membershipError } = useMembershipData(
    userData.entityType,
    userData.country,
    userData.organizationType
  );

  // Load pricing configurations
  const { getConfigByOrgTypeAndEngagement } = usePricingData(userData.organizationType, userData.country);
  
  // Load engagement models
  const { engagementModels } = useEngagementModels();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            Organization Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Name</label>
                <p className="text-lg font-semibold text-gray-900">{userData.organizationName || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Entity Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-sm">
                    {userData.entityType || 'Not specified'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Organization Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-sm">
                    {userData.organizationType || 'Not specified'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Country</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.country || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Person</label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{userData.contactPersonName || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{userData.email || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membershipLoading ? (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">Loading membership details...</p>
            </div>
          ) : membershipError ? (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-800 text-sm">{membershipError}</p>
            </div>
          ) : countryPricing ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-3">Membership Fee Structure</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Quarterly</p>
                    <p className="text-lg font-semibold text-green-800">
                      {countryPricing.currency} {countryPricing.quarterlyPrice?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Half-Yearly</p>
                    <p className="text-lg font-semibold text-green-800">
                      {countryPricing.currency} {countryPricing.halfYearlyPrice?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Annual</p>
                    <p className="text-lg font-semibold text-green-800">
                      {countryPricing.currency} {countryPricing.annualPrice?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-600">Country:</label>
                  <p className="font-medium">{countryPricing.country}</p>
                </div>
                <div>
                  <label className="text-gray-600">Currency:</label>
                  <p className="font-medium">{countryPricing.currency}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">No membership fee structure found for this organization configuration.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Models & Engagement Details */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
            Available Engagement Models & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {engagementModels.length > 0 ? (
            <div className="space-y-4">
              {engagementModels.map((model) => {
                const pricingConfig = getConfigByOrgTypeAndEngagement(userData.organizationType, model.name);
                return (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      {pricingConfig && (
                        <Badge variant="outline" className="text-xs">
                          {pricingConfig.engagementModelFee}% Fee
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>
                    
                    {pricingConfig ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Quarterly:</span>
                          <span className="ml-2 font-medium">
                            {pricingConfig.currency || 'USD'} {pricingConfig.quarterlyFee?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Half-Yearly:</span>
                          <span className="ml-2 font-medium">
                            {pricingConfig.currency || 'USD'} {pricingConfig.halfYearlyFee?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Annual:</span>
                          <span className="ml-2 font-medium">
                            {pricingConfig.currency || 'USD'} {pricingConfig.annualFee?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-yellow-600">No pricing configuration available</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No engagement models configured.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Status */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            Registration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Registration Completed</p>
                <p className="text-sm text-green-700">Your organization has been successfully registered as a solution seeker</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Active
            </Badge>
          </div>
          
          {userData.registrationTimestamp && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Registered on: {formatDate(userData.registrationTimestamp)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Information */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            What's Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Ready to Find Solutions</h4>
              <p className="text-sm text-blue-800">
                Your organization is now registered and ready to explore solutions. You can browse available solutions, 
                post challenges, and connect with solution providers through the main platform.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Available Features</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Browse and search solutions catalog</li>
                <li>• Post challenges and requirements</li>
                <li>• Connect with solution providers</li>
                <li>• Access community resources</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadOnlyOrganizationData;
