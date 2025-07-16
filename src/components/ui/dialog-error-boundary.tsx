import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DialogErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dialog Error Boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium text-destructive">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The dialog encountered an error. Please try again.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for easier usage
export const useDialogErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: Error, context: string) => {
    console.error(`Dialog Error in ${context}:`, error);
    toast({
      title: "Error",
      description: `An error occurred in ${context}. Please try again.`,
      variant: "destructive",
    });
  };

  return { handleError };
};