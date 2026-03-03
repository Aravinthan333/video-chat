import api from './api';
import type { User, UpdateProfileData } from '../types';

export const userService = {
  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/profile');
    return res.data.user;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const res = await api.patch('/users/profile', data);
    return res.data.user;
  },
};