
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';
import { Plus, X } from 'lucide-react';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface IndustrySegmentSectionProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  invalidFields?: Set<string>;
}

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  invalidFields = new Set()
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);
  const [selectedSegmentToAdd, setSelectedSegmentToAdd] = useState<string>('');

  useEffect(() => {
    // Load industry segments from shared DataManager
    const loadIndustrySegments = () => {
      console.log('📥 IndustrySegmentSection: Loading segments from shared DataManager...');
      
      const segments = industrySegmentsDataManager.loadData();
      console.log('📋 IndustrySegmentSection: Loaded segments:', segments);

      // Convert to IndustrySegment format
      const segmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
        id: (index + 1).toString(),
        name: segment,
        code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
        description: `Industry segment: ${segment}`
      }));

      setIndustrySegments(segmentObjects);
      console.log('✅ IndustrySegmentSection: Converted to segment objects:', segmentObjects);
    };

    loadIndustrySegments();

    // Listen for industry segments updates from master data
    const handleIndustrySegmentsUpdated = (event: CustomEvent) => {
      console.log('🔄 IndustrySegmentSection: Received industry segments update:', event.detail);
      loadIndustrySegments();
    };

    window.addEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated as EventListener);

    return () => {
      window.removeEventListener('industrySegmentsUpdated', handleIndustrySegmentsUpdated as EventListener);
    };
  }, []);

  const handleAddSegment = () => {
    if (selectedSegmentToAdd && !selectedIndustrySegments.includes(selectedSegmentToAdd)) {
      onAddIndustrySegment(selectedSegmentToAdd);
      setSelectedSegmentToAdd('');
    }
  };

  const availableSegments = industrySegments.filter(
    segment => !selectedIndustrySegments.includes(segment.id)
  );

  const getSelectedSegmentNames = () => {
    return selectedIndustrySegments.map(segmentId => {
      const segment = industrySegments.find(s => s.id === segmentId);
      return segment ? segment.name : segmentId;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Segments *</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select one or more industry segments where you provide solutions. You can add competencies for each segment.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider-type">Provider Type *</Label>
          <Select value={providerType} onValueChange={onProviderTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select provider type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selected Industry Segments */}
        {selectedIndustrySegments.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Industry Segments:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedIndustrySegments.map((segmentId) => {
                const segment = industrySegments.find(s => s.id === segmentId);
                return (
                  <Badge key={segmentId} variant="secondary" className="flex items-center gap-2">
                    {segment ? segment.name : segmentId}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => onRemoveIndustrySegment(segmentId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Industry Segment */}
        <div className="space-y-2">
          <Label htmlFor="industry-segment">Add Industry Segment</Label>
          <div className="flex gap-2">
            <Select value={selectedSegmentToAdd} onValueChange={setSelectedSegmentToAdd}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Industry Segment to Add" />
              </SelectTrigger>
              <SelectContent>
                {availableSegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddSegment}
              disabled={!selectedSegmentToAdd}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {selectedIndustrySegments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Please select at least one industry segment to continue with your enrollment.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentSection;
