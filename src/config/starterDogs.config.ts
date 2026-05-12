import { Rarity } from '../types/animal.types';

export interface StarterDogDef {
  id: string;
  name: string;
  spriteKey: string;
  rarity: Rarity;
  baseDesirabilityRange: [number, number];
  subspecies?: string;
}

export const STARTER_DOGS: StarterDogDef[] = [
  { id: 'dog_husky', name: 'Husky', spriteKey: 'husky', rarity: Rarity.COMMON, baseDesirabilityRange: [40, 60], subspecies: 'Husky' },
  { id: 'dog_beagle', name: 'Beagle', spriteKey: 'beagle', rarity: Rarity.COMMON, baseDesirabilityRange: [45, 65], subspecies: 'Beagle' },
  { id: 'dog_corgi', name: 'Corgi', spriteKey: 'corgi', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Corgi' },
  { id: 'dog_lab', name: 'Labrador', spriteKey: 'lab', rarity: Rarity.COMMON, baseDesirabilityRange: [40, 60], subspecies: 'Labrador' },
  { id: 'dog_dalmatian', name: 'Dalmatian', spriteKey: 'dalmatian', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Dalmatian' },
  { id: 'dog_pug', name: 'Pug', spriteKey: 'pug', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'Pug' },
];
