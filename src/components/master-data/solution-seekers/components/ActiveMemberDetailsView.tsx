
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Calendar, DollarSign, Clock, Receipt, Users, Settings } from 'lucide-react';

interface PaymentRecord {
  date: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  receipt?: string;
}

interface ActiveMemberDetailsProps {
  membershipData: {
    status: string;
    type: string;
    createdAt: string;
    pricingTier?: string;
    paymentAmount?: number;
    paymentCurrency?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    receiptNumber?: string;
    lastPaymentDate?: string;
    selectedFrequency?: string;
    totalPaymentsMade?: number;
    discountPercentage?: number;
    finalCalculatedPrice?: number;
    frequencyPayments?: PaymentRecord[];
    frequencyChangeHistory?: any[];
    nextDueDate?: string;
  };
  engagementData?: {
    model: string;
    features: string[];
    supportLevel: string;
    analyticsAccess: boolean;
  };
  isMobile?: boolean;
}

const ActiveMemberDetailsView: React.FC<ActiveMemberDetailsProps> = ({ 
  membershipData, 
  engagementData, 
  isMobile = false 
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateNextDueDate = (lastPayment: string, frequency: string) => {
    const lastDate = new Date(lastPayment);
    const frequencyMap: { [key: string]: number } = {
      'monthly': 1,
      'quarterly': 3,
      'half-yearly': 6,
      'annual': 12
    };
    
    const months = frequencyMap[frequency] || 12;
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + months);
    
    return nextDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
      {/* Enhanced Membership Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Active Membership Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Badge variant="default" className="bg-green-100 text-green-800">
              {membershipData.status === 'member_paid' ? 'Premium Member' : 'Active Member'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Membership Type</span>
            <span className="font-medium capitalize">{membershipData.type}</span>
          </div>

          {membershipData.pricingTier && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Pricing Tier</span>
              <Badge variant="secondary" className="capitalize">
                {membershipData.pricingTier}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Member Since</span>
            <span className="text-sm">{formatDate(membershipData.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {membershipData.paymentAmount && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Current Payment</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(membershipData.paymentAmount, membershipData.paymentCurrency || 'USD')}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Payment Status</span>
            <Badge variant={membershipData.paymentStatus === 'paid' ? 'default' : 'destructive'}>
              {membershipData.paymentStatus}
            </Badge>
          </div>

          {membershipData.paymentMethod && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
              <span className="text-sm">{membershipData.paymentMethod}</span>
            </div>
          )}

          {membershipData.receiptNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Receipt Number</span>
              <span className="text-sm font-mono">{membershipData.receiptNumber}</span>
            </div>
          )}

          {membershipData.lastPaymentDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Last Payment</span>
              <span className="text-sm">{formatDate(membershipData.lastPaymentDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing & Frequency Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing & Frequency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {membershipData.selectedFrequency && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Billing Frequency</span>
              <Badge variant="outline" className="capitalize">
                {membershipData.selectedFrequency}
              </Badge>
            </div>
          )}

          {membershipData.lastPaymentDate && membershipData.selectedFrequency && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Next Due Date</span>
              <span className="text-sm font-medium text-blue-600">
                {calculateNextDueDate(membershipData.lastPaymentDate, membershipData.selectedFrequency)}
              </span>
            </div>
          )}

          {membershipData.frequencyPayments && membershipData.frequencyPayments.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Payment History</span>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {membershipData.frequencyPayments.slice(0, 3).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                    <span>{formatDate(payment.date)}</span>
                    <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {membershipData.frequencyChangeHistory && membershipData.frequencyChangeHistory.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Frequency Changes:</span> {membershipData.frequencyChangeHistory.length}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {membershipData.totalPaymentsMade !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Payments Made</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(membershipData.totalPaymentsMade, membershipData.paymentCurrency || 'USD')}
              </span>
            </div>
          )}

          {membershipData.discountPercentage && membershipData.discountPercentage > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Discount Applied</span>
              <span className="text-sm font-medium text-green-600">
                {membershipData.discountPercentage}%
              </span>
            </div>
          )}

          {membershipData.finalCalculatedPrice && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Final Calculated Price</span>
              <span className="text-sm font-medium">
                {formatCurrency(membershipData.finalCalculatedPrice, membershipData.paymentCurrency || 'USD')}
              </span>
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">All payments processed successfully</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Administrative Details */}
      {engagementData && (
        <Card className={isMobile ? 'col-span-1' : 'col-span-2'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Administrative Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Engagement Model</span>
                <p className="text-sm font-medium">{engagementData.model}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground">Support Level</span>
                <Badge variant="outline">{engagementData.supportLevel}</Badge>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">Analytics Access</span>
                <Badge variant={engagementData.analyticsAccess ? 'default' : 'secondary'}>
                  {engagementData.analyticsAccess ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {engagementData.features && engagementData.features.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Features Included</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {engagementData.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {engagementData.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{engagementData.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActiveMemberDetailsView;
