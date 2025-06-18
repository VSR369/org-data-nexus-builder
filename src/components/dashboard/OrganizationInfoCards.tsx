
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Globe, Mail, Calendar, Shield, Database, AlertTriangle } from 'lucide-react';
import { useSeekerMasterData } from '@/hooks/useSeekerMasterData';
import { useUserData } from './UserDataProvider';

const OrganizationInfoCards: React.FC = () => {
  const { userData, isLoading } = useUserData();
  const { industrySegments } = useSeekerMasterData();

  console.log('🔍 OrganizationInfoCards: userData received:', userData);
  console.log('🔍 OrganizationInfoCards: isLoading:', isLoading);
  console.log('🔍 OrganizationInfoCards: industrySegments:', industrySegments);

  // Helper function to get industry segment name by ID
  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId || !industrySegments.length) return segmentId || 'Not Available';
    
    const segment = industrySegments.find(seg => seg.id === segmentId);
    return segment ? segment.industrySegment : segmentId;
  };

  // Helper function to check if a field has actual data
  const hasActualData = (value: string) => {
    return value && 
           value !== 'N/A' && 
           value !== 'Not Available' && 
           value !== 'Organization Name Not Available' &&
           value !== 'Entity Type Not Available' &&
           value !== 'Country Not Available' &&
           value !== 'Email Not Available' &&
           value !== 'Contact Person Not Available' &&
           value !== 'Organization Type Not Available' &&
           value !== 'Industry Segment Not Available' &&
           value !== 'Organization ID Not Available' &&
           value !== 'Registration Date Not Available' &&
           value.trim() !== '';
  };

  // Helper function to render field with status indicator
  const renderFieldWithStatus = (label: string, value: string, icon: React.ReactNode) => {
    const hasData = hasActualData(value);
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${
        hasData ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        {icon}
        <div className="flex-1">
          <p className={`text-sm font-medium ${hasData ? 'text-green-600' : 'text-red-600'}`}>
            {label}
          </p>
          <p className={`text-lg font-semibold ${hasData ? 'text-green-900' : 'text-red-700'}`}>
            {hasData ? value : `${label} - No Data Found`}
          </p>
        </div>
        {!hasData && <AlertTriangle className="h-4 w-4 text-red-500" />}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-medium">Loading organization data...</p>
            <p className="text-sm text-gray-600 mt-2">Retrieving seeking organization details from registration data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Count how many fields have actual data
  const fieldsWithData = [
    userData.organizationName,
    userData.organizationId,
    userData.organizationType,
    userData.industrySegment,
    userData.contactPersonName,
    userData.userId,
    userData.email,
    userData.country,
    userData.entityType,
    userData.registrationTimestamp
  ].filter(hasActualData).length;

  const totalFields = 10;
  const dataCompleteness = Math.round((fieldsWithData / totalFields) * 100);

  return (
    <div className="space-y-6">
      {/* Data Status Overview */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            Registration Data Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${
              dataCompleteness >= 80 ? 'bg-green-50 border-green-200' : 
              dataCompleteness >= 50 ? 'bg-yellow-50 border-yellow-200' : 
              'bg-red-50 border-red-200'
            }`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${
                  dataCompleteness >= 80 ? 'text-green-700' : 
                  dataCompleteness >= 50 ? 'text-yellow-700' : 
                  'text-red-700'
                }`}>
                  {dataCompleteness}%
                </p>
                <p className="text-sm text-gray-600">Data Completeness</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{fieldsWithData}/{totalFields}</p>
                <p className="text-sm text-gray-600">Fields Available</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-700">
                  {userData.registrationTimestamp && hasActualData(userData.registrationTimestamp) ? 
                    new Date(userData.registrationTimestamp).toLocaleDateString() : 'Unknown'
                  }
                </p>
                <p className="text-sm text-gray-600">Registration Date</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Organization Information */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-600" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {renderFieldWithStatus(
                "Organization Name", 
                userData.organizationName, 
                <Building className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Organization ID", 
                userData.organizationId, 
                <Database className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Organization Type", 
                userData.organizationType, 
                <Shield className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Industry Segment", 
                getIndustrySegmentName(userData.industrySegment), 
                <Building className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal & Contact Information */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6 text-green-600" />
              Contact & User Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {renderFieldWithStatus(
                "Contact Person", 
                userData.contactPersonName, 
                <User className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "User ID", 
                userData.userId, 
                <Database className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Email Address", 
                userData.email, 
                <Mail className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Country", 
                userData.country, 
                <Globe className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Entity & Registration Information */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-purple-600" />
              Entity & Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {renderFieldWithStatus(
                "Entity Type", 
                userData.entityType, 
                <Shield className="h-5 w-5 text-gray-400" />
              )}
              {renderFieldWithStatus(
                "Registration Date", 
                userData.registrationTimestamp && hasActualData(userData.registrationTimestamp) ? 
                  new Date(userData.registrationTimestamp).toLocaleDateString() : 
                  userData.registrationTimestamp, 
                <Calendar className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="h-6 w-6 text-orange-600" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Raw User Data</p>
                <pre className="text-xs text-gray-800 mt-2 overflow-auto max-h-40">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationInfoCards;
