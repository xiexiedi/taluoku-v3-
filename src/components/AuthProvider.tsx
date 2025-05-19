import React, { createContext, useEffect, useState } from 'react';
import { AuthContext, AuthUser, signIn, signUp, signOut } from '../lib/auth';
import { LoadingSpinner } from './LoadingSpinner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('tarot_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signIn: async (username: string, password: string) => {
      const { user } = await signIn(username, password);
      setUser(user);
    },
    signUp: async (username: string, password: string) => {
      const { user } = await signUp(username, password);
      setUser(user);
    },
    signOut: async () => {
      await signOut();
      setUser(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};