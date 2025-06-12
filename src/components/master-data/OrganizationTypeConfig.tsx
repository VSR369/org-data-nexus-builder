
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { UniversalDataManager } from '@/utils/core/UniversalDataManager';
import { seedingService } from '@/utils/core/UniversalSeedingService';

const defaultOrgTypes = [
  'Large Enterprise',
  'Start-up',
  'MSME',
  'Academic Institution',
  'Research Institution',
  'Non-Profit Organization / NGO',
  'Government Department / PSU',
  'Industry Association / Consortium',
  'Freelancer / Individual Consultant',
  'Think Tank / Policy Institute'
];

// Validation function for organization types
const validateOrgTypesData = (data: any): boolean => {
  console.log(`🔍 Validating organization types data:`, data);
  const isValid = Array.isArray(data);
  console.log(`✅ Organization types validation result: ${isValid}`);
  return isValid;
};

// Seeding function for organization types
const seedOrgTypesData = (): string[] => {
  console.log('🌱 Seeding organization types default data');
  return defaultOrgTypes;
};

// Create universal data manager instance
const orgTypesManager = new UniversalDataManager<string[]>({
  key: 'master_data_organization_types',
  defaultData: defaultOrgTypes,
  version: 2, // Increment version for the new system
  seedFunction: seedOrgTypesData,
  validationFunction: validateOrgTypesData
});

// Register with seeding service
seedingService.registerManager('organization_types', orgTypesManager);
seedingService.registerSeedFunction('organization_types', seedOrgTypesData);

const OrganizationTypeConfig = () => {
  const { toast } = useToast();
  const [orgTypes, setOrgTypes] = useState<string[]>([]);
  const [newOrgType, setNewOrgType] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load data on component mount using Universal Data Manager
  useEffect(() => {
    console.log('🔄 OrganizationTypeConfig: Loading data using Universal Data Manager...');
    const loadedTypes = orgTypesManager.loadData();
    console.log('✅ OrganizationTypeConfig: Loaded data:', loadedTypes);
    setOrgTypes(loadedTypes);
  }, []);

  // Save data whenever orgTypes change
  useEffect(() => {
    if (orgTypes.length > 0) {
      console.log('💾 OrganizationTypeConfig: Saving data:', orgTypes);
      orgTypesManager.saveData(orgTypes);
    }
  }, [orgTypes]);

  const handleAddOrgType = () => {
    if (newOrgType.trim()) {
      const updatedTypes = [...orgTypes, newOrgType.trim()];
      setOrgTypes(updatedTypes);
      setNewOrgType('');
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Organization type added successfully",
      });
    }
  };

  const handleEditOrgType = (index: number) => {
    setEditingIndex(index);
    setEditingValue(orgTypes[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedOrgTypes = [...orgTypes];
      updatedOrgTypes[editingIndex] = editingValue.trim();
      setOrgTypes(updatedOrgTypes);
      setEditingIndex(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Organization type updated successfully",
      });
    }
  };

  const handleDeleteOrgType = (index: number) => {
    const updatedOrgTypes = orgTypes.filter((_, i) => i !== index);
    setOrgTypes(updatedOrgTypes);
    toast({
      title: "Success",
      description: "Organization type deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewOrgType('');
  };

  const handleResetToDefault = () => {
    console.log('🔄 Resetting organization types to default...');
    const defaultData = orgTypesManager.forceReseed();
    setOrgTypes(defaultData);
    setEditingIndex(null);
    setEditingValue('');
    setIsAdding(false);
    setNewOrgType('');
    toast({
      title: "Success",
      description: "Organization types reset to default values",
    });
  };

  const handleRefreshData = () => {
    console.log('🔄 Refreshing organization types data...');
    const refreshedData = orgTypesManager.loadData();
    setOrgTypes(refreshedData);
    toast({
      title: "Success",
      description: "Organization types data refreshed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organization Types</CardTitle>
            <CardDescription>
              Configure organization types for Solution Seeking, Solution Provider, Solution Assessor, Solution Manager, and Solution Head Organizations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefreshData}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={handleResetToDefault}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Organization Types ({orgTypes.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="new-org-type">New Organization Type</Label>
              <Input
                id="new-org-type"
                value={newOrgType}
                onChange={(e) => setNewOrgType(e.target.value)}
                placeholder="Enter organization type name"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddOrgType} size="sm" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex items-center gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {orgTypes.map((orgType, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{orgType}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditOrgType(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteOrgType(index)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationTypeConfig;
