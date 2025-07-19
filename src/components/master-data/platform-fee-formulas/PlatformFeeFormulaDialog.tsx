import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';

interface PlatformFeeFormulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formula?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const PlatformFeeFormulaDialog: React.FC<PlatformFeeFormulaDialogProps> = ({
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
    variables: {} as Record<string, any>,
    is_active: true,
  });

  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableValue, setNewVariableValue] = useState('');
  const [newVariableType, setNewVariableType] = useState('number');

  const { items: engagementModels } = useMasterDataCRUD('master_engagement_models');

  useEffect(() => {
    if (formula) {
      setFormData({
        formula_name: formula.formula_name || '',
        engagement_model_id: formula.engagement_model_id || '',
        formula_expression: formula.formula_expression || '',
        description: formula.description || '',
        variables: formula.variables || {},
        is_active: formula.is_active !== false,
      });
    } else {
      setFormData({
        formula_name: '',
        engagement_model_id: '',
        formula_expression: '',
        description: '',
        variables: {},
        is_active: true,
      });
    }
  }, [formula, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addVariable = () => {
    if (newVariableName.trim()) {
      let value: any = newVariableValue;
      if (newVariableType === 'number') {
        value = parseFloat(newVariableValue) || 0;
      } else if (newVariableType === 'boolean') {
        value = newVariableValue.toLowerCase() === 'true';
      }

      setFormData(prev => ({
        ...prev,
        variables: {
          ...prev.variables,
          [newVariableName.trim()]: {
            type: newVariableType,
            default_value: value,
            description: `${newVariableName} variable`
          }
        }
      }));
      setNewVariableName('');
      setNewVariableValue('');
    }
  };

  const removeVariable = (name: string) => {
    setFormData(prev => ({
      ...prev,
      variables: Object.fromEntries(
        Object.entries(prev.variables).filter(([key]) => key !== name)
      )
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {formula ? 'Edit' : 'Add'} Platform Fee Formula
          </DialogTitle>
        </DialogHeader>

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
            <Label htmlFor="formula_expression">Formula Expression *</Label>
            <Textarea
              id="formula_expression"
              value={formData.formula_expression}
              onChange={(e) => setFormData(prev => ({ ...prev, formula_expression: e.target.value }))}
              placeholder="e.g., base_value * country_multiplier + fixed_fee"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use variable names that will be defined below. Common operators: +, -, *, /, ( )
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this formula calculates"
              rows={2}
            />
          </div>

          {/* Variables */}
          <div className="space-y-2">
            <Label>Variables</Label>
            <div className="flex gap-2">
              <Input
                value={newVariableName}
                onChange={(e) => setNewVariableName(e.target.value)}
                placeholder="Variable name"
                className="flex-1"
              />
              <Select value={newVariableType} onValueChange={setNewVariableType}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newVariableValue}
                onChange={(e) => setNewVariableValue(e.target.value)}
                placeholder="Default value"
                className="flex-1"
              />
              <Button type="button" onClick={addVariable} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.variables).map(([name, config]: [string, any]) => (
                <Badge key={name} variant="outline" className="flex items-center gap-1">
                  {name}: {config.type}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeVariable(name)}
                  />
                </Badge>
              ))}
            </div>
          </div>

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
      </DialogContent>
    </Dialog>
  );
};