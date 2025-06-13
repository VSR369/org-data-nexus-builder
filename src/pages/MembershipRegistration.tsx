
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Building, Globe, User, AlertTriangle, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { countriesDataManager } from '@/utils/sharedDataManagers';

interface MembershipRegistrationProps {
  userId?: string;
  organizationName?: string;
  entityType?: string;
  country?: string;
}

interface PricingData {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipConfig {
  organizationType: string;
  marketplaceFee: number;
  aggregatorFee: number;
  marketplacePlusAggregatorFee: number;
  internalPaasPricing: PricingData[];
}

const MembershipRegistration = () => {
  const location = useLocation();
  const [membershipData, setMembershipData] = useState<MembershipConfig | null>(null);
  const [countryPricing, setCountryPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { userId, organizationName, entityType, country } = location.state as MembershipRegistrationProps || {};

  useEffect(() => {
    const loadMembershipData = () => {
      console.log('🔍 Loading membership data for:', { entityType, country });
      setLoading(true);
      setError(null);

      try {
        // Load pricing configs from localStorage (master data system)
        const pricingConfigsStr = localStorage.getItem('master_data_pricing_configs');
        
        if (!pricingConfigsStr) {
          console.log('⚠️ No pricing configs found in master data');
          setError('No pricing configuration found. Please contact administrator.');
          setLoading(false);
          return;
        }

        const pricingConfigs: MembershipConfig[] = JSON.parse(pricingConfigsStr);
        console.log('📋 Loaded pricing configs:', pricingConfigs);

        // Find configuration for the entity type or fallback to "All Organizations"
        let matchingConfig = pricingConfigs.find(config => 
          config.organizationType === entityType
        );

        if (!matchingConfig) {
          matchingConfig = pricingConfigs.find(config => 
            config.organizationType === 'All Organizations'
          );
        }

        if (!matchingConfig) {
          console.log('❌ No matching pricing configuration found');
          setError('No pricing configuration available for your organization type.');
          setLoading(false);
          return;
        }

        console.log('✅ Found matching config:', matchingConfig);
        setMembershipData(matchingConfig);

        // Find pricing for the specific country
        const countrySpecificPricing = matchingConfig.internalPaasPricing.find(
          pricing => pricing.country === country
        );

        if (!countrySpecificPricing) {
          console.log('⚠️ No country-specific pricing found for:', country);
          setError(`No pricing available for ${country}. Please contact administrator.`);
        } else {
          console.log('✅ Found country pricing:', countrySpecificPricing);
          setCountryPricing(countrySpecificPricing);
        }

      } catch (error) {
        console.error('❌ Error loading membership data:', error);
        setError('Failed to load membership information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (entityType && country) {
      loadMembershipData();
    } else {
      setError('Missing entity type or country information.');
      setLoading(false);
    }
  }, [entityType, country]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p>Loading membership information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Link to="/seeker-dashboard" state={{ userId }}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Membership Registration
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Join as a member to access premium features
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Organization Details Header */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Details</h2>
              <p className="text-sm text-gray-600">Review your organization information below</p>
            </div>

            {/* Organization Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Organization Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {organizationName || 'Not Available'}
                  </p>
                </CardContent>
              </Card>

              {/* Entity Type */}
              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Entity Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {entityType || 'Not Available'}
                  </p>
                </CardContent>
              </Card>

              {/* Country */}
              <Card className="border border-gray-200 md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-gray-900">
                    {country || 'Not Available'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Membership Pricing Information */}
            {membershipData && countryPricing && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Membership Pricing
                </h2>
                
                {/* Pricing Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Quarterly Plan */}
                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg text-blue-600">Quarterly</CardTitle>
                      <p className="text-sm text-gray-600">3 months</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {countryPricing.currency} {countryPricing.quarterlyPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">per quarter</p>
                    </CardContent>
                  </Card>

                  {/* Half-Yearly Plan */}
                  <Card className="border border-green-200 bg-green-50 hover:shadow-md transition-shadow">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg text-green-600">Half-Yearly</CardTitle>
                      <p className="text-sm text-gray-600">6 months</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {countryPricing.currency} {countryPricing.halfYearlyPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">per 6 months</p>
                    </CardContent>
                  </Card>

                  {/* Annual Plan */}
                  <Card className="border border-purple-200 bg-purple-50 hover:shadow-md transition-shadow">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg text-purple-600">Annual</CardTitle>
                      <p className="text-sm text-gray-600">12 months</p>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Best Value
                      </span>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {countryPricing.currency} {countryPricing.annualPrice.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-600">per year</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Fees Information */}
                <Card className="bg-blue-50 border border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Marketplace Fee</p>
                        <p className="text-blue-700 font-semibold">{membershipData.marketplaceFee}%</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Aggregator Fee</p>
                        <p className="text-blue-700 font-semibold">{membershipData.aggregatorFee}%</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Combined Fee</p>
                        <p className="text-blue-700 font-semibold">{membershipData.marketplacePlusAggregatorFee}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">User ID:</span>
                  <span className="font-medium text-gray-900">{userId || 'Not Available'}</span>
                </div>
              </div>
            </div>

            {/* Membership Action Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Complete your membership registration to unlock premium features and enhanced access to our platform.
                </p>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!membershipData || !countryPricing || !!error}
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed with Membership Registration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MembershipRegistration;
