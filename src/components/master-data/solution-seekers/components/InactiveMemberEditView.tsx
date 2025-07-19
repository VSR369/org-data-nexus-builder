
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MembershipPlan {
  frequency: string;
  amount: number;
  currency: string;
  description: string;
}

interface InactiveMemberEditViewProps {
  userId: string;
  organizationData?: any;
  onPaymentSuccess?: () => void;
  isMobile?: boolean;
}

const InactiveMemberEditView: React.FC<InactiveMemberEditViewProps> = ({ 
  userId, 
  organizationData, 
  onPaymentSuccess,
  isMobile = false 
}) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Sample membership plans - in real implementation, fetch from database
  const membershipPlans: MembershipPlan[] = [
    { frequency: 'monthly', amount: 99, currency: 'USD', description: 'Monthly Premium Membership' },
    { frequency: 'quarterly', amount: 279, currency: 'USD', description: 'Quarterly Premium Membership (Save 6%)' },
    { frequency: 'half-yearly', amount: 534, currency: 'USD', description: 'Half-Yearly Premium Membership (Save 10%)' },
    { frequency: 'annual', amount: 948, currency: 'USD', description: 'Annual Premium Membership (Save 20%)' }
  ];

  const selectedPlanDetails = membershipPlans.find(plan => plan.frequency === selectedPlan);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan || !paymentMethod || !termsAccepted) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields and accept the terms.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPlanDetails) {
      toast({
        title: "Invalid Plan",
        description: "Please select a valid membership plan.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Update engagement_activations table with payment details
      const { error } = await supabase
        .from('engagement_activations')
        .upsert({
          user_id: userId,
          membership_status: 'Active',
          membership_type: 'premium',
          mem_payment_status: 'paid',
          mem_payment_amount: selectedPlanDetails.amount,
          mem_payment_currency: selectedPlanDetails.currency,
          mem_payment_method: paymentMethod,
          mem_payment_date: new Date().toISOString(),
          mem_receipt_number: receiptNumber,
          selected_frequency: selectedPlan,
          mem_terms: termsAccepted,
          total_payments_made: selectedPlanDetails.amount,
          workflow_step: 'activation_complete',
          workflow_completed: true,
          activation_status: 'Activated',
          payment_simulation_status: 'completed',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Payment processing error:', error);
        toast({
          title: "Payment Failed",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Payment Successful!",
        description: `Your ${selectedPlan} membership has been activated. Receipt: ${receiptNumber}`,
      });

      // Call success callback to refresh parent component
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an unexpected error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
      {/* Membership Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Status</span>
            <Badge variant="destructive">
              Inactive Member
            </Badge>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Activate your membership</strong> to unlock premium features including:
            </p>
            <ul className="text-sm text-orange-700 mt-2 space-y-1">
              <li>• Access to premium engagement models</li>
              <li>• Priority support</li>
              <li>• Advanced analytics</li>
              <li>• Exclusive member benefits</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Activate Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Plan Selection */}
            <div className="space-y-2">
              <Label htmlFor="plan">Select Membership Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {membershipPlans.map((plan) => (
                    <SelectItem key={plan.frequency} value={plan.frequency}>
                      <div className="flex items-center justify-between w-full">
                        <span className="capitalize">{plan.frequency}</span>
                        <span className="ml-2 font-medium">{plan.currency} {plan.amount}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPlanDetails && (
                <p className="text-sm text-muted-foreground">{selectedPlanDetails.description}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Details (simplified for demo) */}
            {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardholder-name">Cardholder Name</Label>
                  <Input
                    id="cardholder-name"
                    value={cardDetails.cardholderName}
                    onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {selectedPlanDetails && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedPlanDetails.currency} {selectedPlanDetails.amount}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Billed {selectedPlan}
                </p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
                required
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing || !selectedPlan || !paymentMethod || !termsAccepted}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate Membership
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InactiveMemberEditView;
