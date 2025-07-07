import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Users, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  Clock,
  DollarSign,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/membershipPricingUtils';

interface ComprehensiveOrgData {
  organizationDetails: any;
  membershipDetails: any;
  engagementDetails: any;
  pricingDetails: any;
  paymentHistory: any[];
}

interface SeekerDetails {
  id: string;
  organizationName: string;
  organizationType: string;
  entityType: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
  hasAdministrator?: boolean;
  country?: string;
}

const SeekingOrgValidationDashboard: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [comprehensiveData, setComprehensiveData] = useState<ComprehensiveOrgData | null>(null);

  // Load comprehensive organization data
  const loadComprehensiveOrgData = (orgId: string) => {
    try {
      // Load membership pricing system state
      const membershipState = JSON.parse(localStorage.getItem('membership_pricing_system_state') || '{}');
      
      // Load organization registration data
      const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
      
      // Load pricing configurations
      const pricingConfigs = JSON.parse(localStorage.getItem('master_data_pricing_configs') || '[]');
      
      // Load membership fees
      const membershipFees = JSON.parse(localStorage.getItem('master_data_seeker_membership_fees') || '[]');

      const data: ComprehensiveOrgData = {
        organizationDetails: orgData,
        membershipDetails: {
          status: membershipState.membership_status || 'inactive',
          type: membershipState.membership_type || null,
          fees: membershipFees
        },
        engagementDetails: {
          selectedModel: membershipState.selected_engagement_model || null,
          frequency: membershipState.selected_frequency || null,
          configs: pricingConfigs
        },
        pricingDetails: {
          configs: pricingConfigs,
          membershipFees: membershipFees
        },
        paymentHistory: membershipState.payment_records || []
      };

      setComprehensiveData(data);
    } catch (error) {
      console.error('Error loading comprehensive org data:', error);
    }
  };

  // Load seekers data from actual storage
  const refreshSeekers = () => {
    setLoading(true);
    setError(null);
    
    try {
      const seekersData: SeekerDetails[] = [];
      
      // Load current organization from registration data
      const orgData = JSON.parse(localStorage.getItem('solution_seeker_registration_data') || '{}');
      const membershipState = JSON.parse(localStorage.getItem('membership_pricing_system_state') || '{}');
      
      if (orgData.organizationName) {
        seekersData.push({
          id: 'current-org',
          organizationName: orgData.organizationName,
          organizationType: orgData.organizationType || 'solution-seeker',
          entityType: orgData.entityType || 'organization',
          approvalStatus: 'approved',
          membershipStatus: membershipState.membership_status === 'member_paid' ? 'active' : 
                           membershipState.membership_status === 'inactive' ? 'inactive' : 'not-member',
          hasAdministrator: true,
          country: orgData.country || 'IN'
        });
      }

      // Load all registered users and extract organization data
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        if (Array.isArray(registeredUsers)) {
          registeredUsers.forEach((user, index) => {
            if (user.organizationName && user.organizationName !== orgData.organizationName) {
              seekersData.push({
                id: `user-${index}`,
                organizationName: user.organizationName,
                organizationType: user.organizationType || 'solution-seeker',
                entityType: user.entityType || 'organization',
                approvalStatus: 'approved',
                membershipStatus: 'inactive',
                hasAdministrator: true,
                country: user.country || 'IN'
              });
            }
          });
        }
      } catch (userError) {
        console.log('No registered users found or error loading users:', userError);
      }

      // If no data found, show empty state message
      if (seekersData.length === 0) {
        console.log('No seeking organization data found in localStorage');
      }
      
      setSeekers(seekersData);
      console.log(`✅ Loaded ${seekersData.length} seeking organizations for validation`);
    } catch (err) {
      setError('Failed to load seeking organization data');
      console.error('Error loading seekers:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSeekersData = () => {
    const data = seekers.map(seeker => ({
      id: seeker.id,
      organizationName: seeker.organizationName,
      organizationType: seeker.organizationType,
      entityType: seeker.entityType,
      approvalStatus: seeker.approvalStatus,
      membershipStatus: seeker.membershipStatus,
      hasAdministrator: seeker.hasAdministrator
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution-seekers-validation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    refreshSeekers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading validation dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-destructive/80 mt-1">{error}</p>
          <Button onClick={refreshSeekers} className="mt-3" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solution Seekers Validation Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Found {seekers.length} solution seeker{seekers.length !== 1 ? 's' : ''} in the system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshSeekers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={downloadSeekersData} variant="outline">
            <DollarSign className="h-4 w-4 mr-2" />
            Download Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="organizations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="comprehensive">Comprehensive View</TabsTrigger>
          <TabsTrigger value="validation">Validation Center</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seekers.map(seeker => (
              <Card key={seeker.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{seeker.organizationName}</h4>
                        <p className="text-sm text-muted-foreground">{seeker.organizationType}</p>
                      </div>
                      <Badge variant={seeker.approvalStatus === 'approved' ? 'default' : 'secondary'}>
                        {seeker.approvalStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{seeker.entityType}</Badge>
                      <Badge variant={seeker.membershipStatus === 'active' ? 'default' : 'secondary'}>
                        {seeker.membershipStatus || 'inactive'}
                      </Badge>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedOrg(seeker.id);
                        loadComprehensiveOrgData(seeker.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comprehensive" className="space-y-4">
          {!selectedOrg ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Organization</h3>
                  <p className="text-muted-foreground">
                    Click "View Details" on an organization to see comprehensive information
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ComprehensiveOrgView data={comprehensiveData} />
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <ValidationCenter seekers={seekers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Comprehensive Organization View Component
const ComprehensiveOrgView: React.FC<{ data: ComprehensiveOrgData | null }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Organization Name</div>
            <div className="font-medium">{data.organizationDetails.organizationName || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Organization Type</div>
            <div>{data.organizationDetails.organizationType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Entity Type</div>
            <div>{data.organizationDetails.entityType || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Country</div>
            <div>{data.organizationDetails.country || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Membership Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membership Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Membership Status</div>
            <Badge variant={data.membershipDetails.status === 'member_paid' ? 'default' : 'secondary'}>
              {data.membershipDetails.status === 'member_paid' ? 'Premium Member' : 
               data.membershipDetails.type === 'not-a-member' ? 'Not a Member' : 'Basic'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Membership Type</div>
            <div>{data.membershipDetails.type === 'annual' ? 'Annual Plan' : 'Not a Member'}</div>
          </div>
          {data.membershipDetails.fees.length > 0 && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Annual Fee</div>
              <div className="font-medium text-primary">
                {formatCurrency(data.membershipDetails.fees[0].annualAmount, data.membershipDetails.fees[0].annualCurrency)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Model Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Engagement Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Selected Model</div>
            <div>{data.engagementDetails.selectedModel ? 
              data.engagementDetails.selectedModel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
              'Not Selected'}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Billing Frequency</div>
            <div>{data.engagementDetails.frequency || 'Not Selected'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {data.paymentHistory.slice(0, 3).map((payment, index) => (
                <div key={payment.id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{payment.type} Payment</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                  </div>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No payment history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Validation Center Component
const ValidationCenter: React.FC<{ seekers: any[] }> = ({ seekers }) => {
  const pendingCount = seekers.filter(s => s.approvalStatus === 'pending').length;
  const approvedCount = seekers.filter(s => s.approvalStatus === 'approved').length;
  const rejectedCount = seekers.filter(s => s.approvalStatus === 'rejected').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Clock className="h-5 w-5" />
            Pending Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
          <p className="text-sm text-muted-foreground">Organizations awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Approved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          <p className="text-sm text-muted-foreground">Validated organizations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Users className="h-5 w-5" />
            Rejected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          <p className="text-sm text-muted-foreground">Organizations needing review</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeekingOrgValidationDashboard;