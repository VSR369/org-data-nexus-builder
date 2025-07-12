import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Wallet, Clock } from "lucide-react";
import { getDisplayAmount } from '@/utils/membershipPricingUtils';
import { useEngagementDataStorage } from '@/hooks/useEngagementDataStorage';

interface PaaSFrequencyManagerProps {
  selectedEngagementModel: string;
  currentFrequency: string;
  activationData: any;
  membershipStatus: string;
  pricingConfigs: any[];
  country: string;
  organizationType: string;
  membershipFees: any[];
  onFrequencyChange: (success: boolean) => void;
}

export const PaaSFrequencyManager: React.FC<PaaSFrequencyManagerProps> = ({
  selectedEngagementModel,
  currentFrequency,
  activationData,
  membershipStatus,
  pricingConfigs,
  country,
  organizationType,
  membershipFees,
  onFrequencyChange
}) => {
  const [selectedNewFrequency, setSelectedNewFrequency] = useState<string | null>(null);

  const frequencies = ['quarterly', 'half_yearly', 'annual'];
  
  // Get current pricing config
  const currentPricing = pricingConfigs.find(config => 
    config.engagement_model === selectedEngagementModel &&
    config.membership_status === membershipStatus &&
    config.country === country &&
    config.organization_type === organizationType
  ) || null;

  const {
    loading,
    payEngagementFee
  } = useEngagementDataStorage({
    selectedEngagementModel,
    selectedFrequency: selectedNewFrequency,
    membershipStatus,
    pricingConfigs,
    country,
    organizationType,
    currentPricing,
    currentAmount: selectedNewFrequency && currentPricing ? getDisplayAmount(selectedNewFrequency, currentPricing, membershipStatus)?.amount || 0 : 0,
    membershipFees
  });

  const handleFrequencyPayment = async (frequency: string) => {
    setSelectedNewFrequency(frequency);
    const success = await payEngagementFee(true); // true indicates frequency change
    if (success) {
      onFrequencyChange(true);
    }
  };

  const formatCurrency = (amount: number | undefined | null) => `₹${(amount || 0).toLocaleString()}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-4">
      {/* Current Payment Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Current PaaS Engagement</CardTitle>
            <Badge variant="secondary">Locked</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current Frequency:</span>
              <p className="font-medium capitalize">{currentFrequency}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Payment:</span>
              <p className="font-medium">{formatCurrency(activationData?.payment_amount)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Date:</span>
              <p className="font-medium">{activationData?.payment_date ? formatDate(activationData.payment_date) : 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Payments:</span>
              <p className="font-medium">{formatCurrency(activationData?.total_payments_made || activationData?.payment_amount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency Change Options */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">Change Billing Frequency</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentPricing && (
            <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">No pricing configuration found for your current membership status and location.</p>
            </div>
          )}
          <div className="grid gap-3">
            {frequencies.map((frequency) => {
              const amount = currentPricing ? getDisplayAmount(frequency, currentPricing, membershipStatus) : null;
              const isCurrentFrequency = frequency === currentFrequency;
              
              return (
                <div key={frequency} className={`p-3 border rounded-lg ${isCurrentFrequency ? 'bg-muted/50 border-primary' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium capitalize">{frequency.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {amount?.amount ? formatCurrency(amount.amount) : 'Price not available'}
                        </p>
                      </div>
                      {isCurrentFrequency && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                    </div>
                    
                    {!isCurrentFrequency && amount?.amount && (
                      <Button
                        onClick={() => handleFrequencyPayment(frequency)}
                        disabled={loading}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Wallet className="h-3 w-3" />
                        Pay Fee
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />
          
          {/* Payment History */}
          {activationData?.frequency_change_history && Array.isArray(activationData.frequency_change_history) && activationData.frequency_change_history.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Frequency Change History</h4>
              <div className="space-y-2">
                {activationData.frequency_change_history.map((change: any, index: number) => (
                  <div key={index} className="text-xs text-muted-foreground border-l-2 border-muted pl-3">
                    <p>Changed to <span className="font-medium capitalize">{change?.to_frequency || 'Unknown'}</span></p>
                    <p>Amount: {formatCurrency(change?.amount)} • {change?.date ? formatDate(change.date) : 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};