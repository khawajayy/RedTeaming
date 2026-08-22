import React, { Component } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import KanbanBoard from './components/KanbanBoard';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-12 h-12 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Red Team Subsystem Fault</h1>
          <p className="text-slate-400 text-sm max-w-md mb-6 font-mono">
            {this.state.error?.message || 'An unexpected client-side error occurred.'}
          </p>
          <button
            onClick={this.handleReload}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Cache & Reload Sandbox</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGuard>
          <KanbanBoard />
        </AuthGuard>
      </AuthProvider>
    </ErrorBoundary>
  );
}
