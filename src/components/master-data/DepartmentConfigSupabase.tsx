import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Trash2, Plus, Download, Search, Upload, FileSpreadsheet, ChevronDown, ChevronRight, Building, Users, User } from 'lucide-react';
import ResponsiveDashboardWrapper from '@/components/layout/ResponsiveDashboardWrapper';
import * as XLSX from 'xlsx';

interface TeamUnit {
  id: string;
  name: string;
}

interface SubDepartment {
  id: string;
  name: string;
  teams: TeamUnit[];
}

interface Department {
  id: string;
  name: string;
  subDepartments: SubDepartment[];
}

interface DepartmentHierarchy {
  categories: Department[];
}

interface DepartmentConfig {
  id: string;
  name: string;
  organization_id: string | null;
  hierarchy: DepartmentHierarchy;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_user_created: boolean;
  version: number;
}

interface OrganizationInfo {
  id: string;
  name: string;
}

const DepartmentConfigSupabase = () => {
  const [selectedConfig, setSelectedConfig] = useState<DepartmentConfig | null>(null);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigOrgId, setNewConfigOrgId] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [newConfigDescription, setNewConfigDescription] = useState('');
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [editingConfigData, setEditingConfigData] = useState({ name: '', organization_id: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; value: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: departmentConfigs = [], isLoading, error } = useQuery({
    queryKey: ['departmentConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        hierarchy: (item.hierarchy as any) || { categories: [] }
      })) as DepartmentConfig[];
    },
  });

  // Auto-populate organization name when ID is entered
  useEffect(() => {
    const fetchOrganizationName = async () => {
      if (newConfigOrgId.trim()) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('organization_name')
            .eq('organization_id', newConfigOrgId.trim())
            .limit(1)
            .maybeSingle();
          
          if (data && !error) {
            setOrganizationName(data.organization_name);
          } else {
            setOrganizationName('');
          }
        } catch (error) {
          setOrganizationName('');
        }
      } else {
        setOrganizationName('');
      }
    };

    fetchOrganizationName();
  }, [newConfigOrgId]);

  const addConfigMutation = useMutation({
    mutationFn: async (configData: { name: string; organization_id?: string; description?: string }) => {
      const { data, error } = await supabase
        .from('master_departments')
        .insert([{ 
          ...configData,
          organization_id: configData.organization_id || null,
          hierarchy: { categories: [] },
          is_user_created: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, hierarchy: (data.hierarchy as any) || { categories: [] } } as DepartmentConfig;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departmentConfigs'] });
      setNewConfigName('');
      setNewConfigOrgId('');
      setNewConfigDescription('');
      setOrganizationName('');
      setSelectedConfig(data);
      toast({
        title: 'Success',
        description: 'Department configuration created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create department configuration',
        variant: 'destructive',
      });
      console.error('Error creating config:', error);
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from('master_departments')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { ...result, hierarchy: (result.hierarchy as any) || { categories: [] } } as DepartmentConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentConfigs'] });
      setEditingConfigId(null);
      toast({
        title: 'Success',
        description: 'Configuration updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update configuration',
        variant: 'destructive',
      });
      console.error('Error updating config:', error);
    },
  });

  const deleteConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('master_departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentConfigs'] });
      setSelectedConfig(null);
      toast({
        title: 'Success',
        description: 'Configuration deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete configuration',
        variant: 'destructive',
      });
      console.error('Error deleting config:', error);
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: async (hierarchyData: { department: string; subDepartment?: string; teamUnit?: string }[]) => {
      if (!selectedConfig) throw new Error('No configuration selected');

      const departmentMap = new Map<string, Department>();
      const newHierarchy: DepartmentHierarchy = { categories: [] };

      // Process the Excel data to create hierarchy
      hierarchyData.forEach(row => {
        if (!row.department) return;

        // Get or create department
        let department = departmentMap.get(row.department);
        if (!department) {
          department = {
            id: crypto.randomUUID(),
            name: row.department,
            subDepartments: []
          };
          departmentMap.set(row.department, department);
          newHierarchy.categories.push(department);
        }

        if (row.subDepartment) {
          // Find or create sub-department
          let subDept = department.subDepartments.find(s => s.name === row.subDepartment);
          if (!subDept) {
            subDept = {
              id: crypto.randomUUID(),
              name: row.subDepartment,
              teams: []
            };
            department.subDepartments.push(subDept);
          }

          if (row.teamUnit) {
            // Add team/unit if it doesn't exist
            const existingTeam = subDept.teams.find(t => t.name === row.teamUnit);
            if (!existingTeam) {
              subDept.teams.push({
                id: crypto.randomUUID(),
                name: row.teamUnit
              });
            }
          }
        }
      });

      // Update the configuration with new hierarchy
      const { data, error } = await supabase
        .from('master_departments')
        .update({ hierarchy: newHierarchy as any })
        .eq('id', selectedConfig.id)
        .select()
        .single();
      
      if (error) throw error;
      return { ...data, hierarchy: (data.hierarchy as any) || { categories: [] } } as DepartmentConfig;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departmentConfigs'] });
      setSelectedConfig(data);
      setSelectedFile(null);
      toast({
        title: 'Success',
        description: 'Department hierarchy uploaded successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to upload hierarchy',
        variant: 'destructive',
      });
      console.error('Error uploading hierarchy:', error);
    },
  });

  const handleAddConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (newConfigName.trim()) {
      addConfigMutation.mutate({
        name: newConfigName.trim(),
        organization_id: newConfigOrgId.trim() || undefined,
        description: newConfigDescription.trim() || undefined
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processExcelFile = () => {
    if (!selectedFile || !selectedConfig) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const hierarchyData: { department: string; subDepartment?: string; teamUnit?: string }[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row[0]) {
            hierarchyData.push({
              department: row[0]?.toString().trim() || '',
              subDepartment: row[1]?.toString().trim() || undefined,
              teamUnit: row[2]?.toString().trim() || undefined
            });
          }
        }

        if (hierarchyData.length > 0) {
          bulkUploadMutation.mutate(hierarchyData);
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
    if (!selectedConfig) return;

    const exportData: string[][] = [];
    
    selectedConfig.hierarchy.categories.forEach(dept => {
      if (dept.subDepartments.length === 0) {
        exportData.push([dept.name, '', '']);
      } else {
        dept.subDepartments.forEach(subDept => {
          if (subDept.teams.length === 0) {
            exportData.push([dept.name, subDept.name, '']);
          } else {
            subDept.teams.forEach(team => {
              exportData.push([dept.name, subDept.name, team.name]);
            });
          }
        });
      }
    });
    
    const ws = XLSX.utils.aoa_to_sheet([
      ['Department Name', 'Sub Department Name', 'Team/Unit Name'],
      ...exportData
    ]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Departments');
    XLSX.writeFile(wb, `departments_${selectedConfig.name.replace(/\s+/g, '_')}.xlsx`);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const addDepartment = () => {
    if (!selectedConfig) return;
    
    const newDept: Department = {
      id: crypto.randomUUID(),
      name: 'New Department',
      subDepartments: []
    };

    const updatedHierarchy = {
      ...selectedConfig.hierarchy,
      categories: [...selectedConfig.hierarchy.categories, newDept]
    };

    updateConfigMutation.mutate({
      id: selectedConfig.id,
      data: { hierarchy: updatedHierarchy }
    });
  };

  const addSubDepartment = (deptId: string) => {
    if (!selectedConfig) return;

    const newSubDept: SubDepartment = {
      id: crypto.randomUUID(),
      name: 'New Sub Department',
      teams: []
    };

    const updatedCategories = selectedConfig.hierarchy.categories.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          subDepartments: [...dept.subDepartments, newSubDept]
        };
      }
      return dept;
    });

    updateConfigMutation.mutate({
      id: selectedConfig.id,
      data: { hierarchy: { categories: updatedCategories } }
    });
  };

  const addTeamUnit = (deptId: string, subDeptId: string) => {
    if (!selectedConfig) return;

    const newTeam: TeamUnit = {
      id: crypto.randomUUID(),
      name: 'New Team/Unit'
    };

    const updatedCategories = selectedConfig.hierarchy.categories.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          subDepartments: dept.subDepartments.map(sub => {
            if (sub.id === subDeptId) {
              return {
                ...sub,
                teams: [...sub.teams, newTeam]
              };
            }
            return sub;
          })
        };
      }
      return dept;
    });

    updateConfigMutation.mutate({
      id: selectedConfig.id,
      data: { hierarchy: { categories: updatedCategories } }
    });
  };

  const deleteItem = (type: 'department' | 'subDepartment' | 'team', ids: { deptId: string; subDeptId?: string; teamId?: string }) => {
    if (!selectedConfig) return;

    let updatedCategories = [...selectedConfig.hierarchy.categories];

    if (type === 'department') {
      updatedCategories = updatedCategories.filter(dept => dept.id !== ids.deptId);
    } else if (type === 'subDepartment' && ids.subDeptId) {
      updatedCategories = updatedCategories.map(dept => {
        if (dept.id === ids.deptId) {
          return {
            ...dept,
            subDepartments: dept.subDepartments.filter(sub => sub.id !== ids.subDeptId)
          };
        }
        return dept;
      });
    } else if (type === 'team' && ids.subDeptId && ids.teamId) {
      updatedCategories = updatedCategories.map(dept => {
        if (dept.id === ids.deptId) {
          return {
            ...dept,
            subDepartments: dept.subDepartments.map(sub => {
              if (sub.id === ids.subDeptId) {
                return {
                  ...sub,
                  teams: sub.teams.filter(team => team.id !== ids.teamId)
                };
              }
              return sub;
            })
          };
        }
        return dept;
      });
    }

    updateConfigMutation.mutate({
      id: selectedConfig.id,
      data: { hierarchy: { categories: updatedCategories } }
    });
  };

  const updateItemName = (type: 'department' | 'subDepartment' | 'team', ids: { deptId: string; subDeptId?: string; teamId?: string }, newName: string) => {
    if (!selectedConfig || !newName.trim()) return;

    let updatedCategories = [...selectedConfig.hierarchy.categories];

    if (type === 'department') {
      updatedCategories = updatedCategories.map(dept => {
        if (dept.id === ids.deptId) {
          return { ...dept, name: newName.trim() };
        }
        return dept;
      });
    } else if (type === 'subDepartment' && ids.subDeptId) {
      updatedCategories = updatedCategories.map(dept => {
        if (dept.id === ids.deptId) {
          return {
            ...dept,
            subDepartments: dept.subDepartments.map(sub => {
              if (sub.id === ids.subDeptId) {
                return { ...sub, name: newName.trim() };
              }
              return sub;
            })
          };
        }
        return dept;
      });
    } else if (type === 'team' && ids.subDeptId && ids.teamId) {
      updatedCategories = updatedCategories.map(dept => {
        if (dept.id === ids.deptId) {
          return {
            ...dept,
            subDepartments: dept.subDepartments.map(sub => {
              if (sub.id === ids.subDeptId) {
                return {
                  ...sub,
                  teams: sub.teams.map(team => {
                    if (team.id === ids.teamId) {
                      return { ...team, name: newName.trim() };
                    }
                    return team;
                  })
                };
              }
              return sub;
            })
          };
        }
        return dept;
      });
    }

    updateConfigMutation.mutate({
      id: selectedConfig.id,
      data: { hierarchy: { categories: updatedCategories } }
    });

    setEditingItem(null);
  };

  const filteredConfigs = departmentConfigs.filter(config =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (config.organization_id && config.organization_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return (
      <ResponsiveDashboardWrapper>
        <div className="text-center py-8">
          <p className="text-destructive">Error loading department configurations</p>
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
              Manage hierarchical department configurations: Department → Sub Department → Team/Unit
            </p>
          </div>
          {selectedConfig && (
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Configuration Management */}
          <div className="space-y-6">
            {/* Create New Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Department Configuration
                </CardTitle>
                <CardDescription>
                  Create a new department hierarchy configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddConfig} className="space-y-4">
                  <div>
                    <Label htmlFor="configName">Configuration Name *</Label>
                    <Input
                      id="configName"
                      type="text"
                      value={newConfigName}
                      onChange={(e) => setNewConfigName(e.target.value)}
                      placeholder="Enter configuration name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizationId">Organization ID (Optional)</Label>
                    <Input
                      id="organizationId"
                      type="text"
                      value={newConfigOrgId}
                      onChange={(e) => setNewConfigOrgId(e.target.value)}
                      placeholder="Enter organization ID"
                    />
                    {organizationName && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Organization: <span className="font-medium">{organizationName}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newConfigDescription}
                      onChange={(e) => setNewConfigDescription(e.target.value)}
                      placeholder="Enter description (optional)"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={addConfigMutation.isPending}>
                    {addConfigMutation.isPending ? 'Creating...' : 'Create Configuration'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Configurations */}
            <Card>
              <CardHeader>
                <CardTitle>Department Configurations</CardTitle>
                <CardDescription>
                  {departmentConfigs.length} configurations available
                </CardDescription>
                <div className="flex items-center gap-2 mt-4">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading configurations...</div>
                ) : filteredConfigs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No configurations found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredConfigs.map((config) => (
                      <div
                        key={config.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedConfig?.id === config.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedConfig(config)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{config.name}</h4>
                            {config.organization_id && (
                              <p className="text-sm text-muted-foreground">Org ID: {config.organization_id}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {config.hierarchy.categories.length} departments
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingConfigId(config.id);
                                setEditingConfigData({
                                  name: config.name,
                                  organization_id: config.organization_id || '',
                                  description: config.description || ''
                                });
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConfigMutation.mutate(config.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Hierarchy Management */}
          <div className="space-y-6">
            {selectedConfig ? (
              <>
                {/* Excel Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      Excel Upload
                    </CardTitle>
                    <CardDescription>
                      Upload department hierarchy from Excel file
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

                {/* Hierarchy Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Department Hierarchy</span>
                      <Button onClick={addDepartment} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Department
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Manage the hierarchical structure of {selectedConfig.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedConfig.hierarchy.categories.map((department) => (
                        <div key={department.id} className="border rounded-lg p-3">
                          {/* Department Level */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(department.id)}
                              className="p-0 h-auto"
                            >
                              {expandedItems.has(department.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <Building className="h-4 w-4 text-primary" />
                            {editingItem?.type === 'department' && editingItem.id === department.id ? (
                              <Input
                                value={editingItem.value}
                                onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                                onBlur={() => updateItemName('department', { deptId: department.id }, editingItem.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateItemName('department', { deptId: department.id }, editingItem.value);
                                  } else if (e.key === 'Escape') {
                                    setEditingItem(null);
                                  }
                                }}
                                autoFocus
                                className="flex-1"
                              />
                            ) : (
                              <span className="font-medium flex-1">{department.name}</span>
                            )}
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingItem({ type: 'department', id: department.id, value: department.name })}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addSubDepartment(department.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteItem('department', { deptId: department.id })}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Sub-Departments */}
                          {expandedItems.has(department.id) && (
                            <div className="ml-6 mt-2 space-y-2">
                              {department.subDepartments.map((subDept) => (
                                <div key={subDept.id} className="border-l-2 border-gray-200 pl-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleExpanded(subDept.id)}
                                      className="p-0 h-auto"
                                    >
                                      {expandedItems.has(subDept.id) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Users className="h-4 w-4 text-secondary-foreground" />
                                    {editingItem?.type === 'subDepartment' && editingItem.id === subDept.id ? (
                                      <Input
                                        value={editingItem.value}
                                        onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                                        onBlur={() => updateItemName('subDepartment', { deptId: department.id, subDeptId: subDept.id }, editingItem.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            updateItemName('subDepartment', { deptId: department.id, subDeptId: subDept.id }, editingItem.value);
                                          } else if (e.key === 'Escape') {
                                            setEditingItem(null);
                                          }
                                        }}
                                        autoFocus
                                        className="flex-1"
                                      />
                                    ) : (
                                      <span className="font-medium flex-1">{subDept.name}</span>
                                    )}
                                    <div className="flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingItem({ type: 'subDepartment', id: subDept.id, value: subDept.name })}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addTeamUnit(department.id, subDept.id)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteItem('subDepartment', { deptId: department.id, subDeptId: subDept.id })}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Teams/Units */}
                                  {expandedItems.has(subDept.id) && (
                                    <div className="ml-6 mt-2 space-y-1">
                                      {subDept.teams.map((team) => (
                                        <div key={team.id} className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          {editingItem?.type === 'team' && editingItem.id === team.id ? (
                                            <Input
                                              value={editingItem.value}
                                              onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                                              onBlur={() => updateItemName('team', { deptId: department.id, subDeptId: subDept.id, teamId: team.id }, editingItem.value)}
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                  updateItemName('team', { deptId: department.id, subDeptId: subDept.id, teamId: team.id }, editingItem.value);
                                                } else if (e.key === 'Escape') {
                                                  setEditingItem(null);
                                                }
                                              }}
                                              autoFocus
                                              className="flex-1"
                                            />
                                          ) : (
                                            <span className="flex-1">{team.name}</span>
                                          )}
                                          <div className="flex gap-1">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => setEditingItem({ type: 'team', id: team.id, value: team.name })}
                                              className="h-6 w-6 p-0"
                                            >
                                              <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => deleteItem('team', { deptId: department.id, subDeptId: subDept.id, teamId: team.id })}
                                              className="h-6 w-6 p-0"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {selectedConfig.hierarchy.categories.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No departments configured. Add a department to get started.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a configuration from the left panel to manage its hierarchy
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ResponsiveDashboardWrapper>
  );
};

export default DepartmentConfigSupabase;
