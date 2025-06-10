
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { IndustrySegment } from '../types';
import { Building2 } from 'lucide-react';

interface IndustrySegmentSelectionProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (segmentId: string) => void;
}

export const IndustrySegmentSelection: React.FC<IndustrySegmentSelectionProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment
}) => {
  const selectedSegmentInfo = industrySegments.find(s => s.id === selectedIndustrySegment);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Industry Segment Selection
        </CardTitle>
        <CardDescription>
          Choose an industry segment from master data to create domain groups for
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {industrySegments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-muted-foreground">No active industry segments found in master data</p>
                <p className="text-sm text-muted-foreground">
                  Please configure industry segments in the Industry Segments section first
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="industry-segment">Industry Segment *</Label>
                <Select value={selectedIndustrySegment} onValueChange={onSelectIndustrySegment}>
                  <SelectTrigger id="industry-segment" className="mt-1">
                    <SelectValue placeholder="Select an industry segment from master data" />
                  </SelectTrigger>
                  <SelectContent>
                    {industrySegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {segment.code}
                          </Badge>
                          {segment.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSegmentInfo && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">{selectedSegmentInfo.name}</p>
                  {selectedSegmentInfo.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedSegmentInfo.description}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
