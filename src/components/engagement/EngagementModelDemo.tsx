import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlobalModelSwitcher } from './GlobalModelSwitcher';
import { CheckCircle, XCircle, Clock, Users, Zap } from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  engagement_model: string;
  created_at: string;
}

interface EngagementModelDemoProps {
  tier: 'Basic' | 'Standard' | 'Premium';
  userId: string;
  tierId: string;
}

export const EngagementModelDemo: React.FC<EngagementModelDemoProps> = ({
  tier,
  userId,
  tierId
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      name: 'Healthcare Innovation Challenge',
      status: 'Active',
      engagement_model: 'Market Place',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Fintech Solutions Challenge',
      status: 'Active',
      engagement_model: 'Market Place',
      created_at: '2024-01-14T14:30:00Z'
    },
    {
      id: '3',
      name: 'Sustainability Initiative',
      status: 'Paused',
      engagement_model: 'Market Place',
      created_at: '2024-01-13T09:15:00Z'
    }
  ]);

  const activeCount = challenges.filter(c => c.status === 'Active').length;
  const isBasicTier = tier === 'Basic';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Paused':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleModelSwitched = (newModel: string) => {
    // For Basic tier, update all challenges to use the new global model
    if (isBasicTier) {
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        engagement_model: newModel
      })));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tier Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {tier} Tier
            <Badge variant={tier === 'Basic' ? 'secondary' : 'default'}>
              {tier}
            </Badge>
          </CardTitle>
          <CardDescription>
            Current engagement model configuration and rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tier Rules */}
          <div className="space-y-2">
            <h4 className="font-medium">Tier Rules:</h4>
            <ul className="text-sm space-y-1">
              {isBasicTier ? (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Multiple challenges allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-yellow-600" />
                    Only one global engagement model
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-600" />
                    Must complete/pause all challenges to switch models
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Multiple challenges allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Per-challenge model selection
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    No switching restrictions
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Active Challenges Count */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Challenges:</span>
              <Badge variant={activeCount > 0 ? 'default' : 'secondary'}>
                {activeCount}
              </Badge>
            </div>
          </div>

          {/* Global Model Switcher for Basic Tier */}
          {isBasicTier && (
            <GlobalModelSwitcher
              userId={userId}
              tierId={tierId}
              onModelSwitched={handleModelSwitched}
            />
          )}
        </CardContent>
      </Card>

      {/* Challenges List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Challenges</CardTitle>
          <CardDescription>
            {isBasicTier 
              ? 'All challenges use the same global engagement model'
              : 'Each challenge can have its own engagement model'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(challenge.status)}
                  <div>
                    <h4 className="font-medium text-sm">{challenge.name}</h4>
                    <p className="text-xs text-gray-500">
                      Model: {challenge.engagement_model}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={challenge.status === 'Active' ? 'default' : 'secondary'}>
                    {challenge.status}
                  </Badge>
                  {!isBasicTier && (
                    <Button size="sm" variant="outline">
                      Change Model
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Basic Tier Switching Warning */}
          {isBasicTier && activeCount > 0 && (
            <Alert className="mt-4">
              <AlertDescription>
                You have {activeCount} active challenge{activeCount > 1 ? 's' : ''}. 
                Complete or pause all challenges to switch your global engagement model.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};