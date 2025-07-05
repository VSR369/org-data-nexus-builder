import React from 'react';
import { Shield, Building2, MousePointer } from 'lucide-react';

interface LoginHeaderProps {
  routeSource?: 'direct' | 'general-signin' | 'post-registration' | 'post-signup' | 'legacy';
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ routeSource = 'direct' }) => {
  const getHeaderContent = () => {
    switch (routeSource) {
      case 'post-registration':
        return {
          title: 'Welcome! Complete Your Login',
          subtitle: 'Your organization has been registered successfully. Please sign in to access your dashboard.',
          icon: Building2
        };
      case 'post-signup':
        return {
          title: 'Registration Complete',
          subtitle: 'Thank you for registering! Please sign in with your credentials to continue.',
          icon: Building2
        };
      case 'general-signin':
        return {
          title: 'Organization Portal',
          subtitle: 'You selected Solution Seeking Organization. Please sign in with your credentials.',
          icon: MousePointer
        };
      case 'direct':
      default:
        return {
          title: 'Organization Portal',
          subtitle: 'Sign in to access your solution seeking organization dashboard',
          icon: Shield
        };
    }
  };

  const { title, subtitle, icon: Icon } = getHeaderContent();

  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2">
        <Icon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
};

export default LoginHeader;