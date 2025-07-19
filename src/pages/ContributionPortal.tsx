
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Lightbulb, 
  Users, 
  Award, 
  TrendingUp, 
  FileText,
  MessageCircle,
  Calendar
} from 'lucide-react';

const ContributionPortal = () => {
  const contributionAreas = [
    {
      id: 'solutions',
      title: 'Solution Contributions',
      description: 'Submit innovative solutions to open challenges',
      icon: Lightbulb,
      count: '127',
      status: 'Active',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'mentoring',
      title: 'Mentoring & Guidance',
      description: 'Provide expertise and guidance to solution seekers',
      icon: Users,
      count: '45',
      status: 'Active',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'evaluation',
      title: 'Solution Evaluation',
      description: 'Review and evaluate submitted solutions',
      icon: Award,
      count: '23',
      status: 'Available',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'challenges',
      title: 'Challenge Creation',
      description: 'Help formulate and structure new challenges',
      icon: Target,
      count: '8',
      status: 'Open',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'solution',
      title: 'AI-Based Inventory Management Solution',
      status: 'Under Review',
      date: '2 hours ago',
      icon: Lightbulb
    },
    {
      id: 2,
      type: 'mentoring',
      title: 'Mentoring Session: Digital Transformation',
      status: 'Completed',
      date: '1 day ago',
      icon: Users
    },
    {
      id: 3,
      type: 'evaluation',
      title: 'Evaluated: Supply Chain Optimization',
      status: 'Submitted',
      date: '2 days ago',
      icon: Award
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contribution Portal</h1>
              <p className="text-muted-foreground">Contribute your expertise to help solve challenges</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Target className="w-4 h-4 mr-1" />
            Innovation Contribution Hub
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">Solutions Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Active Mentorships</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Evaluations Done</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contribution Areas */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Contribution Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${area.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{area.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">{area.status}</Badge>
                        </div>
                      </div>
                      <Badge variant="secondary">{area.count}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {area.description}
                    </CardDescription>
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Opportunities
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'Completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContributionPortal;
