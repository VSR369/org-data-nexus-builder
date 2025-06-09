
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const OrganizationTypeConfig = () => {
  const { toast } = useToast();
  const [orgTypes, setOrgTypes] = useState([
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
  ]);
  
  const [newOrgType, setNewOrgType] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddOrgType = () => {
    if (newOrgType.trim()) {
      setOrgTypes([...orgTypes, newOrgType.trim()]);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Types</CardTitle>
        <CardDescription>
          Configure organization types for Solution Seeking, Solution Provider, Solution Assessor, Solution Manager, and Solution Head Organizations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Organization Types</h3>
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
