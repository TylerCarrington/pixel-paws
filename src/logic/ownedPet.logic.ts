import { Animal, Species, Rarity, HealthStatus, DiscoveryMethod } from '../types/animal.types';
import { StarterDogDef } from '../config/starterDogs.config';

export function createStarterPet(breedDef: StarterDogDef, name: string): Animal {
  const isCat = breedDef.id.startsWith('cat_');
  return {
    id: crypto.randomUUID(),
    species: isCat ? Species.CAT : Species.DOG,
    breed: breedDef.id,
    subspecies: breedDef.subspecies,
    name: name,
    rarity: breedDef.rarity || Rarity.COMMON,
    isRevealed: true,
    desirability: breedDef.baseDesirabilityRange ? (breedDef.baseDesirabilityRange[0] + Math.floor(Math.random() * (breedDef.baseDesirabilityRange[1] - breedDef.baseDesirabilityRange[0] + 1))) : 50,
    healthStatus: HealthStatus.HEALTHY,
    vetDaysRemaining: 0,
    hasHealthCertificate: false,
    isMine: true,
    homeLocation: 'bedroom',
    outfits: [],
    discoveryMethod: DiscoveryMethod.DIRTY,
    mood: 'Calm',
    actionsUsedToday: 0,
    level: 1,
    currentXP: 0,
    totalXP: 0,
    activityCooldowns: {},
    equippedAccessories: {
      head: null,
      neck: null,
      body: null,
      back: null
    },
    hiddenBonuses: {
      pet: Math.floor(Math.random() * 9) - 3,  // -3 to +5
      feed: Math.floor(Math.random() * 9) - 3,
      play: Math.floor(Math.random() * 9) - 3,
      groom: Math.floor(Math.random() * 9) - 3,
      activity: Math.floor(Math.random() * 9) - 3
    }
  };
}

export function xpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}
