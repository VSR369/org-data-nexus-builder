
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Shield, 
  Database, 
  BarChart3, 
  FileText,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminPortal = () => {
  const adminSections = [
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      count: '1,234',
      status: 'Active',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system-wide settings and parameters',
      icon: Settings,
      count: '47',
      status: 'Updated',
      color: 'bg-gray-100 text-gray-600'
    },
    {
      id: 'security',
      title: 'Security & Access Control',
      description: 'Manage security policies and access controls',
      icon: Shield,
      count: '12',
      status: 'Secure',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'data-management',
      title: 'Data Management',
      description: 'Database operations and data integrity',
      icon: Database,
      count: '23',
      status: 'Healthy',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      description: 'System analytics and performance reports',
      icon: BarChart3,
      count: '89',
      status: 'Active',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'audit-logs',
      title: 'Audit & Compliance',
      description: 'System audit trails and compliance monitoring',
      icon: FileText,
      count: '456',
      status: 'Monitored',
      color: 'bg-red-100 text-red-600'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High Memory Usage',
      description: 'System memory usage is above 85%',
      time: '5 minutes ago',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      type: 'success',
      title: 'Backup Completed',
      description: 'Daily system backup completed successfully',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'System maintenance scheduled for tonight',
      time: '1 day ago',
      icon: Clock,
      color: 'text-blue-600'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-muted-foreground">System administration and management console</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            <Shield className="w-4 h-4 mr-1" />
            Administrative Console
          </Badge>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">Secure</p>
                  <p className="text-sm text-muted-foreground">Security Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Administration Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
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
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{section.status}</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* System Alerts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">System Alerts</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {systemAlerts.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${alert.color}`} />
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{alert.time}</p>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPortal;
