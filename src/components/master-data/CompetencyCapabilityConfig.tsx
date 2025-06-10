
import React, { useState } from 'react';
import RatingScaleOverview from './competency-capability/RatingScaleOverview';
import CapabilityManagement from './competency-capability/CapabilityManagement';
import AddCapabilityDialog from './competency-capability/AddCapabilityDialog';
import EditCapabilityDialog from './competency-capability/EditCapabilityDialog';
import CapabilityItem from './competency-capability/CapabilityItem';
import { CompetencyCapability, FormData } from './competency-capability/types';
import { DEFAULT_CAPABILITIES, COLOR_OPTIONS } from './competency-capability/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CompetencyCapabilityConfig = () => {
  const [capabilities, setCapabilities] = useState<CompetencyCapability[]>(DEFAULT_CAPABILITIES);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCapability, setEditingCapability] = useState<CompetencyCapability | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    ratingRange: '1-5',
    color: COLOR_OPTIONS[0].value
  });
  const { toast } = useToast();

  const handleUpdateRatingRange = (id: string, newRange: string) => {
    setCapabilities(prev => prev.map(cap => 
      cap.id === id ? { ...cap, ratingRange: newRange } : cap
    ));
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleAddCapability = () => {
    if (!formData.name.trim() || !formData.ratingRange.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCapability: CompetencyCapability = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: 'technical',
      ratingRange: formData.ratingRange,
      isActive: true,
      color: formData.color
    };

    setCapabilities(prev => [...prev, newCapability]);
    setFormData({
      name: '',
      description: '',
      ratingRange: '1-5',
      color: COLOR_OPTIONS[0].value
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Capability added successfully"
    });
  };

  const handleEditCapability = (capability: CompetencyCapability) => {
    setEditingCapability(capability);
    setFormData({
      name: capability.name,
      description: capability.description,
      ratingRange: capability.ratingRange,
      color: capability.color || COLOR_OPTIONS[0].value
    });
  };

  const handleUpdateCapability = () => {
    if (!editingCapability || !formData.name.trim() || !formData.ratingRange.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setCapabilities(prev => prev.map(cap =>
      cap.id === editingCapability.id
        ? {
            ...cap,
            name: formData.name.trim(),
            description: formData.description.trim(),
            ratingRange: formData.ratingRange,
            color: formData.color
          }
        : cap
    ));
    setEditingCapability(null);
    setFormData({
      name: '',
      description: '',
      ratingRange: '1-5',
      color: COLOR_OPTIONS[0].value
    });
    toast({
      title: "Success",
      description: "Capability updated successfully"
    });
  };

  const handleDeleteCapability = (id: string) => {
    setCapabilities(prev => prev.filter(cap => cap.id !== id));
    toast({
      title: "Success",
      description: "Capability deleted successfully"
    });
  };

  const handleToggleStatus = (id: string) => {
    setCapabilities(prev => prev.map(cap =>
      cap.id === id ? { ...cap, isActive: !cap.isActive } : cap
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground mb-2">Competency & Capability Configuration</h2>
        <p className="text-lg text-muted-foreground">
          Manage competency capabilities and their rating scales for assessments
        </p>
      </div>

      <RatingScaleOverview
        capabilities={capabilities}
        onUpdateRatingRange={handleUpdateRatingRange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Capability Management</CardTitle>
          <CardDescription>
            Add, edit, and manage competency capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Current Capabilities</h3>
            <AddCapabilityDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              formData={formData}
              onFormDataChange={handleFormDataChange}
              onAdd={handleAddCapability}
              colorOptions={COLOR_OPTIONS}
            />
          </div>

          <div className="space-y-3">
            {capabilities.map((capability) => (
              <CapabilityItem
                key={capability.id}
                capability={capability}
                onEdit={handleEditCapability}
                onDelete={handleDeleteCapability}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          <EditCapabilityDialog
            editingCapability={editingCapability}
            onClose={() => setEditingCapability(null)}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onUpdate={handleUpdateCapability}
            colorOptions={COLOR_OPTIONS}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencyCapabilityConfig;
