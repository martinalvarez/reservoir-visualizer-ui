import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary class component to catch rendering errors in children.
 * Note: Error Boundaries must be Class Components as of React 18/19.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // Called when a child component throws an error during rendering
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // Used for logging error details to an external service (e.g., Sentry)
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Return a custom fallback UI if provided, otherwise a default one
      return (
        this.props.fallback || (
          <div style={containerStyle}>
            <h2 style={titleStyle}>Service Temporarily Unavailable</h2>
            <p style={textStyle}>We encountered an error while loading this data.</p>
            <button style={buttonStyle} onClick={() => this.setState({ hasError: false })}>
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Inline styles to keep the component self-contained
const containerStyle = {
  padding: '2rem',
  backgroundColor: '#fff1f2',
  border: '1px solid #fecdd3',
  borderRadius: '0.5rem',
  textAlign: 'center' as const,
  margin: '1rem 0',
};

const titleStyle = { color: '#9f1239', margin: '0 0 0.5rem 0' };
const textStyle = { color: '#be123c', marginBottom: '1rem' };
const buttonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#be123c',
  color: 'white',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
};

export default ErrorBoundary;
