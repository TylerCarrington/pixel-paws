import { Species } from '../types/animal.types';

export interface HabitatUpgrade {
  id: string;
  name: string;
  cost: number;
  unlockedSpecies: Species[];
  description: string;
  icon: string;
}

export const HABITAT_UPGRADES: HabitatUpgrade[] = [
  {
    id: 'habitat_cat_room',
    name: 'Purr-fect Suite',
    cost: 300,
    unlockedSpecies: [Species.CAT],
    description: 'A dedicated room with climbing walls and sunbeds for our feline friends.',
    icon: '🐱'
  },
  {
    id: 'habitat_hutch',
    name: 'Small Mammal Hutch',
    cost: 450,
    unlockedSpecies: [Species.SMALL_ANIMAL],
    description: 'Safe, multi-level enclosures for rabbits, hamsters, and guinea pigs.',
    icon: '🐰'
  },
  {
    id: 'habitat_aviary',
    name: 'Sky-View Aviary',
    cost: 700,
    unlockedSpecies: [Species.BIRD],
    description: 'A spacious, climate-controlled space for flight and nesting.',
    icon: '🦜'
  }
];
