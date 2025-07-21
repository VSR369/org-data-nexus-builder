import React, { useState, useEffect, useMemo } from "react";
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
import { Plus, Edit, Trash2, Users, Phone, Mail, User, Building2, ChevronRight, Search, Filter, X, ChevronDown, SortAsc, SortDesc, FilterX } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<'person_name' | 'role_name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    roleNames: [] as string[],
    domainGroups: [] as string[],
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

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const uniqueRoleNames = Array.from(new Set(roles.map(r => r.role_name))).filter(Boolean);
    const uniqueDomainGroups = Array.from(new Set(roles.map(r => r.domain_group?.name).filter(Boolean)));
    const uniqueDepartments = Array.from(new Set(roles.map(r => r.department?.name).filter(Boolean)));
    
    return {
      roleNames: uniqueRoleNames,
      domainGroups: uniqueDomainGroups,
      departments: uniqueDepartments
    };
  }, [roles]);

  // Filtered and sorted roles
  const filteredAndSortedRoles = useMemo(() => {
    let filtered = roles.filter(role => {
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch = 
          role.person_name?.toLowerCase().includes(query) ||
          role.role_name.toLowerCase().includes(query) ||
          role.email_id.toLowerCase().includes(query) ||
          role.user_id.toLowerCase().includes(query) ||
          role.mobile_number.includes(query);
        
        if (!matchesSearch) return false;
      }

      // Role name filter
      if (filters.roleNames.length > 0 && !filters.roleNames.includes(role.role_name)) {
        return false;
      }

      // Domain group filter
      if (filters.domainGroups.length > 0 && (!role.domain_group?.name || !filters.domainGroups.includes(role.domain_group.name))) {
        return false;
      }

      // Department filter
      if (filters.departments.length > 0 && (!role.department?.name || !filters.departments.includes(role.department.name))) {
        return false;
      }

      // Status filter
      if (filters.status) {
        const isActive = filters.status === 'active';
        if (role.is_active !== isActive) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'person_name':
          aValue = a.person_name || '';
          bValue = b.person_name || '';
          break;
        case 'role_name':
          aValue = a.role_name;
          bValue = b.role_name;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [roles, debouncedSearchQuery, filters, sortBy, sortOrder]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({
      roleNames: [],
      domainGroups: [],
      departments: [],
      status: ""
    });
  };

  // Check if any filters are applied
  const hasActiveFilters = searchQuery || filters.roleNames.length > 0 || filters.domainGroups.length > 0 || filters.departments.length > 0 || filters.status;

  // Applied filter count
  const activeFilterCount = 
    (searchQuery ? 1 : 0) +
    filters.roleNames.length +
    filters.domainGroups.length +
    filters.departments.length +
    (filters.status ? 1 : 0);

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
          <h2 className="text-2xl font-bold">
            Seeking Organization Roles 
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredAndSortedRoles.length} of {roles.length})
            </span>
          </h2>
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

      {/* Search and Filter Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, email, or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('-') as [typeof sortBy, typeof sortOrder];
            setSortBy(field);
            setSortOrder(order);
          }}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="created_at-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="person_name-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Name A-Z
                </div>
              </SelectItem>
              <SelectItem value="person_name-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Name Z-A
                </div>
              </SelectItem>
              <SelectItem value="role_name-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  Role A-Z
                </div>
              </SelectItem>
              <SelectItem value="role_name-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Role Z-A
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters Panel */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="flex items-center gap-2"
                    >
                      <FilterX className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Role Names Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role Names</Label>
                    <Select
                      value={filters.roleNames.length === 1 ? filters.roleNames[0] : ""}
                      onValueChange={(value) => {
                        if (value) {
                          setFilters(prev => ({
                            ...prev,
                            roleNames: [value]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.roleNames.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Domain Groups Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Domain Groups</Label>
                    <Select
                      value={filters.domainGroups.length === 1 ? filters.domainGroups[0] : ""}
                      onValueChange={(value) => {
                        if (value) {
                          setFilters(prev => ({
                            ...prev,
                            domainGroups: [value]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.domainGroups.map(domain => (
                          <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Departments Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Departments</Label>
                    <Select
                      value={filters.departments.length === 1 ? filters.departments[0] : ""}
                      onValueChange={(value) => {
                        if (value) {
                          setFilters(prev => ({
                            ...prev,
                            departments: [value]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Applied Filter Chips */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.roleNames.map(role => (
                      <Badge key={role} variant="secondary" className="flex items-center gap-1">
                        Role: {role}
                        <button
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            roleNames: prev.roleNames.filter(r => r !== role)
                          }))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {filters.domainGroups.map(domain => (
                      <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                        Domain: {domain}
                        <button
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            domainGroups: prev.domainGroups.filter(d => d !== domain)
                          }))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {filters.departments.map(dept => (
                      <Badge key={dept} variant="secondary" className="flex items-center gap-1">
                        Department: {dept}
                        <button
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            departments: prev.departments.filter(d => d !== dept)
                          }))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {filters.status && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Status: {filters.status === 'active' ? 'Active' : 'Inactive'}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, status: "" }))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Results */}
      {filteredAndSortedRoles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No roles found</h3>
            <p className="text-muted-foreground text-center">
              {hasActiveFilters 
                ? "Try adjusting your search criteria or clearing filters"
                : "Get started by creating your first seeking organization role"
              }
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="mt-4 flex items-center gap-2"
              >
                <FilterX className="h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedRoles.map((role) => (
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
                    onClick={() => handleDelete(role.id, role.person_name || role.role_name)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {renderFormDialog(true)}
      </Dialog>
    </div>
  );
};
