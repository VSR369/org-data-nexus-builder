
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface IndustrySegmentSectionProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  invalidFields?: Set<string>;
}

const industrySegments = [
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'healthcare', name: 'Healthcare & Life Sciences' },
  { id: 'financial-services', name: 'Financial Services' },
  { id: 'retail', name: 'Retail & Consumer Goods' },
  { id: 'technology', name: 'Technology & Software' },
  { id: 'logistics', name: 'Logistics & Supply Chain' },
  { id: 'energy', name: 'Energy & Utilities' },
  { id: 'government', name: 'Government & Public Sector' },
  { id: 'education', name: 'Education' },
  { id: 'real-estate', name: 'Real Estate & Construction' }
];

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  invalidFields = new Set()
}) => {
  const [newSegment, setNewSegment] = React.useState('');

  const handleAddSegment = () => {
    if (newSegment && !selectedIndustrySegments.includes(newSegment)) {
      onAddIndustrySegment(newSegment);
      setNewSegment('');
    }
  };

  const availableSegments = industrySegments.filter(
    segment => !selectedIndustrySegments.includes(segment.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Type Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Provider Type *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select whether you are registering as an individual or organization
            </p>
          </div>
          
          <RadioGroup 
            value={providerType} 
            onValueChange={onProviderTypeChange}
            className={invalidFields.has('providerType') ? 'border border-destructive rounded-md p-2' : ''}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="font-normal">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="organization" id="organization" />
              <Label htmlFor="organization" className="font-normal">Organization</Label>
            </div>
          </RadioGroup>
          
          {invalidFields.has('providerType') && (
            <p className="text-sm text-destructive">Please select a provider type</p>
          )}
        </div>

        {/* Industry Segments */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Industry Segments *</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the industry segments where you have expertise
            </p>
          </div>

          {/* Selected Segments */}
          {selectedIndustrySegments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Segments:</Label>
              <div className="flex flex-wrap gap-2">
                {selectedIndustrySegments.map((segmentId) => {
                  const segment = industrySegments.find(s => s.id === segmentId);
                  return (
                    <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                      {segment?.name || segmentId}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
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

          {/* Add New Segment */}
          <div className="flex gap-2">
            <Select value={newSegment} onValueChange={setNewSegment}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select an industry segment to add" />
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
              onClick={handleAddSegment} 
              disabled={!newSegment}
              variant="outline"
            >
              Add
            </Button>
          </div>

          {invalidFields.has('industrySegment') && (
            <p className="text-sm text-destructive">Please select at least one industry segment</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentSection;
