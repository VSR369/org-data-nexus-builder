import * as z from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Username is required")
    .refine((value) => {
      // Allow email format or username
      if (value.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
      return value.length >= 3;
    }, "Please enter a valid email address or username (min 3 characters)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface SolutionSeekingOrgLoginProps {
  onSuccess?: (userData: any) => void;
  redirectUrl?: string;
  showRegisterLink?: boolean;
  showHelpLink?: boolean;
  className?: string;
  prefilledEmail?: string;
  routeSource?: 'direct' | 'general-signin' | 'post-registration' | 'post-signup' | 'legacy';
}

export interface PasswordStrength {
  score: number;
  feedback: string[];
}

export interface LoginState {
  showPassword: boolean;
  isLoading: boolean;
  error: string;
  success: string;
}