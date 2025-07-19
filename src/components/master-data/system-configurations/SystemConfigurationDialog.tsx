import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const configSchema = z.object({
  config_key: z.string().min(1, 'Configuration key is required'),
  config_value: z.string().min(1, 'Configuration value is required'),
  data_type: z.enum(['string', 'number', 'boolean', 'json']),
  description: z.string().optional(),
  category: z.string().default('general'),
  is_system_config: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

interface SystemConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: any;
  onSave: (data: any) => void;
}

export const SystemConfigurationDialog: React.FC<SystemConfigurationDialogProps> = ({
  open,
  onOpenChange,
  config,
  onSave,
}) => {
  const form = useForm({
    resolver: zodResolver(configSchema),
    defaultValues: {
      config_key: config?.config_key || '',
      config_value: config?.config_value || '',
      data_type: config?.data_type || 'string',
      description: config?.description || '',
      category: config?.category || 'general',
      is_system_config: config?.is_system_config ?? false,
      is_active: config?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (config) {
      form.reset({
        config_key: config.config_key || '',
        config_value: config.config_value || '',
        data_type: config.data_type || 'string',
        description: config.description || '',
        category: config.category || 'general',
        is_system_config: config.is_system_config ?? false,
        is_active: config.is_active ?? true,
      });
    } else {
      form.reset({
        config_key: '',
        config_value: '',
        data_type: 'string',
        description: '',
        category: 'general',
        is_system_config: false,
        is_active: true,
      });
    }
  }, [config, form]);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {config ? 'Edit System Configuration' : 'Add New System Configuration'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="config_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter configuration key" 
                      {...field} 
                      disabled={config?.is_system_config}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter configuration value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
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
                      placeholder="Enter description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_system_config"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">System Configuration</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark as system configuration (cannot be deleted)
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={config?.is_system_config}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this configuration
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

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {config ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};