
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Save, X, Factory } from 'lucide-react';
import { IndustrySegmentData, IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from './industrySegmentDataManager';

interface IndustrySegmentDisplayProps {
  data: IndustrySegmentData;
  onDataUpdate: (data: IndustrySegmentData) => void;
}

const IndustrySegmentDisplay: React.FC<IndustrySegmentDisplayProps> = ({ data, onDataUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ industrySegment: '', description: '' });

  const handleEdit = (segment: IndustrySegment) => {
    setEditingId(segment.id);
    setEditForm({
      industrySegment: segment.industrySegment,
      description: segment.description
    });
  };

  const handleSave = (id: string) => {
    if (!editForm.industrySegment.trim()) {
      alert('Please enter an industry segment name');
      return;
    }

    // Check for duplicates (excluding current item)
    const exists = data.industrySegments.some(
      segment => segment.id !== id && 
      segment.industrySegment.toLowerCase() === editForm.industrySegment.toLowerCase()
    );

    if (exists) {
      alert('Industry segment already exists');
      return;
    }

    const updatedData = {
      ...data,
      industrySegments: data.industrySegments.map(segment =>
        segment.id === id
          ? {
              ...segment,
              industrySegment: editForm.industrySegment.trim(),
              description: editForm.description.trim()
            }
          : segment
      )
    };

    industrySegmentDataManager.saveData(updatedData);
    onDataUpdate(updatedData);
    setEditingId(null);
    
    console.log('✅ Industry segment updated:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this industry segment?')) {
      const updatedData = {
        ...data,
        industrySegments: data.industrySegments.filter(segment => segment.id !== id)
      };

      industrySegmentDataManager.saveData(updatedData);
      onDataUpdate(updatedData);
      
      console.log('🗑️ Industry segment deleted:', id);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ industrySegment: '', description: '' });
  };

  if (data.industrySegments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Industry Segments
          </CardTitle>
          <CardDescription>No industry segments configured yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Add your first industry segment using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Factory className="h-5 w-5" />
          Industry Segments
          <Badge variant="secondary">{data.industrySegments.length}</Badge>
        </CardTitle>
        <CardDescription>
          Manage existing industry segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.industrySegments.map((segment) => (
            <div key={segment.id} className="border rounded-lg p-4">
              {editingId === segment.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`edit-segment-${segment.id}`}>Industry Segment</Label>
                      <Input
                        id={`edit-segment-${segment.id}`}
                        type="text"
                        value={editForm.industrySegment}
                        onChange={(e) => setEditForm(prev => ({ ...prev, industrySegment: e.target.value }))}
                        placeholder="Enter industry segment name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`edit-description-${segment.id}`}>Description</Label>
                      <Textarea
                        id={`edit-description-${segment.id}`}
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(segment.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{segment.industrySegment}</h3>
                    {segment.description && (
                      <p className="text-muted-foreground mt-1">{segment.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(segment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(segment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentDisplay;
