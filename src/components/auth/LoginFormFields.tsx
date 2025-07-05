import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, User, Lock, Loader2 } from 'lucide-react';
import { LoginFormData, LoginState } from '@/types/loginTypes';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface LoginFormFieldsProps {
  form: UseFormReturn<LoginFormData>;
  loginState: LoginState;
  onSubmit: (data: LoginFormData) => Promise<void>;
  onReset: () => void;
  onTogglePassword: () => void;
  showHelpLink?: boolean;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  form,
  loginState,
  onSubmit,
  onReset,
  onTogglePassword,
  showHelpLink = true,
}) => {
  const passwordValue = form.watch('password');
  const passwordStrength = passwordValue ? validatePasswordStrength(passwordValue) : { score: 0, feedback: [] };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email/Username Field */}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Email or Username
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type="text"
                    className="pl-10"
                    placeholder="Enter your organization email or username"
                    autoComplete="username"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                    disabled={loginState.isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type={loginState.showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loginState.isLoading}
                  />
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {loginState.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              
              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator 
                password={field.value} 
                passwordStrength={passwordStrength} 
              />
            </FormItem>
          )}
        />

        {/* Remember Me and Forgot Password */}
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                    disabled={loginState.isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-foreground cursor-pointer">
                    Remember me for 30 days
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          {showHelpLink && (
            <div className="text-sm">
              <span className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Forgot Password?
              </span>
            </div>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loginState.isLoading || !form.formState.isValid}
        >
          {loginState.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In to Organization Portal'
          )}
        </Button>

        {/* Reset Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onReset}
          disabled={loginState.isLoading}
        >
          Reset Form
        </Button>
      </form>
    </Form>
  );
};

export default LoginFormFields;