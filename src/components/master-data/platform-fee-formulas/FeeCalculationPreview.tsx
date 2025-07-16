import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign } from 'lucide-react';

interface FeeCalculationPreviewProps {
  formula: any;
  previewValues: {
    solutionFee: number;
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
  const [complexityCalculations, setComplexityCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateAllComplexityLevels();
  }, [formula, previewValues, complexityLevels, engagementModel]);

  const calculateAllComplexityLevels = async () => {
    if (!formula.platform_usage_fee_percentage || !previewValues.solutionFee || !complexityLevels.length) {
      return;
    }

    setLoading(true);
    
    try {
      const calculations = complexityLevels.map(complexity => {
        // Calculate Platform Usage Fee (same for all complexity levels)
        const platformUsageFee = previewValues.solutionFee * (formula.platform_usage_fee_percentage / 100);
        
        // Calculate Management Fee (base * complexity multiplier)
        const managementFee = formula.base_management_fee * (complexity.management_fee_multiplier || 1);
        
        // Calculate Consulting Fee (base * complexity multiplier)
        const consultingFee = formula.base_consulting_fee * (complexity.consulting_fee_multiplier || 1);
        
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
        
        return {
          complexity,
          platformUsageFee,
          managementFee,
          consultingFee,
          totalFee,
          advancePayment,
          managementMultiplier: complexity.management_fee_multiplier || 1,
          consultingMultiplier: complexity.consulting_fee_multiplier || 1,
        };
      });
      
      setComplexityCalculations(calculations);
    } catch (error) {
      console.error('Error calculating complexity levels:', error);
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
        </CardContent>
      </Card>

      {/* Multi-Complexity Grid */}
      {complexityCalculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fee Calculations for All Complexity Levels
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">
                Challenge complexity is selected during challenge submission. This preview shows fees for all complexity levels.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Complexity Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Complexity Level</th>
                    <th className="text-right p-3 font-medium">Platform Usage Fee</th>
                    {engagementModel?.name !== 'Aggregator' && (
                      <th className="text-right p-3 font-medium">Management Fee</th>
                    )}
                    {formula.base_consulting_fee > 0 && (
                      <th className="text-right p-3 font-medium">Consulting Fee</th>
                    )}
                    <th className="text-right p-3 font-medium">Total Fee</th>
                    <th className="text-right p-3 font-medium">Advance Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {complexityCalculations.map((calc, index) => (
                    <tr key={calc.complexity.id} className={`border-b ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{calc.complexity.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Mgmt: ×{calc.managementMultiplier}
                          </Badge>
                          {formula.base_consulting_fee > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Cons: ×{calc.consultingMultiplier}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-medium">{formatCurrency(calc.platformUsageFee)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formula.platform_usage_fee_percentage}%
                        </div>
                      </td>
                      {engagementModel?.name !== 'Aggregator' && (
                        <td className="p-3 text-right">
                          <div className="font-medium">{formatCurrency(calc.managementFee)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(formula.base_management_fee)} × {calc.managementMultiplier}
                          </div>
                        </td>
                      )}
                      {formula.base_consulting_fee > 0 && (
                        <td className="p-3 text-right">
                          <div className="font-medium">{formatCurrency(calc.consultingFee)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(formula.base_consulting_fee)} × {calc.consultingMultiplier}
                          </div>
                        </td>
                      )}
                      <td className="p-3 text-right">
                        <div className="font-bold text-primary text-lg">{formatCurrency(calc.totalFee)}</div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-medium">{formatCurrency(calc.advancePayment)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formula.advance_payment_percentage}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Engagement Model Info */}
            {engagementModel && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Applied for: {engagementModel.name}</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Platform Usage Fee</Badge>
                  {engagementModel.name !== 'Aggregator' && (
                    <Badge variant="outline">Management Fee</Badge>
                  )}
                  {formula.base_consulting_fee > 0 && (
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