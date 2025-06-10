
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DomainGroup, IndustrySegment } from '../types';
import { Plus } from 'lucide-react';

interface DomainGroupCreationProps {
  selectedIndustrySegment: string;
  selectedSegmentInfo?: IndustrySegment;
  onAddDomainGroup: (group: Omit<DomainGroup, 'id' | 'createdAt' | 'categories'>) => void;
  showMessage: (message: string) => void;
}

export const DomainGroupCreation: React.FC<DomainGroupCreationProps> = ({
  selectedIndustrySegment,
  selectedSegmentInfo,
  onAddDomainGroup,
  showMessage
}) => {
  const [domainGroupName, setDomainGroupName] = useState('');
  const [domainGroupDescription, setDomainGroupDescription] = useState('');

  const handleAddDomainGroup = () => {
    if (!selectedIndustrySegment) {
      showMessage('Please select an industry segment first');
      return;
    }
    if (!domainGroupName.trim()) {
      showMessage('Please enter a domain group name');
      return;
    }

    onAddDomainGroup({
      name: domainGroupName.trim(),
      description: domainGroupDescription.trim() || undefined,
      industrySegmentId: selectedIndustrySegment,
      isActive: true
    });

    setDomainGroupName('');
    setDomainGroupDescription('');
    showMessage(`Domain group "${domainGroupName}" added successfully`);
  };

  if (!selectedIndustrySegment) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Domain Group</CardTitle>
        <CardDescription>
          Create a new domain group for {selectedSegmentInfo?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="domain-group-name">Domain Group Name *</Label>
            <Input
              id="domain-group-name"
              value={domainGroupName}
              onChange={(e) => setDomainGroupName(e.target.value)}
              placeholder="Enter domain group name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="domain-group-description">Description</Label>
            <Textarea
              id="domain-group-description"
              value={domainGroupDescription}
              onChange={(e) => setDomainGroupDescription(e.target.value)}
              placeholder="Enter domain group description (optional)"
              className="mt-1"
              rows={2}
            />
          </div>
          <Button 
            onClick={handleAddDomainGroup}
            disabled={!domainGroupName.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Domain Group
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
