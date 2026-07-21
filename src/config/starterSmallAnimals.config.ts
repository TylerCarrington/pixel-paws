import { Rarity } from '../types/animal.types';

export interface StarterSmallAnimalDef {
  id: string;
  name: string;
  spriteKey: string;
  rarity: Rarity;
  baseDesirabilityRange: [number, number];
  subspecies?: string;
}

export const STARTER_SMALL_ANIMALS: StarterSmallAnimalDef[] = [
  // Common
  { id: 'small_golden_hamster', name: 'Golden Hamster', spriteKey: 'golden-hamster-small', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Hamster' },
  { id: 'small_white_mouse', name: 'White Mouse', spriteKey: 'white-mouse-small', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Mouse' },
  { id: 'small_brown_guinea_pig', name: 'Brown Guinea Pig', spriteKey: 'brown-guinea-pig-small', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'Guinea Pig' },
  { id: 'small_gerbil', name: 'Gerbil', spriteKey: 'gerbil-small', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Gerbil' },
  { id: 'small_grey_hamster', name: 'Grey Hamster', spriteKey: 'grey-hamster-small', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Hamster' },
  { id: 'small_black_white_mouse', name: 'Black & White Mouse', spriteKey: 'black-and-white-mouse', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Mouse' },
  { id: 'small_cream_guinea_pig', name: 'Cream Guinea Pig', spriteKey: 'cream-guinea-pig-small', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'Guinea Pig' },
  { id: 'small_mongolian_gerbil', name: 'Mongolian Gerbil', spriteKey: 'mongolian-gerbil-small', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Gerbil' },
  { id: 'small_short_haired_hamster', name: 'Short-Haired Hamster', spriteKey: 'short-haired-hamster-small', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Hamster' },

  // Uncommon
  { id: 'small_fancy_rat', name: 'Fancy Rat', spriteKey: 'fancy-rat-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Rat' },
  { id: 'small_abyssinian_guinea_pig', name: 'Abyssinian Guinea Pig', spriteKey: 'abyssinian-guinea-pig-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Guinea Pig' },
  { id: 'small_roborovski_hamster', name: 'Roborovski Hamster', spriteKey: 'roborovski-hamster-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [55, 75], subspecies: 'Hamster' },
  { id: 'small_dumbo_rat', name: 'Dumbo Rat', spriteKey: 'dumbo-rat-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Rat' },
  { id: 'small_teddy_guinea_pig', name: 'Teddy Guinea Pig', spriteKey: 'teddy-guinea-pig-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Guinea Pig' },
  { id: 'small_black_gerbil', name: 'Black Gerbil', spriteKey: 'black-gerbil-small', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Gerbil' },

  // Rare
  { id: 'small_chinchilla', name: 'Chinchilla', spriteKey: 'chinchilla-small', rarity: Rarity.RARE, baseDesirabilityRange: [65, 85], subspecies: 'Chinchilla' },
  { id: 'small_ferret', name: 'Ferret', spriteKey: 'ferret-small', rarity: Rarity.RARE, baseDesirabilityRange: [70, 90], subspecies: 'Ferret' },
  { id: 'small_hedgehog', name: 'Hedgehog', spriteKey: 'hedgehog-small', rarity: Rarity.RARE, baseDesirabilityRange: [65, 85], subspecies: 'Hedgehog' },

  // Ultra Rare (Exotic)
  { id: 'small_sugar_glider', name: 'Sugar Glider', spriteKey: 'sugar-glider-small', rarity: Rarity.EXOTIC, baseDesirabilityRange: [80, 100], subspecies: 'Sugar Glider' },
  { id: 'small_skinny_pig', name: 'Skinny Pig', spriteKey: 'skinny-guinea-pig-small', rarity: Rarity.EXOTIC, baseDesirabilityRange: [85, 105], subspecies: 'Guinea Pig' },
  { id: 'small_angora_guinea_pig', name: 'Angora Guinea Pig', spriteKey: 'angora-guinea-pig-small', rarity: Rarity.EXOTIC, baseDesirabilityRange: [80, 100], subspecies: 'Guinea Pig' },

  // Legendary
  { id: 'small_capybara', name: 'Capybara', spriteKey: 'capybara-small', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [95, 115], subspecies: 'Capybara' },
  { id: 'small_white_chinchilla', name: 'White Chinchilla', spriteKey: 'white-chinchilla-small', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [90, 110], subspecies: 'Chinchilla' }
];
