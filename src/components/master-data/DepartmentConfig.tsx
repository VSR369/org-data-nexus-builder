
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, X, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DepartmentData {
  categories: string[];
  subcategories: {
    [category: string]: string[];
  };
}

const DepartmentConfig = () => {
  const { toast } = useToast();
  const [departmentData, setDepartmentData] = useState<DepartmentData>({
    categories: [
      'Core Business Functions',
      'Corporate Support Functions',
      'Technology & Digital Functions',
      'Industry-Specific or Specialized Departments'
    ],
    subcategories: {
      'Core Business Functions': [
        'Strategy & Planning',
        'Sales & Business Development',
        'Marketing & Communications',
        'Product Management',
        'Operations / Service Delivery',
        'Customer Support / Success',
        'Research & Development (R&D)',
        'Supply Chain & Procurement',
        'Project / Program Management Office (PMO)'
      ],
      'Corporate Support Functions': [
        'Finance & Accounting',
        'Human Resources (HR)',
        'Legal & Compliance',
        'Administration & Facilities Management',
        'Internal Audit & Risk Management'
      ],
      'Technology & Digital Functions': [
        'Information Technology (IT)',
        'Enterprise Architecture',
        'Data & Analytics / Business Intelligence',
        'Cybersecurity & Information Security',
        'Digital Transformation Office / Innovation Lab',
        'DevOps / Infrastructure & Cloud Services'
      ],
      'Industry-Specific or Specialized Departments': [
        'Quality Assurance / Regulatory Affairs (e.g., Pharma, Manufacturing)',
        'Clinical Affairs (e.g., Healthcare, MedTech)',
        'Merchandising & Category Management (Retail)',
        'Content / Editorial / Creative (Media & EdTech)',
        'Corporate Social Responsibility (CSR) / ESG'
      ]
    }
  });

  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [editingSubcategoryValue, setEditingSubcategoryValue] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setDepartmentData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
        subcategories: {
          ...prev.subcategories,
          [newCategory.trim()]: []
        }
      }));
      setNewCategory('');
      setIsAddingCategory(false);
      toast({
        title: "Success",
        description: "Department category added successfully",
      });
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && selectedCategory) {
      setDepartmentData(prev => ({
        ...prev,
        subcategories: {
          ...prev.subcategories,
          [selectedCategory]: [...(prev.subcategories[selectedCategory] || []), newSubcategory.trim()]
        }
      }));
      setNewSubcategory('');
      setIsAddingSubcategory(false);
      toast({
        title: "Success",
        description: "Department subcategory added successfully",
      });
    }
  };

  const handleEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(departmentData.categories[index]);
  };

  const handleSaveCategoryEdit = () => {
    if (editingCategoryValue.trim() && editingCategoryIndex !== null) {
      const oldCategory = departmentData.categories[editingCategoryIndex];
      const newCategories = [...departmentData.categories];
      newCategories[editingCategoryIndex] = editingCategoryValue.trim();
      
      const newSubcategories = { ...departmentData.subcategories };
      if (oldCategory !== editingCategoryValue.trim()) {
        newSubcategories[editingCategoryValue.trim()] = newSubcategories[oldCategory] || [];
        delete newSubcategories[oldCategory];
      }

      setDepartmentData({
        categories: newCategories,
        subcategories: newSubcategories
      });
      setEditingCategoryIndex(null);
      setEditingCategoryValue('');
      toast({
        title: "Success",
        description: "Department category updated successfully",
      });
    }
  };

  const handleDeleteCategory = (index: number) => {
    const categoryToDelete = departmentData.categories[index];
    const newCategories = departmentData.categories.filter((_, i) => i !== index);
    const newSubcategories = { ...departmentData.subcategories };
    delete newSubcategories[categoryToDelete];

    setDepartmentData({
      categories: newCategories,
      subcategories: newSubcategories
    });
    toast({
      title: "Success",
      description: "Department category deleted successfully",
    });
  };

  const handleEditSubcategory = (categoryName: string, index: number) => {
    setEditingSubcategoryIndex(index);
    setSelectedCategory(categoryName);
    setEditingSubcategoryValue(departmentData.subcategories[categoryName][index]);
  };

  const handleSaveSubcategoryEdit = () => {
    if (editingSubcategoryValue.trim() && editingSubcategoryIndex !== null && selectedCategory) {
      const newSubcategories = { ...departmentData.subcategories };
      newSubcategories[selectedCategory][editingSubcategoryIndex] = editingSubcategoryValue.trim();
      
      setDepartmentData(prev => ({
        ...prev,
        subcategories: newSubcategories
      }));
      setEditingSubcategoryIndex(null);
      setEditingSubcategoryValue('');
      setSelectedCategory('');
      toast({
        title: "Success",
        description: "Department subcategory updated successfully",
      });
    }
  };

  const handleDeleteSubcategory = (categoryName: string, index: number) => {
    const newSubcategories = { ...departmentData.subcategories };
    newSubcategories[categoryName] = newSubcategories[categoryName].filter((_, i) => i !== index);
    
    setDepartmentData(prev => ({
      ...prev,
      subcategories: newSubcategories
    }));
    toast({
      title: "Success",
      description: "Department subcategory deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Configuration</CardTitle>
        <CardDescription>
          Configure department categories and subcategories for organizational structure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Department Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Department Subcategories</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Department Categories</h3>
                <Button 
                  onClick={() => setIsAddingCategory(true)} 
                  disabled={isAddingCategory}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>

              {isAddingCategory && (
                <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <Label htmlFor="new-category">New Department Category</Label>
                    <Input
                      id="new-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter category name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <Button onClick={handleAddCategory} size="sm" className="flex items-center gap-1">
                      <Save className="w-3 h-3" />
                      Save
                    </Button>
                    <Button onClick={() => setIsAddingCategory(false)} variant="outline" size="sm" className="flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                {departmentData.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    {editingCategoryIndex === index ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingCategoryValue}
                          onChange={(e) => setEditingCategoryValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleSaveCategoryEdit} size="sm" className="flex items-center gap-1">
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button onClick={() => setEditingCategoryIndex(null)} variant="outline" size="sm" className="flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{index + 1}</Badge>
                          <span className="font-medium">{category}</span>
                          <Badge variant="outline" className="text-xs">
                            {departmentData.subcategories[category]?.length || 0} subcategories
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditCategory(index)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteCategory(index)}
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="mt-6">
            <div className="space-y-6">
              {departmentData.categories.map((category) => (
                <Card key={category} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        {category}
                      </CardTitle>
                      <Button 
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsAddingSubcategory(true);
                        }} 
                        disabled={isAddingSubcategory && selectedCategory === category}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-3 h-3" />
                        Add Subcategory
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {isAddingSubcategory && selectedCategory === category && (
                      <div className="flex gap-2 p-3 border rounded-lg bg-muted/50 mb-3">
                        <div className="flex-1">
                          <Label htmlFor="new-subcategory">New Subcategory</Label>
                          <Input
                            id="new-subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            placeholder="Enter subcategory name"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2 items-end">
                          <Button onClick={handleAddSubcategory} size="sm" className="flex items-center gap-1">
                            <Save className="w-3 h-3" />
                            Save
                          </Button>
                          <Button onClick={() => setIsAddingSubcategory(false)} variant="outline" size="sm" className="flex items-center gap-1">
                            <X className="w-3 h-3" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {departmentData.subcategories[category]?.map((subcategory, subIndex) => (
                      <div key={subIndex} className="flex items-center justify-between p-2 border rounded hover:bg-muted/30 transition-colors">
                        {editingSubcategoryIndex === subIndex && selectedCategory === category ? (
                          <div className="flex gap-2 flex-1">
                            <Input
                              value={editingSubcategoryValue}
                              onChange={(e) => setEditingSubcategoryValue(e.target.value)}
                              className="flex-1"
                              size={32}
                            />
                            <Button onClick={handleSaveSubcategoryEdit} size="sm" className="flex items-center gap-1">
                              <Save className="w-3 h-3" />
                              Save
                            </Button>
                            <Button onClick={() => setEditingSubcategoryIndex(null)} variant="outline" size="sm" className="flex items-center gap-1">
                              <X className="w-3 h-3" />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{subIndex + 1}</Badge>
                              <span className="text-sm">{subcategory}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => handleEditSubcategory(category, subIndex)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 h-7 px-2"
                              >
                                <Edit className="w-3 h-3" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteSubcategory(category, subIndex)}
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-1 h-7 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground italic">No subcategories defined for this category</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DepartmentConfig;
