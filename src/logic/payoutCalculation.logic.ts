import { Rarity } from '../types/animal.types';
import { BASE_PAYOUTS, PAYOUT_CONFIG } from '../config/payouts.config';

export function calculateCareBonus(desirability: number): number {
  return 1.0 + (desirability / 200);
}

export function calculatepayout(rarity: Rarity, desirability: number): number {
  const base = BASE_PAYOUTS[rarity];
  const bonus = calculateCareBonus(desirability);
  return Math.floor(base * bonus);
}
