import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, AlertTriangle } from 'lucide-react';

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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[JanRakshak Application Error Caught by Boundary]:', error, errorInfo);
  }

  private handleResetSession = () => {
    try {
      localStorage.removeItem('janrakshak_citizen_user');
      localStorage.removeItem('janrakshak_official_session');
    } catch {}
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Application State Recovered</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected state conflict occurred while rendering the dashboard. Click below to safely reset your session and reload the portal.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-red-300 text-left max-h-24 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleResetSession}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session & Return to Login</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
