
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IndustrySegmentSectionProps {
  selectedIndustrySegment: string;
  onIndustrySegmentChange: (value: string) => void;
}

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  selectedIndustrySegment,
  onIndustrySegmentChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="industry-segment">Industry Segment *</Label>
      <Select value={selectedIndustrySegment} onValueChange={onIndustrySegmentChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Industry Segment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bfsi">Banking, Financial Services & Insurance (BFSI)</SelectItem>
          <SelectItem value="retail">Retail & E-Commerce</SelectItem>
          <SelectItem value="healthcare">Healthcare & Life Sciences</SelectItem>
          <SelectItem value="it">Information Technology & Software Services</SelectItem>
          <SelectItem value="telecom">Telecommunications</SelectItem>
          <SelectItem value="education">Education & EdTech</SelectItem>
          <SelectItem value="manufacturing">Manufacturing</SelectItem>
          <SelectItem value="logistics">Logistics & Supply Chain</SelectItem>
        </SelectContent>
      </Select>
      {selectedIndustrySegment && (
        <p className="text-sm text-muted-foreground">
          Selected: {selectedIndustrySegment}
        </p>
      )}
    </div>
  );
};

export default IndustrySegmentSection;
