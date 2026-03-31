import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="bg-slate-800 border border-red-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl" role="img" aria-label="Error">⚠️</span>
              <div>
                <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
                <p className="text-slate-300 text-sm mb-4">
                  An unexpected error occurred. Please try refreshing the page.
                </p>
                {this.state.error && (
                  <details className="mb-4">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                      Error details
                    </summary>
                    <pre className="mt-2 text-xs text-red-300 bg-slate-900 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}
              </div>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
