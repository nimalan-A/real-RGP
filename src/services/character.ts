import { api } from './api';
import { ApiResponse, CharacterSheet, AttributeStat, AttributeKey } from '../types';
import { INITIAL_CHARACTER } from '../data/mockData';

let localCharacter: CharacterSheet = { ...INITIAL_CHARACTER };

export const characterService = {
  async getCharacter(): Promise<ApiResponse<CharacterSheet>> {
    const res = await api.get<CharacterSheet>('/character');
    if (res.success && res.data) {
      localCharacter = res.data;
      return res;
    }
    return {
      success: true,
      data: localCharacter,
    };
  },

  async getAttributes(): Promise<ApiResponse<Record<AttributeKey, AttributeStat>>> {
    const res = await api.get<Record<AttributeKey, AttributeStat>>('/character/attributes');
    if (res.success && res.data) {
      return res;
    }
    return {
      success: true,
      data: localCharacter.attributes,
    };
  },

  async updateCharacter(updates: Partial<CharacterSheet>): Promise<ApiResponse<CharacterSheet>> {
    const res = await api.patch<CharacterSheet>('/character', updates);
    if (res.success && res.data) {
      localCharacter = res.data;
      return res;
    }
    localCharacter = { ...localCharacter, ...updates };
    return {
      success: true,
      data: localCharacter,
    };
  },

  async allocateAttributePoint(attribute: AttributeKey, points = 1): Promise<ApiResponse<CharacterSheet>> {
    const res = await api.post<CharacterSheet>('/character/attributes/allocate', { attribute, points });
    if (res.success && res.data) {
      localCharacter = res.data;
      return res;
    }
    const currentAttr = localCharacter.attributes[attribute];
    if (currentAttr) {
      currentAttr.value = Math.min(100, currentAttr.value + points * 2);
      currentAttr.recentGain += points * 2;
    }
    return {
      success: true,
      data: { ...localCharacter },
    };
  },
};
