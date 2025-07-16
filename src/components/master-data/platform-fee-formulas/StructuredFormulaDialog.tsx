import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, DollarSign, Settings, Eye } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { FeeCalculationPreview } from './FeeCalculationPreview';

interface StructuredFormulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formula?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const StructuredFormulaDialog: React.FC<StructuredFormulaDialogProps> = ({
  open,
  onOpenChange,
  formula,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    formula_name: '',
    engagement_model_id: '',
    formula_expression: '',
    description: '',
    platform_usage_fee_percentage: 15,
    base_management_fee: 0,
    base_consulting_fee: 0,
    advance_payment_percentage: 25,
    challenge_complexity_id: '',
    formula_type: 'structured',
    configuration: {},
    is_active: true,
  });

  const [selectedComplexity, setSelectedComplexity] = useState('');
  const [previewValues, setPreviewValues] = useState({
    solutionFee: 50000,
    complexityLevel: 'Medium'
  });

  const { items: engagementModels } = useMasterDataCRUD('master_engagement_models');
  const { items: complexityLevels } = useMasterDataCRUD('master_challenge_complexity');

  useEffect(() => {
    if (formula) {
      setFormData({
        formula_name: formula.formula_name || '',
        engagement_model_id: formula.engagement_model_id || '',
        formula_expression: formula.formula_expression || '',
        description: formula.description || '',
        platform_usage_fee_percentage: formula.platform_usage_fee_percentage || 15,
        base_management_fee: formula.base_management_fee || 0,
        base_consulting_fee: formula.base_consulting_fee || 0,
        advance_payment_percentage: formula.advance_payment_percentage || 25,
        challenge_complexity_id: formula.challenge_complexity_id || '',
        formula_type: formula.formula_type || 'structured',
        configuration: formula.configuration || {},
        is_active: formula.is_active !== false,
      });
    } else {
      setFormData({
        formula_name: '',
        engagement_model_id: '',
        formula_expression: '',
        description: '',
        platform_usage_fee_percentage: 15,
        base_management_fee: 0,
        base_consulting_fee: 0,
        advance_payment_percentage: 25,
        challenge_complexity_id: '',
        formula_type: 'structured',
        configuration: {},
        is_active: true,
      });
    }
  }, [formula, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate formula expression based on engagement model
    const engagementModel = engagementModels.find(m => m.id === formData.engagement_model_id);
    let expression = '';
    
    if (engagementModel) {
      switch (engagementModel.name) {
        case 'Aggregator':
          expression = 'Platform Usage Fee Only';
          break;
        case 'Market Place':
          expression = 'Platform Usage Fee + Management Fee';
          break;
        case 'Market Place & Aggregator':
          expression = 'Platform Usage Fee + Management Fee + Consulting Fee';
          break;
        case 'Platform as a Service':
          expression = 'Platform Usage Fee + Consulting Fee';
          break;
        default:
          expression = 'Platform Usage Fee';
      }
    }
    
    onSave({
      ...formData,
      formula_expression: expression
    });
  };

  const selectedEngagementModel = engagementModels.find(m => m.id === formData.engagement_model_id);
  const selectedComplexityData = complexityLevels.find(c => c.name === previewValues.complexityLevel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {formula ? 'Edit' : 'Add'} Platform Fee Formula
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="configuration" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="configuration" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="formula_name">Formula Name *</Label>
                  <Input
                    id="formula_name"
                    value={formData.formula_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, formula_name: e.target.value }))}
                    placeholder="Enter formula name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="engagement_model">Engagement Model *</Label>
                  <Select
                    value={formData.engagement_model_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select engagement model" />
                    </SelectTrigger>
                    <SelectContent>
                      {engagementModels.map((model: any) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this formula configuration"
                  rows={2}
                />
              </div>

              {/* Fee Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5" />
                    Fee Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform_usage_fee_percentage">Platform Usage Fee (%)</Label>
                      <Input
                        id="platform_usage_fee_percentage"
                        type="number"
                        step="0.01"
                        value={formData.platform_usage_fee_percentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, platform_usage_fee_percentage: parseFloat(e.target.value) || 0 }))}
                        placeholder="15.0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage of solution fee
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advance_payment_percentage">Advance Payment (%)</Label>
                      <Input
                        id="advance_payment_percentage"
                        type="number"
                        step="0.01"
                        value={formData.advance_payment_percentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, advance_payment_percentage: parseFloat(e.target.value) || 0 }))}
                        placeholder="25.0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage of total fee
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_management_fee">Base Management Fee</Label>
                      <Input
                        id="base_management_fee"
                        type="number"
                        step="0.01"
                        value={formData.base_management_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, base_management_fee: parseFloat(e.target.value) || 0 }))}
                        placeholder="5000"
                      />
                      <p className="text-xs text-muted-foreground">
                        Base amount (multiplied by complexity)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="base_consulting_fee">Base Consulting Fee</Label>
                      <Input
                        id="base_consulting_fee"
                        type="number"
                        step="0.01"
                        value={formData.base_consulting_fee}
                        onChange={(e) => setFormData(prev => ({ ...prev, base_consulting_fee: parseFloat(e.target.value) || 0 }))}
                        placeholder="3000"
                      />
                      <p className="text-xs text-muted-foreground">
                        Base amount (multiplied by complexity)
                      </p>
                    </div>
                  </div>

                  {/* Engagement Model Info */}
                  {selectedEngagementModel && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Formula Components for {selectedEngagementModel.name}:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Platform Usage Fee</Badge>
                        {selectedEngagementModel.name !== 'Aggregator' && 
                         selectedEngagementModel.name !== 'Platform as a Service' && (
                          <Badge variant="outline">Management Fee</Badge>
                        )}
                        {(selectedEngagementModel.name === 'Market Place & Aggregator' || 
                          selectedEngagementModel.name === 'Platform as a Service') && (
                          <Badge variant="outline">Consulting Fee</Badge>
                        )}
                        <Badge variant="outline">Advance Payment</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <FeeCalculationPreview
              formula={formData}
              previewValues={previewValues}
              onPreviewValuesChange={setPreviewValues}
              complexityLevels={complexityLevels}
              engagementModel={selectedEngagementModel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};