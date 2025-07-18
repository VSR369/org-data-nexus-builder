
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface TierFeatureSectionProps {
  analyticsAccess: string;
  supportType: string;
  onboardingType: string;
  workflowTemplate: string;
  monthlyLimit: number | null;
  solutionsPerChallenge: number;
  allowsOverage: boolean;
  overageFeePerChallenge: number;
  currencySymbol: string;
  currencyCode: string;
}

export const TierFeatureSection: React.FC<TierFeatureSectionProps> = ({
  analyticsAccess,
  supportType,
  onboardingType,
  workflowTemplate,
  monthlyLimit,
  solutionsPerChallenge,
  allowsOverage,
  overageFeePerChallenge,
  currencySymbol,
  currencyCode
}) => {
  return (
    <div className="space-y-3 text-left">
      {/* Challenge Limits */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Monthly Challenges:</span>
          <span className="font-medium">
            {monthlyLimit ? `${monthlyLimit} challenges` : 'Unlimited'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Solutions per Challenge:</span>
          <span className="font-medium">{solutionsPerChallenge}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overage Allowed:</span>
          <div className="flex items-center gap-1">
            {allowsOverage ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium">{allowsOverage ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        {allowsOverage && overageFeePerChallenge > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overage Fee:</span>
            <span className="font-medium">
              {currencySymbol}{overageFeePerChallenge} per challenge
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Analytics:</span>
          <Badge variant="outline" className="text-xs">
            {analyticsAccess}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Support:</span>
          <Badge variant="outline" className="text-xs">
            {supportType}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Onboarding:</span>
          <Badge variant="outline" className="text-xs">
            {onboardingType}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Workflow:</span>
          <Badge variant="outline" className="text-xs">
            {workflowTemplate}
          </Badge>
        </div>
      </div>
    </div>
  );
};
