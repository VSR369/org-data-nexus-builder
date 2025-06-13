
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from 'lucide-react';

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

interface MembershipPricingSectionProps {
  membershipData: MembershipConfig;
  countryPricing: PricingData;
}

export const MembershipPricingSection = ({ 
  membershipData, 
  countryPricing 
}: MembershipPricingSectionProps) => {
  return (
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
  );
};
