import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DomainGroup {
  id?: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  is_active?: boolean;
  is_user_created?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface IndustrySegment {
  id: string;
  name: string;
  description?: string;
}

export default function DomainGroupsConfigSupabase() {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDomainGroup, setEditingDomainGroup] = useState<DomainGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry_segment_id: ''
  });

  const loadDomainGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_domain_groups')
        .select(`
          *,
          master_industry_segments(name)
        `)
        .order('name');
      
      if (error) throw error;
      setDomainGroups(data || []);
    } catch (error) {
      console.error('Error loading domain groups:', error);
      toast({
        title: "Error",
        description: "Failed to load domain groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadIndustrySegments = async () => {
    try {
      const { data, error } = await supabase
        .from('master_industry_segments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setIndustrySegments(data || []);
    } catch (error) {
      console.error('Error loading industry segments:', error);
      toast({
        title: "Error",
        description: "Failed to load industry segments",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadDomainGroups();
    loadIndustrySegments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Domain group name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const domainGroupData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        industry_segment_id: formData.industry_segment_id || null,
        is_active: true,
        is_user_created: true
      };

      if (editingDomainGroup) {
        const { error } = await supabase
          .from('master_domain_groups')
          .update(domainGroupData)
          .eq('id', editingDomainGroup.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Domain group updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('master_domain_groups')
          .insert([domainGroupData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Domain group added successfully",
        });
      }
      
      resetForm();
      await loadDomainGroups();
    } catch (error: any) {
      console.error('Error saving domain group:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save domain group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (domainGroup: DomainGroup) => {
    setEditingDomainGroup(domainGroup);
    setFormData({
      name: domainGroup.name || '',
      description: domainGroup.description || '',
      industry_segment_id: domainGroup.industry_segment_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain group? All related categories will also be affected.')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_domain_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Domain group deleted successfully",
      });
      
      await loadDomainGroups();
    } catch (error) {
      console.error('Error deleting domain group:', error);
      toast({
        title: "Error",
        description: "Failed to delete domain group",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      industry_segment_id: ''
    });
    setEditingDomainGroup(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Domain Groups Configuration</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Domain Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingDomainGroup ? 'Edit Domain Group' : 'Add New Domain Group'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Domain Group Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Digital Services"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="industry_segment_id">Industry Segment</Label>
                <Select value={formData.industry_segment_id} onValueChange={(value) => setFormData(prev => ({ ...prev, industry_segment_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry segment (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No industry segment</SelectItem>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Domain group description..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingDomainGroup ? 'Update' : 'Add'} Domain Group
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Industry Segment</th>
                <th className="text-left p-4 font-medium">Description</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {domainGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    {loading ? 'Loading domain groups...' : 'No domain groups found. Add your first domain group above.'}
                  </td>
                </tr>
              ) : (
                domainGroups.map((domainGroup) => (
                  <tr key={domainGroup.id} className="border-b hover:bg-muted/25">
                    <td className="p-4 font-medium">{domainGroup.name}</td>
                    <td className="p-4">{(domainGroup as any).master_industry_segments?.name || '-'}</td>
                    <td className="p-4 max-w-xs truncate">{domainGroup.description || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        domainGroup.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {domainGroup.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(domainGroup)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(domainGroup.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}