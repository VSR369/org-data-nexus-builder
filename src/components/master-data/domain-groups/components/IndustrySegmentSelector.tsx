
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IndustrySegment } from '../types';

interface IndustrySegmentSelectorProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (segmentId: string) => void;
}

export const IndustrySegmentSelector: React.FC<IndustrySegmentSelectorProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment
}) => {
  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Segment Selection</CardTitle>
        <CardDescription>
          Select an industry segment to view its domain groups hierarchy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="industry-segment-select">Industry Segment</Label>
            <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
              <SelectTrigger id="industry-segment-select" className="mt-1">
                <SelectValue placeholder="Select an industry segment" />
              </SelectTrigger>
              <SelectContent>
                {industrySegments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
