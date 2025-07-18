import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

interface PaymentSimulationCardProps {
  membershipFees: any[];
  isProcessing: boolean;
  paymentStatus: PaymentStatus;
  onPaymentSubmit: () => void;
  selectedTier?: string;
}

export const PaymentSimulationCard: React.FC<PaymentSimulationCardProps> = ({
  membershipFees,
  isProcessing,
  paymentStatus,
  onPaymentSubmit,
  selectedTier = 'basic'
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState<'monthly' | 'quarterly' | 'annual'>('annual');
  
  const membershipFee = membershipFees[0];
  const amounts = {
    monthly: membershipFee?.monthly_amount || 99,
    quarterly: membershipFee?.quarterly_amount || 270,
    annual: membershipFee?.annual_amount || 990
  };
  
  const currency = membershipFee?.annual_currency || 'USD';
  const savings = Math.round(((amounts.monthly * 12) - amounts.annual) / (amounts.monthly * 12) * 100);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'processing':
        return 'Processing Payment...';
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      default:
        return 'Ready to Pay';
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card className="w-full border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Payment Successful
          </CardTitle>
          <CardDescription className="text-green-700">
            Your membership payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white border border-green-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Amount Paid:</span>
                <span className="text-lg font-bold text-green-800">
                  {currency} {amounts[selectedFrequency]}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Billing Frequency:</span>
                <span className="text-sm font-medium capitalize">{selectedFrequency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Receipt Number:</span>
                <span className="text-sm font-mono">RCP-{Date.now()}</span>
              </div>
            </div>
            
            <div className="text-center text-green-700">
              <p className="text-sm">
                You can now proceed to select your pricing tier and engagement model.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Membership Payment
        </CardTitle>
        <CardDescription>
          Complete your membership payment to activate full platform access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Status */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>

          {/* Billing Frequency Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Select Billing Frequency:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: 'monthly', label: 'Monthly', amount: amounts.monthly },
                { key: 'quarterly', label: 'Quarterly', amount: amounts.quarterly },
                { key: 'annual', label: 'Annual', amount: amounts.annual, badge: `Save ${savings}%` }
              ].map((option) => (
                <div
                  key={option.key}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedFrequency === option.key
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFrequency(option.key as any)}
                >
                  {option.badge && (
                    <Badge className="absolute -top-2 right-2 bg-green-600">
                      {option.badge}
                    </Badge>
                  )}
                  <div className="text-center">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-lg font-bold text-primary">
                      {currency} {option.amount}
                    </div>
                    {option.key === 'monthly' && (
                      <div className="text-xs text-gray-500 mt-1">per month</div>
                    )}
                    {option.key === 'quarterly' && (
                      <div className="text-xs text-gray-500 mt-1">every 3 months</div>
                    )}
                    {option.key === 'annual' && (
                      <div className="text-xs text-gray-500 mt-1">per year</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Membership Fee ({selectedFrequency}):</span>
                <span className="font-medium">{currency} {amounts[selectedFrequency]}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span className="font-medium">Included</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{currency} {amounts[selectedFrequency]}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={onPaymentSubmit}
            disabled={isProcessing}
            className="w-full h-12 text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {currency} {amounts[selectedFrequency]} - Simulate Payment
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This is a simulation. No real payment will be processed. 
            In production, this would integrate with a payment gateway.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};