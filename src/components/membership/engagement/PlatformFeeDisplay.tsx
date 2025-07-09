import React from 'react';
import { PricingConfig } from '@/types/pricing';

interface PlatformFeeDisplayProps {
  engagementPricing: PricingConfig;
  onFrequencyChange: (value: string) => void;
}

export const PlatformFeeDisplay: React.FC<PlatformFeeDisplayProps> = ({
  engagementPricing,
  onFrequencyChange
}) => {
  // Debug logging for platform fee display
  console.log('🔍 PlatformFeeDisplay - engagementPricing:', engagementPricing);
  console.log('🔍 PlatformFeeDisplay - platformFeePercentage:', engagementPricing.platformFeePercentage);
  
  return (
    <div className="space-y-3">
      <div 
        className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary cursor-pointer"
        onClick={() => onFrequencyChange('platform-fee')}
      >
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span>Platform Fee</span>
        </div>
        <div className="text-right space-y-1">
          <div className="font-bold text-green-600">
            {engagementPricing.platformFeePercentage || 0}%
          </div>
          <div className="text-xs text-muted-foreground">
            of solution fee
          </div>
        </div>
      </div>
    </div>
  );
};