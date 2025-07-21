
import { 
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  Target,
  Lightbulb,
  BarChart3,
  FileText,
  Shield,
  UserCheck,
  UserCog
} from 'lucide-react';

export const dashboardMenuItems = [
  {
    id: 'overview',
    title: 'Overview',
    icon: LayoutDashboard,
    description: 'Dashboard overview'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    icon: Target,
    description: 'Common admin actions'
  }
];

export const organizationMenuItems = [
  {
    id: 'organization-details',
    title: 'Organization Details',
    icon: Building2,
    description: 'View and manage organization info'
  },
  {
    id: 'membership-status',
    title: 'Membership Status',
    icon: UserCheck,
    description: 'Manage membership details'
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: Users,
    description: 'Manage organization users'
  },
  {
    id: 'role-management',
    title: 'Role Management',
    icon: UserCog,
    description: 'Manage platform roles and permissions'
  }
];

export const solutionMenuItems = [
  {
    id: 'challenges',
    title: 'Posted Challenges',
    icon: Target,
    description: 'View posted challenges'
  },
  {
    id: 'solutions',
    title: 'Received Solutions',
    icon: Lightbulb,
    description: 'Review submitted solutions'
  },
  {
    id: 'engagements',
    title: 'Active Engagements',
    icon: Users,
    description: 'Manage solution engagements'
  }
];

export const reportsMenuItems = [
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    description: 'View performance metrics'
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: FileText,
    description: 'Generate and view reports'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    description: 'Admin settings'
  }
];
