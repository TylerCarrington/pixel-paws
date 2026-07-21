import { CallTemplate } from '../types/calls.types';
import { getUnlockedSpecies } from './speciesUnlock.logic';
import { Species, Rarity } from '../types/animal.types';

export function getEligibleCalls(
  pool: CallTemplate[], 
  currentUpgrades: string[], 
  catsUnlocked: boolean = false,
  rarePetsUnlocked: boolean = false
): CallTemplate[] {
  const unlockedSpecies = getUnlockedSpecies(currentUpgrades, catsUnlocked);
  
  return pool.filter(call => {
    // 1. Species Gate
    if (!unlockedSpecies.includes(call.species as Species)) return false;

    // 2. Rarity Gate
    if (!rarePetsUnlocked && (call.rarity === Rarity.RARE || call.rarity === Rarity.EXOTIC || call.rarity === Rarity.LEGENDARY)) {
      return false;
    }

    // 3. Facility Upgrade Gate
    if (!call.requiredFacility || call.requiredFacility.length === 0) return true;
    
    // check if all required facilities are unlocked
    return call.requiredFacility.every(req => currentUpgrades.includes(req));
  });
}
