import { api } from './api';
import { ApiResponse, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/mockData';

let localAchievements = [...INITIAL_ACHIEVEMENTS];

export const achievementService = {
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    const res = await api.get<Achievement[]>('/achievements');
    if (res.success && res.data) {
      localAchievements = res.data;
      return res;
    }
    return {
      success: true,
      data: localAchievements,
    };
  },

  async claimAchievementReward(id: string): Promise<ApiResponse<Achievement>> {
    const res = await api.post<Achievement>(`/achievements/${id}/claim`);
    if (res.success && res.data) {
      return res;
    }
    const ach = localAchievements.find((a) => a.id === id);
    if (!ach) {
      return {
        success: false,
        data: null as unknown as Achievement,
        error: { code: 'NOT_FOUND', message: 'Achievement not found' },
      };
    }
    return {
      success: true,
      data: { ...ach },
    };
  },
};
