import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Wallet, CreditCard, Loader2 } from "lucide-react";
import { PricingConfig } from '@/types/pricing';
import { 
  getEngagementModelName, 
  getDisplayAmount, 
  formatCurrency, 
  isPaaSModel 
} from '@/utils/membershipPricingUtils';

interface EngagementPaymentCardProps {
  selectedEngagementModel: string;
  selectedFrequency: string;
  membershipStatus: string;
  engagementPricing: PricingConfig | null;
  organizationType: string;
  country: string;
  pricingConfigs: PricingConfig[];
  engagementPaymentLoading: boolean;
  hasPaidEngagement: boolean;
  onFrequencyChange: (value: string) => void;
  onEngagementPayment: () => void;
}

export const EngagementPaymentCard: React.FC<EngagementPaymentCardProps> = ({
  selectedEngagementModel,
  selectedFrequency,
  membershipStatus,
  engagementPricing,
  organizationType,
  country,
  pricingConfigs,
  engagementPaymentLoading,
  hasPaidEngagement,
  onFrequencyChange,
  onEngagementPayment
}) => {
  const isPaaS = isPaaSModel(selectedEngagementModel);

  return (
    <Card className={selectedEngagementModel ? '' : 'opacity-50'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Engagement Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedEngagementModel && engagementPricing ? (
          <div className="space-y-4">
            <div className="text-sm text-center p-2 bg-muted rounded">
              {membershipStatus === 'member_paid' ? 'Member Pricing' : 'Standard Pricing'}
            </div>

            <RadioGroup 
              value={selectedFrequency || ''} 
              onValueChange={onFrequencyChange}
            >
              <div className="space-y-3">
                {['quarterly', 'half-yearly', 'annual'].map((frequency) => {
                  const displayInfo = getDisplayAmount(frequency, engagementPricing, membershipStatus);
                  
                  return (
                    <Label key={frequency} htmlFor={frequency} className="cursor-pointer">
                      <div className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent ${
                        selectedFrequency === frequency ? 'border-primary bg-primary/5' : ''
                      }`}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={frequency} id={frequency} />
                          <span className="capitalize">{frequency.replace('-', ' ')}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-bold">
                            {isPaaS ? (
                              <div className="space-y-1">
                                <div className="text-green-600">
                                  {formatCurrency(displayInfo.amount, engagementPricing.currency)}
                                </div>
                                {displayInfo.discountApplied && displayInfo.originalAmount && (
                                  <div className="text-xs text-gray-500 line-through">
                                    {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                                  </div>
                                )}
                                {displayInfo.discountApplied && (
                                  <div className="text-xs text-green-600 font-medium">
                                    {engagementPricing.discountPercentage}% member discount
                                  </div>
                                )}
                              </div>
                            ) : (
                              `${displayInfo.amount}%`
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isPaaS ? frequency.replace('-', ' ') : 'of solution fee'}
                          </div>
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>

            {selectedFrequency && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">Payment Summary</div>
                  {(() => {
                    const displayInfo = getDisplayAmount(selectedFrequency, engagementPricing, membershipStatus);
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Engagement Model:</span>
                          <span className="font-medium">{getEngagementModelName(selectedEngagementModel)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Billing Frequency:</span>
                          <span className="font-medium capitalize">{selectedFrequency.replace('-', ' ')}</span>
                        </div>
                        {displayInfo.discountApplied && displayInfo.originalAmount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Original Price:</span>
                            <span className="text-gray-500 line-through">
                              {formatCurrency(displayInfo.originalAmount, engagementPricing.currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {displayInfo.discountApplied ? 'Discounted Price:' : 'Total Amount:'}
                          </span>
                          <span className="font-bold text-lg text-green-600">
                            {isPaaS 
                              ? formatCurrency(displayInfo.amount, engagementPricing.currency)
                              : `${displayInfo.amount}% of solution fee`
                            }
                          </span>
                        </div>
                        {displayInfo.discountApplied && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-600">Member Discount:</span>
                            <span className="text-green-600 font-medium">
                              -{engagementPricing.discountPercentage}%
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                {hasPaidEngagement ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={engagementPaymentLoading}
                      >
                        {engagementPaymentLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay & Activate {getEngagementModelName(selectedEngagementModel)}
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change Engagement Model?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have already subscribed to an engagement model. Do you want to subscribe to a new engagement model: <strong>{getEngagementModelName(selectedEngagementModel)}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onEngagementPayment}>
                          Yes, Subscribe to New Model
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={onEngagementPayment}
                    disabled={engagementPaymentLoading}
                  >
                    {engagementPaymentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay & Activate {getEngagementModelName(selectedEngagementModel)}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : selectedEngagementModel ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-muted-foreground">Loading pricing for {getEngagementModelName(selectedEngagementModel)}...</p>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Selected Model ID: {selectedEngagementModel}</div>
              <div>Mapped Name: {getEngagementModelName(selectedEngagementModel)}</div>
              <div>Membership Status: {membershipStatus === 'member_paid' ? 'member' : 'not-a-member'}</div>
              <div>Pricing Configs Available: {pricingConfigs.length}</div>
              <div>Organization Type: {organizationType}</div>
              <div>Country: {country}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select an engagement model to view pricing</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};