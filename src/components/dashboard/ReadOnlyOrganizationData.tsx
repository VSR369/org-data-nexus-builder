
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, FileText, Calendar, Clock, CreditCard, DollarSign } from 'lucide-react';
import { useUserData } from "@/components/dashboard/UserDataProvider";

const ReadOnlyOrganizationData: React.FC = () => {
  const { userData } = useUserData();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Overview */}
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
                <p className="text-gray-900">{userData.industrySegment || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details - From Registration Data */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Registered Organization Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-600">Organization ID:</label>
                  <p className="font-medium">{userData.organizationId || 'Not available'}</p>
                </div>
                <div>
                  <label className="text-gray-600">User ID:</label>
                  <p className="font-medium">{userData.userId || 'Not available'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Entity Type:</label>
                  <p className="font-medium">{userData.entityType || 'Not available'}</p>
                </div>
                <div>
                  <label className="text-gray-600">Organization Type:</label>
                  <p className="font-medium">{userData.organizationType || 'Not available'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Registration Status</h4>
              <p className="text-sm text-green-800">
                This organization has been successfully registered as a solution seeker with the provided details.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-700">Active Registration</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Details */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-green-600" />
            Registration Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{formatDate(userData.registrationTimestamp)}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Registration Status</label>
                <div className="mt-1">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Completed
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Organization Profile Summary</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Organization:</strong> {userData.organizationName}</p>
                <p><strong>Type:</strong> {userData.entityType} - {userData.organizationType}</p>
                <p><strong>Location:</strong> {userData.country}</p>
                <p><strong>Industry:</strong> {userData.industrySegment}</p>
                <p><strong>Contact:</strong> {userData.contactPersonName} ({userData.email})</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Services */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
            Available Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-3">Solution Seeking Services</h4>
            <p className="text-sm text-purple-800 mb-3">
              As a registered {userData.entityType} organization of type {userData.organizationType}, 
              you have access to the following services:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Browse and search solutions catalog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Post challenges and requirements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Connect with solution providers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Access community resources</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Information */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            What's Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Ready to Find Solutions</h4>
              <p className="text-sm text-blue-800">
                Your organization registration is complete and active. You can now start exploring 
                the platform to find solutions that match your organization's needs.
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Getting Started</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Navigate to the Solutions section to browse available offerings</li>
                <li>• Post your specific challenges in the Challenges section</li>
                <li>• Join community discussions and events</li>
                <li>• Connect directly with solution providers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadOnlyOrganizationData;
