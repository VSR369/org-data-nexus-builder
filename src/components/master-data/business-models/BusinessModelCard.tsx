import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, DollarSign, Users, Eye } from 'lucide-react';

interface BusinessModelCardProps {
  model: any;
}

export const BusinessModelCard: React.FC<BusinessModelCardProps> = ({ model }) => {
  const getModelDetails = (formula: any, modelType: string, subType?: string) => {
    if (!formula) {
      return (
        <div className="text-center py-2 sm:py-4 text-muted-foreground">
          <p className="text-xs sm:text-sm">No {modelType} formula configured</p>
        </div>
      );
    }

    if (modelType === 'Marketplace') {
      const isGeneralMarketplace = subType === 'General';
      
      return (
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Platform Fee:</span>
            <span className="font-medium">{formula.platform_usage_fee_percentage || 0}%</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Management Fee:</span>
            <span className="font-medium">{formula.currency_symbol}{formula.base_management_fee || 0}</span>
          </div>
          {!isGeneralMarketplace && (
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-muted-foreground">Consulting Fee:</span>
              <span className="font-medium">{formula.currency_symbol}{formula.base_consulting_fee || 0}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Membership Discount:</span>
            <span className="font-medium">{formula.membership_discount_percentage || 0}%</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-1 sm:space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Platform Fee:</span>
            <span className="font-medium">{formula.platform_usage_fee_percentage || 0}%</span>
          </div>
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-muted-foreground">Membership Discount:</span>
            <span className="font-medium">{formula.membership_discount_percentage || 0}%</span>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">{model.pricing_tier_name || 'Unknown Tier'}</span>
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
              {model.country_name || 'Unknown Country'}
            </p>
          </div>
          <Badge variant={model.is_active ? 'default' : 'secondary'} className="text-xs shrink-0">
            {model.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        {/* Tier Features */}
        <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
          <h4 className="font-medium text-xs sm:text-sm mb-2">Tier Features</h4>
          <div className="space-y-1 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly Limit:</span>
              <span className="font-medium text-right">{model.monthly_challenge_limit || 'Unlimited'} challenges</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Solutions per Challenge:</span>
              <span className="font-medium">{model.solutions_per_challenge || 1}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fixed Charge:</span>
              <span className="font-medium">{model.currency_symbol}{model.fixed_charge_per_challenge || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overage Allowed:</span>
              <span className="font-medium">{model.allows_overage ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Marketplace General Model */}
        <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-2 sm:p-3">
          <h4 className="font-medium text-xs sm:text-sm mb-2 text-blue-800">Marketplace General</h4>
          {getModelDetails(model.marketplaceGeneralFormula, 'Marketplace', 'General')}
        </div>

        {/* Marketplace Program Managed Model */}
        <div className="border border-purple-200 bg-purple-50/50 rounded-lg p-2 sm:p-3">
          <h4 className="font-medium text-xs sm:text-sm mb-2 text-purple-800">Marketplace Program Managed</h4>
          {getModelDetails(model.marketplaceProgramManagedFormula, 'Marketplace', 'Program Managed')}
        </div>

        {/* Aggregator Model */}
        <div className="border border-green-200 bg-green-50/50 rounded-lg p-2 sm:p-3">
          <h4 className="font-medium text-xs sm:text-sm mb-2 text-green-800">Aggregator Model</h4>
          {getModelDetails(model.aggregatorFormula, 'Aggregator')}
        </div>

        {/* Additional Services */}
        <div className="bg-muted/30 rounded-lg p-2 sm:p-3">
          <h4 className="font-medium text-xs sm:text-sm mb-2">Additional Services</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="min-w-0">
              <span className="text-muted-foreground">Analytics:</span>
              <p className="font-medium truncate">{model.analytics_access_name || 'Basic'}</p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground">Support:</span>
              <p className="font-medium truncate">{model.support_type_name || 'Standard'}</p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground">Onboarding:</span>
              <p className="font-medium truncate">{model.onboarding_type_name || 'Self-service'}</p>
            </div>
            <div className="min-w-0">
              <span className="text-muted-foreground">Workflow:</span>
              <p className="font-medium truncate">{model.workflow_template_name || 'Standard'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center pt-2 border-t">
          <Button variant="outline" size="sm" className="gap-1 text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};