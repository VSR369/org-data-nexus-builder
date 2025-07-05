import React from 'react';
import { Shield, Building2, MousePointer, Target } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LoginHeaderProps {
  routeSource?: 'direct' | 'general-signin' | 'post-registration' | 'post-signup' | 'legacy';
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ routeSource = 'direct' }) => {
  const location = useLocation();
  
  const getHeaderContent = () => {
    // Check if this is from general sign-in or has fromGeneralSignin state
    const isFromGeneralSignin = location.state?.fromGeneralSignin || routeSource === 'general-signin';
    
    if (isFromGeneralSignin) {
      return {
        title: 'Solution Seeking Organization Login',
        subtitle: 'Sign in to your organization account',
        icon: Building2
      };
    }
    
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
      case 'direct':
      default:
        return {
          title: 'Solution Seeking Organization Login',
          subtitle: 'Sign in to your organization account',
          icon: Target
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