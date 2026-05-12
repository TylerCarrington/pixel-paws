import { Outfit } from '../config/outfits.config';
import { Species } from '../types/animal.types';

export function getCompatibleOutfits(species: Species, allOutfits: Outfit[]): Outfit[] {
  return allOutfits.filter(outfit => outfit.speciesWhitelist.includes(species));
}
