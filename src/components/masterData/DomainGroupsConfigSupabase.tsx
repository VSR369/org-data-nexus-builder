import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainGroup {
  id: string;
  name: string;
  description?: string;
  industry_segment_id?: string;
  is_active: boolean;
}

interface IndustrySegment {
  id: string;
  name: string;
}

const DomainGroupsConfigSupabase = () => {
  const { toast } = useToast();
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [newDomainGroup, setNewDomainGroup] = useState({ 
    name: '', 
    description: '', 
    industry_segment_id: '', 
    is_active: true 
  });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch domain groups and industry segments
      const [domainGroupsResult, industrySegmentsResult] = await Promise.all([
        supabase.from('master_domain_groups').select('*').order('name'),
        supabase.from('master_industry_segments').select('id, name').order('name')
      ]);

      if (domainGroupsResult.error) throw domainGroupsResult.error;
      if (industrySegmentsResult.error) throw industrySegmentsResult.error;

      setDomainGroups(domainGroupsResult.data || []);
      setIndustrySegments(industrySegmentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load domain groups and industry segments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId) return 'None';
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'None';
  };

  if (loading) {
    return <div>Loading domain groups...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Domain Groups</CardTitle>
            <CardDescription>
              Configure domain groups with optional industry segment links
            </CardDescription>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Domain Groups ({domainGroups.length})</h3>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Domain Group
          </Button>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1 space-y-2">
              <div>
                <Label htmlFor="new-domain-group-name">Domain Group Name</Label>
                <Input
                  id="new-domain-group-name"
                  value={newDomainGroup.name}
                  onChange={(e) => setNewDomainGroup({...newDomainGroup, name: e.target.value})}
                  placeholder="Enter domain group name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-domain-group-description">Description</Label>
                <Input
                  id="new-domain-group-description"
                  value={newDomainGroup.description}
                  onChange={(e) => setNewDomainGroup({...newDomainGroup, description: e.target.value})}
                  placeholder="Enter description (optional)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-domain-group-segment">Industry Segment (Optional)</Label>
                <Select
                  value={newDomainGroup.industry_segment_id}
                  onValueChange={(value) => setNewDomainGroup({...newDomainGroup, industry_segment_id: value === 'none' ? '' : value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select industry segment (optional)" />
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
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddDomainGroup} size="sm" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex items-center gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {domainGroups.map((domainGroup, index) => (
            <div key={domainGroup.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{index + 1}</Badge>
                <div>
                  <div className="font-medium">{domainGroup.name}</div>
                  {domainGroup.description && (
                    <div className="text-sm text-muted-foreground">{domainGroup.description}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Industry: {getIndustrySegmentName(domainGroup.industry_segment_id || '')}
                  </div>
                </div>
                <Badge variant={domainGroup.is_active ? "default" : "secondary"}>
                  {domainGroup.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainGroupsConfigSupabase;