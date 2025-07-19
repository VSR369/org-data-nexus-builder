
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useOrganizationTypes } from '@/hooks/useMasterDataCRUD';

const OrganizationTypeConfig = () => {
  const { toast } = useToast();
  const { items: orgTypes, loading, addItem, updateItem, deleteItem, refreshItems } = useOrganizationTypes();
  const [newOrgType, setNewOrgType] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddOrgType = async () => {
    if (newOrgType.trim()) {
      const success = await addItem({ name: newOrgType.trim(), is_user_created: true });
      if (success) {
        setNewOrgType('');
        setIsAdding(false);
        toast({
          title: "Success",
          description: "Organization type added successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add organization type",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditOrgType = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingId) {
      const success = await updateItem(editingId, { name: editingValue.trim() });
      if (success) {
        setEditingId(null);
        setEditingValue('');
        toast({
          title: "Success",
          description: "Organization type updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update organization type",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteOrgType = async (id: string) => {
    const success = await deleteItem(id);
    if (success) {
      toast({
        title: "Success",
        description: "Organization type deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete organization type",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewOrgType('');
  };

  const handleResetToDefault = async () => {
    // Add default organization types to Supabase
    const defaultTypes = [
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
    
    try {
      // Clear existing and add defaults - this would need custom logic
      await refreshItems();
      setEditingId(null);
      setEditingValue('');
      setIsAdding(false);
      setNewOrgType('');
      toast({
        title: "Info",
        description: "Please manually add default organization types",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset organization types",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = async () => {
    await refreshItems();
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

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading organization types...</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {orgTypes.map((orgType, index) => (
              <div key={orgType.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                {editingId === orgType.id ? (
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
                      <span className="font-medium">{orgType.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditOrgType(orgType.id, orgType.name)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteOrgType(orgType.id)}
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
        )}
      </CardContent>
    </Card>
  );
};

export default OrganizationTypeConfig;
