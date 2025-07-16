import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import { useToast } from '@/hooks/use-toast';

interface EngagementModelSubtypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtype?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const EngagementModelSubtypeDialog: React.FC<EngagementModelSubtypeDialogProps> = ({
  open,
  onOpenChange,
  subtype,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    engagement_model_id: '',
    required_fields: [] as string[],
    optional_fields: [] as string[],
    is_active: true,
  });

  const [newRequiredField, setNewRequiredField] = useState('');
  const [newOptionalField, setNewOptionalField] = useState('');
  const [validationError, setValidationError] = useState('');

  const { items: engagementModels } = useMasterDataCRUD('master_engagement_models');
  const { items: existingSubtypes } = useMasterDataCRUD('master_engagement_model_subtypes');
  const { toast } = useToast();

  useEffect(() => {
    if (subtype) {
      setFormData({
        name: subtype.name || '',
        description: subtype.description || '',
        engagement_model_id: subtype.engagement_model_id || '',
        required_fields: subtype.required_fields || [],
        optional_fields: subtype.optional_fields || [],
        is_active: subtype.is_active !== false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        engagement_model_id: '',
        required_fields: [],
        optional_fields: [],
        is_active: true,
      });
    }
    setValidationError('');
  }, [subtype, open]);

  // Validation function to check for duplicate names
  const validateUniqueness = (name: string, engagementModelId: string) => {
    if (!name || !engagementModelId) return true;
    
    const duplicate = existingSubtypes.find(
      (item: any) => 
        item.name.toLowerCase() === name.toLowerCase() &&
        item.engagement_model_id === engagementModelId &&
        item.id !== subtype?.id // Exclude current item when editing
    );
    
    return !duplicate;
  };

  // Real-time validation as user types
  useEffect(() => {
    if (formData.name && formData.engagement_model_id) {
      if (!validateUniqueness(formData.name, formData.engagement_model_id)) {
        setValidationError('A subtype with this name already exists for the selected engagement model');
      } else {
        setValidationError('');
      }
    } else {
      setValidationError('');
    }
  }, [formData.name, formData.engagement_model_id, existingSubtypes, subtype]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateUniqueness(formData.name, formData.engagement_model_id)) {
      setValidationError('A subtype with this name already exists for the selected engagement model');
      return;
    }
    
    try {
      await onSave(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save engagement model subtype",
        variant: "destructive",
      });
    }
  };

  const addRequiredField = () => {
    if (newRequiredField.trim()) {
      setFormData(prev => ({
        ...prev,
        required_fields: [...prev.required_fields, newRequiredField.trim()]
      }));
      setNewRequiredField('');
    }
  };

  const removeRequiredField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      required_fields: prev.required_fields.filter((_, i) => i !== index)
    }));
  };

  const addOptionalField = () => {
    if (newOptionalField.trim()) {
      setFormData(prev => ({
        ...prev,
        optional_fields: [...prev.optional_fields, newOptionalField.trim()]
      }));
      setNewOptionalField('');
    }
  };

  const removeOptionalField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      optional_fields: prev.optional_fields.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {subtype ? 'Edit' : 'Add'} Engagement Model Subtype
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter subtype name"
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

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{validationError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          {/* Required Fields */}
          <div className="space-y-2">
            <Label>Required Fields</Label>
            <div className="flex gap-2">
              <Input
                value={newRequiredField}
                onChange={(e) => setNewRequiredField(e.target.value)}
                placeholder="Add required field"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredField())}
              />
              <Button type="button" onClick={addRequiredField} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.required_fields.map((field, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {field}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeRequiredField(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-2">
            <Label>Optional Fields</Label>
            <div className="flex gap-2">
              <Input
                value={newOptionalField}
                onChange={(e) => setNewOptionalField(e.target.value)}
                placeholder="Add optional field"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionalField())}
              />
              <Button type="button" onClick={addOptionalField} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.optional_fields.map((field, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {field}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeOptionalField(index)}
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
            <Button type="submit" disabled={loading || !!validationError}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};