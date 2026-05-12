import { CallTemplate } from '../types/calls.types';
import { getUnlockedSpecies } from './speciesUnlock.logic';
import { Species } from '../types/animal.types';

export function getEligibleCalls(pool: CallTemplate[], currentUpgrades: string[]): CallTemplate[] {
  const unlockedSpecies = getUnlockedSpecies(currentUpgrades);
  
  return pool.filter(call => {
    // 1. Species Gate
    if (!unlockedSpecies.includes(call.species as Species)) return false;

    // 2. Facility Upgrade Gate
    if (!call.requiredFacility || call.requiredFacility.length === 0) return true;
    
    // check if all required facilities are unlocked
    return call.requiredFacility.every(req => currentUpgrades.includes(req));
  });
}
