import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DependencyCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  component: any;
  dependencies: any;
  onConfirmDelete: (componentId: string, cascade: boolean) => void;
  loading?: boolean;
}

export const DependencyCheckDialog: React.FC<DependencyCheckDialogProps> = ({
  open,
  onOpenChange,
  component,
  dependencies,
  onConfirmDelete,
  loading = false,
}) => {
  if (!component || !dependencies) return null;

  const canDelete = dependencies.can_delete;
  const hasEngagementMappings = dependencies.engagement_model_mappings > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Delete Fee Component
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Component to Delete:</h4>
            <div className="flex items-center gap-2">
              <span className="font-medium">{component.name}</span>
              <Badge variant="outline">
                {component.component_type?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>

          {!canDelete && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This fee component cannot be deleted because it has dependencies.
              </AlertDescription>
            </Alert>
          )}

          {hasEngagementMappings && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Dependencies found:</h4>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    {dependencies.engagement_model_mappings} engagement model mapping(s)
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Available Actions:</h4>
            
            {canDelete ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✓ This component can be safely deleted without affecting other data.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    ✗ Cannot delete: This component is referenced by other data.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <p className="text-sm text-orange-800">
                    ⚠️ Force delete: Remove all dependencies and delete the component.
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Warning: This action cannot be undone and may affect related data.
                  </p>
                </div>
              </div>
            )}
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
            
            {canDelete && (
              <Button
                variant="destructive"
                onClick={() => onConfirmDelete(component.id, false)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            
            {!canDelete && (
              <Button
                variant="destructive"
                onClick={() => onConfirmDelete(component.id, true)}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {loading ? 'Force Deleting...' : 'Force Delete'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};