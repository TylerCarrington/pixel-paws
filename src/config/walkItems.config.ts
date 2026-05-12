export type WalkItemType = 'Food' | 'Toy' | 'Treasure' | 'Currency';

export interface WalkItem {
  id: string;
  name: string;
  type: WalkItemType;
  rarity: 'Common' | 'Rare' | 'Legendary';
  value?: number;
}

export const WALK_ITEMS: WalkItem[] = [
  { id: 'found_kibble', name: 'Premium Kibble Bag', type: 'Food', rarity: 'Common' },
  { id: 'stray_tennis_ball', name: 'Neon Tennis Ball', type: 'Toy', rarity: 'Common' },
  { id: 'shiny_pebble', name: 'Shiny Pebble', type: 'Treasure', rarity: 'Rare' },
  { id: 'lost_coin', name: 'Lost Coin', type: 'Currency', rarity: 'Common', value: 10 },
  { id: 'golden_bone', name: 'Ancient Golden Bone', type: 'Treasure', rarity: 'Legendary' }
];
