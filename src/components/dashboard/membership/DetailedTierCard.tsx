
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, TrendingUp, Star } from 'lucide-react';

interface DetailedTierCardProps {
  tierConfiguration: any;
  isSelected: boolean;
  isCurrent: boolean;
  onTierSelect: (tierName: string) => void;
  membershipStatus: 'active' | 'inactive';
}

export const DetailedTierCard: React.FC<DetailedTierCardProps> = ({
  tierConfiguration,
  isSelected,
  isCurrent,
  onTierSelect,
  membershipStatus
}) => {
  const tierName = tierConfiguration.master_pricing_tiers?.name;
  const isMember = membershipStatus === 'active';

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const validCurrency = currency && currency.trim() !== '' ? currency : 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleCardClick = () => {
    if (tierName) {
      onTierSelect(tierName);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all border-2 ${
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50'
          : isCurrent 
            ? 'border-green-500 bg-green-50'
            : 'hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            <span>{tierName}</span>
          </div>
          <div className="flex items-center gap-2">
            {isCurrent && (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                <Star className="h-3 w-3 mr-1" />
                Current
              </Badge>
            )}
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-purple-600" />
            )}
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tierConfiguration.master_pricing_tiers?.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Core Features */}
        <div className="p-3 border rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-800 mb-3">Tier Features</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Monthly Challenges:</span>
              <span className="font-medium">
                {tierConfiguration.monthly_challenge_limit === null 
                  ? 'Unlimited' 
                  : tierConfiguration.monthly_challenge_limit}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Solutions per Challenge:</span>
              <span className="font-medium">
                {tierConfiguration.solutions_per_challenge || 1}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Overage Allowed:</span>
              <Badge variant={tierConfiguration.allows_overage ? "default" : "secondary"}>
                {tierConfiguration.allows_overage ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="p-3 border rounded-lg bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-3">Pricing Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Fixed Charge per Challenge:</span>
              <span className="font-medium">
                {formatCurrency(
                  tierConfiguration.fixed_charge_per_challenge || 0, 
                  tierConfiguration.master_currencies?.code
                )}
              </span>
            </div>
            
            {isMember && (
              <div className="flex justify-between text-green-700">
                <span>Member Benefits:</span>
                <span className="font-medium">Applied</span>
              </div>
            )}
          </div>
        </div>

        {/* Support & Analytics */}
        <div className="p-3 border rounded-lg bg-purple-50">
          <h4 className="font-semibold text-purple-800 mb-3">Support & Analytics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Support Level:</span>
              <Badge variant="outline">
                {tierConfiguration.support_type_id ? 'Premium' : 'Standard'}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Analytics Access:</span>
              <Badge variant="outline">
                {tierConfiguration.analytics_access_id ? 'Advanced' : 'Basic'}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span>Workflow Templates:</span>
              <Badge variant="outline">
                {tierConfiguration.workflow_template_id ? 'Custom' : 'Standard'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Member Benefits */}
        {isMember && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Member Benefits Active</span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <div>• Discounted pricing on all features</div>
              <div>• Priority customer support</div>
              <div>• Advanced analytics access</div>
              <div>• Custom workflow templates</div>
            </div>
          </div>
        )}

        {/* Tier Level Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tier Level:</span>
            <Badge variant="outline">
              Level {tierConfiguration.master_pricing_tiers?.level_order || 1}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
