
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Globe, Mail, Calendar, Shield, Database } from 'lucide-react';
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

  return (
    <div className="space-y-6">
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
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Organization Name</p>
                  <p className="text-lg font-semibold text-green-900">{userData.organizationName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Database className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Organization ID</p>
                  <p className="text-lg font-semibold text-green-900">{userData.organizationId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Shield className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Organization Type</p>
                  <p className="text-lg font-semibold text-green-900">{userData.organizationType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Building className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Industry Segment</p>
                  <p className="text-lg font-semibold text-green-900">{getIndustrySegmentName(userData.industrySegment)}</p>
                </div>
              </div>
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
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Contact Person</p>
                  <p className="text-lg font-semibold text-green-900">{userData.contactPersonName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Database className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">User ID</p>
                  <p className="text-lg font-semibold text-green-900">{userData.userId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Mail className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Email Address</p>
                  <p className="text-lg font-semibold text-green-900">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Globe className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Country</p>
                  <p className="text-lg font-semibold text-green-900">{userData.country}</p>
                </div>
              </div>
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
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Shield className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Entity Type</p>
                  <p className="text-lg font-semibold text-green-900">{userData.entityType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-green-50 border-green-200">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-600">Registration Date</p>
                  <p className="text-lg font-semibold text-green-900">
                    {userData.registrationTimestamp ? 
                      new Date(userData.registrationTimestamp).toLocaleDateString() : 
                      'Registration Date Not Available'
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationInfoCards;
