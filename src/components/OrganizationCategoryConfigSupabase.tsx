import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit3, Check, X } from 'lucide-react';
import { useOrganizationCategories } from '@/hooks/useMasterDataCRUD';

interface OrganizationCategory {
  id?: string;
  name: string;
  description?: string;
  category_type: 'solution_seeker' | 'platform_provider' | 'solution_provider';
  is_active?: boolean;
  is_user_created?: boolean;
  workflow_config?: any;
  created_at?: string;
  updated_at?: string;
}

export function OrganizationCategoryConfigSupabase() {
  const { items: categories, loading, addItem, updateItem, deleteItem } = useOrganizationCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrganizationCategory>({
    name: '',
    description: '',
    category_type: 'solution_seeker',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const success = await updateItem(editingId, formData);
      if (success) {
        setEditingId(null);
        setFormData({ name: '', description: '', category_type: 'solution_seeker' });
      }
    } else {
      const success = await addItem(formData);
      if (success) {
        setIsAdding(false);
        setFormData({ name: '', description: '', category_type: 'solution_seeker' });
      }
    }
  };

  const handleEdit = (category: any) => {
    setFormData(category);
    setEditingId(category.id!);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', description: '', category_type: 'solution_seeker' });
  };

  const getCategoryTypeColor = (type: string) => {
    switch (type) {
      case 'solution_seeker': return 'bg-blue-100 text-blue-800';
      case 'platform_provider': return 'bg-green-100 text-green-800';
      case 'solution_provider': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Categories</CardTitle>
          <CardDescription>
            Manage organization categories that define workflow roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(isAdding || editingId) && (
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter category name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category_type">Category Type</Label>
                        <Select
                          value={formData.category_type}
                          onValueChange={(value) => setFormData({...formData, category_type: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solution_seeker">Solution Seeker</SelectItem>
                            <SelectItem value="platform_provider">Platform Provider</SelectItem>
                            <SelectItem value="solution_provider">Solution Provider</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        <Check className="w-4 h-4 mr-2" />
                        {editingId ? 'Update' : 'Add'}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {!isAdding && !editingId && (
              <Button onClick={() => setIsAdding(true)} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            )}

            <div className="space-y-2">
              {categories.map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge className={getCategoryTypeColor(category.category_type as string)}>
                          {category.category_type?.replace('_', ' ')}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        disabled={loading}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteItem(category.id!)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}