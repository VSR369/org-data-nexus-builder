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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const tierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  level_order: z.number().min(1, 'Level order must be positive'),
  is_active: z.boolean().default(true),
});

interface PricingTierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier?: any;
  onSave: (data: any) => void;
}

export const PricingTierDialog: React.FC<PricingTierDialogProps> = ({
  open,
  onOpenChange,
  tier,
  onSave,
}) => {
  const form = useForm({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      name: tier?.name || '',
      description: tier?.description || '',
      level_order: tier?.level_order || 1,
      is_active: tier?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (tier) {
      form.reset({
        name: tier.name || '',
        description: tier.description || '',
        level_order: tier.level_order || 1,
        is_active: tier.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        level_order: 1,
        is_active: true,
      });
    }
  }, [tier, form]);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {tier ? 'Edit Pricing Tier' : 'Add New Pricing Tier'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tier name" {...field} />
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
                      placeholder="Enter tier description" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter level order" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this pricing tier
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
                {tier ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};