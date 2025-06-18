
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from 'lucide-react';
import { EngagementModel } from '@/components/master-data/engagement-models/types';
import { PricingConfig } from '@/types/pricing';

interface MembershipStatus {
  status: 'active' | 'inactive';
  plan: string;
}

interface PricingModelCardProps {
  showPricingSelector: boolean;
  setShowPricingSelector: (show: boolean) => void;
  selectedEngagementModel: string;
  setSelectedEngagementModel: (model: string) => void;
  engagementModels: EngagementModel[];
  currentPricingConfig: PricingConfig | null;
  membershipStatus: MembershipStatus;
  showLoginWarning: boolean;
}

const PricingModelCard: React.FC<PricingModelCardProps> = ({
  showPricingSelector,
  setShowPricingSelector,
  selectedEngagementModel,
  setSelectedEngagementModel,
  engagementModels,
  currentPricingConfig,
  membershipStatus,
  showLoginWarning
}) => {
  return (
    <Card className="shadow-xl border-0 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-green-600" />
          Pricing Models
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => setShowPricingSelector(!showPricingSelector)}
          className="w-full h-12 flex items-center justify-center gap-3"
          variant="outline"
          disabled={showLoginWarning}
        >
          <DollarSign className="h-5 w-5" />
          Select Pricing Model
        </Button>

        {showPricingSelector && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Engagement Model
                {membershipStatus.status === 'active' && (
                  <span className="text-green-600 text-xs ml-2">(Active Membership)</span>
                )}
                {membershipStatus.status === 'inactive' && (
                  <span className="text-gray-500 text-xs ml-2">(No Active Membership)</span>
                )}
              </label>
              <Select
                value={selectedEngagementModel}
                onValueChange={setSelectedEngagementModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an engagement model" />
                </SelectTrigger>
                <SelectContent>
                  {engagementModels.map((model) => (
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEngagementModel && currentPricingConfig && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-3">
                  Pricing for {selectedEngagementModel}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Country:</span>
                    <span className="text-sm font-medium">{currentPricingConfig.country || 'Global'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Currency:</span>
                    <span className="text-sm font-medium">{currentPricingConfig.currency || 'USD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement Model Fee:</span>
                    <span className="text-sm font-medium">{currentPricingConfig.engagementModelFee || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Membership Status:</span>
                    <span className="text-sm font-medium capitalize">
                      {currentPricingConfig.membershipStatus ? 
                        currentPricingConfig.membershipStatus.replace('-', ' ') : 
                        'Not Specified'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedEngagementModel && !currentPricingConfig && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No pricing configuration found for the selected engagement model.
                </p>
              </div>
            )}

            {engagementModels.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No engagement models found. Please configure them in master data first.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingModelCard;
