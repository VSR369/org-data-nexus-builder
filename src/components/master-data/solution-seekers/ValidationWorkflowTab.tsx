
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, Users, RefreshCw } from 'lucide-react';
import ValidationActionsPanel from './ValidationActionsPanel';
import type { SeekerDetails } from './types';

interface ValidationWorkflowTabProps {
  seekers: SeekerDetails[];
  onValidateDocuments: (seeker: SeekerDetails) => void;
  onCreateAdmin: (seeker: SeekerDetails) => void;
  onViewDetails: (seeker: SeekerDetails) => void;
  onRefresh: () => void;
  isMobile?: boolean;
}

const ValidationWorkflowTab: React.FC<ValidationWorkflowTabProps> = ({
  seekers,
  onValidateDocuments,
  onCreateAdmin,
  onViewDetails,
  onRefresh,
  isMobile
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Filter seekers that need validation actions
  const pendingSeekers = seekers.filter(s => s.approvalStatus === 'pending');
  const approvedSeekers = seekers.filter(s => s.approvalStatus === 'approved');
  const rejectedSeekers = seekers.filter(s => s.approvalStatus === 'rejected');

  const nonCommercialPending = pendingSeekers.filter(s => 
    ['Non-Profit Organization', 'Society', 'Trust'].includes(s.entityType)
  );

  const filteredSeekers = filter === 'all' ? seekers : 
    filter === 'pending' ? pendingSeekers :
    filter === 'approved' ? approvedSeekers : rejectedSeekers;

  const prioritySeekers = [
    ...nonCommercialPending, // Non-commercial pending (need document validation)
    ...approvedSeekers.slice(0, 3), // Approved (ready for admin creation)
    ...pendingSeekers.filter(s => !['Non-Profit Organization', 'Society', 'Trust'].includes(s.entityType)).slice(0, 2)
  ];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingSeekers.length}</p>
                <p className="text-sm text-muted-foreground">Pending Validation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{approvedSeekers.length}</p>
                <p className="text-sm text-muted-foreground">Ready for Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{nonCommercialPending.length}</p>
                <p className="text-sm text-muted-foreground">Need Doc Validation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{seekers.length}</p>
                <p className="text-sm text-muted-foreground">Total Organizations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Validation Workflow</h2>
          <p className="text-muted-foreground">
            Organizations requiring immediate validation actions
          </p>
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({seekers.length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingSeekers.length})
        </Button>
        <Button 
          variant={filter === 'approved' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('approved')}
        >
          Ready for Admin ({approvedSeekers.length})
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('rejected')}
        >
          Rejected ({rejectedSeekers.length})
        </Button>
      </div>

      {/* Priority Actions Section */}
      {filter === 'all' && prioritySeekers.length > 0 && (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Actions Required
            </h3>
            <p className="text-sm text-orange-700 mb-4">
              These organizations require immediate validation actions to complete their onboarding.
            </p>
          </div>
          
          <div className="space-y-4">
            {prioritySeekers.map(seeker => (
              <ValidationActionsPanel
                key={seeker.id}
                seeker={seeker}
                onValidateDocuments={onValidateDocuments}
                onCreateAdmin={onCreateAdmin}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filtered Results */}
      {filter !== 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              {filter === 'pending' ? 'Pending Validation' :
               filter === 'approved' ? 'Ready for Administrator Creation' :
               'Rejected Organizations'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredSeekers.length} organization{filteredSeekers.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {filteredSeekers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  No organizations in this category
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSeekers.map(seeker => (
                <ValidationActionsPanel
                  key={seeker.id}
                  seeker={seeker}
                  onValidateDocuments={onValidateDocuments}
                  onCreateAdmin={onCreateAdmin}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationWorkflowTab;
