import { api } from './api';
import { ApiResponse } from '../types';
import { WEEKLY_ACTIVITY } from '../data/mockData';

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  freezesRemaining: number;
  weeklyActivity: typeof WEEKLY_ACTIVITY;
  streakMilestones: { days: number; title: string; reached: boolean }[];
}

export const streakService = {
  async getStreaks(): Promise<ApiResponse<StreakData>> {
    const res = await api.get<StreakData>('/streaks');
    if (res.success && res.data) {
      return res;
    }
    return {
      success: true,
      data: {
        currentStreak: 27,
        bestStreak: 42,
        freezesRemaining: 2,
        weeklyActivity: WEEKLY_ACTIVITY,
        streakMilestones: [
          { days: 3, title: 'Flame Spark', reached: true },
          { days: 7, title: 'Weekly Champion', reached: true },
          { days: 14, title: 'Fortnight Fortitude', reached: true },
          { days: 21, title: 'Habit Formation', reached: true },
          { days: 30, title: 'Iron Will Legend', reached: false },
          { days: 60, title: 'Master of Flow', reached: false },
        ],
      },
    };
  },
};
