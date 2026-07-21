import { Rarity, Species } from '../types/animal.types';
import { StarterDogDef, STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';
import { STARTER_REPTILES } from '../config/starterReptiles.config';
import { STARTER_FISH } from '../config/starterFish.config';
import { STARTER_BIRDS } from '../config/starterBirds.config';
import { STARTER_SMALL_ANIMALS } from '../config/starterSmallAnimals.config';

// Simple seeded random generator (for replication in tests)
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export const assignStarterBreed = (seed: number, species: string = 'Dog', rareUnlocked: boolean = false): any => {
  const rand = mulberry32(seed);
  const spec = species.toUpperCase();
  
  let pool: any[] = STARTER_DOGS;
  if (spec === Species.CAT) {
    pool = STARTER_CATS;
  } else if (spec === Species.REPTILE) {
    pool = STARTER_REPTILES;
  } else if (spec === Species.AQUATIC) {
    pool = STARTER_FISH;
  } else if (spec === Species.BIRD) {
    pool = STARTER_BIRDS;
  } else if (spec === Species.SMALL_ANIMAL) {
    pool = STARTER_SMALL_ANIMALS;
  }
  
  let eligiblePool = pool;
  if (!rareUnlocked) {
    // Note: EXOTIC and LEGENDARY are usually locked
    eligiblePool = pool.filter(p => p.rarity === Rarity.COMMON || p.rarity === Rarity.UNCOMMON);
  }
  
  if (eligiblePool.length === 0) eligiblePool = pool; // fallback

  const index = Math.floor(rand() * eligiblePool.length);
  return eligiblePool[index];
};
