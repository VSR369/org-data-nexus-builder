
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Factory, Plus, Search, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';

// Types
interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface DomainGroup {
  id: string;
  name: string;
  industrySegmentId: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Data manager for domain groups
const domainGroupsDataManager = new DataManager({
  key: 'master_data_domain_groups',
  defaultData: [] as DomainGroup[],
  version: 1
});

const DomainGroupsConfig: React.FC = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>([]);
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustrySegment, setSelectedIndustrySegment] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDomainGroup, setNewDomainGroup] = useState({
    name: '',
    industrySegmentId: '',
    description: '',
    isActive: true
  });
  
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    // Load domain groups
    const loadedDomainGroups = domainGroupsDataManager.loadData();
    setDomainGroups(loadedDomainGroups);

    // Load industry segments from master data
    const loadIndustrySegments = () => {
      const savedIndustrySegments = localStorage.getItem('master_data_industry_segments');
      if (savedIndustrySegments) {
        try {
          const industrySegmentsData: IndustrySegment[] = JSON.parse(savedIndustrySegments);
          console.log('Loaded industry segments from master data:', industrySegmentsData);
          setIndustrySegments(industrySegmentsData.filter(segment => segment.isActive));
        } catch (error) {
          console.error('Error parsing industry segments data:', error);
          setIndustrySegments([]);
        }
      } else {
        console.log('No industry segments found in master data');
        setIndustrySegments([]);
      }
    };

    loadIndustrySegments();
  }, []);

  // Filter domain groups based on search term and selected industry segment
  const filteredDomainGroups = domainGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustrySegment = selectedIndustrySegment === 'all' || group.industrySegmentId === selectedIndustrySegment;
    return matchesSearch && matchesIndustrySegment;
  });

  // Get industry segment name by ID
  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : 'Unknown Segment';
  };

  // Get industry segment code by ID
  const getIndustrySegmentCode = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.code : 'N/A';
  };

  const handleAddDomainGroup = () => {
    if (!newDomainGroup.name || !newDomainGroup.industrySegmentId) {
      toast({
        title: "Validation Error",
        description: "Name and industry segment are required fields",
        variant: "destructive"
      });
      return;
    }

    const newId = (domainGroups.length + 1).toString();
    const domainGroupToAdd: DomainGroup = {
      id: newId,
      name: newDomainGroup.name,
      industrySegmentId: newDomainGroup.industrySegmentId,
      description: newDomainGroup.description || undefined,
      isActive: newDomainGroup.isActive,
      createdAt: new Date().toISOString()
    };

    const updatedDomainGroups = [...domainGroups, domainGroupToAdd];
    setDomainGroups(updatedDomainGroups);
    domainGroupsDataManager.saveData(updatedDomainGroups);
    
    setNewDomainGroup({ name: '', industrySegmentId: '', description: '', isActive: true });
    setIsAddDialogOpen(false);

    toast({
      title: "Domain Group Added",
      description: `Successfully added ${domainGroupToAdd.name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Groups</h1>
          <p className="text-muted-foreground">Manage domain groups organized by industry segments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Domain Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Domain Group</DialogTitle>
              <DialogDescription>
                Create a new domain group and assign it to an industry segment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="domain-name">Domain Group Name *</Label>
                <Input 
                  id="domain-name" 
                  value={newDomainGroup.name}
                  onChange={(e) => setNewDomainGroup({...newDomainGroup, name: e.target.value})}
                  placeholder="e.g., Core Banking"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry-segment">Industry Segment *</Label>
                <Select 
                  value={newDomainGroup.industrySegmentId} 
                  onValueChange={(value) => setNewDomainGroup({...newDomainGroup, industrySegmentId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {segment.code}
                          </Badge>
                          {segment.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain-desc">Description</Label>
                <Input 
                  id="domain-desc" 
                  value={newDomainGroup.description}
                  onChange={(e) => setNewDomainGroup({...newDomainGroup, description: e.target.value})}
                  placeholder="Brief description of this domain group"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDomainGroup}>Add Domain Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            Domain Groups Management
          </CardTitle>
          <CardDescription>
            View and manage domain groups organized by industry segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domain groups..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedIndustrySegment} onValueChange={setSelectedIndustrySegment}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Filter by industry segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industry Segments</SelectItem>
                  {industrySegments.map((segment) => (
                    <SelectItem key={segment.id} value={segment.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {segment.code}
                        </Badge>
                        {segment.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filteredDomainGroups.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="font-medium text-lg mb-1">No domain groups found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedIndustrySegment !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Start by adding a domain group.'}
                </p>
                {industrySegments.length === 0 && (
                  <p className="text-muted-foreground text-sm mt-2">
                    Note: Configure industry segments first to create domain groups.
                  </p>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Group</TableHead>
                    <TableHead>Industry Segment</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDomainGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {getIndustrySegmentCode(group.industrySegmentId)}
                          </Badge>
                          <span className="text-sm">{getIndustrySegmentName(group.industrySegmentId)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                        {group.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={group.isActive ? "default" : "secondary"}>
                          {group.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainGroupsConfig;
