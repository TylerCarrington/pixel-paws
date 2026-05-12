import { Animal, Species, Rarity, HealthStatus, DiscoveryMethod } from '../types/animal.types';
import { StarterDogDef } from '../config/starterDogs.config';

export function createStarterPet(breedDef: StarterDogDef, name: string): Animal {
  return {
    id: crypto.randomUUID(),
    species: Species.DOG,
    breed: breedDef.id,
    subspecies: breedDef.subspecies,
    name: name,
    rarity: Rarity.COMMON,
    isRevealed: true,
    desirability: 50,
    healthStatus: HealthStatus.HEALTHY,
    vetDaysRemaining: 0,
    hasHealthCertificate: false,
    isMine: true,
    outfits: [],
    discoveryMethod: DiscoveryMethod.DIRTY
  };
}
