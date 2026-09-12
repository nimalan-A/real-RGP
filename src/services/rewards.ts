import { api } from './api';
import { ApiResponse, RewardItem } from '../types';
import { INITIAL_REWARDS } from '../data/mockData';

let localRewards = [...INITIAL_REWARDS];

export interface PurchaseResult {
  reward: RewardItem;
  remainingGold: number;
}

export const rewardService = {
  async getRewards(): Promise<ApiResponse<RewardItem[]>> {
    const res = await api.get<RewardItem[]>('/rewards');
    if (res.success && res.data) {
      localRewards = res.data;
      return res;
    }
    return {
      success: true,
      data: localRewards,
    };
  },

  async purchaseReward(id: string): Promise<ApiResponse<PurchaseResult>> {
    const res = await api.post<PurchaseResult>(`/rewards/${id}/purchase`);
    if (res.success && res.data) {
      localRewards = localRewards.map((r) => (r.id === id ? { ...r, owned: true } : r));
      return res;
    }
    const found = localRewards.find((r) => r.id === id);
    if (!found) {
      return {
        success: false,
        data: null as unknown as PurchaseResult,
        error: { code: 'NOT_FOUND', message: 'Item not found in Bazaar' },
      };
    }
    found.owned = true;
    return {
      success: true,
      data: {
        reward: found,
        remainingGold: 1240 - found.price,
      },
    };
  },
};
