
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';
import { IndustrySegmentData, IndustrySegment } from '@/types/industrySegments';
import { industrySegmentDataManager } from './industrySegmentDataManager';

interface IndustrySegmentFormProps {
  data: IndustrySegmentData;
  onDataUpdate: (data: IndustrySegmentData) => void;
}

const IndustrySegmentForm: React.FC<IndustrySegmentFormProps> = ({ data, onDataUpdate }) => {
  const [industrySegment, setIndustrySegment] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!industrySegment.trim()) {
      alert('Please enter an industry segment name');
      return;
    }

    // Check for duplicates
    const exists = data.industrySegments.some(
      segment => segment.industrySegment.toLowerCase() === industrySegment.toLowerCase()
    );

    if (exists) {
      alert('Industry segment already exists');
      return;
    }

    const newSegment: IndustrySegment = {
      id: Date.now().toString(),
      industrySegment: industrySegment.trim(),
      description: description.trim()
    };

    const updatedData = {
      ...data,
      industrySegments: [...data.industrySegments, newSegment]
    };

    industrySegmentDataManager.saveData(updatedData);
    onDataUpdate(updatedData);
    
    // Clear form
    setIndustrySegment('');
    setDescription('');
    
    console.log('✅ Industry segment added:', newSegment);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Industry Segment
        </CardTitle>
        <CardDescription>
          Create a new industry segment with name and description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industrySegment">Industry Segment</Label>
              <Input
                id="industrySegment"
                type="text"
                value={industrySegment}
                onChange={(e) => setIndustrySegment(e.target.value)}
                placeholder="Enter industry segment name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Industry Segment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IndustrySegmentForm;
