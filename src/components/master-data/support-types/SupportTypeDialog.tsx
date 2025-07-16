import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supportTypeSchema, SupportTypeFormData } from '@/lib/validations/tierPricingValidation';

interface SupportTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supportType?: any;
  onSave: (data: SupportTypeFormData) => void;
  loading: boolean;
}

export const SupportTypeDialog: React.FC<SupportTypeDialogProps> = ({
  open,
  onOpenChange,
  supportType,
  onSave,
  loading
}) => {
  const form = useForm<SupportTypeFormData>({
    resolver: zodResolver(supportTypeSchema),
    defaultValues: {
      name: supportType?.name || '',
      description: supportType?.description || '',
      service_level: supportType?.service_level || '',
      availability: supportType?.availability || '',
      response_time: supportType?.response_time || '',
      is_active: supportType?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (supportType) {
      form.reset({
        name: supportType.name || '',
        description: supportType.description || '',
        service_level: supportType.service_level || '',
        availability: supportType.availability || '',
        response_time: supportType.response_time || '',
        is_active: supportType.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        service_level: '',
        availability: '',
        response_time: '',
        is_active: true,
      });
    }
  }, [supportType, form]);

  const handleSubmit = (data: SupportTypeFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {supportType ? 'Edit Support Type' : 'Add Support Type'}
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
                    <Input placeholder="Enter support type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Level *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 24/7, Business Hours" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="response_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Time</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 2 hours, 24 hours" {...field} />
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
                      placeholder="Enter support type description" 
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this support type for use in tier configurations
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
                {loading ? 'Saving...' : (supportType ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};