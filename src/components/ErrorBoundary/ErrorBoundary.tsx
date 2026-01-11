import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 *
 * Prevents the entire app from crashing when a component throws an error.
 * Displays a fallback UI instead of a white screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI styled like Mac OS X error dialog
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#3b82c4',
            fontFamily: '"Lucida Grande", "Lucida Sans Unicode", sans-serif',
            color: '#333',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px 32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#666' }}>
              The application encountered an unexpected error.
              {this.state.error && (
                <span style={{ display: 'block', marginTop: '8px', fontFamily: 'Monaco, monospace', fontSize: '11px' }}>
                  {this.state.error.message}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                padding: '8px 24px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: 'linear-gradient(180deg, #fff 0%, #e5e5e5 100%)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
