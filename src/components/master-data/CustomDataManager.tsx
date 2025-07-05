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
    
    // 1. Scan ALL localStorage for any data that looks custom
    const allKeys = Object.keys(localStorage);
    const masterDataKeys = allKeys.filter(key => 
      key.startsWith('master_data_') || 
      key.startsWith('custom_') || 
      key.includes('currencies') ||
      key.includes('countries') ||
      key.includes('industry') ||
      key.includes('organization') ||
      key.includes('entity') ||
      key.includes('department') ||
      key.includes('domain') ||
      key.includes('challenge') ||
      key.includes('solution') ||
      key.includes('competency') ||
      key.includes('communication') ||
      key.includes('reward') ||
      key.includes('membership') ||
      key.includes('engagement') ||
      key.includes('pricing') ||
      key.includes('events')
    );
    
    console.log('🔍 ALL localStorage keys related to master data:', masterDataKeys);
    
    // 2. Analyze each key for custom data
    const customDataAnalysis: Record<string, any> = {};
    masterDataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const isCustom = analyzeIfCustomData(parsed, key);
          customDataAnalysis[key] = {
            isCustom,
            dataType: Array.isArray(parsed) ? 'array' : typeof parsed,
            itemCount: Array.isArray(parsed) ? parsed.length : (typeof parsed === 'object' ? Object.keys(parsed).length : 1),
            hasCustomIndicators: JSON.stringify(parsed).includes('custom') || JSON.stringify(parsed).includes('user'),
            sample: Array.isArray(parsed) ? parsed[0] : (typeof parsed === 'object' ? Object.keys(parsed)[0] : parsed)
          };
        } catch (error) {
          customDataAnalysis[key] = { error: 'Failed to parse JSON' };
        }
      }
    });
    
    console.log('📊 Custom Data Analysis:', customDataAnalysis);
    
    // 3. Check each service individually
    const serviceStatus = {
      currencies: checkServiceStatus('currencies', 'CurrencyService'),
      industrySegments: checkServiceStatus('industrySegments', 'IndustrySegmentService'), 
      countries: checkServiceStatus('countries', 'CountriesDataManager'),
      organizationTypes: checkServiceStatus('organizationTypes', 'OrganizationTypeService'),
      entityTypes: checkServiceStatus('entityTypes', 'EntityTypeService'),
      departments: checkServiceStatus('departments', 'DepartmentsService'),
      domainGroups: checkServiceStatus('domainGroups', 'DomainGroupsService'),
      challengeStatuses: checkServiceStatus('challengeStatuses', 'ChallengeStatusService'),
      solutionStatuses: checkServiceStatus('solutionStatuses', 'SolutionStatusService'),
      competencyCapabilities: checkServiceStatus('competencyCapabilities', 'CompetencyService'),
      communicationTypes: checkServiceStatus('communicationTypes', 'CommunicationTypeService'),
      rewardTypes: checkServiceStatus('rewardTypes', 'RewardTypeService'),
      seekerMembershipFees: checkServiceStatus('seekerMembershipFees', 'MembershipFeeService'),
      engagementModels: checkServiceStatus('engagementModels', 'EngagementModelsService'),
      pricing: checkServiceStatus('pricing', 'PricingService'),  
      events: checkServiceStatus('events', 'EventsService')
    };
    
    console.log('📊 Service Status Report:', serviceStatus);
    
    // 4. Identify issues
    const issues: string[] = [];
    Object.entries(serviceStatus).forEach(([key, status]) => {
      if (customDataAnalysis[`master_data_${key}`]?.isCustom && status.status === 'DEFAULT/MOCK') {
        issues.push(`${key} has custom data but service is using default/mock`);
      }
    });
    
    if (issues.length > 0) {
      console.error('🚨 ISSUES FOUND:', issues);
    } else {
      console.log('✅ No issues found - all services using appropriate data sources');
    }
    
    // 5. Check extraction report details
    const extractionReport = CustomDataExtractor.getExtractionReport();
    if (extractionReport) {
      console.log('📋 Extraction Report:', {
        totalCustomConfigurations: extractionReport.totalCustomConfigurations,
        customDataCategories: extractionReport.customDataCategories,
        removedDefaultKeys: extractionReport.removedDefaultKeys,
        preservedCustomKeys: extractionReport.preservedCustomKeys
      });
    }
    
    CustomDataExtractor.debugDataStatus();
    
    toast({
      title: "Comprehensive Debug Complete ✅",
      description: `Analyzed ${masterDataKeys.length} storage keys and ${Object.keys(serviceStatus).length} services. ${issues.length > 0 ? `Found ${issues.length} issues.` : 'No issues found.'} Check console for details.`,
    });
  };

  // Helper function to analyze if data is custom
  const analyzeIfCustomData = (data: any, key: string): boolean => {
    if (!data) return false;
    
    // Check for custom indicators
    const dataString = JSON.stringify(data);
    const hasCustomMarkers = dataString.includes('custom') || 
                            dataString.includes('user') || 
                            dataString.includes('modified') ||
                            dataString.includes('created');
    
    // Check data size vs expected defaults
    const category = key.replace('master_data_', '').replace('custom_', '');
    const defaultSizes: Record<string, number> = {
      'countries': 3,
      'currencies': 2,  
      'industry_segments': 3,
      'organization_types': 5,
      'entity_types': 2,
      'departments': 6
    };
    
    const expectedSize = defaultSizes[category] || 0;
    const actualSize = Array.isArray(data) ? data.length : 
                      (data.industrySegments ? data.industrySegments.length : 
                       (typeof data === 'object' ? Object.keys(data).length : 1));
    
    return hasCustomMarkers || actualSize > expectedSize;
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

  const handleAutoFixDataIssues = async () => {
    setIsLoading(true);
    console.log('🔧 Auto-fixing custom data loading issues...');
    
    try {
      // 1. Identify all custom data in localStorage
      const customData: Record<string, any> = {};
      const allKeys = Object.keys(localStorage);
      
      const masterDataCategories = [
        'countries', 'currencies', 'industry_segments', 'organization_types', 
        'entity_types', 'departments', 'domain_groups', 'challenge_statuses',
        'solution_statuses', 'competency_capabilities', 'communication_types',
        'reward_types', 'seeker_membership_fees', 'engagement_models', 
        'pricing', 'events'
      ];
      
      // 2. Find and preserve custom data
      let customDataFound = 0;
      masterDataCategories.forEach(category => {
        const possibleKeys = [
          `master_data_${category}`,
          `custom_${category}`,
          category,
          category.replace('_', '')
        ];
        
        for (const key of possibleKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (analyzeIfCustomData(parsed, key)) {
                console.log(`✅ Found custom data for ${category} in key: ${key}`);
                customData[category] = parsed;
                customDataFound++;
                
                // Store in custom format
                localStorage.setItem(`custom_${category}`, JSON.stringify(parsed));
                break;
              }
            } catch (error) {
              console.warn(`⚠️ Error parsing ${key}:`, error);
            }
          }
        }
      });
      
      // 3. Set custom-only mode
      localStorage.setItem('master_data_mode', 'custom_only');
      localStorage.setItem('custom_data_fix_timestamp', new Date().toISOString());
      
      // 4. Create fix report  
      const fixReport: CustomDataReport = {
        totalCustomConfigurations: customDataFound,
        customDataCategories: Object.keys(customData),
        extractedData: customData,
        removedDefaultKeys: [], // Auto-fix doesn't remove keys, just preserves custom data
        preservedCustomKeys: Object.keys(customData).map(cat => `custom_${cat}`)
      };
      
      localStorage.setItem('custom_data_report', JSON.stringify(fixReport));
      setReport(fixReport);
      setIsCustomMode(true);
      
      console.log('✅ Auto-fix completed:', fixReport);
      
      toast({
        title: "Custom Data Issues Fixed! ✅",
        description: `Found and fixed ${customDataFound} custom data categories. System now in custom-only mode. Refreshing...`,
      });
      
      // 5. Force refresh to reload all services
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error auto-fixing custom data:', error);
      toast({
        title: "Auto-Fix Failed",
        description: "Failed to auto-fix custom data issues. Please check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
              Debug & Fix All Data Issues
            </Button>
            
            <Button 
              onClick={handleAutoFixDataIssues}
              variant="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Auto-Fix Custom Data Loading
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