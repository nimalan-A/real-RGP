import { api } from './api';
import { ApiResponse, Quest } from '../types';
import { INITIAL_QUESTS } from '../data/mockData';

// Local cache for standalone development without live server
let localQuests: Quest[] = [...INITIAL_QUESTS];

export interface QuestCompleteResult {
  quest: Quest;
  xpEarned: number;
  goldEarned: number;
  attributeGained: {
    attribute: string;
    amount: number;
  };
  streak: number;
  levelUp: boolean;
  newLevel?: number;
  unlockedReward?: string;
}

export const questService = {
  async getQuests(): Promise<ApiResponse<Quest[]>> {
    const res = await api.get<Quest[]>('/quests');
    if (res.success && res.data) {
      localQuests = res.data;
      return res;
    }
    return {
      success: true,
      data: localQuests,
    };
  },

  async getQuestById(id: string): Promise<ApiResponse<Quest>> {
    const res = await api.get<Quest>(`/quests/${id}`);
    if (res.success && res.data) {
      return res;
    }
    const found = localQuests.find((q) => q.id === id);
    if (found) {
      return { success: true, data: found };
    }
    return {
      success: false,
      data: null as unknown as Quest,
      error: { code: 'NOT_FOUND', message: 'Quest not found' },
    };
  },

  async createQuest(payload: Omit<Quest, 'id' | 'status' | 'progress'>): Promise<ApiResponse<Quest>> {
    const res = await api.post<Quest>('/quests', payload);
    if (res.success && res.data) {
      localQuests.unshift(res.data);
      return res;
    }
    const newQuest: Quest = {
      ...payload,
      id: `quest-${Date.now()}`,
      status: 'not_started',
      progress: 0,
    };
    localQuests = [newQuest, ...localQuests];
    return {
      success: true,
      data: newQuest,
    };
  },

  async updateQuest(id: string, updates: Partial<Quest>): Promise<ApiResponse<Quest>> {
    const res = await api.patch<Quest>(`/quests/${id}`, updates);
    if (res.success && res.data) {
      localQuests = localQuests.map((q) => (q.id === id ? res.data : q));
      return res;
    }
    let updatedQuest: Quest | null = null;
    localQuests = localQuests.map((q) => {
      if (q.id === id) {
        updatedQuest = { ...q, ...updates };
        return updatedQuest;
      }
      return q;
    });
    if (updatedQuest) {
      return { success: true, data: updatedQuest };
    }
    return {
      success: false,
      data: null as unknown as Quest,
      error: { code: 'NOT_FOUND', message: 'Quest not found' },
    };
  },

  async deleteQuest(id: string): Promise<ApiResponse<boolean>> {
    const res = await api.delete<boolean>(`/quests/${id}`);
    localQuests = localQuests.filter((q) => q.id !== id);
    return res.success ? res : { success: true, data: true };
  },

  async completeQuest(id: string): Promise<ApiResponse<QuestCompleteResult>> {
    const res = await api.post<QuestCompleteResult>(`/quests/${id}/complete`);
    if (res.success && res.data) {
      localQuests = localQuests.map((q) => (q.id === id ? res.data.quest : q));
      return res;
    }
    const found = localQuests.find((q) => q.id === id);
    const target = found || {
      id,
      title: 'Active Quest',
      category: 'coding',
      difficulty: 'medium',
      xpReward: 70,
      goldReward: 35,
      targetAttribute: 'intellect',
      dueDate: new Date().toISOString(),
      estimatedDuration: 30,
      status: 'not_started',
      progress: 0,
    } as Quest;

    const completedQuest: Quest = {
      ...target,
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
    };
    localQuests = localQuests.map((q) => (q.id === id ? completedQuest : q));

    return {
      success: true,
      data: {
        quest: completedQuest,
        xpEarned: target.xpReward || 70,
        goldEarned: target.goldReward || 35,
        attributeGained: {
          attribute: target.targetAttribute || 'intellect',
          amount: Math.round((target.xpReward || 70) * 0.25),
        },
        streak: 28,
        levelUp: false,
      },
    };
  },
};
