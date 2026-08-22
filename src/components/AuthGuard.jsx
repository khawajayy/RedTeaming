import React from 'react';
import { useAuth } from '../context/AuthContext';
import Auth from './Auth';
import { Shield } from 'lucide-react';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b12] flex flex-col items-center justify-center text-slate-300">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
          <Shield className="w-7 h-7 text-red-500 absolute" />
        </div>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest animate-pulse">
          Verifying Operator Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <>{children}</>;
}
