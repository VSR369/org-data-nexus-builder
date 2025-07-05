import React from 'react';
import { Link } from 'react-router-dom';

interface LoginFooterProps {
  showRegisterLink?: boolean;
  showHelpLink?: boolean;
}

const LoginFooter: React.FC<LoginFooterProps> = ({
  showRegisterLink = true,
  showHelpLink = true,
}) => {
  if (!showRegisterLink && !showHelpLink) return null;

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
      <p className="text-sm text-muted-foreground">
        Need to access a different area?{' '}
        <Link to="/signin" className="text-primary hover:underline font-medium">
          General Sign In
        </Link>
      </p>
    </div>
  );
};

export default LoginFooter;