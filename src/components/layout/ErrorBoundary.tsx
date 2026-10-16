import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // If the error comes from an external browser extension like MetaMask or Web3 injection, ignore it
    const msg = (error?.message || '').toLowerCase();
    const stack = (error?.stack || '').toLowerCase();
    if (
      msg.includes('metamask') ||
      msg.includes('ethereum') ||
      msg.includes('inpage.js') ||
      stack.includes('chrome-extension://')
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = (error?.message || '').toLowerCase();
    if (
      msg.includes('metamask') ||
      msg.includes('ethereum') ||
      msg.includes('inpage.js')
    ) {
      // Ignore extension-injected errors
      return;
    }
    console.error('SafeNet Application ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-white">System Signal Interruption</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                A localized client rendering interruption occurred. The SafeNet Security perimeter remains secure.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-establish Signal</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Command HQ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
