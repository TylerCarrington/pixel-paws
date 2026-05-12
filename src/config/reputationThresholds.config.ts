import { Species } from '../types/animal.types';

export const REPUTATION_THRESHOLDS: Record<Species, number> = {
  [Species.DOG]: 3, 
  [Species.CAT]: 6, 
  [Species.SMALL_ANIMAL]: 10,
  [Species.BIRD]: 15,
  [Species.REPTILE]: 20,
  [Species.AQUATIC]: 25,
  [Species.EXOTIC_SMALL]: 30,
  [Species.EXOTIC_LARGE]: 50
};
