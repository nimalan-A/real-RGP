import { api } from './api';
import { ApiResponse, LevelMilestone } from '../types';
import { LEVEL_MILESTONES, WEEKLY_ACTIVITY } from '../data/mockData';

export interface ProgressionData {
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  percentage: number;
  milestones: LevelMilestone[];
  history: typeof WEEKLY_ACTIVITY;
}

export const progressionService = {
  async getProgression(): Promise<ApiResponse<ProgressionData>> {
    const res = await api.get<ProgressionData>('/progression');
    if (res.success && res.data) {
      return res;
    }
    return {
      success: true,
      data: {
        currentLevel: 14,
        currentXp: 8420,
        xpToNextLevel: 10000,
        totalXp: 48950,
        percentage: 84.2,
        milestones: LEVEL_MILESTONES,
        history: WEEKLY_ACTIVITY,
      },
    };
  },

  async getHistory(): Promise<ApiResponse<typeof WEEKLY_ACTIVITY>> {
    const res = await api.get<typeof WEEKLY_ACTIVITY>('/progression/history');
    if (res.success && res.data) {
      return res;
    }
    return {
      success: true,
      data: WEEKLY_ACTIVITY,
    };
  },
};
