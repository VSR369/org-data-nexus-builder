import { solutionSeekingOrgAuthService } from '@/services/SolutionSeekingOrgAuthService';
import { LoginCredentials, AuthResult, AuthSession, RememberMeData } from '@/types/authTypes';

/**
 * Login utility function for Solution Seeking Organizations
 */
export const loginSolutionSeekingOrg = async (credentials: LoginCredentials): Promise<AuthResult> => {
  return await solutionSeekingOrgAuthService.loginSolutionSeekingOrg(credentials);
};

/**
 * Get current authenticated Solution Seeking Organization
 */
export const getCurrentSolutionSeekingOrg = (): AuthSession | null => {
  return solutionSeekingOrgAuthService.getCurrentSolutionSeekingOrg();
};

/**
 * Logout Solution Seeking Organization
 */
export const logoutSolutionSeekingOrg = (): void => {
  solutionSeekingOrgAuthService.logoutSolutionSeekingOrg();
};

/**
 * Check if Solution Seeking Organization is authenticated
 */
export const isAuthenticated = (): boolean => {
  return solutionSeekingOrgAuthService.isAuthenticated();
};

/**
 * Get remember me data
 */
export const getRememberMeData = (): RememberMeData | null => {
  return solutionSeekingOrgAuthService.getRememberMeData();
};

/**
 * Clear all authentication data
 */
export const clearAllAuthData = (): void => {
  solutionSeekingOrgAuthService.clearAllAuthData();
};

/**
 * Get authentication service health
 */
export const getAuthServiceHealth = (): any => {
  return solutionSeekingOrgAuthService.getAuthServiceHealth();
};