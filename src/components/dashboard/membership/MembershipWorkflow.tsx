
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, Settings, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface WorkflowStatus {
  current_step: string;
  is_complete: boolean;
  membership_status: string;
  has_workflow: boolean;
}

interface MembershipWorkflowProps {
  userId: string;
}

export const MembershipWorkflow: React.FC<MembershipWorkflowProps> = ({ userId }) => {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflowStatus();
  }, [userId]);

  const loadWorkflowStatus = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading membership workflow status for user:', userId);

      const { data, error } = await supabase.rpc('get_membership_workflow_status', {
        user_id_param: userId
      });

      if (error) {
        console.error('❌ Error loading workflow status:', error);
        toast({
          title: "Error",
          description: "Failed to load workflow status.",
          variant: "destructive"
        });
        return;
      }

      console.log('📊 Workflow status loaded:', data);
      setWorkflowStatus(data as unknown as WorkflowStatus);
    } catch (error) {
      console.error('❌ Error in loadWorkflowStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepNavigation = (step: string) => {
    console.log('🧭 Navigating to step:', step);
    // Navigation logic can be implemented here
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Membership & Enrollment</h2>
          <p className="text-green-600">Manage your membership and platform access</p>
        </div>
      </div>

      {/* Workflow Status Overview */}
      {workflowStatus && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Enrollment Status</CardTitle>
            <CardDescription>
              Track your progress through the membership enrollment process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Step</label>
                <Badge className="bg-blue-600">{workflowStatus.current_step.replace('_', ' ')}</Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Membership Status</label>
                <Badge className={workflowStatus.membership_status === 'Active' ? "bg-green-600" : "bg-yellow-600"}>
                  {workflowStatus.membership_status}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Workflow Status</label>
                <div className="flex items-center gap-2">
                  {workflowStatus.is_complete ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="text-sm">
                    {workflowStatus.is_complete ? 'Complete' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer" onClick={() => handleStepNavigation('membership_decision')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Membership Decision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Choose your membership plan and get started with premium features.</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => handleStepNavigation('tier_selection')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Select Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Choose your pricing tier based on your usage needs.</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:border-purple-400 transition-colors cursor-pointer" onClick={() => handleStepNavigation('engagement_model')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Engagement Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Select how you want to interact with solution providers.</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Steps */}
      {!workflowStatus?.has_workflow && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Start Your Membership Journey</CardTitle>
            <CardDescription>
              Begin by making a membership decision to access premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Click on one of the quick actions above to get started with your membership enrollment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
