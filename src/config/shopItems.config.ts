export type ShopItemEffect = 
  | { type: 'ADD_KENNEL_SLOT'; value: number }
  | { type: 'UNLOCK_ACTION'; value: string }
  | { type: 'RECOVERY_MODIFIER'; value: number }
  | { type: 'PASSIVE_DESIRABILITY_BOOST'; value: number };

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'Essentials' | 'Facility' | 'Supplies';
  requiredUnlock?: string;
  effect: ShopItemEffect;
  oneTime: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'premium_bowl',
    name: 'Premium Food Bowl',
    description: 'A ceramic bowl that keeps food fresh. Increases desirability slightly.',
    cost: 30,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 5 },
    oneTime: true
  },
  {
    id: 'grooming_brush',
    name: 'Grooming Brush',
    description: 'Allows you to brush animals to improve their mood and appearance.',
    cost: 45,
    category: 'Essentials',
    effect: { type: 'UNLOCK_ACTION', value: 'groom' },
    oneTime: true
  },
  {
    id: 'cozy_bed',
    name: 'Cozy Kennel Bed',
    description: 'A soft bed that helps animals rest better. +10% desirability.',
    cost: 50,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 10 },
    oneTime: true
  },
  {
    id: 'enrichment_toy',
    name: 'Enrichment Toy',
    description: 'Interactive toys that keep animals mentally stimulated.',
    cost: 25,
    category: 'Essentials',
    effect: { type: 'PASSIVE_DESIRABILITY_BOOST', value: 3 },
    oneTime: true
  },
  {
    id: 'kennel_expansion_1',
    name: 'Kennel Expansion Kit',
    description: 'Adds one additional housing slot to your shelter.',
    cost: 250,
    category: 'Facility',
    effect: { type: 'ADD_KENNEL_SLOT', value: 1 },
    oneTime: false // Can buy multiple expansions? Let's say one for now, or indexed
  }
];
