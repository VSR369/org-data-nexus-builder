import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Zap, Shield, Globe, TrendingUp, Clock } from 'lucide-react';

interface MembershipFee {
  id: string;
  country: string;
  organization_type: string;
  entity_type: string;
  monthly_amount: number | null;
  quarterly_amount: number | null;
  half_yearly_amount: number | null;
  annual_amount: number | null;
  monthly_currency: string | null;
  quarterly_currency: string | null;
  half_yearly_currency: string | null;
  annual_currency: string | null;
  description?: string;
}

interface EnhancedMembershipCardProps {
  membershipStatus: string;
  membershipFees: MembershipFee | null;
  onJoinMembership: () => void;
  onManageMembership: () => void;
  loading?: boolean;
}

const formatCurrency = (amount: number | null, currency: string | null) => {
  if (!amount || !currency) return null;
  return `${currency} ${amount.toLocaleString()}`;
};

const calculateSavings = (annual: number | null, monthly: number | null) => {
  if (!annual || !monthly) return null;
  const monthlyTotal = monthly * 12;
  const savings = monthlyTotal - annual;
  const percentage = ((savings / monthlyTotal) * 100).toFixed(0);
  return { amount: savings, percentage };
};

export const EnhancedMembershipCard: React.FC<EnhancedMembershipCardProps> = ({
  membershipStatus,
  membershipFees,
  onJoinMembership,
  onManageMembership,
  loading = false
}) => {
  const isActive = membershipStatus?.toLowerCase() === 'active';
  
  const membershipBenefits = [
    { icon: TrendingUp, text: "Discounted platform fees", highlight: true },
    { icon: Zap, text: "Priority challenge processing", highlight: false },
    { icon: Shield, text: "Enhanced support access", highlight: false },
    { icon: Globe, text: "Global marketplace access", highlight: false },
    { icon: Users, text: "Community networking", highlight: false },
    { icon: Clock, text: "Extended project timelines", highlight: false }
  ];

  const renderPricingOption = (
    period: string,
    amount: number | null,
    currency: string | null,
    isRecommended: boolean = false
  ) => {
    if (!amount || !currency) return null;

    const savings = period === 'Annual' ? calculateSavings(amount, membershipFees?.monthly_amount) : null;

    return (
      <div className={`relative p-4 rounded-lg border-2 transition-all ${
        isRecommended 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-border hover:border-primary/50'
      }`}>
        {isRecommended && (
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
            Most Popular
          </Badge>
        )}
        
        <div className="text-center">
          <h4 className="font-semibold text-lg">{period}</h4>
          <div className="my-2">
            <span className="text-2xl font-bold text-foreground">
              {formatCurrency(amount, currency)}
            </span>
            <div className="text-sm text-muted-foreground">
              per {period.toLowerCase()}
            </div>
          </div>
          
          {savings && (
            <Badge variant="secondary" className="mb-2">
              Save {savings.percentage}% ({formatCurrency(savings.amount, currency)})
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isActive ? 'border-green-500 bg-green-50/50' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Membership Status
            </CardTitle>
            <CardDescription>
              {isActive 
                ? "You're an active member with exclusive benefits" 
                : "Join our membership for exclusive benefits and discounts"
              }
            </CardDescription>
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={isActive ? "bg-green-600" : ""}
          >
            {membershipStatus || 'Not Active'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Membership Benefits */}
        <div>
          <h4 className="font-semibold mb-3 text-foreground">Membership Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <benefit.icon className={`h-4 w-4 ${
                  benefit.highlight ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <span className={`text-sm ${
                  benefit.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'
                }`}>
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        {membershipFees && !isActive && (
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Membership Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderPricingOption(
                'Monthly', 
                membershipFees.monthly_amount, 
                membershipFees.monthly_currency
              )}
              {renderPricingOption(
                'Quarterly', 
                membershipFees.quarterly_amount, 
                membershipFees.quarterly_currency
              )}
              {renderPricingOption(
                'Half-Yearly', 
                membershipFees.half_yearly_amount, 
                membershipFees.half_yearly_currency
              )}
              {renderPricingOption(
                'Annual', 
                membershipFees.annual_amount, 
                membershipFees.annual_currency,
                true
              )}
            </div>
          </div>
        )}

        {/* Organization Context */}
        {membershipFees && (
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <strong>Your Organization:</strong> {membershipFees.organization_type} • {membershipFees.entity_type} • {membershipFees.country}
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          {isActive ? (
            <Button onClick={onManageMembership} variant="outline" className="flex-1">
              <Shield className="mr-2 h-4 w-4" />
              Manage Membership
            </Button>
          ) : (
            <Button onClick={onJoinMembership} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Join Membership
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};