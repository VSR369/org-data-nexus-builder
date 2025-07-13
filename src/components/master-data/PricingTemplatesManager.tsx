import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePricingTemplates } from '@/hooks/usePricingTemplates';
import { Loader2, Plus, Settings, Zap } from 'lucide-react';

export const PricingTemplatesManager = () => {
  const { templates, rules, loading, error, refetch } = usePricingTemplates();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pricing system...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error loading pricing system: {error}</p>
        <Button onClick={refetch} className="mt-2">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Templates & Rules</h2>
          <p className="text-muted-foreground">Manage pricing templates and business rules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Pricing Templates ({templates.length})
          </CardTitle>
          <CardDescription>
            Base pricing configurations for different engagement models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.template_name}</CardTitle>
                    <Badge variant={template.template_type === 'marketplace' ? 'default' : 'secondary'}>
                      {template.template_type}
                    </Badge>
                  </div>
                  <CardDescription>{template.engagement_model}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {template.base_platform_fee_percentage && (
                      <div className="flex justify-between">
                        <span>Platform Fee:</span>
                        <span className="font-medium">{template.base_platform_fee_percentage}%</span>
                      </div>
                    )}
                    {template.base_quarterly_fee && (
                      <div className="flex justify-between">
                        <span>Quarterly Fee:</span>
                        <span className="font-medium">₹{template.base_quarterly_fee}</span>
                      </div>
                    )}
                    {template.base_annual_fee && (
                      <div className="flex justify-between">
                        <span>Annual Fee:</span>
                        <span className="font-medium">₹{template.base_annual_fee}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Rules Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Business Rules ({rules.length})
          </CardTitle>
          <CardDescription>
            Automatic adjustments applied to base pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{rule.rule_name}</h4>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{rule.rule_type}</Badge>
                      <p className="text-sm mt-1">
                        {rule.adjustment_type === 'multiplier' ? `×${rule.adjustment_value}` :
                         rule.adjustment_type === 'percentage' ? `${rule.adjustment_value}%` :
                         `${rule.adjustment_value}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border rounded-lg p-4">
        <h3 className="font-medium text-green-600 mb-2">✅ Implementation Complete</h3>
        <p className="text-sm text-muted-foreground">
          The pricing system has been successfully revamped with template-based configuration. 
          No more hardcoded values - all pricing is now managed through admin-configurable templates and business rules.
        </p>
      </div>
    </div>
  );
};