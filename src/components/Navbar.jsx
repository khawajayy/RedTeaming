import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  LogOut, 
  Database, 
  Sparkles, 
  RefreshCw, 
  Terminal, 
  User, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({ 
  hasCards, 
  totalCards, 
  onSeedData, 
  seedingLoading, 
  seedSuccessMessage 
}) {
  const { user, logout } = useAuth();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSeedClick = () => {
    if (hasCards) {
      setShowConfirmReset(true);
    } else {
      onSeedData(false);
    }
  };

  const confirmReset = () => {
    setShowConfirmReset(false);
    onSeedData(true);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Operator';

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight text-base sm:text-lg">
                  RED TEAM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  AI OPS
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
                6-Month Interactive Exploit & Defense Roadmap
              </p>
            </div>
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Seed / Reset Button */}
            {!hasCards ? (
              <button
                type="button"
                onClick={() => onSeedData(false)}
                disabled={seedingLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg shadow-red-600/30 border border-red-400/30 transition-all duration-200 cursor-pointer disabled:opacity-50 animate-pulse"
              >
                {seedingLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Seed Roadmap (24 Milestones)</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleSeedClick}
                  disabled={seedingLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
                  title="Reset or re-seed roadmap data"
                >
                  {seedingLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  ) : (
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="hidden md:inline">Reset / Re-Seed</span>
                </button>

                {/* Reset Confirmation Popover */}
                {showConfirmReset && (
                  <div className="absolute right-0 mt-2 w-72 p-4 bg-slate-900 border border-red-500/40 rounded-xl shadow-2xl z-50 animate-fadeIn text-xs">
                    <div className="flex items-start gap-2 text-red-300 font-semibold mb-1">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Re-seed 24 Milestones?</span>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-3">
                      This will reset all 24 tasks back to "To Do" state.
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowConfirmReset(false)}
                        className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmReset}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-medium"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Operator / Google User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-5 h-5 rounded-full ring-1 ring-red-500/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-3.5 h-3.5 text-red-400" />
              )}
              <span className="max-w-[140px] truncate" title={user?.email || displayName}>
                {displayName}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 rounded-xl transition-all duration-200 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>
      </div>

      {/* Success Notification Banner */}
      {seedSuccessMessage && (
        <div className="bg-emerald-500/10 border-t border-b border-emerald-500/20 px-4 py-2 text-center text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{seedSuccessMessage}</span>
        </div>
      )}
    </header>
  );
}
