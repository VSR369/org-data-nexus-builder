
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users, Phone, Mail, User, Building2, ChevronRight, Search, Filter, X, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SeekingOrgRole {
  id: string;
  role_name: string;
  person_name?: string;
  mobile_number: string;
  email_id: string;
  user_id: string;
  password: string;
  domain_group_id?: string;
  category_id?: string;
  subcategory_id?: string;
  department_id?: string;
  sub_department_id?: string;
  team_unit_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  domain_group?: { name: string };
  category?: { name: string };
  subcategory?: { name: string };
  department?: { name: string };
  sub_department?: { name: string };
  team_unit?: { name: string };
}

interface MasterDataItem {
  id: string;
  name: string;
  domain_group_id?: string;
  category_id?: string;
  department_id?: string;
  sub_department_id?: string;
}

interface MasterData {
  roles: { id: string; name: string }[];
  domainGroups: MasterDataItem[];
  categories: MasterDataItem[];
  subcategories: MasterDataItem[];
  departments: MasterDataItem[];
  subDepartments: MasterDataItem[];
  teamUnits: MasterDataItem[];
}

export const SeekingOrgRoles: React.FC = () => {
  const [roles, setRoles] = useState<SeekingOrgRole[]>([]);
  const [masterData, setMasterData] = useState<MasterData>({
    roles: [],
    domainGroups: [],
    categories: [],
    subcategories: [],
    departments: [],
    subDepartments: [],
    teamUnits: []
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SeekingOrgRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    roleNames: [] as string[],
    domainGroups: [] as string[],
    categories: [] as string[],
    departments: [] as string[],
    status: ""
  });
  
  const [formData, setFormData] = useState({
    role_name: "",
    person_name: "",
    mobile_number: "",
    email_id: "",
    user_id: "",
    password: "",
    domain_group_id: "",
    category_id: "",
    subcategory_id: "",
    department_id: "",
    sub_department_id: "",
    team_unit_id: ""
  });

  // Filtered options for cascading dropdowns
  const [filteredCategories, setFilteredCategories] = useState<MasterDataItem[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<MasterDataItem[]>([]);
  const [filteredSubDepartments, setFilteredSubDepartments] = useState<MasterDataItem[]>([]);
  const [filteredTeamUnits, setFilteredTeamUnits] = useState<MasterDataItem[]>([]);

  // Load initial data
  useEffect(() => {
    loadRoles();
    loadMasterData();
  }, []);

  // Handle cascading for Domain Group -> Category -> Subcategory
  useEffect(() => {
    if (formData.domain_group_id) {
      const filtered = masterData.categories.filter(cat => cat.domain_group_id === formData.domain_group_id);
      setFilteredCategories(filtered);
      // Reset dependent fields when parent changes
      setFormData(prev => ({ ...prev, category_id: "", subcategory_id: "" }));
      setFilteredSubcategories([]);
    } else {
      setFilteredCategories([]);
      setFilteredSubcategories([]);
    }
  }, [formData.domain_group_id, masterData.categories]);

  useEffect(() => {
    if (formData.category_id) {
      const filtered = masterData.subcategories.filter(subcat => subcat.category_id === formData.category_id);
      setFilteredSubcategories(filtered);
      // Reset dependent field when parent changes
      setFormData(prev => ({ ...prev, subcategory_id: "" }));
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category_id, masterData.subcategories]);

  // Handle cascading for Department -> Sub Department -> Team Unit
  useEffect(() => {
    if (formData.department_id) {
      const filtered = masterData.subDepartments.filter(subdept => subdept.department_id === formData.department_id);
      setFilteredSubDepartments(filtered);
      // Reset dependent fields when parent changes
      setFormData(prev => ({ ...prev, sub_department_id: "", team_unit_id: "" }));
      setFilteredTeamUnits([]);
    } else {
      setFilteredSubDepartments([]);
      setFilteredTeamUnits([]);
    }
  }, [formData.department_id, masterData.subDepartments]);

  useEffect(() => {
    if (formData.sub_department_id) {
      const filtered = masterData.teamUnits.filter(unit => unit.sub_department_id === formData.sub_department_id);
      setFilteredTeamUnits(filtered);
      // Reset dependent field when parent changes
      setFormData(prev => ({ ...prev, team_unit_id: "" }));
    } else {
      setFilteredTeamUnits([]);
    }
  }, [formData.sub_department_id, masterData.teamUnits]);

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('seeking_organization_roles')
        .select(`
          *,
          domain_group:domain_group_id(name),
          category:category_id(name),
          subcategory:subcategory_id(name),
          department:department_id(name),
          sub_department:sub_department_id(name),
          team_unit:team_unit_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Failed to load seeking org roles');
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      // Load all master data in parallel
      const [
        rolesData,
        domainGroupsData,
        categoriesData,
        subcategoriesData,
        departmentsData,
        subDepartmentsData,
        teamUnitsData
      ] = await Promise.all([
        supabase.from('roles').select('id, name').eq('is_active', true),
        supabase.from('master_domain_groups').select('id, name').eq('is_active', true),
        supabase.from('master_categories').select('id, name, domain_group_id').eq('is_active', true),
        supabase.from('master_sub_categories').select('id, name, category_id').eq('is_active', true),
        supabase.from('master_departments').select('id, name').eq('is_active', true),
        supabase.from('master_sub_departments').select('id, name, department_id').eq('is_active', true),
        supabase.from('master_team_units').select('id, name, sub_department_id').eq('is_active', true)
      ]);

      setMasterData({
        roles: rolesData.data || [],
        domainGroups: domainGroupsData.data || [],
        categories: categoriesData.data || [],
        subcategories: subcategoriesData.data || [],
        departments: departmentsData.data || [],
        subDepartments: subDepartmentsData.data || [],
        teamUnits: teamUnitsData.data || []
      });
    } catch (error) {
      console.error('Error loading master data:', error);
      toast.error('Failed to load master data');
    }
  };

  const resetForm = () => {
    setFormData({
      role_name: "",
      person_name: "",
      mobile_number: "",
      email_id: "",
      user_id: "",
      password: "",
      domain_group_id: "",
      category_id: "",
      subcategory_id: "",
      department_id: "",
      sub_department_id: "",
      team_unit_id: ""
    });
    // Reset filtered arrays
    setFilteredCategories([]);
    setFilteredSubcategories([]);
    setFilteredSubDepartments([]);
    setFilteredTeamUnits([]);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleEdit = (role: SeekingOrgRole) => {
    setEditingRole(role);
    setFormData({
      role_name: role.role_name,
      person_name: role.person_name || "",
      mobile_number: role.mobile_number,
      email_id: role.email_id,
      user_id: role.user_id,
      password: role.password,
      domain_group_id: role.domain_group_id || "",
      category_id: role.category_id || "",
      subcategory_id: role.subcategory_id || "",
      department_id: role.department_id || "",
      sub_department_id: role.sub_department_id || "",
      team_unit_id: role.team_unit_id || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.role_name || !formData.person_name || !formData.mobile_number || !formData.email_id || !formData.user_id || !formData.password) {
      toast.error('Please fill in all required fields including person name');
      return;
    }

    try {
      if (editingRole) {
        // Update existing role
        const { error } = await supabase
          .from('seeking_organization_roles')
          .update({
            role_name: formData.role_name,
            person_name: formData.person_name,
            mobile_number: formData.mobile_number,
            email_id: formData.email_id,
            user_id: formData.user_id,
            password: formData.password,
            domain_group_id: formData.domain_group_id || null,
            category_id: formData.category_id || null,
            subcategory_id: formData.subcategory_id || null,
            department_id: formData.department_id || null,
            sub_department_id: formData.sub_department_id || null,
            team_unit_id: formData.team_unit_id || null
          })
          .eq('id', editingRole.id);

        if (error) throw error;
        toast.success('Seeking org role updated successfully');
        setIsEditDialogOpen(false);
        setEditingRole(null);
      } else {
        // Create new role
        const { error } = await supabase
          .from('seeking_organization_roles')
          .insert({
            role_name: formData.role_name,
            person_name: formData.person_name,
            mobile_number: formData.mobile_number,
            email_id: formData.email_id,
            user_id: formData.user_id,
            password: formData.password,
            domain_group_id: formData.domain_group_id || null,
            category_id: formData.category_id || null,
            subcategory_id: formData.subcategory_id || null,
            department_id: formData.department_id || null,
            sub_department_id: formData.sub_department_id || null,
            team_unit_id: formData.team_unit_id || null
          });

        if (error) throw error;
        toast.success('Seeking org role created successfully');
        setIsAddDialogOpen(false);
      }

      resetForm();
      loadRoles();
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast.error(error.message || 'Failed to save seeking org role');
    }
  };

  const handleDelete = async (id: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role for "${roleName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('seeking_organization_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Seeking org role deleted successfully');
      loadRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Failed to delete seeking org role');
    }
  };

  const renderHierarchyPath = (role: SeekingOrgRole, type: 'domain' | 'department') => {
    if (type === 'domain') {
      const parts = [];
      if (role.domain_group?.name) parts.push(role.domain_group.name);
      if (role.category?.name) parts.push(role.category.name);
      if (role.subcategory?.name) parts.push(role.subcategory.name);
      
      return parts.length > 0 ? (
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium">Domain:</span>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < parts.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>
      ) : null;
    } else {
      const parts = [];
      if (role.department?.name) parts.push(role.department.name);
      if (role.sub_department?.name) parts.push(role.sub_department.name);
      if (role.team_unit?.name) parts.push(role.team_unit.name);
      
      return parts.length > 0 ? (
        <div className="flex items-center gap-1 text-sm">
          <span className="font-medium">Department:</span>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < parts.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>
      ) : null;
    }
  };

  const renderFormDialog = (isEdit: boolean) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Edit' : 'Add'} Seeking Organization Role</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-primary">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="person_name" className="text-sm font-medium">
                Person Name *
              </Label>
              <Input
                id="person_name"
                value={formData.person_name}
                onChange={(e) => setFormData(prev => ({ ...prev, person_name: e.target.value }))}
                placeholder="Enter person's full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_name" className="text-sm font-medium">
                Role Name *
              </Label>
              <Select value={formData.role_name} onValueChange={(value) => setFormData(prev => ({ ...prev, role_name: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Challenge Creator">Challenge Creator</SelectItem>
                  <SelectItem value="Challenge Curator">Challenge Curator</SelectItem>
                  <SelectItem value="Innovation Director">Innovation Director</SelectItem>
                  <SelectItem value="Expert Reviewer">Expert Reviewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mobile_number" className="text-sm font-medium">
                Mobile Number *
              </Label>
              <Input
                id="mobile_number"
                value={formData.mobile_number}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile_number: e.target.value }))}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email_id" className="text-sm font-medium">
                Email ID *
              </Label>
              <Input
                id="email_id"
                type="email"
                value={formData.email_id}
                onChange={(e) => setFormData(prev => ({ ...prev, email_id: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user_id" className="text-sm font-medium">
                User ID *
              </Label>
              <Input
                id="user_id"
                value={formData.user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                placeholder="Enter user ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password * (min 3 chars for testing)
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
            />
          </div>
        </div>

        <Separator />

        {/* Domain Structure */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-primary">Domain Structure (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain_group_id" className="text-sm font-medium">
                Domain Group
              </Label>
              <Select 
                value={formData.domain_group_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, domain_group_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain group" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.domainGroups.map(group => (
                    <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-sm font-medium">
                Category
              </Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                disabled={!formData.domain_group_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory_id" className="text-sm font-medium">
                Subcategory
              </Label>
              <Select 
                value={formData.subcategory_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                disabled={!formData.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map(subcat => (
                    <SelectItem key={subcat.id} value={subcat.id}>{subcat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Department Structure */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-primary">Department Structure (Optional)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department_id" className="text-sm font-medium">
                Department
              </Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {masterData.departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub_department_id" className="text-sm font-medium">
                Sub Department
              </Label>
              <Select 
                value={formData.sub_department_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, sub_department_id: value }))}
                disabled={!formData.department_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub department" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubDepartments.map(subdept => (
                    <SelectItem key={subdept.id} value={subdept.id}>{subdept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_unit_id" className="text-sm font-medium">
                Team/Unit
              </Label>
              <Select 
                value={formData.team_unit_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, team_unit_id: value }))}
                disabled={!formData.sub_department_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team/unit" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeamUnits.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              if (isEdit) {
                setIsEditDialogOpen(false);
                setEditingRole(null);
              } else {
                setIsAddDialogOpen(false);
              }
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEdit ? 'Update' : 'Create'} Role
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (loading) {
    return <div>Loading seeking organization roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Seeking Organization Roles ({roles.length})</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Role
            </Button>
          </DialogTrigger>
          {renderFormDialog(false)}
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {role.role_name}
                </div>
                <Badge variant={role.is_active ? "default" : "secondary"}>
                  {role.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Person Name - Main Identifier */}
              {role.person_name && (
                <div className="bg-primary/10 p-3 rounded-md">
                  <div className="flex items-center gap-2 text-primary">
                    <User className="h-4 w-4" />
                    <span className="font-semibold text-lg">{role.person_name}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">User ID:</span> {role.user_id}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span> {role.email_id}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Mobile:</span> {role.mobile_number}
                </div>
              </div>

              <Separator />

              {/* Hierarchical paths */}
              <div className="space-y-2">
                {renderHierarchyPath(role, 'domain')}
                {renderHierarchyPath(role, 'department')}
              </div>
              
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(role)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(role.id, role.role_name)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {renderFormDialog(true)}
      </Dialog>
    </div>
  );
};
