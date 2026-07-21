import { Species } from '../types/animal.types';

export interface Outfit {
  id: string;
  name: string;
  speciesWhitelist: Species[];
  spriteSuffix: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export const OUTFITS: Outfit[] = [
  {
    id: 'red_bandana',
    name: 'Red Bandana',
    speciesWhitelist: [Species.DOG, Species.CAT],
    spriteSuffix: '_bandana',
    rarity: 'Common'
  },
  {
    id: 'cool_shades',
    name: 'Cool Shades',
    speciesWhitelist: [Species.DOG, Species.CAT, Species.SMALL_ANIMAL],
    spriteSuffix: '_shades',
    rarity: 'Rare'
  },
  {
    id: 'chefs_apron',
    name: 'Chef\'s Apron',
    speciesWhitelist: [Species.DOG, Species.CAT],
    spriteSuffix: '_apron',
    rarity: 'Common'
  },
  {
    id: 'tiny_hat',
    name: 'Tiny Top Hat',
    speciesWhitelist: [Species.SMALL_ANIMAL, Species.BIRD],
    spriteSuffix: '_tophat',
    rarity: 'Legendary'
  },
  {
    id: 'yellow_sweater',
    name: 'Yellow Sweater',
    speciesWhitelist: [Species.DOG, Species.CAT],
    spriteSuffix: '_sweater',
    rarity: 'Common'
  }
];
