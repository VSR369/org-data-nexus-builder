
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    // Load industry segments from master data
    const loadIndustrySegments = () => {
      const savedSegments = localStorage.getItem('industrySegments');
      let segments: string[] = [];
      
      if (savedSegments) {
        try {
          segments = JSON.parse(savedSegments);
        } catch (error) {
          console.error('Error parsing saved segments:', error);
          // Default segments if parsing fails
          segments = [
            'Banking, Financial Services & Insurance (BFSI)',
            'Retail & E-Commerce',
            'Healthcare & Life Sciences',
            'Information Technology & Software Services',
            'Telecommunications',
            'Education & EdTech',
            'Manufacturing (Smart / Discrete / Process)',
            'Logistics & Supply Chain'
          ];
        }
      } else {
        // Default segments if none saved
        segments = [
          'Banking, Financial Services & Insurance (BFSI)',
          'Retail & E-Commerce',
          'Healthcare & Life Sciences',
          'Information Technology & Software Services',
          'Telecommunications',
          'Education & EdTech',
          'Manufacturing (Smart / Discrete / Process)',
          'Logistics & Supply Chain'
        ];
      }

      // Convert to IndustrySegment format
      const segmentObjects: IndustrySegment[] = segments.map((segment, index) => ({
        id: (index + 1).toString(),
        name: segment,
        code: segment.split(' ')[0].substring(0, 4).toUpperCase(),
        description: `Industry segment: ${segment}`
      }));

      setIndustrySegments(segmentObjects);
      console.log('Loaded industry segments for enrollment:', segmentObjects);
    };

    loadIndustrySegments();
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
