import { Rarity } from '../types/animal.types';

export interface StarterReptileDef {
  id: string;
  name: string;
  spriteKey: string;
  rarity: Rarity;
  baseDesirabilityRange: [number, number];
  subspecies?: string;
}

export const STARTER_REPTILES: StarterReptileDef[] = [
  // Common
  { id: 'reptile_garter_snake', name: 'Garter Snake', spriteKey: 'garter-snake', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Garter Snake' },
  { id: 'reptile_red_eared_slider', name: 'Red-Eared Slider', spriteKey: 'red-eared-slider', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'Red-Eared Slider' },
  { id: 'reptile_brown_anole', name: 'Brown Anole', spriteKey: 'brown-anole', rarity: Rarity.COMMON, baseDesirabilityRange: [25, 45], subspecies: 'Brown Anole' },
  { id: 'reptile_leopard_gecko', name: 'Leopard Gecko', spriteKey: 'leopard-gecko', rarity: Rarity.COMMON, baseDesirabilityRange: [40, 60], subspecies: 'Leopard Gecko' },
  { id: 'reptile_pink_axolotl', name: 'Pink Axolotl', spriteKey: 'pink-axolotl', rarity: Rarity.COMMON, baseDesirabilityRange: [45, 65], subspecies: 'Pink Axolotl' },
  { id: 'reptile_green_tree_frog', name: 'Green Tree Frog', spriteKey: 'green-tree-frog', rarity: Rarity.COMMON, baseDesirabilityRange: [30, 50], subspecies: 'Green Tree Frog' },
  { id: 'reptile_box_turtle', name: 'Box Turtle', spriteKey: 'box-turtle', rarity: Rarity.COMMON, baseDesirabilityRange: [35, 55], subspecies: 'Box Turtle' },

  // Uncommon
  { id: 'reptile_corn_snake', name: 'Corn Snake', spriteKey: 'corn-snake', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Corn Snake' },
  { id: 'reptile_orange_bearded_dragon', name: 'Bearded Dragon', spriteKey: 'orange-bearded-dragon', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Bearded Dragon' },
  { id: 'reptile_blue_tongued_skink', name: 'Blue-Tongued Skink', spriteKey: 'blue-tongued-skink', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [55, 75], subspecies: 'Blue-Tongued Skink' },
  { id: 'reptile_white_axolotl', name: 'White Axolotl', spriteKey: 'white-axolotl', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [60, 80], subspecies: 'White Axolotl' },
  { id: 'reptile_fire_bellied_toad', name: 'Fire-Bellied Toad', spriteKey: 'fire-bellied-toad', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [40, 60], subspecies: 'Fire-Bellied Toad' },

  // Rare
  { id: 'reptile_ball_python', name: 'Ball Python', spriteKey: 'ball-python', rarity: Rarity.RARE, baseDesirabilityRange: [65, 85], subspecies: 'Ball Python' },
  { id: 'reptile_crested_gecko', name: 'Crested Gecko', spriteKey: 'crested-gecko', rarity: Rarity.RARE, baseDesirabilityRange: [70, 90], subspecies: 'Crested Gecko' },
  { id: 'reptile_golden_axolotl', name: 'Golden Axolotl', spriteKey: 'golden-axolotl', rarity: Rarity.RARE, baseDesirabilityRange: [75, 95], subspecies: 'Golden Axolotl' },
  { id: 'reptile_russian_tortoise', name: 'Russian Tortoise', spriteKey: 'russian-tortoise', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Russian Tortoise' },

  // Ultra Rare (Exotic)
  { id: 'reptile_blue_poison_dart_frog', name: 'Blue Poison Dart Frog', spriteKey: 'blue-poison-dart-frog', rarity: Rarity.EXOTIC, baseDesirabilityRange: [85, 105], subspecies: 'Blue Poison Dart Frog' },
  { id: 'reptile_black_axolotl', name: 'Black Axolotl', spriteKey: 'black-axolotl', rarity: Rarity.EXOTIC, baseDesirabilityRange: [90, 110], subspecies: 'Black Axolotl' },

  // Legendary
  { id: 'reptile_leucistic_axolotl', name: 'Leucistic Axolotl', spriteKey: 'leucistic-axolotl', rarity: Rarity.LEGENDARY, baseDesirabilityRange: [110, 150], subspecies: 'Leucistic Axolotl' },
];
