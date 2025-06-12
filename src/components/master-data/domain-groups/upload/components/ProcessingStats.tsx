
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ProcessingResult, HierarchyData } from '../types';

interface ProcessingStatsProps {
  processingResult: ProcessingResult;
  hierarchyData: HierarchyData;
}

const ProcessingStats: React.FC<ProcessingStatsProps> = ({
  processingResult,
  hierarchyData
}) => {
  return (
    <div className="space-y-4">
      {/* Processing Statistics */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{processingResult.totalRows}</div>
            <div className="text-sm text-blue-700">Total Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{processingResult.validRows}</div>
            <div className="text-sm text-green-700">Valid Rows</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Object.keys(hierarchyData).length}</div>
            <div className="text-sm text-muted-foreground">Industry Segments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Object.values(hierarchyData).reduce((sum, dgs) => sum + Object.keys(dgs).length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Domain Groups</div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {processingResult.validRows > 0 && (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ready to Import
        </Badge>
      )}

      {/* Errors and Warnings */}
      {(processingResult.errors.length > 0 || processingResult.warnings.length > 0) && (
        <div className="space-y-2">
          {processingResult.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-900">Validation Errors</span>
              </div>
              <ul className="text-sm text-red-800 space-y-1">
                {processingResult.errors.slice(0, 5).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {processingResult.errors.length > 5 && (
                  <li className="font-medium">...and {processingResult.errors.length - 5} more errors</li>
                )}
              </ul>
            </div>
          )}
          
          {processingResult.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">Warnings</span>
              </div>
              <ul className="text-sm text-yellow-800 space-y-1">
                {processingResult.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcessingStats;
