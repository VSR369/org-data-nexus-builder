
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
  }
];

export const administrationMenuItems = [
  {
    id: 'seeking-org-roles',
    title: 'Seeking Org Roles',
    icon: UserCog,
    description: 'Manage organization roles and assignments'
  }
];
