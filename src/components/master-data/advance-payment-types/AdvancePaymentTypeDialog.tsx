import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface AdvancePaymentTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentType?: any;
  onSave: (data: any) => void;
  loading?: boolean;
}

export const AdvancePaymentTypeDialog: React.FC<AdvancePaymentTypeDialogProps> = ({
  open,
  onOpenChange,
  paymentType,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    percentage_of_platform_fee: 0,
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (paymentType) {
      setFormData({
        name: paymentType.name || '',
        percentage_of_platform_fee: paymentType.percentage_of_platform_fee || 0,
        description: paymentType.description || '',
        is_active: paymentType.is_active !== false,
      });
    } else {
      setFormData({
        name: '',
        percentage_of_platform_fee: 0,
        description: '',
        is_active: true,
      });
    }
  }, [paymentType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {paymentType ? 'Edit' : 'Add'} Advance Payment Type
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter payment type name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage of Platform Fee *</Label>
            <div className="relative">
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.percentage_of_platform_fee}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  percentage_of_platform_fee: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.0"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentage of the calculated platform fee required as advance payment
            </p>
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