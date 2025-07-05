import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  FileText,
  Settings
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { CustomDataExtractor } from '@/utils/customDataExtractor';

interface CustomDataReport {
  totalCustomConfigurations: number;
  customDataCategories: string[];
  extractedData: Record<string, any>;
  removedDefaultKeys: string[];
  preservedCustomKeys: string[];
}

const CustomDataManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CustomDataReport | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check current status
    const currentReport = CustomDataExtractor.getExtractionReport();
    const customOnlyMode = CustomDataExtractor.isCustomOnlyMode();
    
    setReport(currentReport);
    setIsCustomMode(customOnlyMode);
    
    console.log('📋 Custom Data Manager Status:', {
      hasReport: !!currentReport,
      isCustomMode: customOnlyMode,
      totalConfigurations: currentReport?.totalCustomConfigurations || 0
    });
  }, []);

  const checkServiceStatus = (category: string, serviceName: string) => {
    const isCustomMode = CustomDataExtractor.isCustomOnlyMode();
    const customKey = `custom_${category}`;
    const regularKey = `master_data_${category}`;
    
    const hasCustomData = !!localStorage.getItem(customKey);
    const hasRegularData = !!localStorage.getItem(regularKey);
    
    return {
      serviceName,
      isCustomMode,
      hasCustomData,
      hasRegularData,
      usingCustomData: isCustomMode && hasCustomData,
      status: isCustomMode && hasCustomData ? 'CUSTOM' : 'DEFAULT/MOCK'
    };
  };

  const handleDebugDataStatus = () => {
    console.log('🔍 === COMPREHENSIVE DATA STATUS DEBUG ===');
    
    // Check each service individually
    const serviceStatus = {
      currencies: checkServiceStatus('currencies', 'CurrencyService'),
      industrySegments: checkServiceStatus('industrySegments', 'IndustrySegmentService'), 
      countries: checkServiceStatus('countries', 'CountriesDataManager'),
      organizationTypes: checkServiceStatus('organizationTypes', 'OrganizationTypeService'),
      entityTypes: checkServiceStatus('entityTypes', 'EntityTypeService')
    };
    
    console.log('📊 Service Status Report:', serviceStatus);
    
    // Check extraction report details
    const extractionReport = CustomDataExtractor.getExtractionReport();
    if (extractionReport) {
      console.log('📋 Extraction Report:', {
        totalCustomConfigurations: extractionReport.totalCustomConfigurations,
        customDataCategories: extractionReport.customDataCategories,
        removedDefaultKeys: extractionReport.removedDefaultKeys,
        preservedCustomKeys: extractionReport.preservedCustomKeys
      });
      
      console.log('🔍 "Removed Default Keys" Analysis:');
      console.log('These keys were identified as default/mock data and removed:', extractionReport.removedDefaultKeys);
      console.log('These keys contain your custom configurations:', extractionReport.preservedCustomKeys);
    }
    
    CustomDataExtractor.debugDataStatus();
    
    toast({
      title: "Debug Analysis Complete ✅",
      description: `Analyzed ${Object.keys(serviceStatus).length} services. Check console for detailed status report including "removed default keys" explanation.`,
    });
  };

  const handleExtractCustomData = async () => {
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting custom data extraction...');
      
      const extractionReport = await CustomDataExtractor.extractAndPreserveCustomData();
      setReport(extractionReport);
      setIsCustomMode(true);
      
      toast({
        title: "Custom Data Extracted Successfully! ✅",
        description: `Preserved ${extractionReport.totalCustomConfigurations} custom configurations across ${extractionReport.customDataCategories.length} categories. Removed ${extractionReport.removedDefaultKeys.length} default data keys.`,
      });
      
      // Refresh the page to ensure all components load with custom-only data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error extracting custom data:', error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract custom data. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadCustomData = () => {
    const customData = CustomDataExtractor.loadCustomOnlyData();
    console.log('📖 Loaded custom data:', customData);
    
    // Check if we're in custom mode
    const isCustomMode = CustomDataExtractor.isCustomOnlyMode();
    
    if (!isCustomMode) {
      toast({
        title: "Not in Custom Mode",
        description: "Please extract custom data first to enable custom-only mode",
        variant: "destructive"
      });
      return;
    }
    
    if (Object.keys(customData).length === 0) {
      toast({
        title: "No Custom Data Found",
        description: "No custom data available. Please extract custom data first.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Custom Data Loaded Successfully! ✅",
      description: `Loaded ${Object.keys(customData).length} custom data categories. Refreshing components...`,
    });
    
    // Force refresh all components to use custom data
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleResetToMixed = () => {
    localStorage.removeItem('master_data_mode');
    localStorage.removeItem('custom_data_extraction_timestamp');
    localStorage.removeItem('custom_data_report');
    
    setIsCustomMode(false);
    setReport(null);
    
    toast({
      title: "Reset Complete",
      description: "System reset to mixed mode (custom + default data)",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            Custom Data Manager
          </h2>
          <p className="text-muted-foreground mt-1">
            Extract, preserve, and manage your custom master data configurations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isCustomMode ? "default" : "secondary"} className="flex items-center gap-1">
            {isCustomMode ? <CheckCircle className="h-3 w-3" /> : <Settings className="h-3 w-3" />}
            {isCustomMode ? "Custom Only Mode" : "Mixed Mode"}
          </Badge>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {report.totalCustomConfigurations}
                  </div>
                  <div className="text-sm text-green-700">Custom Configurations</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {report.customDataCategories.length}
                  </div>
                  <div className="text-sm text-blue-700">Data Categories</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {report.removedDefaultKeys.length}
                  </div>
                  <div className="text-sm text-orange-700">Removed Default Keys</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Custom Data Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {report.customDataCategories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {report.preservedCustomKeys.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Preserved Storage Keys:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {report.preservedCustomKeys.map((key) => (
                      <div key={key} className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No custom data extraction has been performed yet. Click "Extract Custom Data" to analyze and preserve your custom configurations.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleExtractCustomData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isLoading ? "Extracting..." : "Extract & Preserve Custom Data"}
            </Button>
            
            <Button 
              onClick={handleLoadCustomData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Load Custom Data
            </Button>
            
            <Button 
              onClick={handleDebugDataStatus}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Debug Status & Analysis
            </Button>
            
            {isCustomMode && (
              <Button 
                onClick={handleResetToMixed}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Reset to Mixed Mode
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
              <div>
                <strong>Analysis:</strong> Scans all master data categories to identify custom configurations (user-created, modified, or non-default data).
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
              <div>
                <strong>Extraction:</strong> Extracts and preserves all custom data while removing default/fallback configurations.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibale">3</div>
              <div>
                <strong>Optimization:</strong> Creates a clean, custom-only storage structure that contains only your configured data.
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold">4</div>
              <div>
                <strong>Permanence:</strong> Sets the system to "Custom Only Mode" ensuring only your data is used going forward.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomDataManager;