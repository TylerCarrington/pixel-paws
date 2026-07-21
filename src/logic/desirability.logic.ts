import { Animal, Rarity } from '../types/animal.types';
import { RARITY_DATA } from '../constants/rarity.constants';

export function clampDesirability(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getAdoptionChance(animal: Animal, facilityUpgrades: string[] = []): number {
  let adjustedDesirability = animal.desirability;

  // Passive boosts from shop items
  if (facilityUpgrades.includes('premium_bowl')) adjustedDesirability += 5;
  if (facilityUpgrades.includes('cozy_bed')) adjustedDesirability += 8; // Tweak numbers
  if (facilityUpgrades.includes('enrichment_toy')) adjustedDesirability += 4;

  const desirability = clampDesirability(adjustedDesirability);
  const maxChance = RARITY_DATA[animal.rarity].baseAdoptionChanceMax;

  return (desirability / 100) * maxChance;
}
