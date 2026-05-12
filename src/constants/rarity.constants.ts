import { Rarity } from '../types/animal.types';

export const RARITY_DATA = {
  [Rarity.COMMON]: {
    label: 'Common',
    baseAdoptionChanceMax: 0.5,
    payoutRange: [10, 20],
  },
  [Rarity.UNCOMMON]: {
    label: 'Uncommon',
    baseAdoptionChanceMax: 0.35,
    payoutRange: [25, 40],
  },
  [Rarity.RARE]: {
    label: 'Rare',
    baseAdoptionChanceMax: 0.20,
    payoutRange: [50, 80],
  },
  [Rarity.EXOTIC]: {
    label: 'Exotic',
    baseAdoptionChanceMax: 0.10,
    payoutRange: [100, 200],
  },
  [Rarity.LEGENDARY]: {
    label: 'Legendary',
    baseAdoptionChanceMax: 0.05,
    payoutRange: [300, 500],
  },
};
