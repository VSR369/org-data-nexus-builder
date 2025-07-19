
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Building2, 
  UserPlus, 
  Target, 
  Settings, 
  Users,
  BarChart3,
  Award,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const portalSections = [
    {
      id: 'organization-dashboard',
      title: 'Organization Portal',
      description: 'Comprehensive organization management and master data access',
      icon: Building2,
      count: '12 Modules',
      path: '/organization-dashboard',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'master-data-portal',
      title: 'Master Data Portal',
      description: 'Advanced configuration management system with sidebar navigation',
      icon: Database,
      count: '500+ Configs',
      path: '/master-data-portal',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'new-seeker',
      title: 'New Seeker Registration',
      description: 'Register and onboard new solution-seeking organizations',
      icon: UserPlus,
      count: '23 Pending',
      path: '/new-seeker',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'contribution',
      title: 'Contribution Portal',
      description: 'Innovation hub for solution contributions and mentoring',
      icon: Target,
      count: '127 Active',
      path: '/contribution-portal',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'System administration and management console',
      icon: Settings,
      count: '47 Settings',
      path: '/admin-portal',
      color: 'bg-red-100 text-red-600'
    }
  ];

  const quickStats = [
    { title: 'Active Organizations', value: '1,234', icon: Building2, color: 'text-blue-500' },
    { title: 'Master Data Records', value: '15,678', icon: Database, color: 'text-green-500' },
    { title: 'Active Challenges', value: '89', icon: Target, color: 'text-purple-500' },
    { title: 'Success Rate', value: '92%', icon: TrendingUp, color: 'text-yellow-500' }
  ];

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CoInnovator Platform</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive platform for innovation management, master data configuration, and organizational collaboration
          </p>
          <Badge variant="secondary" className="text-sm">
            <Award className="w-4 h-4 mr-1" />
            Enterprise Innovation Platform
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Portal Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Platform Portals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card 
                  key={section.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/50"
                  onClick={() => handleCardClick(section.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline">{section.count}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm mb-4">
                      {section.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(section.path);
                      }}
                    >
                      Access Portal
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Master Data Configuration Updated</p>
                      <p className="text-sm text-muted-foreground">Pricing tiers and formulas updated</p>
                    </div>
                  </div>
                  <Badge variant="secondary">2 hours ago</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <UserPlus className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">New Organization Registered</p>
                      <p className="text-sm text-muted-foreground">TechCorp Solutions joined the platform</p>
                    </div>
                  </div>
                  <Badge variant="secondary">5 hours ago</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">New Challenge Posted</p>
                      <p className="text-sm text-muted-foreground">AI-driven supply chain optimization</p>
                    </div>
                  </div>
                  <Badge variant="secondary">1 day ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
