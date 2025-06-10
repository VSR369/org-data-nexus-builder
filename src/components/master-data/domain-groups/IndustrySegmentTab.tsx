
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndustrySegment } from './types';
import { Building2, Check } from 'lucide-react';

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
  console.log('IndustrySegmentTab - Industry segments:', industrySegments);
  console.log('IndustrySegmentTab - Selected segment:', selectedIndustrySegment);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Industry Segment
          </CardTitle>
          <CardDescription>
            Choose an industry segment to manage its domain groups
          </CardDescription>
        </CardHeader>
        <CardContent>
          {industrySegments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No industry segments available</p>
            </div>
          ) : (
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
                    <Badge variant="secondary" className="font-mono text-xs">
                      {segment.code}
                    </Badge>
                    <div>
                      <span className="font-medium">{segment.name}</span>
                      {segment.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {segment.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedIndustrySegment === segment.id && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <Badge variant="default" className="text-xs">Selected</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
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
