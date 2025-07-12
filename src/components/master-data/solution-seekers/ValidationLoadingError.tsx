import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ValidationLoadingErrorProps {
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ValidationLoadingError: React.FC<ValidationLoadingErrorProps> = ({ 
  loading, 
  error, 
  onRefresh 
}) => {
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading solution seekers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <Button onClick={onRefresh} className="mt-3" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ValidationLoadingError;