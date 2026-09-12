import { api } from './api';
import { ApiResponse, UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

let localProfile = { ...INITIAL_USER_PROFILE };

export const profileService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const res = await api.get<UserProfile>('/profile');
    if (res.success && res.data) {
      localProfile = res.data;
      return res;
    }
    return {
      success: true,
      data: localProfile,
    };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const res = await api.patch<UserProfile>('/profile', updates);
    if (res.success && res.data) {
      localProfile = res.data;
      return res;
    }
    localProfile = { ...localProfile, ...updates };
    return {
      success: true,
      data: localProfile,
    };
  },
};
