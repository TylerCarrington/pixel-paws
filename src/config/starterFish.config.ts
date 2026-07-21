import { Rarity } from '../types/animal.types';

export interface StarterFishDef {
  id: string;
  name: string;
  spriteKey: string;
  rarity: Rarity;
  baseDesirabilityRange: [number, number];
  subspecies?: string;
}

export const STARTER_FISH: StarterFishDef[] = [
  // Common
  { id: 'fish_goldfish', name: 'Goldfish', spriteKey: 'goldfish', rarity: Rarity.COMMON, baseDesirabilityRange: [20, 40], subspecies: 'Goldfish' },
  { id: 'fish_betta_red', name: 'Betta Fish', spriteKey: 'betta-red', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Red Betta' },
  { id: 'fish_guppy', name: 'Guppy', spriteKey: 'guppy', rarity: Rarity.COMMON, baseDesirabilityRange: [15, 35], subspecies: 'Guppy' },
  { id: 'fish_neon_tetra', name: 'Neon Tetra', spriteKey: 'neon-tetra', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Neon Tetra' },
  { id: 'fish_molly', name: 'Molly', spriteKey: 'molly', rarity: Rarity.COMMON, baseDesirabilityRange: [20, 40], subspecies: 'Molly' },
  { id: 'fish_platy', name: 'Platy', spriteKey: 'platy', rarity: Rarity.COMMON, baseDesirabilityRange: [20, 40], subspecies: 'Platy' },
  { id: 'fish_corydoras', name: 'Corydoras', spriteKey: 'corydoras', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Corydoras' },
  { id: 'fish_white_cloud_minnow', name: 'White Cloud Minnow', spriteKey: 'white-cloud-minnow', rarity: Rarity.COMMON, baseDesirabilityRange: [15, 35], subspecies: 'White Cloud Mountain Minnow' },

  // Uncommon
  { id: 'fish_angelfish', name: 'Angelfish', spriteKey: 'angelfish', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Angelfish' },
  { id: 'fish_oranda', name: 'Oranda Goldfish', spriteKey: 'oranda', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [55, 75], subspecies: 'Fancy Oranda Goldfish' },
  { id: 'fish_pearl_gourami', name: 'Pearl Gourami', spriteKey: 'pearl-gourami', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Pearl Gourami' },
  { id: 'fish_rainbow_fish', name: 'Rainbow Fish', spriteKey: 'rainbow-fish', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [60, 80], subspecies: 'Rainbow Fish' },
  { id: 'fish_bristlenose_pleco', name: 'Bristlenose Pleco', spriteKey: 'bristlenose-pleco', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [40, 60], subspecies: 'Bristlenose Pleco' },

  // Rare
  { id: 'fish_koi', name: 'Koi', spriteKey: 'koi', rarity: Rarity.RARE, baseDesirabilityRange: [75, 95], subspecies: 'Standard Koi' },
  { id: 'fish_discus', name: 'Discus Fish', spriteKey: 'discus', rarity: Rarity.RARE, baseDesirabilityRange: [80, 100], subspecies: 'Discus Fish' },

  // Ultra Rare
  { id: 'fish_butterfly_koi', name: 'Butterfly Koi', spriteKey: 'butterfly-koi', rarity: Rarity.EXOTIC, baseDesirabilityRange: [100, 120], subspecies: 'Butterfly Koi' },
  { id: 'fish_dragon_scale_betta', name: 'Dragon Scale Betta', spriteKey: 'dragon-scale-betta', rarity: Rarity.EXOTIC, baseDesirabilityRange: [90, 110], subspecies: 'Dragon Scale Betta' },

  // Legendary
  { id: 'fish_ghost_koi', name: 'Ghost Koi', spriteKey: 'ghost-koi', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [120, 150], subspecies: 'Ghost Koi' },
  { id: 'fish_platinum_betta', name: 'Platinum Betta', spriteKey: 'platinum-betta', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [130, 160], subspecies: 'Platinum Betta' },
];
