import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Building, MapPin, Globe, Phone, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentDetailsSection from './components/PaymentDetailsSection';
import ComprehensiveOrgView from './components/ComprehensiveOrgView';
import { safeRender } from './utils/viewDetailsHelpers';

interface ViewSolutionSeekerDetailsProps {
  userId: string;
  userData: any;
  membershipData?: any;
  pricingData?: any;
  onClose?: () => void;
}

const ViewSolutionSeekerDetails: React.FC<ViewSolutionSeekerDetailsProps> = ({
  userId,
  userData,
  membershipData,
  pricingData,
  onClose
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/master-data-portal');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {safeRender(userData?.contact_person_name) || 'Solution Seeker Details'}
            </h1>
            <p className="text-gray-600">
              {safeRender(userData?.organization_name)} • {safeRender(userData?.custom_user_id)}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payment">Payment & Membership</TabsTrigger>
            <TabsTrigger value="comprehensive">Comprehensive View</TabsTrigger>
            {!isMobile && <TabsTrigger value="activity">Activity Log</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contact Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Person</label>
                    <p className="text-base font-medium">{safeRender(userData?.contact_person_name)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base">{safeRender(userData?.email)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-base font-mono text-sm">{safeRender(userData?.custom_user_id)}</p>
                  </div>
                  {userData?.phone_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-base">{safeRender(userData?.phone_number)}</p>
                    </div>
                  )}
                  {userData?.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="text-base">
                        <a href={userData.website} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline">
                          {safeRender(userData?.website)}
                        </a>
                      </p>
                    </div>
                  )}
                  {userData?.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-base">{safeRender(userData?.address)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organization Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-green-500" />
                    Organization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organization Name</label>
                    <p className="text-base font-medium">{safeRender(userData?.organization_name)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organization ID</label>
                    <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">{safeRender(userData?.organization_id)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organization Type</label>
                    <p className="text-base">{safeRender(userData?.organization_type)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Entity Type</label>
                    <p className="text-base">{safeRender(userData?.entity_type)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-base">{safeRender(userData?.country)}</p>
                  </div>
                  {userData?.industry_segment && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Industry Segment</label>
                      <p className="text-base">{safeRender(userData?.industry_segment)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    Location & Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-base">{safeRender(userData?.country)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-base">{safeRender(userData?.address)}</p>
                  </div>
                  {userData?.phone_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-base">{safeRender(userData?.phone_number)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base">{safeRender(userData?.email)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payment & Membership Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment & Membership Management</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentDetailsSection 
                  membershipData={membershipData}
                  pricingData={pricingData}
                  userId={userId}
                  isMobile={isMobile}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comprehensive View Tab */}
          <TabsContent value="comprehensive" className="space-y-6">
            <ComprehensiveOrgView 
              data={{
                organizationDetails: userData,
                membershipDetails: membershipData || {},
                engagementDetails: pricingData || {},
                pricingDetails: {},
                paymentHistory: []
              }}
            />
          </TabsContent>

          {/* Activity Log Tab */}
          {!isMobile && (
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Activity log implementation coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ViewSolutionSeekerDetails;
