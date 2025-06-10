import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

const IndustrySegmentConfig = () => {
  const { toast } = useToast();
  const [segments, setSegments] = useState<string[]>([]);
  const [newSegment, setNewSegment] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load segments from shared DataManager on component mount
  useEffect(() => {
    console.log(`🚀 IndustrySegmentConfig: Starting initial load with shared DataManager...`);
    
    // Debug current localStorage state first
    industrySegmentsDataManager.debugCurrentState();
    
    const loadedSegments = industrySegmentsDataManager.loadData();
    console.log(`📥 IndustrySegmentConfig: Loaded segments from shared DataManager:`, loadedSegments);
    console.log(`📊 Loaded segments count: ${loadedSegments.length}`);
    
    setSegments(loadedSegments);
    setIsLoading(false);
    
    console.log(`✅ IndustrySegmentConfig: Initial load complete, segments set to:`, loadedSegments);
  }, []);

  // Save segments to shared DataManager - only after initial load is complete
  useEffect(() => {
    if (isLoading) {
      console.log(`⏸️ IndustrySegmentConfig: Skipping save - still loading`);
      return;
    }
    
    console.log(`💾 IndustrySegmentConfig: Auto-saving segments (${segments.length} items):`, segments);
    industrySegmentsDataManager.saveData(segments);
    console.log(`✅ IndustrySegmentConfig: Auto-save complete`);
    
    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('industrySegmentsUpdated', { detail: segments }));
  }, [segments, isLoading]);

  const handleAddSegment = () => {
    if (newSegment.trim()) {
      const updatedSegments = [...segments, newSegment.trim()];
      console.log(`➕ Adding segment: "${newSegment.trim()}", new array:`, updatedSegments);
      setSegments(updatedSegments);
      setNewSegment('');
      setIsAdding(false);
      toast({
        title: "Success",
        description: "Industry segment added successfully",
      });
    }
  };

  const handleEditSegment = (index: number) => {
    setEditingIndex(index);
    setEditingValue(segments[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const updatedSegments = [...segments];
      updatedSegments[editingIndex] = editingValue.trim();
      console.log(`✏️ Editing segment at index ${editingIndex}: "${editingValue.trim()}", new array:`, updatedSegments);
      setSegments(updatedSegments);
      setEditingIndex(null);
      setEditingValue('');
      toast({
        title: "Success",
        description: "Industry segment updated successfully",
      });
    }
  };

  const handleDeleteSegment = (index: number) => {
    const segmentToDelete = segments[index];
    const updatedSegments = segments.filter((_, i) => i !== index);
    console.log(`🗑️ Deleting segment "${segmentToDelete}" at index ${index}`);
    console.log(`📊 New array length: ${updatedSegments.length}, segments:`, updatedSegments);
    setSegments(updatedSegments);
    toast({
      title: "Success",
      description: `Industry segment "${segmentToDelete}" deleted successfully`,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewSegment('');
  };

  const handleResetToDefault = () => {
    console.log(`🔄 IndustrySegmentConfig: Resetting to default data`);
    const resetData = industrySegmentsDataManager.resetToDefault();
    setSegments(resetData);
    toast({
      title: "Success",
      description: "Industry segments reset to default values",
    });
  };

  // Show loading state until data is loaded
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Segments</CardTitle>
          <CardDescription>Loading industry segments...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading industry segments from storage...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Segments</CardTitle>
        <CardDescription>
          Configure industry segments for organization classification ({segments.length} segments)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Current Industry Segments</h3>
          <div className="flex gap-2">
            <Button 
              onClick={handleResetToDefault}
              variant="outline"
              className="flex items-center gap-2"
            >
              Reset to Default
            </Button>
            <Button 
              onClick={() => setIsAdding(true)} 
              disabled={isAdding}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Segment
            </Button>
          </div>
        </div>

        {isAdding && (
          <div className="flex gap-2 p-4 border rounded-lg bg-muted/50">
            <div className="flex-1">
              <Label htmlFor="new-segment">New Industry Segment</Label>
              <Input
                id="new-segment"
                value={newSegment}
                onChange={(e) => setNewSegment(e.target.value)}
                placeholder="Enter industry segment name"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleAddSegment} size="sm" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Save
              </Button>
              <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex items-center gap-1">
                <X className="w-3 h-3" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-2">
          {segments.map((segment, index) => (
            <div key={`${segment}-${index}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              {editingIndex === index ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveEdit} size="sm" className="flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="font-medium">{segment}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditSegment(index)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteSegment(index)}
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

        {segments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No industry segments configured. You can add segments or reset to defaults.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentConfig;
