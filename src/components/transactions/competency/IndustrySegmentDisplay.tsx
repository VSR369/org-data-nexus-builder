
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndustrySegmentDisplayProps {
  selectedIndustrySegment: string;
  getIndustrySegmentName: (value: string) => string;
}

const IndustrySegmentDisplay: React.FC<IndustrySegmentDisplayProps> = ({
  selectedIndustrySegment,
  getIndustrySegmentName
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selected Industry Segment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-base px-4 py-2">
            {getIndustrySegmentName(selectedIndustrySegment)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentDisplay;
