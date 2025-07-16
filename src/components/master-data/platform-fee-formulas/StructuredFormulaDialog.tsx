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
import { Calculator, DollarSign, AlertTriangle } from 'lucide-react';
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
    engagement_model_subtype_id: '',
    country_id: '',
    currency_id: '',
    formula_expression: '',
    description: '',
    platform_usage_fee_percentage: 15,
    base_management_fee: 0,
    base_consulting_fee: 0,
    advance_payment_percentage: 25,
    formula_type: 'structured',
    configuration: {},
    is_active: true,
  });

  const [previewValues, setPreviewValues] = useState({
    solutionFee: 50000
  });

  const { items: engagementModels } = useMasterDataCRUD('master_engagement_models');
  const { items: complexityLevels } = useMasterDataCRUD('master_challenge_complexity');
  const { items: countries } = useMasterDataCRUD('master_countries');
  const { items: currencies } = useMasterDataCRUD('master_currencies');
  const { items: engagementModelSubtypes } = useMasterDataCRUD('master_engagement_model_subtypes');

  useEffect(() => {
    if (formula) {
      setFormData({
        formula_name: formula.formula_name || '',
        engagement_model_id: formula.engagement_model_id || '',
        engagement_model_subtype_id: formula.engagement_model_subtype_id || '',
        country_id: formula.country_id || '',
        currency_id: formula.currency_id || '',
        formula_expression: formula.formula_expression || '',
        description: formula.description || '',
        platform_usage_fee_percentage: formula.platform_usage_fee_percentage || 15,
        base_management_fee: formula.base_management_fee || 0,
        base_consulting_fee: formula.base_consulting_fee || 0,
        advance_payment_percentage: formula.advance_payment_percentage || 25,
        formula_type: formula.formula_type || 'structured',
        configuration: formula.configuration || {},
        is_active: formula.is_active !== false,
      });
    } else {
      setFormData({
        formula_name: '',
        engagement_model_id: '',
        engagement_model_subtype_id: '',
        country_id: '',
        currency_id: '',
        formula_expression: '',
        description: '',
        platform_usage_fee_percentage: 15,
        base_management_fee: 0,
        base_consulting_fee: 0,
        advance_payment_percentage: 25,
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
          const subtype = engagementModelSubtypes.find(s => s.id === formData.engagement_model_subtype_id);
          if (subtype?.name === 'General') {
            expression = 'Platform Usage Fee + Management Fee';
          } else if (subtype?.name === 'Program Managed') {
            expression = 'Platform Usage Fee + Management Fee + Consulting Fee';
          } else {
            expression = 'Platform Usage Fee + Management Fee';
          }
          break;
        default:
          expression = 'Platform Usage Fee';
      }
    }
    
    // Convert empty strings to null for UUID fields to prevent database errors
    const processedFormData = {
      ...formData,
      country_id: formData.country_id || null,
      currency_id: formData.currency_id || null,
      engagement_model_subtype_id: formData.engagement_model_subtype_id || null,
      formula_expression: expression
    };
    
    onSave(processedFormData);
  };

  // Auto-populate currency when country changes
  useEffect(() => {
    if (formData.country_id) {
      const selectedCountry = countries.find(c => c.id === formData.country_id);
      if (selectedCountry) {
        const countryCurrency = currencies.find(c => c.country === selectedCountry.name);
        if (countryCurrency) {
          setFormData(prev => ({ ...prev, currency_id: countryCurrency.id }));
        }
      }
    }
  }, [formData.country_id, countries, currencies]);

  const selectedEngagementModel = engagementModels.find(m => m.id === formData.engagement_model_id);
  const selectedCountry = countries.find(c => c.id === formData.country_id);
  const selectedCurrency = currencies.find(c => c.id === formData.currency_id);
  const selectedSubtype = engagementModelSubtypes.find(s => s.id === formData.engagement_model_subtype_id);
  
  // Filter out Platform as a Service and Market Place & Aggregator from engagement models
  const filteredEngagementModels = engagementModels.filter(m => m.name !== 'Platform as a Service' && m.name !== 'Market Place & Aggregator');
  
  // Filter subtypes based on selected engagement model
  const filteredSubtypes = engagementModelSubtypes.filter(s => 
    s.engagement_model_id === formData.engagement_model_id
  );

  // Determine field visibility based on engagement model
  const showManagementFee = selectedEngagementModel?.name !== 'Aggregator';
  const showConsultingFee = selectedEngagementModel?.name === 'Market Place' && selectedSubtype?.name === 'Program Managed';
  const showSubtypeDropdown = selectedEngagementModel?.name === 'Market Place';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            {formula ? 'Edit' : 'Add'} Platform Fee Formula
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        value={formData.country_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, country_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country: any) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        value={formData.currency_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, currency_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency: any) => (
                            <SelectItem key={currency.id} value={currency.id}>
                              {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="engagement_model">Engagement Model *</Label>
                    <Select
                      value={formData.engagement_model_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_id: value, engagement_model_subtype_id: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select engagement model" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredEngagementModels.map((model: any) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {showSubtypeDropdown && (
                    <div className="space-y-2">
                      <Label htmlFor="engagement_model_subtype">Engagement Model Subtype *</Label>
                      <Select
                        value={formData.engagement_model_subtype_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, engagement_model_subtype_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subtype" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSubtypes.map((subtype: any) => (
                            <SelectItem key={subtype.id} value={subtype.id}>
                              {subtype.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}


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
                </div>

                {/* Fee Configuration */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Fee Configuration</h4>
                  
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

                  {showManagementFee && (
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
                        Base amount (multiplied by challenge complexity)
                      </p>
                    </div>
                  )}

                  {showConsultingFee && (
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
                        Base amount (multiplied by challenge complexity)
                      </p>
                    </div>
                  )}

                  {/* Engagement Model Info */}
                  {selectedEngagementModel && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Formula Components for {selectedEngagementModel.name}:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Platform Usage Fee</Badge>
                        {showManagementFee && (
                          <Badge variant="outline">Management Fee</Badge>
                        )}
                        {showConsultingFee && (
                          <Badge variant="outline">Consulting Fee</Badge>
                        )}
                        <Badge variant="outline">Advance Payment</Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </CardContent>
            </Card>

            {/* Testing Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Testing Preview
                </CardTitle>
                <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-yellow-700">
                    This preview is for testing only. Values entered here will NOT be saved to the database.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <FeeCalculationPreview
                  formula={formData}
                  previewValues={previewValues}
                  onPreviewValuesChange={setPreviewValues}
                  complexityLevels={complexityLevels}
                  engagementModel={selectedEngagementModel}
                  selectedCurrency={selectedCurrency}
                />
              </CardContent>
            </Card>
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
      </DialogContent>
    </Dialog>
  );
};