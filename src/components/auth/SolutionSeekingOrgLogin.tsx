import React from 'react';
import { useOrgLogin } from '@/hooks/useOrgLogin';
import { SolutionSeekingOrgLoginProps } from '@/types/loginTypes';
import LoginHeader from './LoginHeader';
import LoginAlerts from './LoginAlerts';
import LoginFormFields from './LoginFormFields';
import LoginFooter from './LoginFooter';

const SolutionSeekingOrgLogin: React.FC<SolutionSeekingOrgLoginProps> = ({
  onSuccess,
  redirectUrl = '/seeking-org-admin-dashboard',
  showRegisterLink = true,
  showHelpLink = true,
  className = '',
}) => {
  const {
    form,
    loginState,
    onSubmit,
    resetForm,
    togglePasswordVisibility,
  } = useOrgLogin({ onSuccess, redirectUrl });

  return (
    <div className={`space-y-6 ${className}`}>
      <LoginHeader />
      
      <LoginAlerts error={loginState.error} success={loginState.success} />
      
      <LoginFormFields
        form={form}
        loginState={loginState}
        onSubmit={onSubmit}
        onReset={resetForm}
        onTogglePassword={togglePasswordVisibility}
        showHelpLink={showHelpLink}
      />

      <LoginFooter 
        showRegisterLink={showRegisterLink} 
        showHelpLink={showHelpLink} 
      />
    </div>
  );
};

export default SolutionSeekingOrgLogin;