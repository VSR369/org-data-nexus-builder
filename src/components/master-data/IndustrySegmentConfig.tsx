import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Factory, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager } from '@/utils/dataManager';

// Local type definition for IndustrySegment
interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

// Default industry segments
const defaultIndustrySegments: IndustrySegment[] = [
  {
    id: '1',
    name: 'Banking & Financial Services',
    code: 'BFSI',
    description: 'Banking, financial services, and insurance sector',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Healthcare & Life Sciences',
    code: 'HLS',
    description: 'Healthcare providers, pharmaceuticals, and life sciences',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Information Technology',
    code: 'IT',
    description: 'Software, hardware, and IT services',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Retail & Consumer Goods',
    code: 'RCG',
    description: 'Retail, e-commerce, and consumer products',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Manufacturing',
    code: 'MFG',
    description: 'Manufacturing and industrial sector',
    isActive: false,
    createdAt: new Date().toISOString()
  }
];

// Data manager for industry segments
const industrySegmentDataManager = new DataManager({
  key: 'master_data_industry_segments',
  defaultData: defaultIndustrySegments,
  version: 1
});

const IndustrySegmentConfig: React.FC = () => {
  const [segments, setSegments] = useState<IndustrySegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<IndustrySegment | null>(null);
  const [newSegment, setNewSegment] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true
  });
  
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    console.log('=== IndustrySegmentConfig: Loading industry segments ===');
    const loadedSegments = industrySegmentDataManager.loadData();
    console.log('📊 Loaded industry segments:', loadedSegments);
    setSegments(loadedSegments);
  }, []);
  
  // Filter segments based on search term and active tab
  const filteredSegments = segments.filter(segment => {
    // Add null checks to prevent toLowerCase errors
    const name = segment?.name || '';
    const code = segment?.code || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          code.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && segment.isActive;
    if (activeTab === 'inactive') return matchesSearch && !segment.isActive;
    return matchesSearch;
  });
  
  const handleAddSegment = () => {
    if (!newSegment.name || !newSegment.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (segments.length + 1).toString();
    const segmentToAdd: IndustrySegment = {
      id: newId,
      name: newSegment.name,
      code: newSegment.code,
      description: newSegment.description || undefined,
      isActive: newSegment.isActive,
      createdAt: new Date().toISOString()
    };
    
    const updatedSegments = [...segments, segmentToAdd];
    setSegments(updatedSegments);
    industrySegmentDataManager.saveData(updatedSegments);
    setNewSegment({ name: '', code: '', description: '', isActive: true });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Industry Segment Added",
      description: `Successfully added ${segmentToAdd.name}`,
    });
  };
  
  const handleEditSegment = () => {
    if (!currentSegment || !currentSegment.name || !currentSegment.code) {
      toast({
        title: "Validation Error",
        description: "Name and code are required fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedSegments = segments.map(segment => 
      segment.id === currentSegment.id ? currentSegment : segment
    );
    
    setSegments(updatedSegments);
    industrySegmentDataManager.saveData(updatedSegments);
    setIsEditDialogOpen(false);
    setCurrentSegment(null);
    
    toast({
      title: "Industry Segment Updated",
      description: `Successfully updated ${currentSegment.name}`,
    });
  };
  
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    const updatedSegments = segments.map(segment => 
      segment.id === id ? { ...segment, isActive: !currentStatus } : segment
    );
    
    setSegments(updatedSegments);
    industrySegmentDataManager.saveData(updatedSegments);
    
    toast({
      title: "Status Updated",
      description: `Industry segment status ${currentStatus ? 'deactivated' : 'activated'}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Industry Segments</h1>
          <p className="text-muted-foreground">Manage industry segments for domain classification</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Segment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Industry Segment</DialogTitle>
              <DialogDescription>
                Create a new industry segment for domain group classification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="segment-name">Segment Name *</Label>
                <Input 
                  id="segment-name" 
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({...newSegment, name: e.target.value})}
                  placeholder="e.g., Banking & Finance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment-code">Segment Code *</Label>
                <Input 
                  id="segment-code" 
                  value={newSegment.code}
                  onChange={(e) => setNewSegment({...newSegment, code: e.target.value})}
                  placeholder="e.g., BFSI"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segment-desc">Description</Label>
                <Textarea 
                  id="segment-desc" 
                  value={newSegment.description}
                  onChange={(e) => setNewSegment({...newSegment, description: e.target.value})}
                  placeholder="Brief description of this industry segment"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="segment-active" 
                  checked={newSegment.isActive}
                  onCheckedChange={(checked) => setNewSegment({...newSegment, isActive: checked})}
                />
                <Label htmlFor="segment-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSegment}>Add Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5" />
            Industry Segments
          </CardTitle>
          <CardDescription>
            View and manage industry segments used for domain group classifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search industry segments..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" className="w-full sm:w-[300px]" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {filteredSegments.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <h3 className="font-medium text-lg mb-1">No industry segments found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search term.' : 'Start by adding an industry segment.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSegments.map((segment) => (
                    <TableRow key={segment.id}>
                      <TableCell className="font-mono text-xs">
                        <Badge variant="outline">{segment.code}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{segment.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground max-w-[300px] truncate">
                        {segment.description || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={segment.isActive ? "default" : "secondary"}>
                          {segment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setCurrentSegment(segment);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant={segment.isActive ? "destructive" : "default"}
                            size="icon"
                            onClick={() => handleToggleActive(segment.id, segment.isActive)}
                          >
                            {segment.isActive ? (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span className="sr-only">Activate</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Industry Segment</DialogTitle>
            <DialogDescription>
              Update industry segment details.
            </DialogDescription>
          </DialogHeader>
          {currentSegment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-segment-name">Segment Name *</Label>
                <Input 
                  id="edit-segment-name" 
                  value={currentSegment.name}
                  onChange={(e) => setCurrentSegment({...currentSegment, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-segment-code">Segment Code *</Label>
                <Input 
                  id="edit-segment-code" 
                  value={currentSegment.code}
                  onChange={(e) => setCurrentSegment({...currentSegment, code: e.target.value})}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-segment-desc">Description</Label>
                <Textarea 
                  id="edit-segment-desc" 
                  value={currentSegment.description || ''}
                  onChange={(e) => setCurrentSegment({...currentSegment, description: e.target.value || undefined})}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-segment-active" 
                  checked={currentSegment.isActive}
                  onCheckedChange={(checked) => setCurrentSegment({...currentSegment, isActive: checked})}
                />
                <Label htmlFor="edit-segment-active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSegment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IndustrySegmentConfig;
