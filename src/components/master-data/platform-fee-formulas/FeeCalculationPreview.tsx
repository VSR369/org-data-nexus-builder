import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingUp, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FeeCalculationPreviewProps {
  formula: any;
  previewValues: {
    solutionFee: number;
    complexityLevel: string;
  };
  onPreviewValuesChange: (values: any) => void;
  complexityLevels: any[];
  engagementModel?: any;
  selectedCurrency?: any;
}

export const FeeCalculationPreview: React.FC<FeeCalculationPreviewProps> = ({
  formula,
  previewValues,
  onPreviewValuesChange,
  complexityLevels,
  engagementModel,
  selectedCurrency,
}) => {
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedComplexity = complexityLevels.find(c => c.name === previewValues.complexityLevel);

  useEffect(() => {
    calculatePreview();
  }, [formula, previewValues, selectedComplexity]);

  const calculatePreview = async () => {
    if (!formula.platform_usage_fee_percentage || !previewValues.solutionFee || !selectedComplexity) {
      return;
    }

    setLoading(true);
    
    try {
      // Calculate Platform Usage Fee
      const platformUsageFee = previewValues.solutionFee * (formula.platform_usage_fee_percentage / 100);
      
      // Calculate Management Fee (base * complexity multiplier)
      const managementFee = formula.base_management_fee * (selectedComplexity.management_fee_multiplier || 1);
      
      // Calculate Consulting Fee (base * complexity multiplier)
      const consultingFee = formula.base_consulting_fee * (selectedComplexity.consulting_fee_multiplier || 1);
      
      // Calculate Total Fee based on engagement model
      let totalFee = platformUsageFee;
      
      if (engagementModel) {
        switch (engagementModel.name) {
          case 'Market Place':
            // Check if consulting fee should be included based on subtype
            const includeConsultingFee = formula.base_consulting_fee > 0;
            totalFee = platformUsageFee + managementFee + (includeConsultingFee ? consultingFee : 0);
            break;
          case 'Market Place & Aggregator':
            totalFee = platformUsageFee + managementFee + consultingFee;
            break;
          default: // Aggregator
            totalFee = platformUsageFee;
        }
      }
      
      // Calculate Advance Payment
      const advancePayment = totalFee * (formula.advance_payment_percentage / 100);
      
      setCalculationResult({
        solutionFee: previewValues.solutionFee,
        platformUsageFee,
        managementFee,
        consultingFee,
        totalFee,
        advancePayment,
        complexityLevel: previewValues.complexityLevel,
        managementMultiplier: selectedComplexity.management_fee_multiplier || 1,
        consultingMultiplier: selectedComplexity.consulting_fee_multiplier || 1,
        breakdown: {
          platformPercentage: formula.platform_usage_fee_percentage,
          baseManagementFee: formula.base_management_fee,
          baseConsultingFee: formula.base_consulting_fee,
          advancePercentage: formula.advance_payment_percentage
        }
      });
    } catch (error) {
      console.error('Error calculating preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = selectedCurrency?.code || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Input Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Testing Calculator
          </CardTitle>
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <Calculator className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-700">
              Testing: Solution Fee - Enter amount for calculation testing (not saved to database)
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="solution_fee">Testing: Solution Fee</Label>
              <Input
                id="solution_fee"
                type="number"
                value={previewValues.solutionFee}
                onChange={(e) => onPreviewValuesChange({
                  ...previewValues,
                  solutionFee: parseFloat(e.target.value) || 0
                })}
                placeholder="50000"
              />
              <p className="text-xs text-muted-foreground">
                Currency: {selectedCurrency?.name || 'USD'} ({selectedCurrency?.symbol || '$'})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity_level">Challenge Complexity</Label>
              <Select
                value={previewValues.complexityLevel}
                onValueChange={(value) => onPreviewValuesChange({
                  ...previewValues,
                  complexityLevel: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map((level: any) => (
                    <SelectItem key={level.id} value={level.name}>
                      {level.name} (×{level.management_fee_multiplier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedComplexity && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Management Multiplier</p>
                <p className="text-lg font-semibold">×{selectedComplexity.management_fee_multiplier}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Consulting Multiplier</p>
                <p className="text-lg font-semibold">×{selectedComplexity.consulting_fee_multiplier}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Calculation Results
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">
                Results are for display only. Actual calculations happen during challenge creation.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fee Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Platform Usage Fee</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(calculationResult.platformUsageFee)}</p>
                    <p className="text-xs text-muted-foreground">
                      {calculationResult.breakdown.platformPercentage}% of solution fee
                    </p>
                  </div>
                </div>

                {calculationResult.managementFee > 0 && (
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Management Fee</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(calculationResult.managementFee)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(calculationResult.breakdown.baseManagementFee)} × {calculationResult.managementMultiplier}
                      </p>
                    </div>
                  </div>
                )}

                {calculationResult.consultingFee > 0 && (
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Consulting Fee</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(calculationResult.consultingFee)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(calculationResult.breakdown.baseConsultingFee)} × {calculationResult.consultingMultiplier}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Fee</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(calculationResult.totalFee)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Advance Payment</span>
                    <div className="text-right">
                      <p className="text-xl font-bold text-secondary">
                        {formatCurrency(calculationResult.advancePayment)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {calculationResult.breakdown.advancePercentage}% of total fee
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Model Info */}
            {engagementModel && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Applied for: {engagementModel.name}</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Platform Usage Fee</Badge>
                  {calculationResult.managementFee > 0 && (
                    <Badge variant="outline">Management Fee</Badge>
                  )}
                  {calculationResult.consultingFee > 0 && (
                    <Badge variant="outline">Consulting Fee</Badge>
                  )}
                  <Badge variant="outline">Advance Payment</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};