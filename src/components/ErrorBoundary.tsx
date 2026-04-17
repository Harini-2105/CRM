import * as React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './UI';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  props: Props;
  state: State = { hasError: false, error: null };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isPermissionError = false;

      try {
        // Attempt to parse Firestore error info
        const errorData = JSON.parse(this.state.error?.message || '{}');
        if (errorData.error && errorData.error.includes('Missing or insufficient permissions')) {
          errorMessage = `Security Access Denied: We couldn't perform the ${errorData.operationType} operation on ${errorData.path}. Please verify your organization permissions.`;
          isPermissionError = true;
        }
      } catch (e) {
        // Not a JSON error
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-muted-surface p-6">
          <div className="max-w-md w-full bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h1 className="text-2xl font-display font-bold text-text-strong mb-4">
                {isPermissionError ? 'Access Denied' : 'Oops, something went wrong'}
              </h1>
              <p className="text-text-muted mb-8 leading-relaxed">
                {errorMessage}
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  variant="primary" 
                  className="w-full h-11 gap-2 font-bold"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw size={18} />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-11 gap-2 border-border font-bold"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Home size={18} />
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <div className="bg-muted-surface px-8 py-4 border-t border-border">
              <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold text-center">
                Ref ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
