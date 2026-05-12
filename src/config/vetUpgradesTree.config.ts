import { Species } from '../types/animal.types';

export interface VetUpgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  dayUnlock?: number;
  requiredForSpecies?: Species[];
}

export const VET_UPGRADES_TREE: VetUpgrade[] = [
  {
    id: 'vet_exam_room',
    name: 'Exam Room',
    cost: 150,
    description: 'A professional space for checkups. Required for feline intake.',
    icon: '🩺',
    requiredForSpecies: [Species.CAT]
  },
  {
    id: 'vet_pharmacy',
    name: 'Medicine Cabinet',
    cost: 200,
    description: 'Stock specialized medicine for small animals.',
    icon: '💊',
    requiredForSpecies: [Species.SMALL_ANIMAL]
  },
  {
    id: 'vet_recovery_ward',
    name: 'Recovery Ward',
    cost: 350,
    description: 'Increased bed capacity and better monitoring for fragile species.',
    icon: '🏥',
    requiredForSpecies: [Species.BIRD]
  }
];
