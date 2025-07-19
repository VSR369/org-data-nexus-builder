import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ChallengeComplexityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complexity?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const ChallengeComplexityDialog: React.FC<ChallengeComplexityDialogProps> = ({
  open,
  onOpenChange,
  complexity,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    management_fee_multiplier: 1.0,
    consulting_fee_multiplier: 1.0,
    description: '',
    level_order: 1,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (complexity) {
      setFormData({
        name: complexity.name || '',
        management_fee_multiplier: complexity.management_fee_multiplier || 1.0,
        consulting_fee_multiplier: complexity.consulting_fee_multiplier || 1.0,
        description: complexity.description || '',
        level_order: complexity.level_order || 1,
        is_active: complexity.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        management_fee_multiplier: 1.0,
        consulting_fee_multiplier: 1.0,
        description: '',
        level_order: 1,
        is_active: true,
      });
    }
    setErrors({});
  }, [complexity, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.management_fee_multiplier <= 0) {
      newErrors.management_fee_multiplier = 'Management fee multiplier must be greater than 0';
    }

    if (formData.consulting_fee_multiplier <= 0) {
      newErrors.consulting_fee_multiplier = 'Consulting fee multiplier must be greater than 0';
    }

    if (formData.level_order < 1) {
      newErrors.level_order = 'Level order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {complexity ? 'Edit Complexity Level' : 'Add New Complexity Level'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Low, Medium, High"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="level_order">Level Order *</Label>
              <Input
                id="level_order"
                type="number"
                value={formData.level_order}
                onChange={(e) => handleChange('level_order', parseInt(e.target.value) || 1)}
                min="1"
                className={errors.level_order ? 'border-red-500' : ''}
              />
              {errors.level_order && <p className="text-sm text-red-600 mt-1">{errors.level_order}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="management_fee_multiplier">Management Fee Multiplier *</Label>
              <Input
                id="management_fee_multiplier"
                type="number"
                step="0.1"
                value={formData.management_fee_multiplier}
                onChange={(e) => handleChange('management_fee_multiplier', parseFloat(e.target.value) || 1.0)}
                min="0.1"
                placeholder="1.0"
                className={errors.management_fee_multiplier ? 'border-red-500' : ''}
              />
              {errors.management_fee_multiplier && <p className="text-sm text-red-600 mt-1">{errors.management_fee_multiplier}</p>}
            </div>

            <div>
              <Label htmlFor="consulting_fee_multiplier">Consulting Fee Multiplier *</Label>
              <Input
                id="consulting_fee_multiplier"
                type="number"
                step="0.1"
                value={formData.consulting_fee_multiplier}
                onChange={(e) => handleChange('consulting_fee_multiplier', parseFloat(e.target.value) || 1.0)}
                min="0.1"
                placeholder="1.0"
                className={errors.consulting_fee_multiplier ? 'border-red-500' : ''}
              />
              {errors.consulting_fee_multiplier && <p className="text-sm text-red-600 mt-1">{errors.consulting_fee_multiplier}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe this complexity level..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleChange('is_active', checked)}
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