import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { useOrganizationRelationships } from '@/hooks/useOrganizationRelationships';
import { useOrganizationTypes, useOrganizationCategories, useDepartments } from '@/hooks/useMasterDataCRUD';

export function OrganizationRelationshipManager() {
  const { items: orgTypes } = useOrganizationTypes();
  const { items: orgCategories } = useOrganizationCategories();
  const { items: departments } = useDepartments();

  const typeCategoryMapping = useOrganizationRelationships('master_org_type_category_mapping');
  const typeDepartmentMapping = useOrganizationRelationships('master_org_type_department_mapping');
  const categoryDepartmentMapping = useOrganizationRelationships('master_org_category_department_mapping');

  const [selectedOrgType, setSelectedOrgType] = useState<string>('');
  const [selectedOrgCategory, setSelectedOrgCategory] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const handleAddTypeCategory = async () => {
    if (!selectedOrgType || !selectedOrgCategory) return;
    
    await typeCategoryMapping.addRelationship({
      organization_type_id: selectedOrgType,
      organization_category_id: selectedOrgCategory,
      is_active: true,
    });
    
    setSelectedOrgType('');
    setSelectedOrgCategory('');
  };

  const handleAddTypeDepartment = async () => {
    if (!selectedOrgType || !selectedDepartment) return;
    
    await typeDepartmentMapping.addRelationship({
      organization_type_id: selectedOrgType,
      department_id: selectedDepartment,
      is_active: true,
    });
    
    setSelectedOrgType('');
    setSelectedDepartment('');
  };

  const handleAddCategoryDepartment = async () => {
    if (!selectedOrgCategory || !selectedDepartment) return;
    
    await categoryDepartmentMapping.addRelationship({
      organization_category_id: selectedOrgCategory,
      department_id: selectedDepartment,
      is_active: true,
    });
    
    setSelectedOrgCategory('');
    setSelectedDepartment('');
  };

  const getOrgTypeName = (id: string) => orgTypes.find(t => t.id === id)?.name || 'Unknown';
  const getOrgCategoryName = (id: string) => orgCategories.find(c => c.id === id)?.name || 'Unknown';
  const getDepartmentName = (id: string) => departments.find(d => d.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Relationships</CardTitle>
          <CardDescription>
            Manage relationships between organization types, categories, and departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="type-category" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="type-category">Type ↔ Category</TabsTrigger>
              <TabsTrigger value="type-department">Type ↔ Department</TabsTrigger>
              <TabsTrigger value="category-department">Category ↔ Department</TabsTrigger>
            </TabsList>

            <TabsContent value="type-category" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Type-Category Relationship</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedOrgType} onValueChange={setSelectedOrgType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgTypes.map(type => (
                          <SelectItem key={type.id} value={type.id!}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedOrgCategory} onValueChange={setSelectedOrgCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization category" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgCategories.map(category => (
                          <SelectItem key={category.id} value={category.id!}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTypeCategory} disabled={!selectedOrgType || !selectedOrgCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Relationship
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {typeCategoryMapping.relationships.map((rel) => (
                  <Card key={rel.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getOrgTypeName(rel.organization_type_id!)}</Badge>
                        <span>↔</span>
                        <Badge variant="outline">{getOrgCategoryName(rel.organization_category_id!)}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => typeCategoryMapping.deleteRelationship(rel.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="type-department" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Type-Department Relationship</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedOrgType} onValueChange={setSelectedOrgType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization type" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgTypes.map(type => (
                          <SelectItem key={type.id} value={type.id!}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id!}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddTypeDepartment} disabled={!selectedOrgType || !selectedDepartment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Relationship
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {typeDepartmentMapping.relationships.map((rel) => (
                  <Card key={rel.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getOrgTypeName(rel.organization_type_id!)}</Badge>
                        <span>↔</span>
                        <Badge variant="outline">{getDepartmentName(rel.department_id!)}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => typeDepartmentMapping.deleteRelationship(rel.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="category-department" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Category-Department Relationship</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedOrgCategory} onValueChange={setSelectedOrgCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization category" />
                      </SelectTrigger>
                      <SelectContent>
                        {orgCategories.map(category => (
                          <SelectItem key={category.id} value={category.id!}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id!}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddCategoryDepartment} disabled={!selectedOrgCategory || !selectedDepartment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Relationship
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {categoryDepartmentMapping.relationships.map((rel) => (
                  <Card key={rel.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{getOrgCategoryName(rel.organization_category_id!)}</Badge>
                        <span>↔</span>
                        <Badge variant="outline">{getDepartmentName(rel.department_id!)}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => categoryDepartmentMapping.deleteRelationship(rel.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}