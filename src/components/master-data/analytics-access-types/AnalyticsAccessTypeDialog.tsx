import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { analyticsAccessTypeSchema, AnalyticsAccessTypeFormData } from '@/lib/validations/tierPricingValidation';

interface AnalyticsAccessTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessType?: any;
  onSave: (data: AnalyticsAccessTypeFormData) => void;
  loading: boolean;
}

export const AnalyticsAccessTypeDialog: React.FC<AnalyticsAccessTypeDialogProps> = ({
  open,
  onOpenChange,
  accessType,
  onSave,
  loading
}) => {
  const [newFeature, setNewFeature] = useState('');

  const form = useForm<AnalyticsAccessTypeFormData>({
    resolver: zodResolver(analyticsAccessTypeSchema),
    defaultValues: {
      name: accessType?.name || '',
      description: accessType?.description || '',
      dashboard_access: accessType?.dashboard_access ?? false,
      features_included: accessType?.features_included || [],
      is_active: accessType?.is_active ?? true,
    },
  });

  const featuresArray = form.watch('features_included') || [];

  React.useEffect(() => {
    if (accessType) {
      form.reset({
        name: accessType.name || '',
        description: accessType.description || '',
        dashboard_access: accessType.dashboard_access ?? false,
        features_included: accessType.features_included || [],
        is_active: accessType.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        dashboard_access: false,
        features_included: [],
        is_active: true,
      });
    }
  }, [accessType, form]);

  const handleSubmit = (data: AnalyticsAccessTypeFormData) => {
    onSave(data);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('features_included') || [];
      form.setValue('features_included', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = form.getValues('features_included') || [];
    form.setValue('features_included', currentFeatures.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {accessType ? 'Edit Analytics Access Type' : 'Add Analytics Access Type'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter access type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter access type description" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dashboard_access"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Dashboard Access</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Allow access to analytics dashboard
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Features Included</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add feature name"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  disabled={!newFeature.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {featuresArray.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this access type for use in tier configurations
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                {loading ? 'Saving...' : (accessType ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};