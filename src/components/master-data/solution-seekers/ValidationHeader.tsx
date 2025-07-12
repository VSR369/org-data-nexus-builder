import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from 'lucide-react';
import type { SeekerDetails } from './types';

interface ValidationHeaderProps {
  seekersCount: number;
  onRefresh: () => void;
  onDownload: () => void;
}

const ValidationHeader: React.FC<ValidationHeaderProps> = ({ 
  seekersCount, 
  onRefresh, 
  onDownload 
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Solution Seekers Validation</h1>
        <p className="text-gray-600 mt-1">
          Found {seekersCount} solution seeker{seekersCount !== 1 ? 's' : ''} in the system
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={onDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Data
        </Button>
      </div>
    </div>
  );
};

export default ValidationHeader;