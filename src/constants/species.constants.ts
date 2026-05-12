import { Species } from '../types/animal.types';

export const SPECIES_LABELS: Record<Species, string> = {
  [Species.DOG]: 'Dog',
  [Species.CAT]: 'Cat',
  [Species.SMALL_ANIMAL]: 'Small Animal',
  [Species.BIRD]: 'Bird',
  [Species.REPTILE]: 'Reptile',
  [Species.EXOTIC_SMALL]: 'Small Exotic',
  [Species.AQUATIC]: 'Aquatic',
  [Species.EXOTIC_LARGE]: 'Large Exotic',
};
