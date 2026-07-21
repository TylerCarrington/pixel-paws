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
  { id: 'dog_pug', name: 'Pug', spriteKey: 'pug', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [35, 55], subspecies: 'Pug' },
  { id: 'dog_golden_retriever', name: 'Golden Retriever', spriteKey: 'golden-retriever', rarity: Rarity.COMMON, baseDesirabilityRange: [45, 65], subspecies: 'Golden Retriever' },
  { id: 'dog_border_collie', name: 'Border Collie', spriteKey: 'border-collie', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Border Collie' },
  { id: 'dog_shiba_inu', name: 'Shiba Inu', spriteKey: 'shiba-inu', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Shiba Inu' },
  { id: 'dog_pomeranian', name: 'Pomeranian', spriteKey: 'pomeranian', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Pomeranian' },
  { id: 'dog_samoyed', name: 'Samoyed', spriteKey: 'samoyed', rarity: Rarity.RARE, baseDesirabilityRange: [65, 85], subspecies: 'Samoyed' },
  { id: 'dog_akita', name: 'Akita', spriteKey: 'akita', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Akita' },
  { id: 'dog_australian_shepherd', name: 'Australian Shepherd', spriteKey: 'australian-shepherd', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [55, 75], subspecies: 'Australian Shepherd' },
];
