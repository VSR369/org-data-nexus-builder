
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, DollarSign, Zap, AlertCircle } from 'lucide-react';

interface MembershipActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  membershipFees: any[];
  currentEngagementPricing: any[];
  onActivate: () => void;
  isProcessing: boolean;
}

export const MembershipActivationModal: React.FC<MembershipActivationModalProps> = ({
  isOpen,
  onClose,
  membershipFees,
  currentEngagementPricing,
  onActivate,
  isProcessing
}) => {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSavings = () => {
    return currentEngagementPricing.map(pricing => ({
      ...pricing,
      originalAmount: pricing.base_value,
      discountedAmount: pricing.calculated_value,
      savings: pricing.base_value - pricing.calculated_value
    }));
  };

  const savingsBreakdown = calculateSavings();
  const totalSavings = savingsBreakdown.reduce((sum, item) => sum + item.savings, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Activate Membership
          </DialogTitle>
          <DialogDescription>
            Activate your membership to access premium features and receive discounts on engagement model pricing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Membership Fee */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Annual Membership Fee</CardTitle>
              <CardDescription>One-time annual payment for premium membership benefits</CardDescription>
            </CardHeader>
            <CardContent>
              {membershipFees.length > 0 && (
                <div className="text-2xl font-bold text-green-800">
                  {formatCurrency(membershipFees[0].annual_amount, membershipFees[0].annual_currency)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Preview */}
          {totalSavings > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Instant Savings on Engagement Model
                </CardTitle>
                <CardDescription>
                  Your current engagement model pricing will be automatically discounted after membership activation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savingsBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.config_name}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(item.originalAmount, item.currency_code)}
                        </div>
                        <div className="font-bold text-blue-800">
                          {formatCurrency(item.discountedAmount, item.currency_code)}
                        </div>
                      </div>
                    </div>
                    {item.savings > 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        You save: {formatCurrency(item.savings, item.currency_code)} ({item.membership_discount}% discount)
                      </div>
                    )}
                  </div>
                ))}
                
                {totalSavings > 0 && (
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center font-bold text-blue-800">
                      <span>Total Savings:</span>
                      <span>{formatCurrency(totalSavings, savingsBreakdown[0]?.currency_code || 'USD')}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Membership Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Engagement model discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Priority support access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Premium features access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Enhanced analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={onActivate}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Activate Membership'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
