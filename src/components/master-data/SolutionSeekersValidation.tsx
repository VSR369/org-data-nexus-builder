
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building2, AlertCircle, CheckCircle, RefreshCw, Download, Eye } from 'lucide-react';
import { unifiedUserStorageService } from '@/services/UnifiedUserStorageService';
import type { UserRecord } from '@/services/types';

interface SeekerDetails extends UserRecord {
  approvalStatus: 'pending' | 'approved' | 'rejected';
  membershipStatus?: 'active' | 'inactive' | 'not-member';
}

const SolutionSeekersValidation: React.FC = () => {
  const [seekers, setSeekers] = useState<SeekerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSeekers = async () => {
      setLoading(true);
      try {
        await unifiedUserStorageService.initialize();
        const allUsers = await unifiedUserStorageService.getAllUsers();
        
        // Filter for solution seekers and cast to SeekerDetails
        const solutionSeekers = allUsers.filter(user => user.entityType === 'solution-seeker') as SeekerDetails[];
        
        setSeekers(solutionSeekers);
      } catch (err: any) {
        setError(err.message || 'Failed to load solution seekers.');
      } finally {
        setLoading(false);
      }
    };

    loadSeekers();
  }, []);

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seekers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "solution_seekers_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const loadEngagementPricingDetails = (seeker: SeekerDetails) => {
    // Try to get membership/pricing data from localStorage
    const membershipKeys = [
      `membership_${seeker.userId}`,
      `membership_${seeker.organizationId}`,
      `${seeker.organizationName}_membership`,
      'selected_membership_plan'
    ];

    const pricingKeys = [
      `pricing_${seeker.userId}`,
      `selected_pricing_${seeker.organizationId}`,
      'selected_engagement_model'
    ];

    let membershipData = null;
    let pricingData = null;

    // Check for membership data
    for (const key of membershipKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.status || parsed.plan || parsed.membershipStatus)) {
            membershipData = parsed;
            break;
          }
        } catch (e) {
          // Continue checking other keys
        }
      }
    }

    // Check for pricing data
    for (const key of pricingKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.engagementModel || parsed.selectedModel || parsed.currency)) {
            pricingData = parsed;
            break;
          }
        } catch (e) {
          // Continue checking other keys
        }
      }
    }

    return { membershipData, pricingData };
  };

  if (loading) {
    return <div>Loading solution seekers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Solution Seekers Validation</h1>
        <Button onClick={handleDownloadData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Data
        </Button>
      </div>
      {seekers.length === 0 ? (
        <div className="text-gray-500">No solution seekers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seekers.map(seeker => {
            const { membershipData, pricingData } = loadEngagementPricingDetails(seeker);
            
            return (
              <Card key={seeker.id} className="bg-white shadow-md rounded-md overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    {seeker.organizationName}
                  </CardTitle>
                  <Badge variant={
                    seeker.membershipStatus === 'active' ? 'default' : 
                    seeker.membershipStatus === 'inactive' ? 'destructive' : 'secondary'
                  }>
                    {seeker.membershipStatus || membershipData?.status || 'not-member'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <Building2 className="h-4 w-4 inline-block mr-1" />
                      {seeker.organizationType} - {seeker.entityType}
                    </p>
                    <p>
                      <AlertCircle className="h-4 w-4 inline-block mr-1" />
                      {seeker.country}
                    </p>
                    <p>Email: {seeker.email}</p>
                    <p>Contact: {seeker.contactPersonName}</p>
                    
                    {/* Engagement/Pricing Model Details */}
                    <div className="mt-3 p-2 bg-blue-50 rounded border">
                      <h4 className="font-medium text-blue-900 mb-1">Engagement & Pricing</h4>
                      {seeker.selectedPlan && (
                        <p className="text-xs text-blue-800">Plan: {seeker.selectedPlan}</p>
                      )}
                      {seeker.selectedEngagementModel && (
                        <p className="text-xs text-blue-800">Model: {seeker.selectedEngagementModel}</p>
                      )}
                      {membershipData?.selectedPlan && (
                        <p className="text-xs text-blue-800">Selected Plan: {membershipData.selectedPlan}</p>
                      )}
                      {pricingData?.engagementModel && (
                        <p className="text-xs text-blue-800">Engagement: {pricingData.engagementModel}</p>
                      )}
                      {pricingData?.currency && pricingData?.amount && (
                        <p className="text-xs text-blue-800">
                          Pricing: {pricingData.currency} {pricingData.amount} ({pricingData.frequency || 'monthly'})
                        </p>
                      )}
                      {!seeker.selectedPlan && !seeker.selectedEngagementModel && !membershipData && !pricingData && (
                        <p className="text-xs text-gray-500">No engagement/pricing details found</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolutionSeekersValidation;
