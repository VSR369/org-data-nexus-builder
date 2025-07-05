import React, { useEffect } from 'react';
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
  prefilledEmail = '',
  routeSource = 'direct',
}) => {
  const {
    form,
    loginState,
    onSubmit,
    resetForm,
    togglePasswordVisibility,
  } = useOrgLogin({ onSuccess, redirectUrl });

  // Pre-fill email when provided
  useEffect(() => {
    if (prefilledEmail && prefilledEmail.trim()) {
      console.log('📧 LOGIN - Pre-filling email field:', prefilledEmail);
      form.setValue('identifier', prefilledEmail.trim());
    }
  }, [prefilledEmail, form]);

  return (
    <div className={`space-y-6 ${className}`}>
      <LoginHeader routeSource={routeSource} />
      
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
        routeSource={routeSource}
      />
    </div>
  );
};

export default SolutionSeekingOrgLogin;