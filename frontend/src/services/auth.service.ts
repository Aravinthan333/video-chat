import api from './api';
import type { User } from '../types';

export const authService = {
  // Returns current user or null
  getMe: async (): Promise<User | null> => {
    try {
      const res = await api.get('/auth/me');
      return res.data.user;
    } catch {
      return null;
    }
  },

  // Redirects browser to backend Google OAuth endpoint
  // This is a full page redirect, not an AJAX call
  loginWithGoogle: () => {
    window.location.href = `http://localhost:3000/api/auth/google`;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};