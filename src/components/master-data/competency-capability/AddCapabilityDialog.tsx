
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import ColorSelector from './ColorSelector';
import { FormData, ColorOption } from './types';

interface AddCapabilityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onAdd: () => void;
  colorOptions: ColorOption[];
}

const AddCapabilityDialog: React.FC<AddCapabilityDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
  onAdd,
  colorOptions,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Capability Level
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Competency Capability</DialogTitle>
          <DialogDescription>
            Create a new competency capability level with rating range for assessments
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Capability Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder="Enter capability name"
            />
          </div>
          <div>
            <Label htmlFor="ratingRange">Rating Range *</Label>
            <Input
              id="ratingRange"
              value={formData.ratingRange}
              onChange={(e) => onFormDataChange({ ratingRange: e.target.value })}
              placeholder="e.g., 0 - 2.49999"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAdd}>Add Capability</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCapabilityDialog;
