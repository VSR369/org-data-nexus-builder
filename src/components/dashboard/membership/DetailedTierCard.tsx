
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Crown, ArrowRight, ChevronDown, ChevronUp, 
         BarChart3, HeadphonesIcon, Rocket, Workflow, DollarSign } from 'lucide-react';
import { TierConfiguration } from '@/hooks/useTierConfigurations';

interface DetailedTierCardProps {
  config: TierConfiguration;
  isSelected: boolean;
  isCurrent: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}

const getTierIcon = (tierName: string) => {
  const lowerName = tierName.toLowerCase();
  if (lowerName.includes('basic')) return CheckCircle;
  if (lowerName.includes('standard')) return Star;
  if (lowerName.includes('premium')) return Crown;
  return CheckCircle;
};

const getTierColor = (tierName: string) => {
  const lowerName = tierName.toLowerCase();
  if (lowerName.includes('basic')) return 'text-green-600';
  if (lowerName.includes('standard')) return 'text-blue-600';
  if (lowerName.includes('premium')) return 'text-purple-600';
  return 'text-green-600';
};

const formatCurrency = (amount: number, symbol: string, code: string) => {
  return `${symbol} ${amount.toFixed(2)} ${code}`;
};

export const DetailedTierCard: React.FC<DetailedTierCardProps> = ({
  config,
  isSelected,
  isCurrent,
  isRecommended,
  onSelect
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const Icon = getTierIcon(config.pricing_tier_name);
  
  // Calculate estimated monthly cost
  const estimatedMonthlyCost = config.monthly_challenge_limit 
    ? config.fixed_charge_per_challenge * config.monthly_challenge_limit
    : config.fixed_charge_per_challenge * 10;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderExpandableSection = (
    title: string,
    icon: React.ComponentType<any>,
    name: string,
    description?: string,
    details?: Record<string, any>
  ) => {
    const isExpanded = expandedSection === title.toLowerCase();
    const SectionIcon = icon;

    return (
      <div className="border rounded-lg p-3">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection(title.toLowerCase())}
        >
          <div className="flex items-center gap-2">
            <SectionIcon className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">{title}</span>
            <Badge variant="outline" className="text-xs">
              {name}
            </Badge>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t space-y-2">
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            {details && Object.entries(details).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">
                    {Array.isArray(value) ? value.join(', ') : value.toString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg'
          : isCurrent 
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } ${isRecommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      onClick={onSelect}
    >
      {isRecommended && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
          Recommended
        </Badge>
      )}
      
      {isCurrent && (
        <Badge className="absolute -top-2 right-4 bg-green-600">
          Current Plan
        </Badge>
      )}
      
      <div className="text-center mb-6">
        <Icon className={`h-8 w-8 mx-auto mb-3 ${getTierColor(config.pricing_tier_name)}`} />
        <h3 className="text-lg font-semibold mb-2">{config.pricing_tier_name}</h3>
        
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
            <DollarSign className="h-5 w-5" />
            {formatCurrency(config.fixed_charge_per_challenge, config.currency_symbol, config.currency_code)}
            <span className="text-sm font-normal text-gray-500">/challenge</span>
          </div>
          {config.monthly_challenge_limit && (
            <div className="text-sm text-gray-500 mt-1">
              Est. {formatCurrency(estimatedMonthlyCost, config.currency_symbol, config.currency_code)}/month
              <br />
              (if you use all {config.monthly_challenge_limit} challenges)
            </div>
          )}
          {!config.monthly_challenge_limit && (
            <div className="text-sm text-gray-500 mt-1">
              Unlimited challenges
            </div>
          )}
        </div>
      </div>

      {/* Challenge Limits Summary */}
      <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Monthly Challenges:</span>
          <span className="font-medium">
            {config.monthly_challenge_limit || 'Unlimited'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Solutions per Challenge:</span>
          <span className="font-medium">{config.solutions_per_challenge}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Overage Allowed:</span>
          <Badge variant={config.allows_overage ? "default" : "secondary"} className="text-xs">
            {config.allows_overage ? 'Yes' : 'No'}
          </Badge>
        </div>
      </div>

      {/* Detailed Feature Sections */}
      <div className="space-y-3 mb-6">
        {renderExpandableSection(
          "Analytics Access",
          BarChart3,
          config.analytics_access_name,
          config.analytics_access_description,
          {
            dashboard_access: config.analytics_dashboard_access ? 'Full Access' : 'Limited Access',
            features_included: config.analytics_features_included?.length ? config.analytics_features_included : ['Basic Analytics']
          }
        )}

        {renderExpandableSection(
          "Support Type",
          HeadphonesIcon,
          config.support_type_name,
          config.support_type_description,
          {
            service_level: config.support_service_level,
            response_time: config.support_response_time,
            availability: config.support_availability
          }
        )}

        {renderExpandableSection(
          "Onboarding",
          Rocket,
          config.onboarding_type_name,
          config.onboarding_type_description,
          {
            service_type: config.onboarding_service_type,
            resources_included: config.onboarding_resources_included?.length ? config.onboarding_resources_included : ['Basic Resources']
          }
        )}

        {renderExpandableSection(
          "Workflow Templates",
          Workflow,
          config.workflow_template_name,
          config.workflow_template_description,
          {
            template_type: config.workflow_template_type,
            customization_level: config.workflow_customization_level,
            template_count: config.workflow_template_count
          }
        )}
      </div>
      
      <Button
        variant={isSelected ? "default" : "outline"}
        className="w-full"
        onClick={onSelect}
      >
        {isSelected ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Selected
          </>
        ) : (
          <>
            Select {config.pricing_tier_name}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
