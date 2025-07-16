import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface FeeComponentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

const FEE_COMPONENT_TYPES = [
  { value: 'management_fee', label: 'Management Fee' },
  { value: 'consulting_fee', label: 'Consulting Fee' },
  { value: 'total_fee', label: 'Total Fee' },
  { value: 'platform_usage_fee', label: 'Platform Usage Fee' },
  { value: 'advance_payment', label: 'Advance Payment' },
];

export const FeeComponentDialog: React.FC<FeeComponentDialogProps> = ({
  open,
  onOpenChange,
  component,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    component_type: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name || '',
        component_type: component.component_type || '',
        description: component.description || '',
        is_active: component.is_active !== false,
      });
    } else {
      setFormData({
        name: '',
        component_type: '',
        description: '',
        is_active: true,
      });
    }
  }, [component, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {component ? 'Edit' : 'Add'} Fee Component
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
                placeholder="Enter component name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="component_type">Component Type *</Label>
              <Select
                value={formData.component_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, component_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {FEE_COMPONENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
              placeholder="Enter description"
              rows={4}
            />
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