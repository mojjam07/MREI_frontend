import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { 
        fallback: FallbackComponent, 
        fallbackTitle = 'Something went wrong',
        fallbackMessage = 'An error occurred while loading this section.',
        showErrorDetails = false,
        showRetry = true,
        showReload = true 
      } = this.props;

      // If a custom fallback component is provided, use it
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 m-4">
          <div className="text-center">
            <div className="text-red-400 text-xl font-semibold mb-2">
              {fallbackTitle}
            </div>
            
            <div className="text-white/80 text-sm mb-4">
              {fallbackMessage}
            </div>

            {/* Error Details - Only shown in development or if explicitly enabled */}
            {showErrorDetails && typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
              <details className="text-left mb-4 p-3 bg-red-500/5 rounded border border-red-500/10">
                <summary className="text-red-300 text-sm cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-200 overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {showRetry && (
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors text-sm"
                  disabled={this.state.retryCount >= 3}
                  title={this.state.retryCount >= 3 ? 'Maximum retries reached' : 'Try again'}
                >
                  {this.state.retryCount >= 3 ? 'Retry (Max)' : 'Retry'}
                </button>
              )}
              
              {showReload && (
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 transition-colors text-sm"
                >
                  Reload Page
                </button>
              )}
            </div>

            {/* Retry Count Display */}
            {showRetry && this.state.retryCount > 0 && (
              <div className="text-white/60 text-xs mt-2">
                Retry attempts: {this.state.retryCount}/3
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component to wrap components with ErrorBoundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook to create error boundary for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);
  
  const resetError = React.useCallback(() => {
    setError(null);
  }, []);
  
  const captureError = React.useCallback((error, errorInfo = null) => {
    console.error('Manual error capture:', error, errorInfo);
    setError({ error, errorInfo });
  }, []);

  // Re-throw the error to trigger ErrorBoundary if it exists
  if (error) {
    throw error.error;
  }

  return { captureError, resetError };
};

export default ErrorBoundary;
