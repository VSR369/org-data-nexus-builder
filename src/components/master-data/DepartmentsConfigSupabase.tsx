
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, ChevronDown, ChevronRight, Download, Upload, RefreshCw, Search, Plus, Building, Users, User, Globe, FolderTree, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

interface OrganizationHierarchy {
  organizationId: string;
  organizationName: string;
  departments: DepartmentHierarchy[];
}

export default function DepartmentsConfigSupabase() {
  const [organizationHierarchy, setOrganizationHierarchy] = useState<OrganizationHierarchy[]>([]);
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
  const [expandedOrganizations, setExpandedOrganizations] = useState<Set<string>>(new Set());

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
        .order('organization_name', { nullsFirst: false });

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
      const departmentHierarchy: DepartmentHierarchy[] = departments?.map(dept => ({
        department: dept,
        subDepartments: subDepartments?.filter(sub => sub.department_id === dept.id).map(sub => ({
          ...sub,
          teamUnits: teamUnits?.filter(team => team.sub_department_id === sub.id) || []
        })) || []
      })) || [];

      // Group by organization
      const organizationMap = new Map<string, OrganizationHierarchy>();
      
      departmentHierarchy.forEach(deptHierarchy => {
        const orgKey = deptHierarchy.department.organization_id || 'no-org';
        const orgName = deptHierarchy.department.organization_name || 'Unknown Organization';
        
        if (!organizationMap.has(orgKey)) {
          organizationMap.set(orgKey, {
            organizationId: deptHierarchy.department.organization_id || '',
            organizationName: orgName,
            departments: []
          });
        }
        
        organizationMap.get(orgKey)!.departments.push(deptHierarchy);
      });

      const orgHierarchyArray = Array.from(organizationMap.values());
      setOrganizationHierarchy(orgHierarchyArray);

      // Auto-expand all departments and sub-departments for better visibility
      const allDepartmentIds = new Set<string>();
      const allSubDepartmentIds = new Set<string>();
      const allOrganizationIds = new Set<string>();

      orgHierarchyArray.forEach(org => {
        allOrganizationIds.add(org.organizationId || 'no-org');
        org.departments.forEach(dept => {
          allDepartmentIds.add(dept.department.id);
          dept.subDepartments.forEach(sub => {
            allSubDepartmentIds.add(sub.id);
          });
        });
      });

      setExpandedOrganizations(allOrganizationIds);
      setExpandedDepartments(allDepartmentIds);
      setExpandedSubDepartments(allSubDepartmentIds);

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
      // Try to find existing organization name from departments
      const existingOrg = organizationHierarchy.find(org => 
        org.organizationId === value || org.organizationId === value.toUpperCase()
      );
      
      if (existingOrg) {
        setFormData(prev => ({ ...prev, organizationName: existingOrg.organizationName }));
      } else {
        setFormData(prev => ({ ...prev, organizationName: `Organization ${value}` }));
      }
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

    console.log('Starting Excel upload:', file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        console.log('File read successfully');
        
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data parsed:', jsonData);

        if (jsonData.length === 0) {
          toast({
            title: "Error",
            description: "No data found in the Excel file",
            variant: "destructive"
          });
          return;
        }

        let createdCount = 0;
        let skippedCount = 0;

        for (const row of jsonData) {
          console.log('Processing row:', row);
          
          try {
            const department = await createDepartmentFromRow(row);
            if (department) {
              console.log('Department created/found:', department.name);
              createdCount++;

              if (row['Sub Department Name']) {
                const subDepartment = await createSubDepartmentFromRow(row, department.id);
                if (subDepartment) {
                  console.log('Sub-department created/found:', subDepartment.name);

                  if (row['Team/Unit Name']) {
                    const teamUnit = await createTeamUnitFromRow(row, subDepartment.id);
                    if (teamUnit) {
                      console.log('Team unit created/found:', teamUnit.name);
                    }
                  }
                }
              }
            } else {
              skippedCount++;
            }
          } catch (rowError) {
            console.error('Error processing row:', row, rowError);
            skippedCount++;
          }
        }

        toast({
          title: "Success",
          description: `Processed ${jsonData.length} rows. Created/Updated: ${createdCount}, Skipped: ${skippedCount}`
        });

        await fetchData(); // Refresh the data
        setShowExcelUpload(false);
      } catch (error) {
        console.error('Error uploading Excel:', error);
        toast({
          title: "Error",
          description: `Failed to upload Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const createDepartmentFromRow = async (row: any) => {
    if (!row['Department Name']) return null;

    const orgId = row['Organization ID'] || null;
    
    // Check if department already exists for this organization
    const { data: existingDept, error: queryError } = await supabase
      .from('master_departments')
      .select('*')
      .eq('name', row['Department Name'])
      .eq('organization_id', orgId)
      .limit(1);

    if (queryError) {
      console.error('Error checking existing department:', queryError);
      throw queryError;
    }

    if (existingDept && existingDept.length > 0) {
      return existingDept[0];
    }

    // Create new department
    const { data, error } = await supabase
      .from('master_departments')
      .insert({
        name: row['Department Name'],
        description: row['Department Description'] || null,
        organization_id: orgId,
        organization_name: row['Organization Name'] || null,
        is_user_created: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating department:', error);
      throw error;
    }
    return data;
  };

  const createSubDepartmentFromRow = async (row: any, departmentId: string) => {
    if (!row['Sub Department Name']) return null;

    // Check if sub department already exists for this department
    const { data: existingSubDept, error: queryError } = await supabase
      .from('master_sub_departments')
      .select('*')
      .eq('name', row['Sub Department Name'])
      .eq('department_id', departmentId)
      .limit(1);

    if (queryError) {
      console.error('Error checking existing sub department:', queryError);
      throw queryError;
    }

    if (existingSubDept && existingSubDept.length > 0) {
      return existingSubDept[0];
    }

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

    if (error) {
      console.error('Error creating sub department:', error);
      throw error;
    }
    return data;
  };

  const createTeamUnitFromRow = async (row: any, subDepartmentId: string) => {
    if (!row['Team/Unit Name']) return null;

    // Check if team unit already exists for this sub department
    const { data: existingTeam, error: queryError } = await supabase
      .from('master_team_units')
      .select('*')
      .eq('name', row['Team/Unit Name'])
      .eq('sub_department_id', subDepartmentId)
      .limit(1);

    if (queryError) {
      console.error('Error checking existing team unit:', queryError);
      throw queryError;
    }

    if (existingTeam && existingTeam.length > 0) {
      return existingTeam[0];
    }

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

    if (error) {
      console.error('Error creating team unit:', error);
      throw error;
    }
    return data;
  };

  const exportData = async () => {
    try {
      const exportData = [];
      
      for (const orgHierarchy of organizationHierarchy) {
        for (const deptHierarchy of orgHierarchy.departments) {
          for (const subDept of deptHierarchy.subDepartments) {
            for (const teamUnit of subDept.teamUnits) {
              exportData.push({
                'Organization ID': orgHierarchy.organizationId,
                'Organization Name': orgHierarchy.organizationName,
                'Department Name': deptHierarchy.department.name,
                'Department Description': deptHierarchy.department.description || '',
                'Sub Department Name': subDept.name,
                'Sub Department Description': subDept.description || '',
                'Team/Unit Name': teamUnit.name,
                'Team/Unit Description': teamUnit.description || ''
              });
            }
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

  const toggleOrganizationExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrganizations);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrganizations(newExpanded);
  };

  const toggleExpandAll = () => {
    const allDepartmentIds = new Set<string>();
    const allSubDepartmentIds = new Set<string>();
    const allOrganizationIds = new Set<string>();

    organizationHierarchy.forEach(org => {
      allOrganizationIds.add(org.organizationId || 'no-org');
      org.departments.forEach(dept => {
        allDepartmentIds.add(dept.department.id);
        dept.subDepartments.forEach(sub => {
          allSubDepartmentIds.add(sub.id);
        });
      });
    });

    const areAllExpanded = expandedDepartments.size === allDepartmentIds.size &&
                          expandedSubDepartments.size === allSubDepartmentIds.size &&
                          expandedOrganizations.size === allOrganizationIds.size;

    if (areAllExpanded) {
      // Collapse all
      setExpandedOrganizations(new Set());
      setExpandedDepartments(new Set());
      setExpandedSubDepartments(new Set());
    } else {
      // Expand all
      setExpandedOrganizations(allOrganizationIds);
      setExpandedDepartments(allDepartmentIds);
      setExpandedSubDepartments(allSubDepartmentIds);
    }
  };

  const filteredHierarchy = organizationHierarchy.map(orgHierarchy => ({
    ...orgHierarchy,
    departments: orgHierarchy.departments.filter(deptHierarchy =>
      deptHierarchy.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deptHierarchy.subDepartments.some(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.teamUnits.some(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
  })).filter(orgHierarchy => orgHierarchy.departments.length > 0 || searchTerm === '');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">Loading Department Hierarchy...</p>
          <p className="text-sm text-muted-foreground">Fetching departments, sub-departments, and team units from Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Department Master Data</span>
            <div className="flex gap-2">
              <Button onClick={toggleExpandAll} variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                {expandedDepartments.size > 0 ? 'Collapse All' : 'Expand All'}
              </Button>
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
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Organizations</div>
                    <div className="text-2xl font-bold text-blue-600">{organizationHierarchy.length}</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">Departments</div>
                    <div className="text-2xl font-bold text-green-600">
                      {organizationHierarchy.reduce((acc, org) => acc + org.departments.length, 0)}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="font-medium">Sub Departments</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {organizationHierarchy.reduce((acc, org) => 
                        acc + org.departments.reduce((subAcc, dept) => subAcc + dept.subDepartments.length, 0), 0)}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Team/Units</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {organizationHierarchy.reduce((acc, org) => 
                        acc + org.departments.reduce((deptAcc, dept) => 
                          deptAcc + dept.subDepartments.reduce((subAcc, sub) => subAcc + sub.teamUnits.length, 0), 0), 0)}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Hierarchy Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="w-5 h-5" />
                  Department Hierarchies by Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredHierarchy.length === 0 && organizationHierarchy.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Department Data Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by creating your first department hierarchy</p>
                    <Button onClick={() => setShowDirectEntry(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </div>
                ) : filteredHierarchy.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Matching Results</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {filteredHierarchy.map((orgHierarchy) => (
                    <div key={orgHierarchy.organizationId || 'no-org'} className="border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <Collapsible 
                        open={expandedOrganizations.has(orgHierarchy.organizationId || 'no-org')}
                        onOpenChange={() => toggleOrganizationExpansion(orgHierarchy.organizationId || 'no-org')}
                      >
                        <CollapsibleTrigger className="w-full p-4 text-left hover:bg-blue-100/50 rounded-t-lg">
                          {/* Organization Header */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Globe className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-blue-900">
                                {orgHierarchy.organizationId ? `[${orgHierarchy.organizationId}] ` : ''}
                                {orgHierarchy.organizationName}
                              </h3>
                              <p className="text-sm text-blue-700">
                                {orgHierarchy.departments.length} Departments • {' '}
                                {orgHierarchy.departments.reduce((sum, dept) => sum + dept.subDepartments.length, 0)} Sub-Departments • {' '}
                                {orgHierarchy.departments.reduce((sum, dept) => 
                                  sum + dept.subDepartments.reduce((subSum, sub) => subSum + sub.teamUnits.length, 0), 0)} Team/Units
                              </p>
                            </div>
                            <div className="ml-auto">
                              {expandedOrganizations.has(orgHierarchy.organizationId || 'no-org') ? (
                                <ChevronDown className="w-5 h-5 text-blue-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-4 pb-4">
                          {/* Departments */}
                      <div className="space-y-3">
                        {orgHierarchy.departments.map((deptHierarchy) => (
                          <div key={deptHierarchy.department.id} className="bg-white border rounded-lg">
                            <Collapsible 
                              open={expandedDepartments.has(deptHierarchy.department.id)}
                              onOpenChange={() => toggleDepartmentExpansion(deptHierarchy.department.id)}
                            >
                              <CollapsibleTrigger className="w-full p-4 text-left hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <Building className="w-5 h-5 text-primary" />
                                    <div>
                                      <h4 className="font-medium">
                                        <span className="text-primary font-semibold">Dept:</span> {deptHierarchy.department.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {deptHierarchy.subDepartments.length} sub-departments
                                        {deptHierarchy.department.description && ` • ${deptHierarchy.department.description}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(deptHierarchy.department, 'department');
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingItem({ ...deptHierarchy.department, type: 'department' });
                                        setDeleteDialog(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    {expandedDepartments.has(deptHierarchy.department.id) ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent className="px-4 pb-4">
                                <div className="space-y-2 ml-8">
                                  {deptHierarchy.subDepartments.map((subDept) => (
                                    <div key={subDept.id} className="border-l-2 border-primary/20 pl-4">
                                      <Collapsible
                                        open={expandedSubDepartments.has(subDept.id)}
                                        onOpenChange={() => toggleSubDepartmentExpansion(subDept.id)}
                                      >
                                        <CollapsibleTrigger className="w-full text-left p-2 hover:bg-gray-50 rounded">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Users className="w-4 h-4 text-primary" />
                                              <div>
                                                <span className="font-medium text-sm">
                                                  <span className="text-orange-600 font-semibold">Sub Dept:</span> {subDept.name}
                                                </span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                  {subDept.teamUnits.length} team/units
                                                </Badge>
                                                {subDept.description && (
                                                  <div className="text-xs text-muted-foreground mt-1">{subDept.description}</div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEdit(subDept, 'subdepartment');
                                                }}
                                              >
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeletingItem({ ...subDept, type: 'subdepartment' });
                                                  setDeleteDialog(true);
                                                }}
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </Button>
                                              {expandedSubDepartments.has(subDept.id) ? (
                                                <ChevronDown className="w-3 h-3" />
                                              ) : (
                                                <ChevronRight className="w-3 h-3" />
                                              )}
                                            </div>
                                          </div>
                                        </CollapsibleTrigger>
                                        
                                        <CollapsibleContent className="mt-2">
                                          <div className="space-y-1 ml-6">
                                            {subDept.teamUnits.map((teamUnit, index) => (
                                              <div key={teamUnit.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                                                <div className="flex items-start gap-2">
                                                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium shrink-0">
                                                    {index + 1}
                                                  </span>
                                                  <div>
                                                    <div className="font-medium">
                                                      <span className="text-purple-600 font-semibold">Team/Unit:</span> {teamUnit.name}
                                                    </div>
                                                    {teamUnit.description && (
                                                      <div className="text-xs text-muted-foreground mt-1">
                                                        {teamUnit.description}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <div className="flex gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(teamUnit, 'teamunit')}
                                                  >
                                                    <Edit className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      setDeletingItem({ ...teamUnit, type: 'teamunit' });
                                                      setDeleteDialog(true);
                                                    }}
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                         ))}
                       </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                   ))}
                 </div>
                )}
              </CardContent>
            </Card>
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
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
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
