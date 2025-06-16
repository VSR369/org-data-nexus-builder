
import React from 'react';
import { Label } from "@/components/ui/label";
import { Upload } from 'lucide-react';
import { FormData } from '@/types/seekerRegistration';
import FileDisplayItem from './FileDisplayItem';

interface DocumentUploadSectionProps {
  formData: FormData;
  requiresRegistrationDocuments: boolean;
  onFileUpload: (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', files: FileList | null) => void;
  onFileRemove: (field: 'registrationDocuments' | 'companyProfile' | 'companyLogo', index?: number) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  formData,
  requiresRegistrationDocuments,
  onFileUpload,
  onFileRemove
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
        <h3 className="text-lg font-semibold text-blue-600">Company Documents</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requiresRegistrationDocuments && (
          <div className="space-y-2 md:col-span-2">
            <Label>Registration Documents *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <input
                type="file"
                onChange={(e) => onFileUpload('registrationDocuments', e.target.files)}
                className="hidden"
                id="registrationDocuments"
                accept=".pdf,.doc,.docx"
                multiple
              />
              <Label htmlFor="registrationDocuments" className="cursor-pointer text-blue-600 hover:underline">
                Choose Files
              </Label>
              <p className="text-xs text-gray-400 mt-1">Required for Non-Profit Organization, Society, or Trust</p>
              <p className="text-xs text-blue-600 mt-1">Accepted formats: PDF, DOC, DOCX</p>
            </div>
            
            {formData.registrationDocuments && formData.registrationDocuments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.registrationDocuments.map((file, index) => (
                  <FileDisplayItem
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() => onFileRemove('registrationDocuments', index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
              multiple
            />
            <Label htmlFor="companyProfile" className="cursor-pointer text-blue-600 hover:underline">
              Choose Files
            </Label>
            <p className="text-xs text-blue-600 mt-1">Accepted formats: PDF, DOC, DOCX</p>
          </div>
          
          {formData.companyProfile && formData.companyProfile.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.companyProfile.map((file, index) => (
                <FileDisplayItem
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => onFileRemove('companyProfile', index)}
                />
              ))}
            </div>
          )}
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
              multiple
            />
            <Label htmlFor="companyLogo" className="cursor-pointer text-blue-600 hover:underline">
              Choose Files
            </Label>
            <p className="text-xs text-blue-600 mt-1">Accepted formats: JPG, PNG, GIF, SVG</p>
          </div>
          
          {formData.companyLogo && formData.companyLogo.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.companyLogo.map((file, index) => (
                <FileDisplayItem
                  key={`${file.name}-${index}`}
                  file={file}
                  onRemove={() => onFileRemove('companyLogo', index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
