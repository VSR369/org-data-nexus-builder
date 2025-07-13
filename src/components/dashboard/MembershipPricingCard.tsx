import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Percent, CreditCard, Calendar, CheckCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

interface MembershipPricingCardProps {
  profile: any;
}

export const MembershipPricingCard: React.FC<MembershipPricingCardProps> = ({ profile }) => {
  const [pricingOptions, setPricingOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      loadMembershipPricing();
    }
  }, [profile]);

  const loadMembershipPricing = async () => {
    try {
      setLoading(true);
      
      // Fetch pricing configurations that match the organization's profile
      const { data, error } = await supabase
        .from('pricing_configurations_detailed')
        .select('*')
        .eq('country_name', profile.country)
        .eq('organization_type', profile.organization_type)
        .eq('entity_type', profile.entity_type)
        .eq('is_active', true)
        .order('engagement_model');

      if (error) throw error;

      // Group by engagement model for better display
      const grouped = data?.reduce((acc: any, config: any) => {
        if (!acc[config.engagement_model]) {
          acc[config.engagement_model] = [];
        }
        acc[config.engagement_model].push(config);
        return acc;
      }, {}) || {};

      setPricingOptions(Object.entries(grouped).map(([model, configs]) => ({
        engagement_model: model,
        configurations: configs
      })));

    } catch (error) {
      console.error('Error loading membership pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (engagementModel: string) => {
    setSelectedOption(engagementModel);
    // Here you would typically handle the selection logic
    // For now, we'll just show it as selected
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Available Membership Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading pricing options...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pricingOptions.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Available Membership Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Info className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Plans Available</h3>
            <p className="text-muted-foreground text-sm">
              No membership plans are currently available for your organization type and location.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              {profile.organization_type} • {profile.entity_type} • {profile.country}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Available Membership Plans
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Plans tailored for {profile.organization_type} in {profile.country}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pricingOptions.map((option) => (
          <div key={option.engagement_model} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base">{option.engagement_model}</h4>
              <Badge variant="outline" className="text-xs">
                {option.configurations.length} option{option.configurations.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            {option.configurations.map((config: any, index: number) => (
              <div 
                key={config.id} 
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                  selectedOption === config.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="space-y-3">
                  {/* Membership Status */}
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={config.membership_status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {config.membership_status} Member
                    </Badge>
                    {selectedOption === config.id && (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>

                  {/* Pricing Information */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Base Price</span>
                      <div className="flex items-center gap-1">
                        {config.is_percentage ? (
                          <>
                            <Percent className="h-3 w-3" />
                            <span className="font-medium">{formatPercentage(config.base_value)}</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            <span className="font-medium">
                              {formatCurrency(config.base_value, config.currency_code)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {config.membership_discount_percentage > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Member Discount</span>
                        <span className="font-medium text-green-600">
                          -{formatPercentage(config.membership_discount_percentage)}
                        </span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Final Price</span>
                      <div className="flex items-center gap-1">
                        {config.is_percentage ? (
                          <>
                            <Percent className="h-4 w-4 text-primary" />
                            <span className="font-bold text-lg text-primary">
                              {formatPercentage(config.calculated_value)}
                            </span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(config.calculated_value, config.currency_code)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {config.billing_frequency && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Billing</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          <span>{config.billing_frequency}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant={selectedOption === config.id ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectPlan(config.id)}
                  >
                    {selectedOption === config.id ? 'Selected Plan' : 'Select Plan'}
                  </Button>
                </div>
              </div>
            ))}
            
            {option !== pricingOptions[pricingOptions.length - 1] && (
              <Separator className="my-4" />
            )}
          </div>
        ))}

        {/* Additional Information */}
        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <Info className="h-3 w-3 inline mr-1" />
            Prices are customized based on your organization profile: {profile.organization_type} • {profile.entity_type} • {profile.country}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};