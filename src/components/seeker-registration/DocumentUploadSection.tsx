
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import { FormData } from '@/types/seekerRegistration';

interface DocumentUploadSectionProps {
  formData: FormData;
  requiresRegistrationDocuments: boolean;
  onFileUpload: (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  formData,
  requiresRegistrationDocuments,
  onFileUpload
}) => {
  return (
    <div className="space-y-6">
      {/* Registration Documents (Conditional) */}
      {requiresRegistrationDocuments && (
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Registration Documents
          </h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Label htmlFor="registrationDocuments">Upload Registration Certificate and Supporting Documents (Max 3 files)</Label>
            <Input
              id="registrationDocuments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => onFileUpload('registrationDocuments', e.target.files)}
              className="mt-2"
            />
            {formData.registrationDocuments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="text-sm text-gray-500">
                  {formData.registrationDocuments.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* File Uploads */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Company Documents
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="companyProfile">Company Profile Document</Label>
            <Input
              id="companyProfile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileUpload('companyProfile', e.target.files)}
              className="mt-2"
            />
            {formData.companyProfile && <p className="text-sm text-gray-500 mt-1">Selected: {formData.companyProfile.name}</p>}
          </div>

          <div>
            <Label htmlFor="companyLogo">Company Logo</Label>
            <Input
              id="companyLogo"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={(e) => onFileUpload('companyLogo', e.target.files)}
              className="mt-2"
            />
            {formData.companyLogo && <p className="text-sm text-gray-500 mt-1">Selected: {formData.companyLogo.name}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
