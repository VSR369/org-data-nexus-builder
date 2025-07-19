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
import { workflowTemplateSchema, WorkflowTemplateFormData } from '@/lib/validations/tierPricingValidation';

interface WorkflowTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: any;
  onSave: (data: WorkflowTemplateFormData) => void;
  loading: boolean;
}

export const WorkflowTemplateDialog: React.FC<WorkflowTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
  loading
}) => {
  const form = useForm<WorkflowTemplateFormData>({
    resolver: zodResolver(workflowTemplateSchema),
    defaultValues: {
      name: template?.name || '',
      description: template?.description || '',
      template_type: template?.template_type || '',
      customization_level: template?.customization_level || '',
      template_count: template?.template_count || 1,
      fields_config: template?.fields_config || {},
      is_active: template?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (template) {
      form.reset({
        name: template.name || '',
        description: template.description || '',
        template_type: template.template_type || '',
        customization_level: template.customization_level || '',
        template_count: template.template_count || 1,
        fields_config: template.fields_config || {},
        is_active: template.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        template_type: '',
        customization_level: '',
        template_count: 1,
        fields_config: {},
        is_active: true,
      });
    }
  }, [template, form]);

  const handleSubmit = (data: WorkflowTemplateFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Workflow Template' : 'Add Workflow Template'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Count *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="Enter count"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="template_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="challenge">Challenge</SelectItem>
                        <SelectItem value="solution">Solution</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customization_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customization Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customization level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter template description" 
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
                      Enable this template for use in tier configurations
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
                {loading ? 'Saving...' : (template ? 'Update' : 'Create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};