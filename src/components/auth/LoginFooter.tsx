import React from 'react';
import { Link } from 'react-router-dom';

interface LoginFooterProps {
  showRegisterLink?: boolean;
  showHelpLink?: boolean;
  routeSource?: 'direct' | 'general-signin' | 'post-registration' | 'post-signup' | 'legacy';
}

const LoginFooter: React.FC<LoginFooterProps> = ({
  showRegisterLink = true,
  showHelpLink = true,
  routeSource = 'direct',
}) => {
  if (!showRegisterLink && !showHelpLink) return null;

  const getBackNavigation = () => {
    switch (routeSource) {
      case 'general-signin':
        return (
          <p className="text-sm text-muted-foreground">
            Want to select a different user type?{' '}
            <Link to="/general-signin" className="text-primary hover:underline font-medium">
              Back to General Sign In
            </Link>
          </p>
        );
      case 'post-registration':
      case 'post-signup':
        return (
          <p className="text-sm text-muted-foreground">
            Registration issues?{' '}
            <Link to="/seeker-registration" className="text-primary hover:underline font-medium">
              Register Again
            </Link>
          </p>
        );
      default:
        return (
          <p className="text-sm text-muted-foreground">
            Need to access a different area?{' '}
            <Link to="/general-signin" className="text-primary hover:underline font-medium">
              General Sign In
            </Link>
          </p>
        );
    }
  };

  return (
    <div className="text-center pt-4 border-t border-border space-y-2">
      {showRegisterLink && (
        <p className="text-sm text-muted-foreground">
          Don't have an organization account?{' '}
          <Link to="/seeker-registration" className="text-primary hover:underline font-medium">
            Register Organization
          </Link>
        </p>
      )}
      {getBackNavigation()}
    </div>
  );
};

export default LoginFooter;