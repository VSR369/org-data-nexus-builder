
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  RefreshCw, 
  Download,
  Search,
  Users,
  FileText,
  CreditCard,
  Shield,
  Globe,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useOrganizationValidationData } from './hooks/useOrganizationValidationData';
import OrganizationProfileViewer from './OrganizationProfileViewer';
import { useIsMobile } from '@/hooks/use-mobile';

const OrganizationValidationViewer: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  
  const {
    organizations,
    loading,
    error,
    refreshData,
    exportData
  } = useOrganizationValidationData();

  const filteredOrganizations = organizations.filter(org =>
    org.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.contact_person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading organization data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-destructive/80 mt-1">{error}</p>
          <Button onClick={refreshData} className="mt-3" variant="outline">
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
      <div className={`${isMobile ? "space-y-4" : "flex items-center justify-between"}`}>
        <div>
          <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>
            Seeking Organization Validation
          </h1>
          <p className={`text-muted-foreground mt-1 ${isMobile ? "text-sm" : ""}`}>
            Monitor and view solution seeker organizations ({filteredOrganizations.length} total)
          </p>
        </div>
        <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
          <Button onClick={refreshData} variant="outline" className={isMobile ? "w-full" : ""}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline" className={isMobile ? "w-full" : ""}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by organization name, contact person, or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? "text-xs" : ""}`}>
          <TabsTrigger value="list">Organization List</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4`}>
            {filteredOrganizations.map(org => (
              <Card key={org.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                    onClick={() => setSelectedOrg(org.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {org.organization_name || 'Unknown Organization'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {org.organization_id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(org.approval_status)}>
                      {org.approval_status || 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.organization_type || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.contact_person_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.country || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.email || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {org.membership_status && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Membership:</span>
                        <Badge variant="outline">{org.membership_status}</Badge>
                      </div>
                    </div>
                  )}
                  
                  {org.pricing_tier && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tier:</span>
                      <Badge variant="secondary">{org.pricing_tier}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredOrganizations.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'No solution seeker organizations are registered yet.'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedOrg ? (
            <OrganizationProfileViewer 
              organizationId={selectedOrg} 
              organizations={organizations}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select an Organization</h3>
                  <p className="text-muted-foreground">
                    Choose an organization from the list to view detailed information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationValidationViewer;
