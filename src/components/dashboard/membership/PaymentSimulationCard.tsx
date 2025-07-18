
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
  const membershipFee = membershipFees[0];
  const annualAmount = membershipFee?.annual_amount || 990;
  const currency = membershipFee?.annual_currency || 'USD';

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
            Your annual membership payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white border border-green-200 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Annual Amount Paid:</span>
                <span className="text-lg font-bold text-green-800">
                  {currency} {annualAmount}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Billing Frequency:</span>
                <span className="text-sm font-medium">Annual</span>
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
          Annual Membership Payment
        </CardTitle>
        <CardDescription>
          Complete your annual membership payment to activate full platform access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Status */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>

          {/* Annual Membership Fee Display */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <Badge className="mb-2 bg-blue-600">Annual Membership</Badge>
              <div className="text-2xl font-bold text-blue-800 mb-1">
                {currency} {annualAmount}
              </div>
              <div className="text-sm text-blue-700">
                Billed annually • Best value for full year access
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Annual Membership Fee:</span>
                <span className="font-medium">{currency} {annualAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing Fee:</span>
                <span className="font-medium">Included</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total (Annual):</span>
                <span>{currency} {annualAmount}</span>
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
                Pay {currency} {annualAmount} - Annual Membership
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
