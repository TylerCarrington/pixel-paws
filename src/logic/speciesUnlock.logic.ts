import { Species } from '../types/animal.types';
import { HABITAT_UPGRADES } from '../config/habitatUpgrades.config';
import { VET_UPGRADES_TREE } from '../config/vetUpgradesTree.config';

export function getUnlockedSpecies(facilityUpgrades: string[], catsUnlocked: boolean = false): Species[] {
  const unlocked = [Species.DOG];

  // Logic: Species is unlocked only if both its habitat AND its vet requirement are met
  // Note: Dog starts unlocked.
  
  // Cat check
  if (catsUnlocked || (facilityUpgrades.includes('habitat_cat_room') && facilityUpgrades.includes('vet_exam_room'))) {
    unlocked.push(Species.CAT);
  }

  // Small Animal check
  if (facilityUpgrades.includes('habitat_hutch') && facilityUpgrades.includes('vet_pharmacy')) {
    unlocked.push(Species.SMALL_ANIMAL);
  }

  // Bird check
  if (facilityUpgrades.includes('habitat_aviary') && facilityUpgrades.includes('vet_recovery_ward')) {
    unlocked.push(Species.BIRD);
  }

  return unlocked;
}
