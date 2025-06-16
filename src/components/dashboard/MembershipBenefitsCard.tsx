
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Globe, Shield, Users, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingData {
  id: string;
  country: string;
  currency: string;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  annualPrice: number;
}

interface MembershipBenefitsCardProps {
  countryPricing: PricingData | null;
  userData: {
    userId: string;
    organizationName: string;
    entityType: string;
    country: string;
  };
  onClose: () => void;
}

const MembershipBenefitsCard: React.FC<MembershipBenefitsCardProps> = ({
  countryPricing,
  userData,
  on Close
}) => {
  const navigate = useNavigate();

  const membershipBenefits = [
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Exclusive Community Access",
      description: "Join a network of solution seekers and innovators"
    },
    {
      icon: <Zap className="h-5 w-5 text-yellow-600" />,
      title: "Priority Solution Matching",
      description: "Get matched with solutions faster than non-members"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Enhanced Security & Support",
      description: "24/7 priority support and enhanced security features"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-600" />,
      title: "Global Marketplace Access",
      description: "Access to worldwide solution providers and challenges"
    }
  ];

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch (error) {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const handleProceedToMembership = () => {
    navigate('/membership-registration', {
      state: {
        userId: userData.userId,
        organizationName: userData.organizationName,
        entityType: userData.entityType,
        country: userData.country
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Premium Membership Benefits
                </CardTitle>
                <p className="text-muted-foreground">
                  Unlock exclusive features and accelerate your innovation journey
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Membership Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-4">What You Get as a Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{benefit.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Organization Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Your Organization Details</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Organization:</span>
                <span className="font-medium">{userData.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Entity Type:</span>
                <Badge variant="outline">{userData.entityType}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <Badge variant="outline">{userData.country}</Badge>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          {countryPricing ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Membership Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900">Quarterly</h4>
                    <div className="text-2xl font-bold text-blue-600 my-2">
                      {formatCurrency(countryPricing.quarterlyPrice, countryPricing.currency)}
                    </div>
                    <p className="text-sm text-gray-600">Every 3 months</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <Badge className="mb-2">Most Popular</Badge>
                    <h4 className="font-semibold text-gray-900">Half-Yearly</h4>
                    <div className="text-2xl font-bold text-blue-600 my-2">
                      {formatCurrency(countryPricing.halfYearlyPrice, countryPricing.currency)}
                    </div>
                    <p className="text-sm text-gray-600">Every 6 months</p>
                    <p className="text-xs text-green-600 mt-1">Save 15%</p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900">Annual</h4>
                    <div className="text-2xl font-bold text-blue-600 my-2">
                      {formatCurrency(countryPricing.annualPrice, countryPricing.currency)}
                    </div>
                    <p className="text-sm text-gray-600">Every 12 months</p>
                    <p className="text-xs text-green-600 mt-1">Save 25%</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleProceedToMembership}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  Proceed to Membership Registration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardContent className="p-4">
                  <p className="text-yellow-800">
                    Membership pricing information is not available for your organization type and country. 
                    Please contact support for custom pricing.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipBenefitsCard;
