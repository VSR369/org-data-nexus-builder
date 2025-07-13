import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Settings, CreditCard, CheckCircle, Clock } from 'lucide-react';
// Simple currency format helper
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

interface ComprehensiveOrgData {
  organizationDetails: any;
  membershipDetails: any;
  engagementDetails: any;
  pricingDetails: any;
  paymentHistory: any[];
}

interface ComprehensiveOrgViewProps {
  data: ComprehensiveOrgData | null;
}

const ComprehensiveOrgView: React.FC<ComprehensiveOrgViewProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Organization Name</div>
            <div className="font-medium">{data.organizationDetails.organizationName || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Organization Type</div>
            <div>{data.organizationDetails.organizationType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Entity Type</div>
            <div>{data.organizationDetails.entityType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Country</div>
            <div>{data.organizationDetails.country || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Membership Status</div>
            <Badge variant={data.membershipDetails.status === 'member_paid' ? 'default' : 'secondary'}>
              {data.membershipDetails.status === 'member_paid' ? 'Premium Member' : 
               data.membershipDetails.type === 'not-a-member' ? 'Not a Member' : 'Basic'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Membership Type</div>
            <div>{data.membershipDetails.type === 'annual' ? 'Annual Plan' : 'Not a Member'}</div>
          </div>
          {data.membershipDetails.fees.length > 0 && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Annual Fee</div>
              <div className="font-medium text-primary">
                {formatCurrency(data.membershipDetails.fees[0].annualAmount, data.membershipDetails.fees[0].annualCurrency)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Model Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Engagement Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Selected Model</div>
            <div>{data.engagementDetails.selectedModel ? 
              data.engagementDetails.selectedModel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
              'Not Selected'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Billing Frequency</div>
            <div>{data.engagementDetails.frequency || 'Not Selected'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {data.paymentHistory.slice(0, 3).map((payment, index) => (
                <div key={payment.id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{payment.type} Payment</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                  </div>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No payment history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveOrgView;