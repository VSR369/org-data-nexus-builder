
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AddCapabilityDialog from './AddCapabilityDialog';
import EditCapabilityDialog from './EditCapabilityDialog';
import CapabilityItem from './CapabilityItem';
import { CompetencyCapability, FormData } from './types';
import { COLOR_OPTIONS } from './constants';

interface CapabilityManagementProps {
  capabilities: CompetencyCapability[];
  onCapabilitiesChange: (capabilities: CompetencyCapability[]) => void;
}

const CapabilityManagement: React.FC<CapabilityManagementProps> = ({
  capabilities,
  onCapabilitiesChange,
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCapability, setEditingCapability] = useState<CompetencyCapability | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    ratingRange: '',
  });

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.ratingRange.trim()) {
      toast({
        title: "Error",
        description: "Capability name and rating range are required",
        variant: "destructive",
      });
      return;
    }

    const newCapability: CompetencyCapability = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      color: formData.color,
      ratingRange: formData.ratingRange,
      order: capabilities.length + 1,
      isActive: true,
    };

    onCapabilitiesChange([...capabilities, newCapability]);
    setFormData({ name: '', description: '', color: 'bg-blue-100 text-blue-800 border-blue-300', ratingRange: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Competency capability added successfully",
    });
  };

  const handleEdit = (capability: CompetencyCapability) => {
    setEditingCapability(capability);
    setFormData({
      name: capability.name,
      description: capability.description,
      color: capability.color,
      ratingRange: capability.ratingRange,
    });
  };

  const handleUpdate = () => {
    if (!formData.name.trim() || !formData.ratingRange.trim() || !editingCapability) return;

    const updatedCapabilities = capabilities.map(cap => 
      cap.id === editingCapability.id 
        ? { ...cap, ...formData }
        : cap
    );

    onCapabilitiesChange(updatedCapabilities);
    setEditingCapability(null);
    setFormData({ name: '', description: '', color: 'bg-blue-100 text-blue-800 border-blue-300', ratingRange: '' });
    
    toast({
      title: "Success",
      description: "Competency capability updated successfully",
    });
  };

  const handleDelete = (id: string) => {
    const updatedCapabilities = capabilities.filter(cap => cap.id !== id);
    onCapabilitiesChange(updatedCapabilities);
    toast({
      title: "Success",
      description: "Competency capability deleted successfully",
    });
  };

  const handleToggleStatus = (id: string) => {
    const updatedCapabilities = capabilities.map(cap => 
      cap.id === id ? { ...cap, isActive: !cap.isActive } : cap
    );
    onCapabilitiesChange(updatedCapabilities);
  };

  const sortedCapabilities = [...capabilities].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Competency Capability Levels Management
        </CardTitle>
        <CardDescription>
          Manage competency capability levels and their rating ranges used for solution provider assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {capabilities.filter(c => c.isActive).length} active capability levels
          </div>
          <AddCapabilityDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onAdd={handleAdd}
            colorOptions={COLOR_OPTIONS}
          />
        </div>

        <div className="grid gap-4">
          {sortedCapabilities.map((capability) => (
            <CapabilityItem
              key={capability.id}
              capability={capability}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>

        <EditCapabilityDialog
          editingCapability={editingCapability}
          onClose={() => setEditingCapability(null)}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onUpdate={handleUpdate}
          colorOptions={COLOR_OPTIONS}
        />
      </CardContent>
    </Card>
  );
};

export default CapabilityManagement;
