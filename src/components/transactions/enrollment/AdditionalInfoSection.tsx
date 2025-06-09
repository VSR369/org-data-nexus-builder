
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import { FormData } from './types';

interface AdditionalInfoSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  updateFormData
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-upload">Upload Detailed Profile (Document)</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop your profile document
            </p>
            <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input 
              id="linkedin" 
              type="url" 
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin}
              onChange={(e) => updateFormData('linkedin', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="articles">Articles/Publications</Label>
            <Input 
              id="articles" 
              type="url" 
              placeholder="https://example.com/articles"
              value={formData.articles}
              onChange={(e) => updateFormData('articles', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websites">Personal/Professional Website</Label>
            <Input 
              id="websites" 
              type="url" 
              placeholder="https://yourwebsite.com"
              value={formData.websites}
              onChange={(e) => updateFormData('websites', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
