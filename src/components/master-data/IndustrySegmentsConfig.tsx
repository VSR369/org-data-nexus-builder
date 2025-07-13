import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit2, Check, X, RefreshCw, Plus } from 'lucide-react';
import { useIndustrySegments } from '@/hooks/useMasterDataCRUD';

const IndustrySegmentsConfig: React.FC = () => {
  const { items: industrySegments, loading, addItem, updateItem, deleteItem, refreshItems } = useIndustrySegments();
  const [newSegment, setNewSegment] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSegment = async () => {
    if (newSegment.name.trim()) {
      const success = await addItem({ 
        name: newSegment.name.trim(),
        description: newSegment.description.trim() || undefined
      });
      if (success) {
        setNewSegment({ name: '', description: '' });
        setIsAdding(false);
      }
    }
  };

  const handleEditSegment = (id: string, name: string, description?: string) => {
    setEditingId(id);
    setEditingValue({ name, description: description || '' });
  };

  const handleSaveEdit = async () => {
    if (editingId && editingValue.name.trim()) {
      const success = await updateItem(editingId, { 
        name: editingValue.name.trim(),
        description: editingValue.description.trim() || undefined
      });
      if (success) {
        setEditingId(null);
        setEditingValue({ name: '', description: '' });
      }
    }
  };

  const handleDeleteSegment = async (id: string) => {
    await deleteItem(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue({ name: '', description: '' });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewSegment({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Segments Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button onClick={refreshItems} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding || loading}>
              <Plus className="h-4 w-4 mr-2" />
              Add Industry Segment
            </Button>
          </div>

          {isAdding && (
            <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted">
              <Input
                value={newSegment.name}
                onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter industry segment name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSegment();
                  } else if (e.key === 'Escape') {
                    handleCancelAdd();
                  }
                }}
                autoFocus
              />
              <Textarea
                value={newSegment.description}
                onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                rows={2}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddSegment} size="sm" disabled={loading}>
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button onClick={handleCancelAdd} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : industrySegments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No industry segments configured. Add some industry segments to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {industrySegments.map((segment) => (
                <div key={segment.id} className="p-3 border rounded-lg">
                  {editingId === segment.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingValue.name}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, name: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        autoFocus
                      />
                      <Textarea
                        value={editingValue.description}
                        onChange={(e) => setEditingValue(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description (optional)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" variant="outline" disabled={loading}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{segment.name}</h4>
                        {segment.description && (
                          <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          onClick={() => handleEditSegment(segment.id!, segment.name, segment.description)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDeleteSegment(segment.id!)} 
                          size="sm" 
                          variant="outline"
                          disabled={loading}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustrySegmentsConfig;