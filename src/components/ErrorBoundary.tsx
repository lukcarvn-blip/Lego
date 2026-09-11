import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { NotFound } from '../pages/NotFound';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <h1>Something went wrong.</h1>
          <p>Please refresh the page or try again later.</p>
          <pre style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,0,0,0.1)', color: '#ef4444', borderRadius: '8px', maxWidth: '80vw', overflowX: 'auto', textAlign: 'left' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
