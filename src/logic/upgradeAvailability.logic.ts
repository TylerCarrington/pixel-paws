import { Species } from '../types/animal.types';
import { REPUTATION_THRESHOLDS } from '../config/reputationThresholds.config';

export function getAvailableSpeciesToUnlock(reputation: Record<Species, number>, facilityUpgrades: string[]): Species[] {
  const speciesList = Object.keys(REPUTATION_THRESHOLDS) as Species[];
  
  return speciesList.filter(s => {
    // Already unlocked? (habitat exists)
    if (facilityUpgrades.includes(`habitat_${s.toLowerCase()}`)) return false;

    // Check pre-requisite reputation
    const reqSpecies = s === Species.CAT ? Species.DOG : 
                       s === Species.SMALL_ANIMAL ? Species.CAT :
                       s === Species.BIRD ? Species.SMALL_ANIMAL : Species.DOG;
    
    return (reputation[reqSpecies] || 0) >= REPUTATION_THRESHOLDS[reqSpecies];
  });
}
