import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import KanbanBoard from './components/KanbanBoard';

export default function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <KanbanBoard />
      </AuthGuard>
    </AuthProvider>
  );
}
