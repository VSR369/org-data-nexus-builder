import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Edit, Trash2, Save, X, RotateCcw, Upload, Download, 
  Wand2, FileText, Target, Search, AlertTriangle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SupabaseWizard from './wizard/SupabaseWizard';
import ExcelUploadSupabase from './upload/ExcelUploadSupabase';
import DomainGroupHierarchyDisplay from './components/DomainGroupHierarchyDisplay';
import DomainGroupHierarchyForm from './components/DomainGroupHierarchyForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  hierarchy?: {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      subCategories: Array<{
        id: string;
        name: string;
        description?: string;
      }>;
    }>;
  };
}

interface IndustrySegment {
  id: string;
  name: string;
}

const DomainGroupsConfigSupabase = () => {
  const { toast } = useToast();
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [showDirectEntry, setShowDirectEntry] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit/Delete states
  const [editingItem, setEditingItem] = useState<DomainGroup | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{open: boolean, item: DomainGroup} | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Form states for direct entry
  const [newDomainGroup, setNewDomainGroup] = useState({ 
    name: '', 
    description: '', 
    industry_segment_id: '', 
    is_active: true 
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [domainGroupsResult, industrySegmentsResult] = await Promise.all([
        supabase.from('master_domain_groups').select('*').order('name'),
        supabase.from('master_industry_segments').select('id, name').order('name')
      ]);

      if (domainGroupsResult.error) throw domainGroupsResult.error;
      if (industrySegmentsResult.error) throw industrySegmentsResult.error;

      // Transform the data to match our interface
      const transformedDomainGroups: DomainGroup[] = (domainGroupsResult.data || []).map(dg => ({
        id: dg.id,
        name: dg.name,
        description: dg.description,
        industry_segment_id: dg.industry_segment_id,
        is_active: dg.is_active,
        created_at: dg.created_at,
        updated_at: dg.updated_at,
        hierarchy: dg.hierarchy ? (typeof dg.hierarchy === 'string' ? JSON.parse(dg.hierarchy) : dg.hierarchy) : undefined
      }));

      setDomainGroups(transformedDomainGroups);
      setIndustrySegments(industrySegmentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load domain groups data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleEdit = (item: DomainGroup) => {
    setEditingItem({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const { error } = await supabase
        .from('master_domain_groups')
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      setEditingItem(null);
      setShowEditDialog(false);
      fetchData();
      toast({
        title: "Success",
        description: "Domain group updated successfully",
      });
    } catch (error) {
      console.error('Error updating domain group:', error);
      toast({
        title: "Error",
        description: "Failed to update domain group.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: DomainGroup) => {
    try {
      const { error } = await supabase
        .from('master_domain_groups')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      setDeleteDialog(null);
      fetchData();
      toast({
        title: "Deleted",
        description: "Domain group deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting domain group:', error);
      toast({
        title: "Error",
        description: "Failed to delete domain group.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (item: DomainGroup) => {
    try {
      const { error } = await supabase
        .from('master_domain_groups')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;

      fetchData();
      toast({
        title: "Status Updated",
        description: `Domain group ${!item.is_active ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleAddDomainGroup = async () => {
    if (newDomainGroup.name.trim()) {
      try {
        const { error } = await supabase
          .from('master_domain_groups')
          .insert([{
            name: newDomainGroup.name.trim(),
            description: newDomainGroup.description.trim() || null,
            industry_segment_id: newDomainGroup.industry_segment_id || null,
            is_active: newDomainGroup.is_active
          }]);

        if (error) throw error;

        setNewDomainGroup({ name: '', description: '', industry_segment_id: '', is_active: true });
        setIsAdding(false);
        fetchData();
        toast({
          title: "Success",
          description: "Domain group added successfully",
        });
      } catch (error) {
        console.error('Error adding domain group:', error);
        toast({
          title: "Error",
          description: "Failed to add domain group.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveHierarchy = async (hierarchyData: any) => {
    try {
      // Build hierarchy structure with categories and sub-categories
      const categories = hierarchyData.categories.map((category: any) => ({
        id: crypto.randomUUID(),
        name: category.name.trim(),
        description: category.description?.trim() || undefined,
        subCategories: category.subCategories.map((sub: any) => ({
          id: crypto.randomUUID(),
          name: sub.name.trim(),
          description: sub.description?.trim() || undefined
        }))
      }));

      // Create Domain Group with hierarchy
      const { error } = await supabase
        .from('master_domain_groups')
        .insert([{
          name: hierarchyData.name.trim(),
          description: hierarchyData.description?.trim() || null,
          industry_segment_id: hierarchyData.industry_segment_id || null,
          is_active: true,
          hierarchy: { categories }
        }]);

      if (error) throw error;

      const totalSubCategories = categories.reduce((sum: number, cat: any) => sum + cat.subCategories.length, 0);

      toast({
        title: "Success!",
        description: `Created domain group "${hierarchyData.name}" with ${categories.length} categories and ${totalSubCategories} sub-categories`,
      });

      setShowDirectEntry(false);
      fetchData();
    } catch (error) {
      console.error('Error saving hierarchy:', error);
      toast({
        title: "Error",
        description: "Failed to save domain group hierarchy",
        variant: "destructive",
      });
      throw error; // Re-throw to let the form handle the error state
    }
  };

  const handleUpdateHierarchy = async (domainGroup: DomainGroup, updatedHierarchy: any) => {
    try {
      const { error } = await supabase
        .from('master_domain_groups')
        .update({ hierarchy: updatedHierarchy })
        .eq('id', domainGroup.id);

      if (error) throw error;

      fetchData();
      toast({
        title: "Success",
        description: "Hierarchy updated successfully",
      });
    } catch (error) {
      console.error('Error updating hierarchy:', error);
      toast({
        title: "Error",
        description: "Failed to update hierarchy",
        variant: "destructive",
      });
    }
  };

  const exportData = async () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        domainGroups: domainGroups
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `domain-groups-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Domain groups data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export domain groups data",
        variant: "destructive",
      });
    }
  };

  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId) return 'None';
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'None';
  };

  // Filter data based on search term
  const filteredDomainGroups = domainGroups.filter(dg => 
    dg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dg.description && dg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading domain groups...</div>;
  }

  if (showWizard) {
    return (
      <SupabaseWizard 
        onCancel={() => setShowWizard(false)} 
        onComplete={() => {
          setShowWizard(false);
          fetchData();
        }} 
      />
    );
  }

  if (showExcelUpload) {
    return (
      <ExcelUploadSupabase 
        onCancel={() => setShowExcelUpload(false)} 
        onComplete={() => {
          setShowExcelUpload(false);
          fetchData();
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6" />
                Domain Groups Management
              </CardTitle>
              <CardDescription>
                Manage domain groups which contain hierarchical categories and sub-categories
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setShowDirectEntry(!showDirectEntry)}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant={showDirectEntry ? "default" : "outline"}
            >
              <FileText className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Direct Entry</div>
                <div className="text-sm opacity-70">Add domain groups one by one</div>
              </div>
            </Button>
            <Button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Wand2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Guided Wizard</div>
                <div className="text-sm opacity-70">Step-by-step setup with categories</div>
              </div>
            </Button>
            <Button
              onClick={() => setShowExcelUpload(true)}
              className="flex items-center gap-2 h-auto p-4 flex-col"
              variant="outline"
            >
              <Upload className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Excel Upload</div>
                <div className="text-sm opacity-70">Bulk import from file</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search domain groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Domain Groups Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{domainGroups.length}</div>
          <div className="text-sm text-muted-foreground">Total domain groups configured</div>
        </CardContent>
      </Card>

      {/* Direct Entry Form */}
      {showDirectEntry && (
        <DomainGroupHierarchyForm
          industrySegments={industrySegments}
          onSave={handleSaveHierarchy}
          onCancel={() => setShowDirectEntry(false)}
        />
      )}

      {/* Domain Groups List */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Groups</CardTitle>
          <CardDescription>Manage existing domain groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDomainGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No domain groups found. Add some domain groups to get started.</p>
              </div>
            ) : (
              filteredDomainGroups.map((domainGroup) => (
                <DomainGroupHierarchyDisplay
                  key={domainGroup.id}
                  domainGroup={domainGroup}
                  industrySegmentName={getIndustrySegmentName(domainGroup.industry_segment_id)}
                  onEdit={handleEdit}
                  onDelete={(item) => setDeleteDialog({ open: true, item })}
                  onToggleStatus={handleToggleStatus}
                  onUpdateHierarchy={handleUpdateHierarchy}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Domain Group</DialogTitle>
            <DialogDescription>
              Make changes to the domain group details below.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    name: e.target.value
                  })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    description: e.target.value
                  })}
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-industry-segment">Industry Segment</Label>
                <Select
                  value={editingItem.industry_segment_id || 'none'}
                  onValueChange={(value) => setEditingItem({
                    ...editingItem,
                    industry_segment_id: value === 'none' ? null : value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Industry Segment</SelectItem>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingItem.is_active}
                  onCheckedChange={(checked) => setEditingItem({
                    ...editingItem,
                    is_active: checked
                  })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteDialog?.open || false} 
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog?.item?.name}"?
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog.item)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DomainGroupsConfigSupabase;