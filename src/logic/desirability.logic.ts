import { Animal, Rarity } from '../types/animal.types';

export function clampDesirability(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getAdoptionChance(animal: Animal, facilityUpgrades: string[] = []): number {
  let adjustedDesirability = animal.desirability;

  // Passive boosts from shop items
  if (facilityUpgrades.includes('premium_bowl')) adjustedDesirability += 5;
  if (facilityUpgrades.includes('cozy_bed')) adjustedDesirability += 10;
  if (facilityUpgrades.includes('enrichment_toy')) adjustedDesirability += 3;

  // Base chance is desirability / 100
  let chance = clampDesirability(adjustedDesirability) / 100;

  // Cap chance based on rarity
  let cap = 1.0;
  switch (animal.rarity) {
    case Rarity.COMMON: cap = 0.9; break;
    case Rarity.UNCOMMON: cap = 0.7; break;
    case Rarity.RARE: cap = 0.4; break;
    case Rarity.EXOTIC: cap = 0.2; break;
    case Rarity.LEGENDARY: cap = 0.05; break;
  }

  return Math.min(chance, cap);
}
