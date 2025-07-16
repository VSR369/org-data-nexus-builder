
import { 
  Database, 
  Globe, 
  Building2, 
  Users, 
  Target, 
  Lightbulb, 
  Settings, 
  Shield, 
  CheckCircle,
  DollarSign,
  Calendar,
  Award,
  FileText,
  UserCheck,
  Key,
  Download,
  Table,
  Folder,
  FolderOpen,
  GitBranch,
  BarChart3,
  Calculator,
  Package,
  Layers,
  CreditCard,
  TrendingUp,
  Lock
} from 'lucide-react';

export const customDataMenuItems = [
  {
    id: 'table-tester',
    title: 'Table Tester',
    icon: Table,
    description: 'View master data table structures and field mappings'
  },
  {
    id: 'custom-data-manager',
    title: 'Custom Data Manager',
    icon: Download,
    description: 'Extract and preserve only your custom configured data'
  }
];

export const foundationMenuItems = [
  {
    id: 'countries',
    title: 'Countries',
    icon: Globe,
    description: 'Manage country master data'
  },
  {
    id: 'currencies',
    title: 'Currencies',
    icon: DollarSign,
    description: 'Configure currency settings'
  },
  {
    id: 'entity-types',
    title: 'Entity Types',
    icon: Building2,
    description: 'Define organization entity types'
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Users,
    description: 'Manage department categories'
  }
];

export const organizationMenuItems = [
  {
    id: 'organization-types',
    title: 'Organization Types',
    icon: Building2,
    description: 'Configure organization categories'
  },
  {
    id: 'organization-categories',
    title: 'Organization Categories',
    icon: FolderOpen,
    description: 'Manage workflow organization categories'
  },
  {
    id: 'industry-segments',
    title: 'Industry Segments',
    icon: Target,
    description: 'Define industry classifications'
  },
  {
    id: 'domain-groups',
    title: 'Domain Groups',
    icon: Database,
    description: 'Manage domain hierarchies'
  },
  {
    id: 'capability-levels',
    title: 'Capability Scoring Levels',
    icon: Award,
    description: 'Manage capability level ranges and scoring thresholds'
  }
];

export const challengeMenuItems = [
  {
    id: 'challenge-complexity',
    title: 'Challenge Complexity',
    icon: TrendingUp,
    description: 'Manage challenge complexity levels and fee multipliers'
  },
  {
    id: 'reward-types',
    title: 'Reward Types',
    icon: Award,
    description: 'Manage reward categories'
  },
  {
    id: 'communication-types',
    title: 'Communication Types',
    icon: FileText,
    description: 'Configure communication methods'
  }
];

export const systemMenuItems = [
  {
    id: 'engagement-models',
    title: 'Engagement Models',
    icon: Users,
    description: 'Configure engagement frameworks'
  },
  {
    id: 'billing-frequencies',
    title: 'Billing Frequencies',
    icon: Calendar,
    description: 'Configure billing cycles and payment schedules'
  },
  {
    id: 'membership-statuses',
    title: 'Membership Statuses',
    icon: UserCheck,
    description: 'Manage membership states and user account statuses'
  },
  {
    id: 'units-of-measure',
    title: 'Units of Measure',
    icon: Target,
    description: 'Configure measurement units for pricing and calculations'
  },
  {
    id: 'pricing',
    title: 'Pricing Configuration',
    icon: DollarSign,
    description: 'Set up pricing models'
  },
  {
    id: 'seeker-membership-fee',
    title: 'Seeker Membership Fee',
    icon: UserCheck,
    description: 'Configure membership pricing'
  },
  {
    id: 'events-calendar',
    title: 'Events Calendar',
    icon: Calendar,
    description: 'Manage event scheduling'
  }
];

export const validationMenuItems = [
  {
    id: 'solution-seekers-validation',
    title: 'Solution Seekers Validation',
    icon: CheckCircle,
    description: 'Validate seeker registrations'
  }
];

export const pricingConfigurationMenuItems = [
  {
    id: 'pricing-tiers',
    title: 'Pricing Tiers',
    icon: Layers,
    description: 'Manage pricing tier levels and hierarchies'
  },
  {
    id: 'system-configurations',
    title: 'System Configurations',
    icon: Settings,
    description: 'Configure system-wide settings and parameters'
  },
  {
    id: 'engagement-model-subtypes',
    title: 'Engagement Model Subtypes',
    icon: GitBranch,
    description: 'Define engagement model variations and configurations'
  },
  {
    id: 'fee-components',
    title: 'Fee Components',
    icon: Package,
    description: 'Manage management, consulting, platform, and advance fee types'
  },
  {
    id: 'platform-fee-formulas',
    title: 'Platform Fee Formulas',
    icon: BarChart3,
    description: 'Create and manage dynamic pricing formulas with variables'
  },
  {
    id: 'advance-payment-types',
    title: 'Advance Payment Types',
    icon: CreditCard,
    description: 'Configure percentage-based advance payment structures'
  },
  {
    id: 'tier-engagement-restrictions',
    title: 'Tier Engagement Restrictions',
    icon: Lock,
    description: 'Manage tier-based access control for engagement models'
  }
];

export const administrationMenuItems = [
  {
    id: 'master-data-diagnostics',
    title: 'Master Data Diagnostics',
    icon: Database,
    description: 'Comprehensive health check for all master data'
  },
  {
    id: 'global-cache-manager',
    title: 'Global Cache Manager',
    icon: Database,
    description: 'Manage system cache'
  },
  {
    id: 'master-data-recovery',
    title: 'Master Data Recovery',
    icon: Shield,
    description: 'Recover lost data'
  },
  {
    id: 'admin-creation',
    title: 'Admin Creation',
    icon: Key,
    description: 'Create administrator accounts'
  },
  {
    id: 'admin-recovery',
    title: 'Admin Data Recovery',
    icon: Shield,
    description: 'Recover corrupted administrator data'
  },
  {
    id: 'complete-data-reset',
    title: 'Complete Data Reset',
    icon: Settings,
    description: 'Reset all organization data'
  },
  {
    id: 'localstorage-debug',
    title: 'localStorage Debug Panel',
    icon: Database,
    description: 'Analyze and verify localStorage data'
  }
];
