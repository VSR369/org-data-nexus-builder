import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, ChevronDown, ChevronRight, Download, Upload, RefreshCw, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import * as XLSX from 'xlsx';

interface Department {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
  organization_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SubDepartment {
  id: string;
  name: string;
  description?: string;
  department_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamUnit {
  id: string;
  name: string;
  description?: string;
  sub_department_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DepartmentHierarchy {
  department: Department;
  subDepartments: (SubDepartment & { teamUnits: TeamUnit[] })[];
}

export default function DepartmentConfigSupabase() {
  const [departmentHierarchy, setDepartmentHierarchy] = useState<DepartmentHierarchy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDirectEntry, setShowDirectEntry] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingItem, setDeletingItem] = useState<any>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());
  const [expandedSubDepartments, setExpandedSubDepartments] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    organizationId: '',
    organizationName: '',
    departmentName: '',
    departmentDescription: '',
    subDepartmentName: '',
    subDepartmentDescription: '',
    teamUnitName: '',
    teamUnitDescription: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch departments
      const { data: departments, error: deptError } = await supabase
        .from('master_departments')
        .select('*')
        .order('name');

      if (deptError) throw deptError;

      // Fetch sub departments
      const { data: subDepartments, error: subDeptError } = await supabase
        .from('master_sub_departments')
        .select('*')
        .order('name');

      if (subDeptError) throw subDeptError;

      // Fetch team units
      const { data: teamUnits, error: teamError } = await supabase
        .from('master_team_units')
        .select('*')
        .order('name');

      if (teamError) throw teamError;

      // Build hierarchy
      const hierarchy: DepartmentHierarchy[] = departments?.map(dept => ({
        department: dept,
        subDepartments: subDepartments?.filter(sub => sub.department_id === dept.id).map(sub => ({
          ...sub,
          teamUnits: teamUnits?.filter(team => team.sub_department_id === sub.id) || []
        })) || []
      })) || [];

      setDepartmentHierarchy(hierarchy);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch department data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationIdChange = async (value: string) => {
    setFormData(prev => ({ ...prev, organizationId: value }));
    
    if (value.trim()) {
      // Auto-populate organization name (placeholder logic)
      setFormData(prev => ({ ...prev, organizationName: `Organization ${value}` }));
    } else {
      setFormData(prev => ({ ...prev, organizationName: '' }));
    }
  };

  const handleDirectEntry = async () => {
    try {
      if (!formData.departmentName.trim()) {
        toast({
          title: "Error",
          description: "Department name is required",
          variant: "destructive"
        });
        return;
      }

      // Create department
      const { data: department, error: deptError } = await supabase
        .from('master_departments')
        .insert({
          name: formData.departmentName,
          description: formData.departmentDescription || null,
          organization_id: formData.organizationId || null,
          organization_name: formData.organizationName || null,
          is_user_created: true
        })
        .select()
        .single();

      if (deptError) throw deptError;

      let subDepartment = null;
      let teamUnit = null;

      // Create sub department if provided
      if (formData.subDepartmentName.trim()) {
        const { data: subDept, error: subDeptError } = await supabase
          .from('master_sub_departments')
          .insert({
            name: formData.subDepartmentName,
            description: formData.subDepartmentDescription || null,
            department_id: department.id,
            is_user_created: true
          })
          .select()
          .single();

        if (subDeptError) throw subDeptError;
        subDepartment = subDept;

        // Create team unit if provided
        if (formData.teamUnitName.trim()) {
          const { data: team, error: teamError } = await supabase
            .from('master_team_units')
            .insert({
              name: formData.teamUnitName,
              description: formData.teamUnitDescription || null,
              sub_department_id: subDepartment.id,
              is_user_created: true
            })
            .select()
            .single();

          if (teamError) throw teamError;
          teamUnit = team;
        }
      }

      toast({
        title: "Success",
        description: "Department hierarchy created successfully"
      });

      setFormData({
        organizationId: '',
        organizationName: '',
        departmentName: '',
        departmentDescription: '',
        subDepartmentName: '',
        subDepartmentDescription: '',
        teamUnitName: '',
        teamUnitDescription: ''
      });
      setShowDirectEntry(false);
      fetchData();
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast({
        title: "Error",
        description: "Failed to create department hierarchy",
        variant: "destructive"
      });
    }
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        for (const row of jsonData) {
          const department = await createDepartmentFromRow(row);
          if (department && row['Sub Department Name']) {
            const subDepartment = await createSubDepartmentFromRow(row, department.id);
            if (subDepartment && row['Team/Unit Name']) {
              await createTeamUnitFromRow(row, subDepartment.id);
            }
          }
        }

        toast({
          title: "Success",
          description: `Uploaded ${jsonData.length} department records`
        });

        fetchData();
        setShowExcelUpload(false);
      } catch (error) {
        console.error('Error uploading Excel:', error);
        toast({
          title: "Error",
          description: "Failed to upload Excel file",
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const createDepartmentFromRow = async (row: any) => {
    if (!row['Department Name']) return null;

    const { data, error } = await supabase
      .from('master_departments')
      .upsert({
        name: row['Department Name'],
        description: row['Department Description'] || null,
        organization_id: row['Organization ID'] || null,
        organization_name: row['Organization Name'] || null,
        is_user_created: true
      }, { onConflict: 'name' })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createSubDepartmentFromRow = async (row: any, departmentId: string) => {
    if (!row['Sub Department Name']) return null;

    const { data, error } = await supabase
      .from('master_sub_departments')
      .insert({
        name: row['Sub Department Name'],
        description: row['Sub Department Description'] || null,
        department_id: departmentId,
        is_user_created: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createTeamUnitFromRow = async (row: any, subDepartmentId: string) => {
    if (!row['Team/Unit Name']) return null;

    const { data, error } = await supabase
      .from('master_team_units')
      .insert({
        name: row['Team/Unit Name'],
        description: row['Team/Unit Description'] || null,
        sub_department_id: subDepartmentId,
        is_user_created: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const exportData = async () => {
    try {
      const exportData = [];
      
      for (const hierarchy of departmentHierarchy) {
        for (const subDept of hierarchy.subDepartments) {
          for (const teamUnit of subDept.teamUnits) {
            exportData.push({
              'Organization ID': hierarchy.department.organization_id || '',
              'Organization Name': hierarchy.department.organization_name || '',
              'Department Name': hierarchy.department.name,
              'Department Description': hierarchy.department.description || '',
              'Sub Department Name': subDept.name,
              'Sub Department Description': subDept.description || '',
              'Team/Unit Name': teamUnit.name,
              'Team/Unit Description': teamUnit.description || ''
            });
          }
        }
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Departments');
      XLSX.writeFile(wb, 'departments.xlsx');

      toast({
        title: "Success",
        description: "Department data exported successfully"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const table = editingItem.type === 'department' ? 'master_departments' :
                   editingItem.type === 'subdepartment' ? 'master_sub_departments' : 'master_team_units';

      const { error } = await supabase
        .from(table)
        .update({
          name: editingItem.name,
          description: editingItem.description
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully"
      });

      setEditDialog(false);
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      const table = deletingItem.type === 'department' ? 'master_departments' :
                   deletingItem.type === 'subdepartment' ? 'master_sub_departments' : 'master_team_units';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', deletingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully"
      });

      setDeleteDialog(false);
      setDeletingItem(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

  const toggleDepartmentExpansion = (deptId: string) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepartments(newExpanded);
  };

  const toggleSubDepartmentExpansion = (subDeptId: string) => {
    const newExpanded = new Set(expandedSubDepartments);
    if (newExpanded.has(subDeptId)) {
      newExpanded.delete(subDeptId);
    } else {
      newExpanded.add(subDeptId);
    }
    setExpandedSubDepartments(newExpanded);
  };

  const filteredHierarchy = departmentHierarchy.filter(hierarchy =>
    hierarchy.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hierarchy.subDepartments.some(sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.teamUnits.some(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading departments...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Department Master Data</span>
            <div className="flex gap-2">
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={() => setShowDirectEntry(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Direct Entry
            </Button>
            <Button variant="outline" onClick={() => setShowExcelUpload(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Excel Upload
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>Total Departments: {departmentHierarchy.length}</div>
              <div>Total Sub Departments: {departmentHierarchy.reduce((acc, h) => acc + h.subDepartments.length, 0)}</div>
              <div>Total Team/Units: {departmentHierarchy.reduce((acc, h) => acc + h.subDepartments.reduce((subAcc, sub) => subAcc + sub.teamUnits.length, 0), 0)}</div>
            </div>

            {filteredHierarchy.map((hierarchy) => (
              <Card key={hierarchy.department.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDepartmentExpansion(hierarchy.department.id)}
                      >
                        {expandedDepartments.has(hierarchy.department.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      <div>
                        <h3 className="font-semibold">{hierarchy.department.name}</h3>
                        {hierarchy.department.description && (
                          <p className="text-sm text-muted-foreground">{hierarchy.department.description}</p>
                        )}
                        {hierarchy.department.organization_name && (
                          <Badge variant="secondary" className="mt-1">
                            {hierarchy.department.organization_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(hierarchy.department, 'department')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingItem({ ...hierarchy.department, type: 'department' });
                          setDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {expandedDepartments.has(hierarchy.department.id) && (
                    <div className="ml-6 mt-4 space-y-3">
                      {hierarchy.subDepartments.map((subDept) => (
                        <Card key={subDept.id} className="border-l-4 border-l-secondary">
                          <CardContent className="pt-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSubDepartmentExpansion(subDept.id)}
                                >
                                  {expandedSubDepartments.has(subDept.id) ? 
                                    <ChevronDown className="h-4 w-4" /> : 
                                    <ChevronRight className="h-4 w-4" />
                                  }
                                </Button>
                                <div>
                                  <h4 className="font-medium">{subDept.name}</h4>
                                  {subDept.description && (
                                    <p className="text-sm text-muted-foreground">{subDept.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(subDept, 'subdepartment')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDeletingItem({ ...subDept, type: 'subdepartment' });
                                    setDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {expandedSubDepartments.has(subDept.id) && (
                              <div className="ml-6 mt-3 space-y-2">
                                {subDept.teamUnits.map((teamUnit) => (
                                  <Card key={teamUnit.id} className="border-l-4 border-l-accent">
                                    <CardContent className="pt-2">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h5 className="font-medium">{teamUnit.name}</h5>
                                          {teamUnit.description && (
                                            <p className="text-sm text-muted-foreground">{teamUnit.description}</p>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(teamUnit, 'teamunit')}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              setDeletingItem({ ...teamUnit, type: 'teamunit' });
                                              setDeleteDialog(true);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Direct Entry Dialog */}
      <Dialog open={showDirectEntry} onOpenChange={setShowDirectEntry}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Department Hierarchy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgId">Organization ID (Optional)</Label>
                <Input
                  id="orgId"
                  value={formData.organizationId}
                  onChange={(e) => handleOrganizationIdChange(e.target.value)}
                  placeholder="Enter organization ID"
                />
              </div>
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={formData.organizationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                  placeholder="Auto-populated"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deptName">Department Name *</Label>
                <Input
                  id="deptName"
                  value={formData.departmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, departmentName: e.target.value }))}
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="deptDesc">Department Description</Label>
                <Textarea
                  id="deptDesc"
                  value={formData.departmentDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, departmentDescription: e.target.value }))}
                  placeholder="Enter department description"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subDeptName">Sub Department Name</Label>
                <Input
                  id="subDeptName"
                  value={formData.subDepartmentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, subDepartmentName: e.target.value }))}
                  placeholder="Enter sub department name"
                />
              </div>
              <div>
                <Label htmlFor="subDeptDesc">Sub Department Description</Label>
                <Textarea
                  id="subDeptDesc"
                  value={formData.subDepartmentDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, subDepartmentDescription: e.target.value }))}
                  placeholder="Enter sub department description"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamName">Team/Unit Name</Label>
                <Input
                  id="teamName"
                  value={formData.teamUnitName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamUnitName: e.target.value }))}
                  placeholder="Enter team/unit name"
                />
              </div>
              <div>
                <Label htmlFor="teamDesc">Team/Unit Description</Label>
                <Textarea
                  id="teamDesc"
                  value={formData.teamUnitDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamUnitDescription: e.target.value }))}
                  placeholder="Enter team/unit description"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDirectEntry(false)}>
                Cancel
              </Button>
              <Button onClick={handleDirectEntry}>
                Create Hierarchy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Excel Upload Dialog */}
      <Dialog open={showExcelUpload} onOpenChange={setShowExcelUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Excel File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload an Excel file with columns: Organization ID, Organization Name, Department Name, Department Description, 
              Sub Department Name, Sub Department Description, Team/Unit Name, Team/Unit Description
            </p>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingItem?.type}</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editDesc">Description</Label>
                <Textarea
                  id="editDesc"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {deletingItem?.type} 
              and all its related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}