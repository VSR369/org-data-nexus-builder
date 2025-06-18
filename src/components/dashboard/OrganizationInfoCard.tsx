
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users } from 'lucide-react';
import { useUserData } from "@/components/dashboard/UserDataProvider";
import { useSeekerMasterData } from '@/hooks/useSeekerMasterData';

const OrganizationInfoCard: React.FC = () => {
  const { userData } = useUserData();
  const { industrySegments } = useSeekerMasterData();

  const getIndustrySegmentName = (segmentId: string) => {
    if (!segmentId || !industrySegments || industrySegments.length === 0) {
      return segmentId || 'Not specified';
    }

    // Try to find by ID first
    const segment = industrySegments.find(seg => seg.id === segmentId);
    if (segment) {
      return segment.industrySegment;
    }

    // Try to find by name (in case segmentId is actually the name)
    const segmentByName = industrySegments.find(seg => 
      seg.industrySegment.toLowerCase() === segmentId.toLowerCase()
    );
    if (segmentByName) {
      return segmentByName.industrySegment;
    }

    // Return the original value if no match found
    return segmentId;
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          Organization Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Name</label>
              <p className="text-lg font-semibold text-gray-900">{userData.organizationName || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Entity Type</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">
                  {userData.entityType || 'Not specified'}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Type</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-sm">
                  {userData.organizationType || 'Not specified'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{userData.country || 'Not specified'}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Contact Person</label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{userData.contactPersonName || 'Not specified'}</span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{userData.email || 'Not specified'}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Industry Segment</label>
              <p className="text-gray-900">{getIndustrySegmentName(userData.industrySegment) || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationInfoCard;
