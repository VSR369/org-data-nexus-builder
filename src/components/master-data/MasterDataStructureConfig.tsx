import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

interface DomainGroup {
  id: string;
  name: string;
  categories: Category[];
}

const initialDomainGroups: DomainGroup[] = [
  {
    id: '1',
    name: 'Technology',
    categories: [
      {
        id: '101',
        name: 'Software Development',
        subCategories: [
          { id: '101-1', name: 'Web Development' },
          { id: '101-2', name: 'Mobile Development' },
        ],
      },
      {
        id: '102',
        name: 'Data Science',
        subCategories: [
          { id: '102-1', name: 'Machine Learning' },
          { id: '102-2', name: 'Data Analysis' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Healthcare',
    categories: [
      {
        id: '201',
        name: 'Medical Devices',
        subCategories: [
          { id: '201-1', name: 'Diagnostic Equipment' },
          { id: '201-2', name: 'Therapeutic Devices' },
        ],
      },
      {
        id: '202',
        name: 'Pharmaceuticals',
        subCategories: [
          { id: '202-1', name: 'Drug Discovery' },
          { id: '202-2', name: 'Clinical Trials' },
        ],
      },
    ],
  },
];

const MasterDataStructureConfig = () => {
  const [domainGroups, setDomainGroups] = useState<DomainGroup[]>(initialDomainGroups);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set<string>());
  const [expandedCategories, setExpandedCategories] = useState(new Set<string>());
  const [message, setMessage] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleAddGroup = () => {
    const newGroup: DomainGroup = {
      id: generateId(),
      name: 'New Domain Group',
      categories: [],
    };
    setDomainGroups([...domainGroups, newGroup]);
    setMessage('Domain Group added.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditGroup = (id: string, name: string) => {
    setEditingGroup(id);
    setEditingGroupName(name);
  };

  const handleSaveGroup = (id: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === id ? { ...group, name: editingGroupName } : group
    );
    setDomainGroups(updatedGroups);
    setEditingGroup(null);
    setMessage('Domain Group updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteGroup = (id: string) => {
    const updatedGroups = domainGroups.filter((group) => group.id !== id);
    setDomainGroups(updatedGroups);
    setMessage('Domain Group deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = (groupId: string) => {
    const newCategory: Category = {
      id: generateId(),
      name: 'New Category',
      subCategories: [],
    };
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId ? { ...group, categories: [...group.categories, newCategory] } : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Category added.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory(id);
    setEditingCategoryName(name);
  };

  const handleSaveCategory = (groupId: string, categoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId ? { ...category, name: editingCategoryName } : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setEditingCategory(null);
    setMessage('Category updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteCategory = (groupId: string, categoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.filter((category) => category.id !== categoryId),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Category deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddSubCategory = (groupId: string, categoryId: string) => {
    const newSubCategory: SubCategory = {
      id: generateId(),
      name: 'New Sub-Category',
    };
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId
              ? { ...category, subCategories: [...category.subCategories, newSubCategory] }
              : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Sub-Category added.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditSubCategory = (id: string, name: string) => {
    setEditingSubCategory(id);
    setEditingSubCategoryName(name);
  };

  const handleSaveSubCategory = (groupId: string, categoryId: string, subCategoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId
              ? {
                ...category,
                subCategories: category.subCategories.map((subCategory) =>
                  subCategory.id === subCategoryId ? { ...subCategory, name: editingSubCategoryName } : subCategory
                ),
              }
              : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setEditingSubCategory(null);
    setMessage('Sub-Category updated.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteSubCategory = (groupId: string, categoryId: string, subCategoryId: string) => {
    const updatedGroups = domainGroups.map((group) =>
      group.id === groupId
        ? {
          ...group,
          categories: group.categories.map((category) =>
            category.id === categoryId
              ? {
                ...category,
                subCategories: category.subCategories.filter((subCategory) => subCategory.id !== subCategoryId),
              }
              : category
          ),
        }
        : group
    );
    setDomainGroups(updatedGroups);
    setMessage('Sub-Category deleted.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditingCategory(null);
    setEditingSubCategory(null);
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryId)) {
      newExpandedCategories.delete(categoryId);
    } else {
      newExpandedCategories.add(categoryId);
    }
    setExpandedCategories(newExpandedCategories);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-foreground mb-2">Domain Groups Configuration</h2>
        <p className="text-muted-foreground">
          Configure the hierarchical structure of Domain Groups, Categories, and Sub-Categories
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription className="text-left">{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="text-left">
          <CardTitle className="flex items-center justify-between">
            <span>Domain Groups Structure</span>
            <Button onClick={handleAddGroup} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain Group
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainGroups.map((group) => (
              <div key={group.id} className="border rounded-lg p-4">
                {/* Domain Group Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGroupExpansion(group.id)}
                    className="p-1 h-auto"
                  >
                    {expandedGroups.has(group.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {editingGroup === group.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingGroupName}
                        onChange={(e) => setEditingGroupName(e.target.value)}
                        className="text-left"
                      />
                      <Button size="sm" onClick={() => handleSaveGroup(group.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-left">Domain Group</Badge>
                        <span className="font-semibold text-left">{group.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditGroup(group.id, group.name)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddCategory(group.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Category
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Categories */}
                {expandedGroups.has(group.id) && (
                  <div className="ml-6 space-y-3">
                    {group.categories.map((category) => (
                      <div key={category.id} className="border-l-2 border-muted pl-4">
                        {/* Category Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="p-1 h-auto"
                          >
                            {expandedCategories.has(category.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                          
                          {editingCategory === category.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="text-left"
                              />
                              <Button size="sm" onClick={() => handleSaveCategory(group.id, category.id)}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1 justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-left">Category</Badge>
                                <span className="font-medium text-left">{category.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditCategory(category.id, category.name)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteCategory(group.id, category.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddSubCategory(group.id, category.id)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Sub-Category
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sub-Categories */}
                        {expandedCategories.has(category.id) && (
                          <div className="ml-6 space-y-2">
                            {category.subCategories.map((subCategory) => (
                              <div key={subCategory.id} className="border-l-2 border-muted-foreground/30 pl-4">
                                {editingSubCategory === subCategory.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={editingSubCategoryName}
                                      onChange={(e) => setEditingSubCategoryName(e.target.value)}
                                      className="text-left"
                                    />
                                    <Button size="sm" onClick={() => handleSaveSubCategory(group.id, category.id, subCategory.id)}>
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-left">Sub-Category</Badge>
                                      <span className="text-sm text-left">{subCategory.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditSubCategory(subCategory.id, subCategory.name)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteSubCategory(group.id, category.id, subCategory.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterDataStructureConfig;
