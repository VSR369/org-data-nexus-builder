
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { industrySegmentsDataManager } from '@/utils/sharedDataManagers';

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface IndustrySegmentSectionProps {
  selectedIndustrySegment: string;
  onIndustrySegmentChange: (value: string) => void;
}

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  selectedIndustrySegment,
  onIndustrySegmentChange
}) => {
  const [industrySegments, setIndustrySegments] = useState<IndustrySegment[]>([]);

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

  const selectedSegment = industrySegments.find(segment => segment.id === selectedIndustrySegment);

  return (
    <div className="space-y-2">
      <Label htmlFor="industry-segment">Industry Segment *</Label>
      <Select value={selectedIndustrySegment} onValueChange={onIndustrySegmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Industry Segment" />
        </SelectTrigger>
        <SelectContent>
          {industrySegments.map((segment) => (
            <SelectItem key={segment.id} value={segment.id}>
              {segment.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSegment && (
        <p className="text-sm text-muted-foreground">
          Selected: {selectedSegment.name}
        </p>
      )}
    </div>
  );
};

export default IndustrySegmentSection;
