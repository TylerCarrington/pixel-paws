import { Rarity } from '../types/animal.types';

export interface StarterBirdDef {
  id: string;
  name: string;
  spriteKey: string;
  rarity: Rarity;
  baseDesirabilityRange: [number, number];
  subspecies?: string;
}

export const STARTER_BIRDS: StarterBirdDef[] = [
  // Common
  { id: 'bird_parakeet_green', name: 'Parakeet', spriteKey: 'parakeet-green', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Green Budgie' },
  { id: 'bird_canary', name: 'Canary', spriteKey: 'canary', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Yellow Canary' },
  { id: 'bird_zebra_finch', name: 'Zebra Finch', spriteKey: 'zebra-finch', rarity: Rarity.COMMON, baseDesirabilityRange: [20, 40], subspecies: 'Zebra Finch' },
  { id: 'bird_society_finch', name: 'Society Finch', spriteKey: 'society-finch', rarity: Rarity.COMMON, baseDesirabilityRange: [20, 40], subspecies: 'Society Finch' },
  { id: 'bird_dove_white', name: 'White Dove', spriteKey: 'dove-white', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'White Dove' },
  { id: 'bird_parakeet_blue', name: 'Parakeet', spriteKey: 'parakeet-blue', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Blue Budgie' },
  { id: 'bird_java_sparrow', name: 'Java Sparrow', spriteKey: 'java-sparrow', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Java Sparrow' },

  // Uncommon
  { id: 'bird_cockatiel_grey', name: 'Cockatiel', spriteKey: 'cockatiel-grey', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Grey Cockatiel' },
  { id: 'bird_lovebird_peach', name: 'Lovebird', spriteKey: 'lovebird-peach', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Peach-faced Lovebird' },
  { id: 'bird_conure_green_cheeked', name: 'Conure', spriteKey: 'conure-green-cheeked', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [55, 75], subspecies: 'Green-cheeked Conure' },
  { id: 'bird_quaker_parrot', name: 'Quaker Parrot', spriteKey: 'quaker-parrot', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Quaker Parrot' },

  // Rare
  { id: 'bird_african_grey', name: 'African Grey Parrot', spriteKey: 'african-grey', rarity: Rarity.RARE, baseDesirabilityRange: [80, 100], subspecies: 'African Grey Parrot' },
  { id: 'bird_sun_conure', name: 'Sun Conure', spriteKey: 'sun-conure', rarity: Rarity.RARE, baseDesirabilityRange: [75, 95], subspecies: 'Sun Conure' },
  { id: 'bird_blue_gold_macaw', name: 'Blue & Gold Macaw', spriteKey: 'blue-gold-macaw', rarity: Rarity.RARE, baseDesirabilityRange: [85, 105], subspecies: 'Blue and Gold Macaw' },
  { id: 'bird_eclectus_male', name: 'Eclectus Parrot', spriteKey: 'eclectus-male', rarity: Rarity.RARE, baseDesirabilityRange: [80, 100], subspecies: 'Male Eclectus Parrot' },

  // Ultra Rare
  { id: 'bird_scarlet_macaw', name: 'Scarlet Macaw', spriteKey: 'scarlet-macaw', rarity: Rarity.EXOTIC, baseDesirabilityRange: [100, 120], subspecies: 'Scarlet Macaw' },
  { id: 'bird_cockatoo_sulphur', name: 'Sulphur-crested Cockatoo', spriteKey: 'cockatoo-sulphur', rarity: Rarity.EXOTIC, baseDesirabilityRange: [95, 115], subspecies: 'Sulphur-crested Cockatoo' },
  { id: 'bird_eclectus_female', name: 'Eclectus Parrot', spriteKey: 'eclectus-female', rarity: Rarity.EXOTIC, baseDesirabilityRange: [90, 110], subspecies: 'Female Eclectus Parrot' },

  // Legendary
  { id: 'bird_hyacinth_macaw', name: 'Hyacinth Macaw', spriteKey: 'hyacinth-macaw', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [130, 170], subspecies: 'Hyacinth Macaw' },
];
