import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTriggerButton } from '@/components/ui/dialog-trigger-button';
import { DialogErrorBoundary, useDialogErrorHandler } from '@/components/ui/dialog-error-boundary';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MasterDataDialogProps {
  mode: 'add' | 'edit' | 'delete';
  item?: any;
  onSuccess: () => void;
  children?: React.ReactNode;
  tableName: string;
  title: string;
  renderForm: (formData: any, setFormData: (data: any) => void, options: any) => React.ReactNode;
  initialFormData: any;
  loadOptions?: () => Promise<any>;
  validateForm?: (formData: any) => string | null;
}

export const MasterDataDialog: React.FC<MasterDataDialogProps> = ({
  mode,
  item,
  onSuccess,
  children,
  tableName,
  title,
  renderForm,
  initialFormData,
  loadOptions,
  validateForm
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [options, setOptions] = useState({});
  
  const { toast } = useToast();
  const { handleError } = useDialogErrorHandler();

  // Reset form when dialog opens/closes or item changes
  useEffect(() => {
    if (open && item && mode === 'edit') {
      setFormData(item);
    } else if (open && mode === 'add') {
      setFormData(initialFormData);
    }
  }, [open, item, mode, initialFormData]);

  // Load options when dialog opens
  useEffect(() => {
    if (open && loadOptions) {
      loadOptionsWithErrorHandling();
    }
  }, [open, loadOptions]);

  const loadOptionsWithErrorHandling = useCallback(async () => {
    try {
      if (loadOptions) {
        const loadedOptions = await loadOptions();
        setOptions(loadedOptions);
      }
    } catch (error) {
      handleError(error as Error, 'loading options');
    }
  }, [loadOptions, handleError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form if validator provided
    if (validateForm) {
      const validationError = validateForm(formData);
      if (validationError) {
        toast({
          title: "Validation Error",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
    }
    
    setLoading(true);

    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from(tableName as any)
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${title} added successfully`,
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from(tableName as any)
          .update(formData)
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${title} updated successfully`,
        });
      } else if (mode === 'delete') {
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq('id', item.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: `${title} deleted successfully`,
        });
      }

      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      handleError(error as Error, `${mode} operation`);
    } finally {
      setLoading(false);
    }
  };

  const renderDialogContent = () => {
    if (mode === 'delete') {
      return (
        <div className="space-y-4">
          <p>Are you sure you want to delete this {title.toLowerCase()}?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderForm(formData, setFormData, options)}
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <DialogErrorBoundary>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTriggerButton mode={mode}>
          {children}
        </DialogTriggerButton>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {mode === 'add' && `Add ${title}`}
              {mode === 'edit' && `Edit ${title}`}
              {mode === 'delete' && `Delete ${title}`}
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </DialogErrorBoundary>
  );
};