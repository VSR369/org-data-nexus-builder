
import React, { useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { FormData } from './types';

interface AdditionalInfoSectionProps {
  formData: FormData;
  updateFormData: (field: string, value: string | string[]) => void;
  invalidFields?: Set<string>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  updateFormData,
  invalidFields = new Set()
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFileNames = Array.from(files).map(file => file.name);
      console.log('Files selected:', newFileNames);
      
      // Add new files to existing ones
      const existingFiles = formData.profileDocuments || [];
      const updatedFiles = [...existingFiles, ...newFileNames];
      updateFormData('profileDocuments', updatedFiles);
      
      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeDocument = (indexToRemove: number) => {
    const updatedFiles = formData.profileDocuments.filter((_, index) => index !== indexToRemove);
    updateFormData('profileDocuments', updatedFiles);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-upload">Upload Detailed Profile (Documents)</Label>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onClick={handleUploadClick}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop your profile documents
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOC, DOCX files supported (multiple files allowed)
            </p>
            <Input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              multiple
            />
          </div>
          
          {/* Display uploaded files */}
          {formData.profileDocuments && formData.profileDocuments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Uploaded Documents:</Label>
              <div className="space-y-2">
                {formData.profileDocuments.map((fileName, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-sm text-primary truncate flex-1">{fileName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
