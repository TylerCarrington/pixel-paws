import { StarterDogDef, STARTER_DOGS } from '../config/starterDogs.config';

// Simple seeded random generator (for replication in tests)
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export const assignStarterBreed = (seed: number): StarterDogDef => {
  const rand = mulberry32(seed);
  const index = Math.floor(rand() * STARTER_DOGS.length);
  return STARTER_DOGS[index];
};
