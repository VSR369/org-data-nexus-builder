
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Building, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  RefreshCw,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Department {
  id: string;
  name: string;
  description?: string;
  organization_id?: string;
  organization_name?: string;
  is_active: boolean;
  subDepartments: SubDepartment[];
}

interface SubDepartment {
  id: string;
  name: string;
  description?: string;
  department_id: string;
  is_active: boolean;
  teamUnits: TeamUnit[];
}

interface TeamUnit {
  id: string;
  name: string;
  description?: string;
  sub_department_id: string;
  is_active: boolean;
}

const DepartmentsConfigSupabase: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [expandedSubDepts, setExpandedSubDepts] = useState<Set<string>>(new Set());
  
  // Editing states
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editingSubDept, setEditingSubDept] = useState<string | null>(null);
  const [editingTeamUnit, setEditingTeamUnit] = useState<string | null>(null);
  
  // Adding states
  const [addingDept, setAddingDept] = useState(false);
  const [addingSubDept, setAddingSubDept] = useState<string | null>(null);
  const [addingTeamUnit, setAddingTeamUnit] = useState<string | null>(null);
  
  // Form states
  const [newDept, setNewDept] = useState({ name: '', description: '', organization_name: '' });
  const [newSubDept, setNewSubDept] = useState({ name: '', description: '' });
  const [newTeamUnit, setNewTeamUnit] = useState({ name: '', description: '' });
  const [editValues, setEditValues] = useState({ name: '', description: '', organization_name: '' });
  
  const { toast } = useToast();

  const loadHierarchicalData = async () => {
    try {
      setLoading(true);
      
      // Load departments
      const { data: deptData, error: deptError } = await supabase
        .from('master_departments')
        .select('*')
        .order('name');
      
      if (deptError) throw deptError;

      // Load sub-departments
      const { data: subDeptData, error: subDeptError } = await supabase
        .from('master_sub_departments')
        .select('*')
        .order('name');
      
      if (subDeptError) throw subDeptError;

      // Load team units
      const { data: teamUnitData, error: teamUnitError } = await supabase
        .from('master_team_units')
        .select('*')
        .order('name');
      
      if (teamUnitError) throw teamUnitError;

      // Build hierarchical structure
      const hierarchicalDepts: Department[] = (deptData || []).map(dept => ({
        ...dept,
        subDepartments: (subDeptData || [])
          .filter(sub => sub.department_id === dept.id)
          .map(sub => ({
            ...sub,
            teamUnits: (teamUnitData || []).filter(team => team.sub_department_id === sub.id)
          }))
      }));

      setDepartments(hierarchicalDepts);
      console.log('✅ Hierarchical department data loaded:', hierarchicalDepts);
    } catch (error) {
      console.error('Error loading hierarchical data:', error);
      toast({
        title: "Error",
        description: "Failed to load department hierarchy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHierarchicalData();
  }, []);

  const toggleDeptExpansion = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const toggleSubDeptExpansion = (subDeptId: string) => {
    const newExpanded = new Set(expandedSubDepts);
    if (newExpanded.has(subDeptId)) {
      newExpanded.delete(subDeptId);
    } else {
      newExpanded.add(subDeptId);
    }
    setExpandedSubDepts(newExpanded);
  };

  // Department CRUD operations
  const handleAddDepartment = async () => {
    if (!newDept.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_departments')
        .insert([{
          name: newDept.name.trim(),
          description: newDept.description.trim() || undefined,
          organization_name: newDept.organization_name.trim() || undefined,
          is_user_created: true
        }])
        .select()
        .single();

      if (error) throw error;

      const newDepartment: Department = { ...data, subDepartments: [] };
      setDepartments(prev => [...prev, newDepartment]);
      setNewDept({ name: '', description: '', organization_name: '' });
      setAddingDept(false);
      
      toast({
        title: "Success",
        description: `Department "${newDept.name}" added successfully`,
      });
    } catch (error) {
      console.error('Error adding department:', error);
      toast({
        title: "Error",
        description: "Failed to add department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = async (deptId: string) => {
    if (!editValues.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_departments')
        .update({
          name: editValues.name.trim(),
          description: editValues.description.trim() || undefined,
          organization_name: editValues.organization_name.trim() || undefined
        })
        .eq('id', deptId)
        .select()
        .single();

      if (error) throw error;

      setDepartments(prev => prev.map(dept => 
        dept.id === deptId ? { ...dept, ...data } : dept
      ));
      setEditingDept(null);
      setEditValues({ name: '', description: '', organization_name: '' });
      
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: "Error",
        description: "Failed to update department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_departments')
        .delete()
        .eq('id', deptId);

      if (error) throw error;

      setDepartments(prev => prev.filter(dept => dept.id !== deptId));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Sub-department CRUD operations
  const handleAddSubDepartment = async (deptId: string) => {
    if (!newSubDept.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_sub_departments')
        .insert([{
          name: newSubDept.name.trim(),
          description: newSubDept.description.trim() || undefined,
          department_id: deptId,
          is_user_created: true
        }])
        .select()
        .single();

      if (error) throw error;

      const newSubDepartment: SubDepartment = { ...data, teamUnits: [] };
      setDepartments(prev => prev.map(dept => 
        dept.id === deptId 
          ? { ...dept, subDepartments: [...dept.subDepartments, newSubDepartment] }
          : dept
      ));
      setNewSubDept({ name: '', description: '' });
      setAddingSubDept(null);
      
      toast({
        title: "Success",
        description: `Sub-department "${newSubDept.name}" added successfully`,
      });
    } catch (error) {
      console.error('Error adding sub-department:', error);
      toast({
        title: "Error",
        description: "Failed to add sub-department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubDepartment = async (subDeptId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_sub_departments')
        .delete()
        .eq('id', subDeptId);

      if (error) throw error;

      setDepartments(prev => prev.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.filter(sub => sub.id !== subDeptId)
      })));
      
      toast({
        title: "Success",
        description: "Sub-department deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting sub-department:', error);
      toast({
        title: "Error",
        description: "Failed to delete sub-department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Team unit CRUD operations
  const handleAddTeamUnit = async (subDeptId: string) => {
    if (!newTeamUnit.name.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('master_team_units')
        .insert([{
          name: newTeamUnit.name.trim(),
          description: newTeamUnit.description.trim() || undefined,
          sub_department_id: subDeptId,
          is_user_created: true
        }])
        .select()
        .single();

      if (error) throw error;

      setDepartments(prev => prev.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.map(sub => 
          sub.id === subDeptId
            ? { ...sub, teamUnits: [...sub.teamUnits, data] }
            : sub
        )
      })));
      setNewTeamUnit({ name: '', description: '' });
      setAddingTeamUnit(null);
      
      toast({
        title: "Success",
        description: `Team unit "${newTeamUnit.name}" added successfully`,
      });
    } catch (error) {
      console.error('Error adding team unit:', error);
      toast({
        title: "Error",
        description: "Failed to add team unit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamUnit = async (teamUnitId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('master_team_units')
        .delete()
        .eq('id', teamUnitId);

      if (error) throw error;

      setDepartments(prev => prev.map(dept => ({
        ...dept,
        subDepartments: dept.subDepartments.map(sub => ({
          ...sub,
          teamUnits: sub.teamUnits.filter(team => team.id !== teamUnitId)
        }))
      })));
      
      toast({
        title: "Success",
        description: "Team unit deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting team unit:', error);
      toast({
        title: "Error",
        description: "Failed to delete team unit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.subDepartments.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.teamUnits.some(team => 
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Department Hierarchy
          </h2>
          <p className="text-muted-foreground">Manage organizational structure with departments, sub-departments, and team units</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={loadHierarchicalData} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setAddingDept(true)} disabled={addingDept || loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search departments, sub-departments, or team units..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Department Form */}
      {addingDept && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Add New Department</span>
              </div>
              <Input
                placeholder="Department name"
                value={newDept.name}
                onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                autoFocus
              />
              <Input
                placeholder="Organization name (optional)"
                value={newDept.organization_name}
                onChange={(e) => setNewDept(prev => ({ ...prev, organization_name: e.target.value }))}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newDept.description}
                onChange={(e) => setNewDept(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddDepartment} size="sm" disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
                <Button onClick={() => setAddingDept(false)} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hierarchical Department Tree */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading department hierarchy...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No departments match your search.' : 'No departments configured. Add a department to get started.'}
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div key={dept.id} className="border rounded-lg overflow-hidden">
              {/* Department Level */}
              <div className="bg-blue-50 border-l-4 border-l-blue-500">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDeptExpansion(dept.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedDepts.has(dept.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <Building2 className="w-5 h-5 text-blue-600" />
                    
                    {editingDept === dept.id ? (
                      <div className="flex-1 space-y-2">
                        <Input
                          value={editValues.name}
                          onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                          className="h-8"
                        />
                        <Input
                          placeholder="Organization name"
                          value={editValues.organization_name}
                          onChange={(e) => setEditValues(prev => ({ ...prev, organization_name: e.target.value }))}
                          className="h-8"
                        />
                        <Textarea
                          placeholder="Description"
                          value={editValues.description}
                          onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-800">{dept.name}</span>
                          {dept.organization_name && (
                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {dept.organization_name}
                            </span>
                          )}
                        </div>
                        {dept.description && (
                          <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                        )}
                        <div className="text-xs text-blue-600 mt-1">
                          {dept.subDepartments.length} sub-departments, {dept.subDepartments.reduce((acc, sub) => acc + sub.teamUnits.length, 0)} team units
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {editingDept === dept.id ? (
                      <>
                        <Button 
                          onClick={() => handleEditDepartment(dept.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => {
                            setEditingDept(null);
                            setEditValues({ name: '', description: '', organization_name: '' });
                          }} 
                          size="sm" 
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          onClick={() => {
                            setEditingDept(dept.id);
                            setEditValues({
                              name: dept.name,
                              description: dept.description || '',
                              organization_name: dept.organization_name || ''
                            });
                          }} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => setAddingSubDept(dept.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteDepartment(dept.id)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Add Sub-Department Form */}
                {addingSubDept === dept.id && (
                  <div className="px-4 pb-4 ml-8">
                    <div className="bg-green-50 border border-green-200 rounded p-3 space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Add Sub-Department</span>
                      </div>
                      <Input
                        placeholder="Sub-department name"
                        value={newSubDept.name}
                        onChange={(e) => setNewSubDept(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newSubDept.description}
                        onChange={(e) => setNewSubDept(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => handleAddSubDepartment(dept.id)} size="sm" disabled={loading}>
                          <Check className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                        <Button onClick={() => setAddingSubDept(null)} size="sm" variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-Departments */}
              {expandedDepts.has(dept.id) && dept.subDepartments.map((subDept) => (
                <div key={subDept.id} className="bg-green-50 border-l-4 border-l-green-500 ml-8">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSubDeptExpansion(subDept.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedSubDepts.has(subDept.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      <Building className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <div className="font-medium text-green-800">{subDept.name}</div>
                        {subDept.description && (
                          <p className="text-sm text-muted-foreground">{subDept.description}</p>
                        )}
                        <div className="text-xs text-green-600">
                          {subDept.teamUnits.length} team units
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        onClick={() => setAddingTeamUnit(subDept.id)} 
                        size="sm" 
                        variant="outline"
                        disabled={loading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteSubDepartment(subDept.id)} 
                        size="sm" 
                        variant="outline"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add Team Unit Form */}
                  {addingTeamUnit === subDept.id && (
                    <div className="px-3 pb-3 ml-8">
                      <div className="bg-purple-50 border border-purple-200 rounded p-3 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Add Team Unit</span>
                        </div>
                        <Input
                          placeholder="Team unit name"
                          value={newTeamUnit.name}
                          onChange={(e) => setNewTeamUnit(prev => ({ ...prev, name: e.target.value }))}
                          autoFocus
                        />
                        <Textarea
                          placeholder="Description (optional)"
                          value={newTeamUnit.description}
                          onChange={(e) => setNewTeamUnit(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleAddTeamUnit(subDept.id)} size="sm" disabled={loading}>
                            <Check className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                          <Button onClick={() => setAddingTeamUnit(null)} size="sm" variant="outline">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Units */}
                  {expandedSubDepts.has(subDept.id) && subDept.teamUnits.map((teamUnit) => (
                    <div key={teamUnit.id} className="bg-purple-50 border-l-4 border-l-purple-500 ml-8">
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-6" /> {/* Spacer for alignment */}
                          <Users className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <div className="font-medium text-purple-800">{teamUnit.name}</div>
                            {teamUnit.description && (
                              <p className="text-sm text-muted-foreground">{teamUnit.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button 
                            onClick={() => handleDeleteTeamUnit(teamUnit.id)} 
                            size="sm" 
                            variant="outline"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DepartmentsConfigSupabase;
