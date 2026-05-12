import { Animal } from '../types/animal.types';
import { getAdoptionChance } from './desirability.logic';

export interface AdoptionResult {
  animalId: string;
  isAdopted: boolean;
  payout: number;
}

export function rollForAdoptions(
  shelterAnimals: Animal[], 
  seed: number,
  calculatePayoutFn: (rarity: any, desirability: number) => number,
  facilityUpgrades: string[] = []
): AdoptionResult[] {
  // Simple LCG or similar for deterministic outcomes
  let currentSeed = seed;
  const random = () => {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    return currentSeed / 4294967296;
  };

  return shelterAnimals.map(animal => {
    // Vet animals cannot be adopted
    if (animal.vetDaysRemaining && animal.vetDaysRemaining > 0) {
      return {
        animalId: animal.id,
        isAdopted: false,
        payout: 0
      };
    }

    const chance = getAdoptionChance(animal, facilityUpgrades);
    const roll = random();
    const isAdopted = roll < chance;

    return {
      animalId: animal.id,
      isAdopted,
      payout: isAdopted ? calculatePayoutFn(animal.rarity, animal.desirability) : 0
    };
  });
}
