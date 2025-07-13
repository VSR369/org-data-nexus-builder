import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Trash2, Plus, Download, Search, Upload, FileSpreadsheet, ChevronRight, Building, Users, User } from 'lucide-react';
import ResponsiveDashboardWrapper from '@/components/layout/ResponsiveDashboardWrapper';
import * as XLSX from 'xlsx';

interface Department {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  hierarchy_path: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_user_created: boolean;
  version: number;
}

interface NewDepartment {
  name: string;
  parent_id: string | null;
}

const DepartmentConfigSupabase = () => {
  const [formData, setFormData] = useState<NewDepartment>({
    name: '',
    parent_id: null
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<NewDepartment>({
    name: '',
    parent_id: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_departments')
        .select('*')
        .order('hierarchy_path');
      
      if (error) throw error;
      return data as Department[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (departmentData: NewDepartment) => {
      const { data, error } = await supabase
        .from('master_departments')
        .insert([{ 
          ...departmentData, 
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setFormData({ name: '', parent_id: null });
      toast({
        title: 'Success',
        description: 'Department added successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add department',
        variant: 'destructive',
      });
      console.error('Error adding department:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NewDepartment }) => {
      const { data: result, error } = await supabase
        .from('master_departments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setEditingId(null);
      setEditingData({ name: '', parent_id: null });
      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update department',
        variant: 'destructive',
      });
      console.error('Error updating department:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if department has children
      const { data: children } = await supabase
        .from('master_departments')
        .select('id')
        .eq('parent_id', id);
      
      if (children && children.length > 0) {
        throw new Error('Cannot delete department with sub-departments or teams. Please delete child items first.');
      }

      const { error } = await supabase
        .from('master_departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department',
        variant: 'destructive',
      });
      console.error('Error deleting department:', error);
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: async (departmentRows: { department: string; subDepartment?: string; teamUnit?: string }[]) => {
      const departmentMap = new Map<string, string>();
      const subDepartmentMap = new Map<string, string>();
      const insertData: NewDepartment[] = [];

      // Process departments first
      for (const row of departmentRows) {
        if (row.department && !departmentMap.has(row.department)) {
          insertData.push({
            name: row.department,
            parent_id: null
          });
        }
      }

      // Insert departments first
      if (insertData.length > 0) {
        const { data: insertedDepts, error } = await supabase
          .from('master_departments')
          .insert(insertData.map(dept => ({ ...dept, is_user_created: true })))
          .select();
        
        if (error) throw error;
        
        // Map department names to IDs
        insertedDepts?.forEach((dept) => {
          departmentMap.set(dept.name, dept.id);
        });
      }

      // Process sub-departments
      const subDeptInserts: NewDepartment[] = [];
      for (const row of departmentRows) {
        if (row.subDepartment) {
          const key = `${row.department}>${row.subDepartment}`;
          if (!subDepartmentMap.has(key)) {
            const parentId = departmentMap.get(row.department);
            if (parentId) {
              subDeptInserts.push({
                name: row.subDepartment,
                parent_id: parentId
              });
              subDepartmentMap.set(key, 'pending');
            }
          }
        }
      }

      // Insert sub-departments
      if (subDeptInserts.length > 0) {
        const { data: insertedSubDepts, error } = await supabase
          .from('master_departments')
          .insert(subDeptInserts.map(dept => ({ ...dept, is_user_created: true })))
          .select();
        
        if (error) throw error;
        
        // Map sub-department names to IDs
        insertedSubDepts?.forEach((dept) => {
          const key = `${departments.find(d => d.id === dept.parent_id)?.name}>${dept.name}`;
          subDepartmentMap.set(key, dept.id);
        });
      }

      // Process teams/units
      const teamInserts: NewDepartment[] = [];
      for (const row of departmentRows) {
        if (row.teamUnit) {
          const subDeptKey = `${row.department}>${row.subDepartment}`;
          const parentId = subDepartmentMap.get(subDeptKey);
          if (parentId && parentId !== 'pending') {
            teamInserts.push({
              name: row.teamUnit,
              parent_id: parentId
            });
          }
        }
      }

      // Insert teams/units
      if (teamInserts.length > 0) {
        const { data, error } = await supabase
          .from('master_departments')
          .insert(teamInserts.map(dept => ({ ...dept, is_user_created: true })))
          .select();
        
        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setSelectedFile(null);
      toast({
        title: 'Success',
        description: 'Departments uploaded successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to upload departments',
        variant: 'destructive',
      });
      console.error('Error uploading departments:', error);
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      addMutation.mutate(formData);
    }
  };

  const handleUpdate = (id: string) => {
    if (editingData.name.trim()) {
      updateMutation.mutate({ id, data: editingData });
    }
  };

  const startEdit = (department: Department) => {
    setEditingId(department.id);
    setEditingData({
      name: department.name,
      parent_id: department.parent_id
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({ name: '', parent_id: null });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processExcelFile = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const departmentRows: { department: string; subDepartment?: string; teamUnit?: string }[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row[0]) {
            departmentRows.push({
              department: row[0]?.toString().trim() || '',
              subDepartment: row[1]?.toString().trim() || undefined,
              teamUnit: row[2]?.toString().trim() || undefined
            });
          }
        }

        if (departmentRows.length > 0) {
          bulkUploadMutation.mutate(departmentRows);
        } else {
          toast({
            title: 'Error',
            description: 'No valid department data found in the Excel file',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process Excel file',
          variant: 'destructive',
        });
        console.error('Error processing Excel file:', error);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleExport = () => {
    const exportData = departments.map(dept => {
      const parts = dept.hierarchy_path?.split(' > ') || [dept.name];
      return [
        parts[0] || '',           // Department
        parts[1] || '',           // Sub Department
        parts[2] || ''            // Team/Unit
      ];
    });
    
    const ws = XLSX.utils.aoa_to_sheet([
      ['Department Name', 'Sub Department Name', 'Team/Unit Name'],
      ...exportData
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Departments');
    XLSX.writeFile(wb, 'departments_hierarchy.xlsx');
  };

  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dept.hierarchy_path && dept.hierarchy_path.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || dept.level.toString() === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const getAvailableParents = (excludeId?: string) => {
    return departments.filter(dept => {
      // Can't be its own parent
      if (excludeId && dept.id === excludeId) return false;
      // Only departments and sub-departments can be parents (levels 1 and 2)
      return dept.level < 3;
    });
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Building className="h-4 w-4" />;
      case 2: return <Users className="h-4 w-4" />;
      case 3: return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Department';
      case 2: return 'Sub-Department';
      case 3: return 'Team/Unit';
      default: return 'Unknown';
    }
  };

  if (error) {
    return (
      <ResponsiveDashboardWrapper>
        <div className="text-center py-8">
          <p className="text-destructive">Error loading departments</p>
        </div>
      </ResponsiveDashboardWrapper>
    );
  }

  return (
    <ResponsiveDashboardWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments Hierarchy</h1>
            <p className="text-muted-foreground">
              Manage organizational structure: Department → Sub-Department → Team/Unit
            </p>
          </div>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>

        {/* Add Department Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Item
            </CardTitle>
            <CardDescription>
              Add a department, sub-department, or team/unit to the hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="parent_id">Parent (optional - leave empty for top-level department)</Label>
                  <Select 
                    value={formData.parent_id || 'none'} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value === 'none' ? null : value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Top-level Department)</SelectItem>
                      {getAvailableParents().map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.hierarchy_path || dept.name} ({getLevelText(dept.level)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Excel Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Excel Upload
            </CardTitle>
            <CardDescription>
              Upload hierarchical department data. Columns: Department Name, Sub Department Name, Team/Unit Name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button 
                onClick={processExcelFile} 
                disabled={!selectedFile || bulkUploadMutation.isPending}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {bulkUploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Department Hierarchy</CardTitle>
            <CardDescription>
              {departments.length} items configured
            </CardDescription>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Departments Only</SelectItem>
                  <SelectItem value="2">Sub-Departments Only</SelectItem>
                  <SelectItem value="3">Teams/Units Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading departments...</div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || selectedLevel !== 'all' ? 'No departments found matching your criteria.' : 'No departments configured yet.'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name & Hierarchy</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Full Path</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        {editingId === department.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingData.name}
                              onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                              autoFocus
                            />
                            <Select 
                              value={editingData.parent_id || 'none'} 
                              onValueChange={(value) => setEditingData(prev => ({ ...prev, parent_id: value === 'none' ? null : value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Parent</SelectItem>
                                {getAvailableParents(department.id).map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.hierarchy_path || dept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {getLevelIcon(department.level)}
                            <span className="font-medium">{department.name}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={department.level === 1 ? "default" : department.level === 2 ? "secondary" : "outline"}>
                          {getLevelText(department.level)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {department.hierarchy_path || department.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(department.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={department.is_user_created ? "secondary" : "default"}>
                          {department.is_user_created ? "User Created" : "System"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === department.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(department.id)}
                                disabled={updateMutation.isPending}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(department)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate(department.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ResponsiveDashboardWrapper>
  );
};

export default DepartmentConfigSupabase;