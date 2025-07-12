import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getDisplayAmount } from '@/utils/membershipPricingUtils';
import { PricingConfig } from '@/types/pricing';

interface PaaSPricingDisplayProps {
  selectedFrequency: string | null;
  onFrequencyChange: (frequency: string) => void;
  membershipStatus: string;
  currentPricing: PricingConfig;
  memberConfig?: PricingConfig | null;
  nonMemberConfig?: PricingConfig | null;
}

export const PaaSPricingDisplay: React.FC<PaaSPricingDisplayProps> = ({
  selectedFrequency,
  onFrequencyChange,
  membershipStatus,
  currentPricing,
  memberConfig,
  nonMemberConfig
}) => {
  const frequencies = [
    { 
      value: 'quarterly', 
      label: 'Quarterly', 
      description: 'Pay every 3 months',
      badge: null 
    },
    { 
      value: 'half-yearly', 
      label: 'Half-Yearly', 
      description: 'Pay every 6 months',
      badge: 'Most Popular' 
    },
    { 
      value: 'annual', 
      label: 'Annual', 
      description: 'Pay once a year',
      badge: 'Best Value' 
    }
  ];

  const isMembershipPaid = membershipStatus === 'member' || membershipStatus === 'member_paid';

  const getFrequencyPricing = (frequency: string) => {
    const currentAmount = getDisplayAmount(frequency, currentPricing, membershipStatus);
    
    let memberAmount = null;
    let nonMemberAmount = null;
    
    if (memberConfig) {
      memberAmount = getDisplayAmount(frequency, memberConfig, 'member');
    }
    
    if (nonMemberConfig) {
      nonMemberAmount = getDisplayAmount(frequency, nonMemberConfig, 'not-a-member');
    }

    return {
      current: currentAmount,
      member: memberAmount,
      nonMember: nonMemberAmount
    };
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <RadioGroup 
        value={selectedFrequency || ''} 
        onValueChange={onFrequencyChange}
        className="space-y-3"
      >
        {frequencies.map((frequency) => {
          const pricing = getFrequencyPricing(frequency.value);
          const currentPrice = pricing.current?.amount;
          
          return (
            <div 
              key={frequency.value}
              className={`
                relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${selectedFrequency === frequency.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
              onClick={() => onFrequencyChange(frequency.value)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={frequency.value} 
                    id={frequency.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Label 
                        htmlFor={frequency.value} 
                        className="text-base font-medium cursor-pointer"
                      >
                        {frequency.label}
                      </Label>
                      {frequency.badge && (
                        <Badge 
                          variant={frequency.badge === 'Most Popular' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {frequency.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {frequency.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {currentPrice ? (
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(currentPrice, currentPricing?.currency || 'USD')}
                      </div>
                      
                      {/* Show discount info for members */}
                      {isMembershipPaid && pricing.member && pricing.nonMember && 
                       pricing.member.amount < pricing.nonMember.amount && (
                        <div className="text-xs text-green-600">
                          <span className="line-through text-muted-foreground mr-1">
                            {formatCurrency(pricing.nonMember.amount, currentPricing?.currency || 'USD')}
                          </span>
                          <span className="font-medium">
                            Save {formatCurrency(pricing.nonMember.amount - pricing.member.amount, currentPricing?.currency || 'USD')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Price not available
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};