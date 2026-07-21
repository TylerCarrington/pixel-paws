import { Rarity } from '../types/animal.types';

export const BASE_PAYOUTS: Record<Rarity, number> = {
  [Rarity.COMMON]: 30,
  [Rarity.UNCOMMON]: 90,
  [Rarity.RARE]: 600,
  [Rarity.EXOTIC]: 1200,
  [Rarity.LEGENDARY]: 3000
};

export const PAYOUT_CONFIG = {
  // Desirability bonus multiplier formula
  // 50 desirability = 1.0x
  // 100 desirability = 1.5x
  MIN_BONUS_DESIRABILITY: 50,
  MAX_BONUS_DESIRABILITY: 100,
  MIN_MULTIPLIER: 1.0,
  MAX_MULTIPLIER: 1.5
};
