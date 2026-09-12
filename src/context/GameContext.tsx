import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CharacterSheet,
  Quest,
  RewardItem,
  AttributeKey,
  DailyMission,
} from '../types';
import {
  INITIAL_CHARACTER,
  INITIAL_QUESTS,
  INITIAL_REWARDS,
  INITIAL_DAILY_MISSIONS,
} from '../data/mockData';
import { questService } from '../services/quests';
import { rewardService } from '../services/rewards';
import { useNotifications } from './NotificationContext';

export interface LevelUpCelebration {
  previousLevel: number;
  newLevel: number;
  attributePointsGained: number;
  newTitle?: string;
  unlockedPerks: string[];
}

interface GameContextType {
  character: CharacterSheet;
  quests: Quest[];
  rewards: RewardItem[];
  dailyMissions: DailyMission[];
  unallocatedPoints: number;
  levelUpCelebration: LevelUpCelebration | null;
  dismissLevelUp: () => void;
  completeQuest: (id: string) => Promise<void>;
  createQuest: (questData: Omit<Quest, 'id' | 'status' | 'progress'>) => Promise<boolean>;
  updateQuest: (id: string, updates: Partial<Quest>) => Promise<boolean>;
  deleteQuest: (id: string) => Promise<boolean>;
  toggleDailyMission: (id: string) => void;
  purchaseReward: (id: string) => Promise<boolean>;
  equipItem: (id: string) => void;
  unequipItem: (id: string) => void;
  allocateAttributePoint: (attribute: AttributeKey) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Non-linear XP required calculation
export const calculateXpForLevel = (level: number): number => {
  return Math.round(100 * Math.pow(1.5, level - 1));
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast } = useNotifications();

  // Load from local storage or mock defaults
  const [character, setCharacter] = useState<CharacterSheet>(() => {
    const saved = localStorage.getItem('life_rpg_character');
    return saved ? JSON.parse(saved) : INITIAL_CHARACTER;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('life_rpg_quests');
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('life_rpg_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(INITIAL_DAILY_MISSIONS);
  const [unallocatedPoints, setUnallocatedPoints] = useState<number>(0);
  const [levelUpCelebration, setLevelUpCelebration] = useState<LevelUpCelebration | null>(null);

  // Sync to local display cache
  useEffect(() => {
    localStorage.setItem('life_rpg_character', JSON.stringify(character));
  }, [character]);

  useEffect(() => {
    localStorage.setItem('life_rpg_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('life_rpg_rewards', JSON.stringify(rewards));
  }, [rewards]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#fea619', '#10b981', '#3525cd', '#d97706'],
      });
    } catch {
      // safe fallback
    }
  };

  const completeQuest = async (id: string) => {
    const quest = quests.find((q) => q.id === id);
    if (!quest || quest.status === 'completed') return;

    // Snapshot current state for rollback if server rejects
    const previousQuests = [...quests];
    const previousCharacter = { ...character };

    // 1. Optimistic Update
    const xpReward = quest.xpReward || 70;
    const goldReward = quest.goldReward || 35;
    const targetAttrKey = quest.targetAttribute || 'intellect';
    const attrGain = Math.round(xpReward * 0.25);

    setQuests((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: 'completed' as const,
              progress: 100,
              completedAt: new Date().toISOString(),
            }
          : q
      )
    );

    // Calculate XP and level progression
    let newLevel = character.level;
    let newXp = character.currentXp + xpReward;
    let xpTarget = character.xpToNextLevel;
    let didLevelUp = false;

    while (newXp >= xpTarget) {
      newXp -= xpTarget;
      newLevel += 1;
      xpTarget = Math.round(xpTarget * 1.35);
      didLevelUp = true;
    }

    const updatedAttributes = { ...character.attributes };
    if (updatedAttributes[targetAttrKey]) {
      const current = updatedAttributes[targetAttrKey];
      updatedAttributes[targetAttrKey] = {
        ...current,
        value: Math.min(100, current.value + Math.ceil(attrGain / 5)),
        recentGain: current.recentGain + attrGain,
      };
    }

    const newStreak = character.streak + 1;
    const newBestStreak = Math.max(character.bestStreak, newStreak);

    setCharacter({
      ...character,
      level: newLevel,
      currentXp: newXp,
      xpToNextLevel: xpTarget,
      totalXp: character.totalXp + xpReward,
      gold: character.gold + goldReward,
      streak: newStreak,
      bestStreak: newBestStreak,
      completedQuestsCount: character.completedQuestsCount + 1,
      attributes: updatedAttributes,
    });

    if (didLevelUp) {
      setUnallocatedPoints((prev) => prev + 5);
      setLevelUpCelebration({
        previousLevel: character.level,
        newLevel,
        attributePointsGained: 5,
        newTitle: newLevel >= 15 ? 'Master of Agency' : undefined,
        unlockedPerks: ['+5 Attribute Allocation Points', 'New Tier Equipment in Bazaar'],
      });
      triggerConfetti();
      addToast({
        type: 'level_up',
        title: 'LEVEL UP!',
        message: `Level ${character.level} → Level ${newLevel}! +5 Attribute Points granted.`,
      });
    } else {
      addToast({
        type: 'xp_drop',
        title: '⚔ QUEST COMPLETE!',
        message: `+${xpReward} XP • +${goldReward} Gold • +${attrGain} ${targetAttrKey.toUpperCase()} • Streak +1 🔥`,
        xp: xpReward,
        gold: goldReward,
        attribute: targetAttrKey,
      });
    }

    // 2. Synchronize with Service Layer
    try {
      const res = await questService.completeQuest(id);
      if (!res.success) {
        // Rollback on server error
        setQuests(previousQuests);
        setCharacter(previousCharacter);
        addToast({
          type: 'error',
          title: 'COULD NOT SAVE QUEST',
          message: res.error?.message || 'Synchronization failed. Progress reverted.',
        });
      }
    } catch {
      // Keep optimistic progress for hackathon demo resilience
    }
  };

  const createQuest = async (
    questData: Omit<Quest, 'id' | 'status' | 'progress'>
  ): Promise<boolean> => {
    const res = await questService.createQuest(questData);
    if (res.success && res.data) {
      setQuests((prev) => [res.data, ...prev]);
      addToast({
        type: 'success',
        title: 'Quest Commissioned!',
        message: `"${questData.title}" is now active on your Quest Board.`,
      });
      return true;
    }
    return false;
  };

  const updateQuest = async (id: string, updates: Partial<Quest>): Promise<boolean> => {
    const res = await questService.updateQuest(id, updates);
    if (res.success && res.data) {
      setQuests((prev) => prev.map((q) => (q.id === id ? res.data : q)));
      addToast({
        type: 'success',
        title: 'Quest Updated',
        message: 'Changes saved successfully.',
      });
      return true;
    }
    return false;
  };

  const deleteQuest = async (id: string): Promise<boolean> => {
    const res = await questService.deleteQuest(id);
    if (res.success) {
      setQuests((prev) => prev.filter((q) => q.id !== id));
      addToast({
        type: 'info',
        title: 'Quest Abandoned',
        message: 'Quest removed from your board.',
      });
      return true;
    }
    return false;
  };

  const toggleDailyMission = (id: string) => {
    setDailyMissions((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = !m.completed;
          if (updated) {
            setCharacter((c) => ({
              ...c,
              currentXp: c.currentXp + m.xp,
              totalXp: c.totalXp + m.xp,
              gold: c.gold + m.gold,
            }));
            addToast({
              type: 'xp_drop',
              title: 'Daily Mission Done',
              message: `+${m.xp} XP • +${m.gold} Gold`,
            });
          }
          return { ...m, completed: updated };
        }
        return m;
      })
    );
  };

  const purchaseReward = async (id: string): Promise<boolean> => {
    const item = rewards.find((r) => r.id === id);
    if (!item) return false;

    if (item.owned) {
      addToast({
        type: 'info',
        title: 'Already Owned',
        message: 'This item is already registered in your Vault.',
      });
      return false;
    }

    if (character.gold < item.price) {
      addToast({
        type: 'error',
        title: 'Insufficient Gold',
        message: `You need ${item.price - character.gold} more Gold to acquire this item.`,
      });
      return false;
    }

    // Optimistic purchase
    setCharacter((c) => ({ ...c, gold: c.gold - item.price }));
    setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, owned: true } : r)));

    addToast({
      type: 'success',
      title: 'Item Acquired!',
      message: `"${item.name}" transferred to your Vault. -${item.price} Gold.`,
    });

    try {
      await rewardService.purchaseReward(id);
    } catch {
      // resilience
    }
    return true;
  };

  const equipItem = (id: string) => {
    const item = rewards.find((r) => r.id === id);
    if (!item || !item.owned) return;

    setRewards((prev) =>
      prev.map((r) => {
        if (r.equipSlot === item.equipSlot) {
          return { ...r, equipped: r.id === id };
        }
        return r;
      })
    );

    if (item.equipSlot) {
      setCharacter((c) => ({
        ...c,
        equipment: {
          ...c.equipment,
          [item.equipSlot!]: item.id,
        },
      }));
    }

    addToast({
      type: 'success',
      title: 'Equipped',
      message: `"${item.name}" is now actively equipped.`,
    });
  };

  const unequipItem = (id: string) => {
    const item = rewards.find((r) => r.id === id);
    if (!item) return;

    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, equipped: false } : r))
    );

    if (item.equipSlot) {
      setCharacter((c) => {
        const nextEquip = { ...c.equipment };
        delete nextEquip[item.equipSlot as keyof typeof nextEquip];
        return { ...c, equipment: nextEquip };
      });
    }

    addToast({
      type: 'info',
      title: 'Unequipped',
      message: `"${item.name}" returned to Vault.`,
    });
  };

  const allocateAttributePoint = (attribute: AttributeKey) => {
    if (unallocatedPoints <= 0) return;

    setUnallocatedPoints((prev) => prev - 1);
    setCharacter((c) => {
      const current = c.attributes[attribute];
      if (!current) return c;
      return {
        ...c,
        attributes: {
          ...c.attributes,
          [attribute]: {
            ...current,
            value: Math.min(100, current.value + 2),
            recentGain: current.recentGain + 2,
          },
        },
      };
    });

    addToast({
      type: 'success',
      title: 'Attribute Upgraded',
      message: `+2 added to ${attribute.toUpperCase()}.`,
    });
  };

  const dismissLevelUp = () => {
    setLevelUpCelebration(null);
  };

  return (
    <GameContext.Provider
      value={{
        character,
        quests,
        rewards,
        dailyMissions,
        unallocatedPoints,
        levelUpCelebration,
        dismissLevelUp,
        completeQuest,
        createQuest,
        updateQuest,
        deleteQuest,
        toggleDailyMission,
        purchaseReward,
        equipItem,
        unequipItem,
        allocateAttributePoint,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
