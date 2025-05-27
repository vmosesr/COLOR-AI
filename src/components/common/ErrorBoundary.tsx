import { Component } from 'react';
import type { ReactNode } from 'react';
import { ToastContent } from '../../hooks/ToastContent';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

type ToastContentType = {
  toast: (options: { title: string; description: string; variant: string }) => void;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contentType = ToastContent;
  declare content: ToastContentType;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    const toast = this.content.toast;
    toast({
      title: 'Error',
      description: error.message,
      variant: 'error',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}