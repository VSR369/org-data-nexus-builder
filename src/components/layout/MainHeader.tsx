
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  UserPlus, 
  Target, 
  Settings, 
  Home,
  Building2,
  Users
} from 'lucide-react';
import { NavigationLogo } from '../home/navigation/NavigationLogo';

export const MainHeader: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Main dashboard overview'
    },
    { 
      path: '/organization-dashboard', 
      label: 'Organization Portal', 
      icon: Building2,
      description: 'Organization management'
    },
    { 
      path: '/master-data-portal', 
      label: 'Master Data Portal', 
      icon: Database,
      description: 'Configuration management'
    },
    { 
      path: '/new-seeker', 
      label: 'New Seeker', 
      icon: UserPlus,
      description: 'Register new seekers'
    },
    { 
      path: '/contribution-portal', 
      label: 'Contribution', 
      icon: Target,
      description: 'Contribution management'
    },
    { 
      path: '/admin-portal', 
      label: 'Admin Portal', 
      icon: Settings,
      description: 'Administrative functions'
    }
  ];

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavigationLogo />

          {/* Main Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2 relative"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive(item.path) && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Active
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
