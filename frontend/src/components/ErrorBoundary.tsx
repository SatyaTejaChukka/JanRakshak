import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[JanRakshak Diagnostic Shield Caught Error]:', error, errorInfo);
  }

  private handleTryReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleResetSession = () => {
    try {
      localStorage.removeItem('janrakshak_citizen_user');
      localStorage.removeItem('janrakshak_official_session');
    } catch {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected state conflict occurred.';

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-xl">
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full inline-block">
                  JanRakshak Diagnostic Shield
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Dashboard Render Handled
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your session and Aadhaar verification status are preserved. A safe recovery fallback has been engaged.
                </p>
              </div>
            </div>

            {/* User-Friendly Status Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Notice: Component Render Handled Safely</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                If you were navigating after entering the verification code, your credentials are saved. Click below to continue into the Civic Portal or sign out.
              </p>

              {/* Expandable Technical Debug Section */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center justify-between w-full cursor-pointer py-0.5"
                >
                  <span>Technical Diagnostics</span>
                  {this.state.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[10px] font-mono text-amber-300/90 max-h-32 overflow-y-auto break-all select-all">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={this.handleTryReload}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Continue to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetSession}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-red-300 text-slate-400 text-xs font-semibold rounded-xl border border-slate-700/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sign Out & Return to Login</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
