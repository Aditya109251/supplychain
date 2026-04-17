import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    const { hasError, error } = this.state;
    // @ts-ignore
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
          <div className="max-w-md w-full panel p-10 text-center">
            <div className="w-16 h-16 bg-risk-high/10 rounded-full flex items-center justify-center mx-auto mb-6 text-risk-high">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-serif font-black text-accent-brown uppercase tracking-tight mb-4">Integrity Breach</h2>
            <p className="text-text-secondary text-sm mb-8 opacity-70 leading-relaxed">
              The Supply AI visual layer encountered a critical rendering exception. This may be due to a component failure or data corruption.
            </p>
            <div className="bg-bg-light/50 p-4 rounded-2xl mb-8 text-left">
               <p className="text-[0.6rem] font-black uppercase text-risk-high tracking-widest mb-1">Stack Trace Summary</p>
               <p className="text-[0.7rem] font-mono text-accent-brown overflow-auto max-h-32">
                 {error?.message || 'Unknown Protocol Error'}
               </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="cta-button w-full py-4 text-[0.8rem]"
            >
              Restart Visual Mesh <RefreshCw size={16} />
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
