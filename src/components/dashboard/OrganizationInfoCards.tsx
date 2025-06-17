
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, User, Globe, Mail, Calendar, Shield, Database } from 'lucide-react';
import { useSeekerMasterData } from '@/hooks/useSeekerMasterData';
import { useUserData } from './UserDataProvider';

const OrganizationInfoCards: React.FC = () => {
  const { userData } = useUserData();
  const { industrySegments } = useSeekerMasterData();

  // Helper function to get industry segment name by ID
  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId || !industrySegments.length) return 'Not Available';
    
    const segment = industrySegments.find(seg => seg.id === segmentId);
    return segment ? segment.industrySegment : segmentId; // fallback to ID if not found
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Organization Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.organizationName || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Database className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Organization ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.organizationId && userData.organizationId !== userData.userId ? 
                    userData.organizationId : 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Organization Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.organizationType || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Building className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Industry Segment</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getIndustrySegmentName(userData.industrySegment)}
                </p>
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
            Personal & Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Contact Person</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.contactPersonName || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Database className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">User ID</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.userId || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Email Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.email || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Globe className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Country</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.country || 'Not Available'}
                </p>
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Entity Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.entityType || 'Not Available'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Registration Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {userData.registrationTimestamp ? 
                    new Date(userData.registrationTimestamp).toLocaleDateString() : 
                    'Not Available'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm text-green-600 font-medium">Registration Status</p>
                <p className="text-lg font-semibold text-green-700">
                  Active & Verified
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Database className="h-6 w-6 text-orange-600" />
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Building className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-blue-600 font-medium">Account Type</p>
                <p className="text-lg font-semibold text-blue-700">
                  Solution Seeker
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Database className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Profile Completion</p>
                <p className="text-lg font-semibold text-gray-900">
                  85%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm text-yellow-600 font-medium">Last Login</p>
                <p className="text-lg font-semibold text-yellow-700">
                  Today
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationInfoCards;
