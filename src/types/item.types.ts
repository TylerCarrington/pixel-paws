import { Species } from './animal.types';

export type ItemCategory = 'Treat' | 'Bowl' | 'Toy' | 'Decoration';

export type ItemRarity = 'Common' | 'Rare' | 'Legendary';

export interface TrackerItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  image: string;
  cost: number;
  compatibleSpecies: Species[];
  
  // Interaction/mechanic variables
  hungerValue?: number;     // How much it helps with feeding
  happinessValue?: number;  // How much it increases mood/affection with toys
  xpBonusValue?: number;    // Extra XP granted on care
  
  // Decoration dimensions if placed
  isDecoratable?: boolean;
  decorType?: 'floor' | 'wall' | 'ceiling';
  width?: number;
  height?: number;
}
