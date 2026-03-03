import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start true — checking auth state

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
  }, []);

  // useEffect(() => {
  //   // On app load, check if user has an active session
  //   refreshUser().finally(() => setLoading(false));
  // }, [refreshUser]);

  const login = () => authService.loginWithGoogle();

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};