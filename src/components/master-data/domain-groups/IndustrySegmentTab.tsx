
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndustrySegment } from './types';

interface IndustrySegmentTabProps {
  industrySegments: IndustrySegment[];
  selectedIndustrySegment: string;
  onSelectIndustrySegment: (id: string) => void;
  showMessage: (message: string) => void;
}

export const IndustrySegmentTab: React.FC<IndustrySegmentTabProps> = ({
  industrySegments,
  selectedIndustrySegment,
  onSelectIndustrySegment,
  showMessage
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Industry Segment</CardTitle>
          <CardDescription>
            Choose an industry segment to manage its domain groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {industrySegments.map((segment) => (
              <div
                key={segment.id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedIndustrySegment === segment.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  onSelectIndustrySegment(segment.id);
                  showMessage(`Selected industry segment: ${segment.name}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{segment.code.toUpperCase()}</Badge>
                  <span className="font-medium">{segment.name}</span>
                </div>
                {selectedIndustrySegment === segment.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            ))}
          </div>
          
          {selectedIndustrySegment && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Selected industry segment will be used for creating domain groups in the next tab.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
