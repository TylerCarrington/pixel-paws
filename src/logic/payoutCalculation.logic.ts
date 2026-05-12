import { Rarity } from '../types/animal.types';
import { BASE_PAYOUTS, PAYOUT_CONFIG } from '../config/payouts.config';

export function calculateCareBonus(desirability: number): number {
  if (desirability <= PAYOUT_CONFIG.MIN_BONUS_DESIRABILITY) return PAYOUT_CONFIG.MIN_MULTIPLIER;
  
  const range = PAYOUT_CONFIG.MAX_BONUS_DESIRABILITY - PAYOUT_CONFIG.MIN_BONUS_DESIRABILITY;
  const multiplierRange = PAYOUT_CONFIG.MAX_MULTIPLIER - PAYOUT_CONFIG.MIN_MULTIPLIER;
  
  const excess = Math.min(desirability, PAYOUT_CONFIG.MAX_BONUS_DESIRABILITY) - PAYOUT_CONFIG.MIN_BONUS_DESIRABILITY;
  const factor = excess / range;
  
  return PAYOUT_CONFIG.MIN_MULTIPLIER + (factor * multiplierRange);
}

export function calculatepayout(rarity: Rarity, desirability: number): number {
  const base = BASE_PAYOUTS[rarity];
  const bonus = calculateCareBonus(desirability);
  return Math.floor(base * bonus);
}
