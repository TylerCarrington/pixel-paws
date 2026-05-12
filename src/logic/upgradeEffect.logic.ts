import { VET_UPGRADES } from '../config/vetUpgrades.config';

export function getRecoverySpeedModifier(facilityUpgrades: string[]): number {
  let modifier = 1.0;
  
  if (facilityUpgrades.includes('med_supplies')) {
    modifier *= 1.2;
  }
  
  if (facilityUpgrades.includes('vet_staff')) {
    modifier *= 1.5;
  }
  
  return modifier;
}

export function getTotalVetBeds(facilityUpgrades: string[]): number {
  if (!facilityUpgrades.includes('vet_wing')) return 0;
  
  let beds = 1;
  if (facilityUpgrades.includes('second_bed')) {
    beds += 1;
  }
  
  return beds;
}
