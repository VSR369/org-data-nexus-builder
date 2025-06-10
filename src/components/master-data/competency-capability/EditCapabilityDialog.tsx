
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorSelector from './ColorSelector';
import { FormData, ColorOption, CompetencyCapability } from './types';

interface EditCapabilityDialogProps {
  editingCapability: CompetencyCapability | null;
  onClose: () => void;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onUpdate: () => void;
  colorOptions: ColorOption[];
}

const EditCapabilityDialog: React.FC<EditCapabilityDialogProps> = ({
  editingCapability,
  onClose,
  formData,
  onFormDataChange,
  onUpdate,
  colorOptions,
}) => {
  return (
    <Dialog open={!!editingCapability} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Competency Capability</DialogTitle>
          <DialogDescription>
            Update the competency capability details and rating range
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Capability Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Enter capability name"
            />
          </div>
          <div>
            <Label htmlFor="edit-ratingRange">Rating Range *</Label>
            <Input
              id="edit-ratingRange"
              value={formData.ratingRange}
              onChange={(e) => onFormDataChange({ ratingRange: e.target.value })}
              placeholder="e.g., 0 - 2.49999"
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              placeholder="Enter capability description"
            />
          </div>
          <ColorSelector
            selectedColor={formData.color}
            onColorChange={(color) => onFormDataChange({ color })}
            colorOptions={colorOptions}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onUpdate}>Update Capability</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCapabilityDialog;
