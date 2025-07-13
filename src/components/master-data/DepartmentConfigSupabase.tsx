import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Trash2, Plus, Download, Search, Upload, FileSpreadsheet } from 'lucide-react';
import ResponsiveDashboardWrapper from '@/components/layout/ResponsiveDashboardWrapper';
import * as XLSX from 'xlsx';

interface Department {
  id: string;
  department_name: string;
  sub_department_name: string | null;
  team_unit_name: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_user_created: boolean;
  version: number;
}

interface NewDepartment {
  department_name: string;
  sub_department_name: string;
  team_unit_name: string;
}

const DepartmentConfigSupabase = () => {
  const [formData, setFormData] = useState<NewDepartment>({
    department_name: '',
    sub_department_name: '',
    team_unit_name: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<NewDepartment>({
    department_name: '',
    sub_department_name: '',
    team_unit_name: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_departments')
        .select('*')
        .order('department_name');
      
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
          is_user_created: true,
          sub_department_name: departmentData.sub_department_name || null,
          team_unit_name: departmentData.team_unit_name || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setFormData({ department_name: '', sub_department_name: '', team_unit_name: '' });
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
        .update({ 
          ...data,
          sub_department_name: data.sub_department_name || null,
          team_unit_name: data.team_unit_name || null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setEditingId(null);
      setEditingData({ department_name: '', sub_department_name: '', team_unit_name: '' });
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
        description: 'Failed to delete department',
        variant: 'destructive',
      });
      console.error('Error deleting department:', error);
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: async (departments: NewDepartment[]) => {
      const { data, error } = await supabase
        .from('master_departments')
        .insert(departments.map(dept => ({
          ...dept,
          is_user_created: true,
          sub_department_name: dept.sub_department_name || null,
          team_unit_name: dept.team_unit_name || null
        })))
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setSelectedFile(null);
      toast({
        title: 'Success',
        description: `${data.length} departments uploaded successfully`,
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
    if (formData.department_name.trim()) {
      addMutation.mutate(formData);
    }
  };

  const handleUpdate = (id: string) => {
    if (editingData.department_name.trim()) {
      updateMutation.mutate({ id, data: editingData });
    }
  };

  const startEdit = (department: Department) => {
    setEditingId(department.id);
    setEditingData({
      department_name: department.department_name,
      sub_department_name: department.sub_department_name || '',
      team_unit_name: department.team_unit_name || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingData({ department_name: '', sub_department_name: '', team_unit_name: '' });
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
        const departments: NewDepartment[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row[0]) { // At least department name is required
            departments.push({
              department_name: row[0]?.toString().trim() || '',
              sub_department_name: row[1]?.toString().trim() || '',
              team_unit_name: row[2]?.toString().trim() || ''
            });
          }
        }

        if (departments.length > 0) {
          bulkUploadMutation.mutate(departments);
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
    const exportData = departments.map(dept => [
      dept.department_name,
      dept.sub_department_name || '',
      dept.team_unit_name || ''
    ]);
    
    const ws = XLSX.utils.aoa_to_sheet([
      ['Department Name', 'Sub Department Name', 'Team/Unit Name'],
      ...exportData
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Departments');
    XLSX.writeFile(wb, 'departments.xlsx');
  };

  const filteredDepartments = departments.filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.sub_department_name && dept.sub_department_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (dept.team_unit_name && dept.team_unit_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            <h1 className="text-3xl font-bold tracking-tight">Departments Master Data</h1>
            <p className="text-muted-foreground">
              Manage organizational departments with hierarchical structure
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
              Add New Department
            </CardTitle>
            <CardDescription>
              Add a new department with hierarchical structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="department_name">Department Name *</Label>
                  <Input
                    id="department_name"
                    type="text"
                    value={formData.department_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, department_name: e.target.value }))}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sub_department_name">Sub Department Name</Label>
                  <Input
                    id="sub_department_name"
                    type="text"
                    value={formData.sub_department_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, sub_department_name: e.target.value }))}
                    placeholder="Enter sub department name"
                  />
                </div>
                <div>
                  <Label htmlFor="team_unit_name">Team/Unit Name</Label>
                  <Input
                    id="team_unit_name"
                    type="text"
                    value={formData.team_unit_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_unit_name: e.target.value }))}
                    placeholder="Enter team/unit name"
                  />
                </div>
              </div>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? 'Adding...' : 'Add Department'}
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
              Upload department data from Excel file. Expected columns: Department Name, Sub Department Name, Team/Unit Name
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

        {/* Search and Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Departments List</CardTitle>
            <CardDescription>
              {departments.length} departments configured
            </CardDescription>
            <div className="flex items-center gap-2 mt-4">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading departments...</div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No departments found matching your search.' : 'No departments configured yet.'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Sub Department</TableHead>
                    <TableHead>Team/Unit</TableHead>
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
                          <Input
                            value={editingData.department_name}
                            onChange={(e) => setEditingData(prev => ({ ...prev, department_name: e.target.value }))}
                            autoFocus
                          />
                        ) : (
                          <span className="font-medium">{department.department_name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === department.id ? (
                          <Input
                            value={editingData.sub_department_name}
                            onChange={(e) => setEditingData(prev => ({ ...prev, sub_department_name: e.target.value }))}
                          />
                        ) : (
                          <span>{department.sub_department_name || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === department.id ? (
                          <Input
                            value={editingData.team_unit_name}
                            onChange={(e) => setEditingData(prev => ({ ...prev, team_unit_name: e.target.value }))}
                          />
                        ) : (
                          <span>{department.team_unit_name || '-'}</span>
                        )}
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