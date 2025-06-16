
import React from 'react';
import { FileText, FileImage, File, X } from 'lucide-react';

interface FileDisplayItemProps {
  file: File;
  onRemove: () => void;
}

const FileDisplayItem: React.FC<FileDisplayItemProps> = ({ file, onRemove }) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FileImage className="h-4 w-4 text-green-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getFileIcon(file.name)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 p-1 hover:bg-gray-200 rounded"
      >
        <X className="h-3 w-3 text-gray-400" />
      </button>
    </div>
  );
};

export default FileDisplayItem;
