
import React from 'react';
import { CheckCircle, BarChart, Users, Headphones, Settings, DollarSign } from 'lucide-react';

interface TierFeatureSectionProps {
  analyticsAccess?: string | null;
  supportType?: string | null;
  onboardingType?: string | null;
  workflowTemplate?: string | null;
  monthlyLimit: number | null;
  solutionsPerChallenge: number;
  allowsOverage: boolean;
  overageFeePerChallenge?: number;
  currencySymbol?: string;
  currencyCode?: string;
}

const getFeatureIcon = (type: 'analytics' | 'support' | 'onboarding' | 'workflow' | 'overage') => {
  switch (type) {
    case 'analytics': return BarChart;
    case 'support': return Headphones;
    case 'onboarding': return Users;
    case 'workflow': return Settings;
    case 'overage': return DollarSign;
    default: return CheckCircle;
  }
};

const formatCurrency = (amount: number, symbol: string, code: string) => {
  // Handle the specific case where symbol might be currency code like "INR"
  if (symbol === code || symbol.length > 3) {
    return `${code} ${amount.toFixed(2)}`;
  }
  return `${symbol}${amount.toFixed(2)} ${code}`;
};

export const TierFeatureSection: React.FC<TierFeatureSectionProps> = ({
  analyticsAccess,
  supportType,
  onboardingType,
  workflowTemplate,
  monthlyLimit,
  solutionsPerChallenge,
  allowsOverage,
  overageFeePerChallenge,
  currencySymbol = 'INR',
  currencyCode = 'INR'
}) => {
  return (
    <div className="space-y-4">
      {/* Pricing Details Section */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Pricing Details
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Limit</span>
            <span className="text-sm font-bold text-gray-900">
              {monthlyLimit ? `${monthlyLimit} challenges` : 'Unlimited challenges'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Solutions/Challenge</span>
            <span className="text-sm font-bold text-gray-900">{solutionsPerChallenge}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fixed Charge</span>
            <span className="text-sm font-bold text-gray-900">
              {overageFeePerChallenge && overageFeePerChallenge > 0 ? 
                formatCurrency(overageFeePerChallenge, currencySymbol, currencyCode) : 
                `${currencyCode}0.00`
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Overage Allowed</span>
            <span className="text-sm font-bold text-gray-900">
              {allowsOverage ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Features & Services Section */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Features & Services
        </h4>
        <div className="space-y-2">
          {analyticsAccess && (
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-600">Analytics:</span>
                <span className="text-sm font-bold text-gray-900">{analyticsAccess}</span>
              </div>
            </div>
          )}
          {onboardingType && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-600">Onboarding:</span>
                <span className="text-sm font-bold text-gray-900">{onboardingType}</span>
              </div>
            </div>
          )}
          {supportType && (
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-600">Support:</span>
                <span className="text-sm font-bold text-gray-900">{supportType}</span>
              </div>
            </div>
          )}
          {workflowTemplate && (
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-gray-600">Workflow:</span>
                <span className="text-sm font-bold text-gray-900">{workflowTemplate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
