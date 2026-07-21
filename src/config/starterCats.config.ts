import { Rarity } from '../types/animal.types';
import { StarterDogDef } from './starterDogs.config';

export const STARTER_CATS: StarterDogDef[] = [
  { id: 'cat_orange_tabby', name: 'Orange Tabby', spriteKey: 'orange-tabby-cat', rarity: Rarity.COMMON, baseDesirabilityRange: [40, 60], subspecies: 'Orange Tabby' },
  { id: 'cat_grey_tabby', name: 'Grey Tabby', spriteKey: 'grey-tabby-cat', rarity: Rarity.COMMON, baseDesirabilityRange: [45, 65], subspecies: 'Grey Tabby' },
  { id: 'cat_tuxedo', name: 'Tuxedo Cat', spriteKey: 'tuxedo-cat', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Tuxedo' },
  { id: 'cat_calico', name: 'Calico', spriteKey: 'calico-cat', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [50, 70], subspecies: 'Calico' },
  { id: 'cat_black', name: 'Black Cat', spriteKey: 'sleek-black-cat', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [40, 60], subspecies: 'Black Cat' },
  { id: 'cat_tortoiseshell', name: 'Tortoiseshell', spriteKey: 'tortoiseshell-cat', rarity: Rarity.UNCOMMON, baseDesirabilityRange: [45, 65], subspecies: 'Tortoiseshell' },
  { id: 'cat_siamese', name: 'Siamese', spriteKey: 'siamese-cat', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Siamese' },
  { id: 'cat_russian_blue', name: 'Russian Blue', spriteKey: 'russian-blue-cat', rarity: Rarity.RARE, baseDesirabilityRange: [60, 80], subspecies: 'Russian Blue' },
  { id: 'cat_persian', name: 'White Persian', spriteKey: 'white-persian-cat', rarity: Rarity.RARE, baseDesirabilityRange: [55, 75], subspecies: 'White Persian' },
  { id: 'cat_ragdoll', name: 'Cream Ragdoll', spriteKey: 'cream-ragdoll-cat', rarity: Rarity.RARE, baseDesirabilityRange: [65, 85], subspecies: 'Cream Ragdoll' }
];
