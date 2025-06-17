
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EngagementModel } from './types';

interface EngagementModelFormProps {
  onAdd: (model: EngagementModel) => void;
  editingModel?: EngagementModel | null;
  onUpdate?: (model: EngagementModel) => void;
  onCancelEdit?: () => void;
}

const EngagementModelForm: React.FC<EngagementModelFormProps> = ({
  onAdd,
  editingModel,
  onUpdate,
  onCancelEdit
}) => {
  const [name, setName] = useState(editingModel?.name || '');
  const [description, setDescription] = useState(editingModel?.description || '');
  const [isActive, setIsActive] = useState(editingModel?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const modelData: EngagementModel = {
      id: editingModel?.id || `model-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      isActive,
      createdAt: editingModel?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingModel && onUpdate) {
      onUpdate(modelData);
    } else {
      onAdd(modelData);
    }

    // Reset form
    setName('');
    setDescription('');
    setIsActive(true);
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setIsActive(true);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingModel ? 'Edit Engagement Model' : 'Add New Engagement Model'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter engagement model name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter engagement model description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingModel ? 'Update' : 'Add'} Engagement Model
            </Button>
            {editingModel && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EngagementModelForm;
