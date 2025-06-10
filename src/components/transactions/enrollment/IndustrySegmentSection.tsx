
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface IndustrySegment {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface IndustrySegmentSectionProps {
  selectedIndustrySegments: string[];
  onAddIndustrySegment: (value: string) => void;
  onRemoveIndustrySegment: (value: string) => void;
  providerType: string;
  onProviderTypeChange: (value: string) => void;
  invalidFields?: Set<string>;
  providerRoles?: string[];
}

const IndustrySegmentSection: React.FC<IndustrySegmentSectionProps> = ({
  selectedIndustrySegments,
  onAddIndustrySegment,
  onRemoveIndustrySegment,
  providerType,
  onProviderTypeChange,
  invalidFields = new Set(),
  providerRoles = []
}) => {
  const [newSegment, setNewSegment] = React.useState('');
  const [industrySegments, setIndustrySegments] = React.useState<IndustrySegment[]>([]);

  // Load industry segments from master data
  React.useEffect(() => {
    const loadIndustrySegments = () => {
      const savedIndustrySegments = localStorage.getItem('master_data_industry_segments');
      if (savedIndustrySegments) {
        try {
          const industrySegmentsData: IndustrySegment[] = JSON.parse(savedIndustrySegments);
          console.log('Loaded industry segments from master data:', industrySegmentsData);
          setIndustrySegments(industrySegmentsData.filter(segment => segment.isActive));
        } catch (error) {
          console.error('Error parsing industry segments data:', error);
          setIndustrySegments([]);
        }
      } else {
        console.log('No industry segments found in master data');
        setIndustrySegments([]);
      }
    };

    loadIndustrySegments();
  }, []);

  const handleAddSegment = () => {
    if (newSegment && !selectedIndustrySegments.includes(newSegment)) {
      onAddIndustrySegment(newSegment);
      setNewSegment('');
    }
  };

  const availableSegments = industrySegments.filter(
    segment => !selectedIndustrySegments.includes(segment.id) && segment.isActive
  );

  // Helper function to get industry segment name by ID
  const getIndustrySegmentName = (segmentId: string) => {
    const segment = industrySegments.find(s => s.id === segmentId);
    return segment ? segment.name : `Industry Segment ${segmentId}`;
  };

  // Determine the heading based on selected roles
  const getHeading = () => {
    const currentRoles = providerRoles || [];
    const hasProvider = currentRoles.includes('solution-provider');
    const hasAssessor = currentRoles.includes('solution-assessor');
    const hasBoth = currentRoles.includes('both') || (hasProvider && hasAssessor);

    if (hasBoth) {
      return "Provider & Assessor Both Roles Information";
    } else if (hasAssessor) {
      return "Assessor Information";
    } else if (hasProvider) {
      return "Provider Information";
    } else {
      return "Provider Information"; // Default heading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getHeading()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Type Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Representation *</Label>
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
            <p className="text-sm text-destructive">Please select a representation type</p>
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
                {selectedIndustrySegments.map((segmentId) => (
                  <Badge key={segmentId} variant="secondary" className="flex items-center gap-1">
                    {getIndustrySegmentName(segmentId)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent"
                      onClick={() => onRemoveIndustrySegment(segmentId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
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

          {industrySegments.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                No industry segments found. Please configure industry segments in Foundation Data first.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentSection;
