import { api } from './api';
import { ApiResponse, RewardItem } from '../types';
import { INITIAL_REWARDS } from '../data/mockData';

let localInventory = INITIAL_REWARDS.filter((r) => r.owned);

export const inventoryService = {
  async getInventory(): Promise<ApiResponse<RewardItem[]>> {
    const res = await api.get<RewardItem[]>('/inventory');
    if (res.success && res.data) {
      localInventory = res.data;
      return res;
    }
    return {
      success: true,
      data: localInventory,
    };
  },

  async equipItem(id: string): Promise<ApiResponse<RewardItem>> {
    const res = await api.post<RewardItem>(`/inventory/${id}/equip`);
    if (res.success && res.data) {
      return res;
    }
    const item = localInventory.find((i) => i.id === id);
    if (!item) {
      return {
        success: false,
        data: null as unknown as RewardItem,
        error: { code: 'NOT_FOUND', message: 'Item not in inventory' },
      };
    }
    // Unequip others in same slot
    localInventory = localInventory.map((i) => {
      if (i.equipSlot === item.equipSlot) {
        return { ...i, equipped: i.id === id };
      }
      return i;
    });
    return {
      success: true,
      data: { ...item, equipped: true },
    };
  },

  async unequipItem(id: string): Promise<ApiResponse<RewardItem>> {
    const res = await api.post<RewardItem>(`/inventory/${id}/unequip`);
    if (res.success && res.data) {
      return res;
    }
    const item = localInventory.find((i) => i.id === id);
    if (!item) {
      return {
        success: false,
        data: null as unknown as RewardItem,
        error: { code: 'NOT_FOUND', message: 'Item not in inventory' },
      };
    }
    item.equipped = false;
    return {
      success: true,
      data: { ...item, equipped: false },
    };
  },
};
