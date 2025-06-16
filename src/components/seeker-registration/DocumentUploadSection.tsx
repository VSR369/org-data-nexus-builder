
import React from 'react';
import { Label } from "@/components/ui/label";
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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
        <h3 className="text-lg font-semibold text-blue-600">Company Documents</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Company Profile Document</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <input
              type="file"
              onChange={(e) => onFileUpload('companyProfile', e.target.files)}
              className="hidden"
              id="companyProfile"
              accept=".pdf,.doc,.docx"
            />
            <Label htmlFor="companyProfile" className="cursor-pointer text-blue-600 hover:underline">
              Choose File
            </Label>
            <p className="text-sm text-gray-500 mt-1">No file chosen</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <input
              type="file"
              onChange={(e) => onFileUpload('companyLogo', e.target.files)}
              className="hidden"
              id="companyLogo"
              accept="image/*"
            />
            <Label htmlFor="companyLogo" className="cursor-pointer text-blue-600 hover:underline">
              Choose File
            </Label>
            <p className="text-sm text-gray-500 mt-1">No file chosen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
