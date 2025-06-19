
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
  Key
} from 'lucide-react';

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
    id: 'competency-capabilities',
    title: 'Competency & Capability',
    icon: Award,
    description: 'Define skills and capabilities'
  }
];

export const challengeMenuItems = [
  {
    id: 'challenge-statuses',
    title: 'Challenge Statuses',
    icon: Target,
    description: 'Configure challenge states'
  },
  {
    id: 'solution-statuses',
    title: 'Solution Statuses',
    icon: Lightbulb,
    description: 'Define solution states'
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
  },
  {
    id: 'solution-voting-assessment',
    title: 'Solution Voting Assessment',
    icon: CheckCircle,
    description: 'Configure voting mechanisms'
  },
  {
    id: 'membership-fee-validator',
    title: 'Membership Fee Validator',
    icon: DollarSign,
    description: 'Validate membership fees'
  }
];

export const administrationMenuItems = [
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
  }
];
