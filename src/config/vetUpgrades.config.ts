export interface FacilityUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'vet' | 'shelter' | 'staff';
  effectValue: number; // e.g. recovery speed multiplier or extra beds
  dayUnlock?: number;
}

export const VET_UPGRADES: FacilityUpgrade[] = [
  {
    id: 'vet_wing',
    name: 'Vet Triage Corner',
    description: 'A small area dedicated to basic medical care. Unlocks the Vet Wing.',
    cost: 75,
    type: 'vet',
    effectValue: 1, // 1 bed
    dayUnlock: 3
  },
  {
    id: 'med_supplies',
    name: 'Better Supplies',
    description: 'Higher quality bandages and medicines. +20% recovery speed.',
    cost: 40,
    type: 'vet',
    effectValue: 1.2,
    dayUnlock: 4
  },
  {
    id: 'second_bed',
    name: 'Extra Recovery Bed',
    description: 'Allows treating two animals at once.',
    cost: 60,
    type: 'vet',
    effectValue: 1, // Add 1 more bed
    dayUnlock: 5
  },
  {
    id: 'vet_staff',
    name: 'Volunteer Vet',
    description: 'A local vet student helps out. +50% recovery speed.',
    cost: 150,
    type: 'staff',
    effectValue: 1.5,
    dayUnlock: 6
  }
];
