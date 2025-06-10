
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { DataManager, GlobalCacheManager } from '@/utils/dataManager';

const defaultSegments = [
  'Banking, Financial Services & Insurance (BFSI)',
  'Retail & E-Commerce',
  'Healthcare & Life Sciences',
  'Information Technology & Software Services',
  'Telecommunications',
  'Education & EdTech',
  'Manufacturing (Smart / Discrete / Process)',
  'Logistics & Supply Chain',
  'Media, Entertainment & OTT',
  'Energy & Utilities (Power, Oil & Gas, Renewables)',
  'Automotive & Mobility',
  'Real Estate & Smart Infrastructure',
  'Travel, Tourism & Hospitality',
  'Agriculture & AgriTech',
  'Public Sector & e-Governance'
];

// Create data manager instance
const dataManager = new DataManager<string[]>({
  key: 'master_data_industry_segments',
  defaultData: defaultSegments,
  version: 1
});

// Register with global cache manager
GlobalCacheManager.registerKey('master_data_industry_segments');

const IndustrySegmentConfig = () => {
  const { toast } = useToast();
  const [segments, setSegments] = useState<string[]>([]);
  const [newSegment, setNewSegment] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Track if initial load is complete

  // Load segments from DataManager on component mount
  useEffect(() => {
    const loadedSegments = dataManager.loadData();
    console.log('Loading industry segments from DataManager:', loadedSegments);
    setSegments(loadedSegments);
    setIsLoaded(true); // Mark as loaded after setting segments
    console.log('Industry segments loaded successfully:', loadedSegments.length, 'segments');
  }, []);

  // Save segments to DataManager only after initial load is complete
  useEffect(() => {
    if (!isLoaded) {
      console.log('Skipping save - initial load not complete yet');
      return; // Don't save during initial load
    }
    
    console.log('Saving industry segments to DataManager:', segments.length, 'segments');
    dataManager.saveData(segments);
    console.log('Industry segments saved successfully');
  }, [segments, isLoaded]);

  const handleAddSegment = () => {
    if (newSegment.trim()) {
      const updatedSegments = [...segments, newSegment.trim()];
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
    const updatedSegments = segments.filter((_, i) => i !== index);
    console.log('Deleting segment. New array length:', updatedSegments.length);
    setSegments(updatedSegments);
    toast({
      title: "Success",
      description: "Industry segment deleted successfully",
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
    const resetData = dataManager.resetToDefault();
    setSegments(resetData);
    toast({
      title: "Success",
      description: "Industry segments reset to default values",
    });
  };

  // Show loading state until data is loaded
  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Industry Segments</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading industry segments...</p>
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
          Configure industry segments for organization classification
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
            <p className="text-muted-foreground">No industry segments found. Add one to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentConfig;
