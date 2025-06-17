
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Inbox, Users, Calendar, Building, MapPin, Phone, Mail, Globe, FileText, X, Eye, Download } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import { UserRecord } from '@/services/types';

interface SeekerDetails extends UserRecord {
  membershipStatus?: 'active' | 'inactive';
  engagementModel?: any;
  pricingPlan?: string;
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadSeekers();
  }, []);

  const loadSeekers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading all registered solution seekers...');
      
      const allUsers = await unifiedUserStorageService.getAllUsers();
      console.log('📊 Retrieved users:', allUsers.length);
      
      // Enhance user data with membership and engagement model information
      const enhancedSeekers = allUsers.map(user => {
        const seekerDetails: SeekerDetails = { ...user };
        
        // Check membership status
        try {
          const membershipData = localStorage.getItem('completed_membership_payment');
          if (membershipData) {
            const parsedMembership = JSON.parse(membershipData);
            if (parsedMembership.userId === user.userId) {
              seekerDetails.membershipStatus = parsedMembership.membershipStatus || 'inactive';
            }
          }
        } catch (error) {
          console.error('Error loading membership data:', error);
        }
        
        // Check engagement model selection
        try {
          const engagementData = localStorage.getItem('engagement_model_selection');
          if (engagementData) {
            const parsedEngagement = JSON.parse(engagementData);
            if (parsedEngagement.userId === user.userId) {
              seekerDetails.engagementModel = parsedEngagement.engagementModel;
              seekerDetails.pricingPlan = parsedEngagement.pricingPlan;
            }
          }
        } catch (error) {
          console.error('Error loading engagement model data:', error);
        }
        
        return seekerDetails;
      });
      
      setSeekers(enhancedSeekers);
      console.log('✅ Loaded and enhanced seekers data:', enhancedSeekers.length);
      
    } catch (error) {
      console.error('❌ Error loading seekers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeekerDoubleClick = (seeker: SeekerDetails) => {
    console.log('📋 Opening details for seeker:', seeker.userId);
    setSelectedSeeker(seeker);
    setShowDetails(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getEntityTypeBadgeVariant = (entityType: string) => {
    switch (entityType?.toLowerCase()) {
      case 'private limited company':
      case 'corporation':
        return 'default';
      case 'partnership':
      case 'sole proprietorship':
        return 'secondary';
      case 'non-profit organization':
      case 'society':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Loading solution seekers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Inbox className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl font-bold">Solution Seekers Validation</CardTitle>
              <p className="text-blue-100">
                Review and validate registered solution seeking organizations
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{seekers.length}</p>
                <p className="text-sm text-muted-foreground">Total Seekers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => ['private limited company', 'corporation', 'partnership'].includes(s.entityType?.toLowerCase() || '')).length}
                </p>
                <p className="text-sm text-muted-foreground">Commercial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => ['non-profit organization', 'society'].includes(s.entityType?.toLowerCase() || '')).length}
                </p>
                <p className="text-sm text-muted-foreground">Non-Commercial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {seekers.filter(s => s.membershipStatus === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seekers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Registered Solution Seekers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Double-click on any seeker to view detailed registration information
          </p>
        </CardHeader>
        
        <CardContent>
          {seekers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Solution Seekers Found</h3>
              <p className="text-gray-600">No solution seekers have registered yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seekers.map((seeker) => (
                    <TableRow 
                      key={seeker.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onDoubleClick={() => handleSeekerDoubleClick(seeker)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{seeker.organizationName}</p>
                          <p className="text-sm text-muted-foreground">{seeker.organizationType}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{seeker.userId}</TableCell>
                      <TableCell>
                        <Badge variant={getEntityTypeBadgeVariant(seeker.entityType)}>
                          {seeker.entityType}
                        </Badge>
                      </TableCell>
                      <TableCell>{seeker.country}</TableCell>
                      <TableCell>{seeker.industrySegment}</TableCell>
                      <TableCell>
                        <Badge variant={seeker.membershipStatus === 'active' ? 'default' : 'secondary'}>
                          {seeker.membershipStatus === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(seeker.registrationTimestamp || seeker.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeekerDoubleClick(seeker);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Building className="h-6 w-6" />
              Solution Seeker Details
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDetails(false)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedSeeker && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Organization Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Organization Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                      <p className="font-semibold">{selectedSeeker.organizationName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization ID</label>
                      <p className="font-mono">{selectedSeeker.organizationId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Organization Type</label>
                      <p>{selectedSeeker.organizationType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                      <Badge variant={getEntityTypeBadgeVariant(selectedSeeker.entityType)}>
                        {selectedSeeker.entityType}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Industry Segment</label>
                      <p>{selectedSeeker.industrySegment}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Country</label>
                      <p>{selectedSeeker.country}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                      <p className="font-semibold">{selectedSeeker.contactPersonName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p>{selectedSeeker.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="font-mono">{selectedSeeker.userId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                      <p>{formatDate(selectedSeeker.registrationTimestamp || selectedSeeker.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Membership Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Membership & Engagement Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Membership Status</label>
                        <div className="mt-1">
                          <Badge variant={selectedSeeker.membershipStatus === 'active' ? 'default' : 'secondary'}>
                            {selectedSeeker.membershipStatus === 'active' ? 'Active Member' : 'Not a Member'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Engagement Model</label>
                        <p>{selectedSeeker.engagementModel?.name || 'Not Selected'}</p>
                      </div>
                    </div>
                    
                    {selectedSeeker.engagementModel && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Engagement Model Description</label>
                        <p className="text-sm mt-1">{selectedSeeker.engagementModel.description}</p>
                      </div>
                    )}
                    
                    {selectedSeeker.pricingPlan && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Selected Pricing Plan</label>
                        <Badge variant="outline" className="ml-2">
                          {selectedSeeker.pricingPlan.charAt(0).toUpperCase() + selectedSeeker.pricingPlan.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* System Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Record Version</label>
                      <p>{selectedSeeker.version}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                      <p>{formatDate(selectedSeeker.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolutionSeekersValidation;
