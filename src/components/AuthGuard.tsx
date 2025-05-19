import React from 'react';
import { useAuth } from '../lib/auth';
import { Login } from '../pages/Login';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};