import { Species } from '../types/animal.types';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';
import { STARTER_REPTILES } from '../config/starterReptiles.config';
import { STARTER_FISH } from '../config/starterFish.config';
import { STARTER_BIRDS } from '../config/starterBirds.config';
import { STARTER_SMALL_ANIMALS } from '../config/starterSmallAnimals.config';

/**
 * Returns the breed definition for a given breed ID by searching across all species configs.
 */
export function getBreedDefinition(breedId: string): any {
  return (
    STARTER_DOGS.find(d => d.id === breedId) ||
    STARTER_CATS.find(c => c.id === breedId) ||
    STARTER_REPTILES.find(r => r.id === breedId) ||
    STARTER_FISH.find(f => f.id === breedId) ||
    STARTER_BIRDS.find(b => b.id === breedId) ||
    STARTER_SMALL_ANIMALS.find(sa => sa.id === breedId) ||
    null
  );
}

const images = import.meta.glob('../assets/images/**/*.+(png|jpeg|jpg)', { eager: true, as: 'url' }) as Record<string, string>;

/**
 * Returns the correct image source path for an animal based on species and breed sprite key.
 */
export function getAnimalSpriteSrc(species: Species, spriteKey: string): string {
  let folder = 'dogs';
  if (species === Species.CAT) folder = 'cats';
  if (species === Species.REPTILE) folder = 'reptiles';
  if (species === Species.AQUATIC) folder = 'fish';
  if (species === Species.BIRD) folder = 'birds';
  if (species === Species.SMALL_ANIMAL) folder = 'small-animals';
  
  const path = `../assets/images/animals/${folder}/${spriteKey}.png`;
  // Iterate through keys to find one that ends with our path
  const match = Object.keys(images).find(key => key.endsWith(path.replace('..', '')));
  return match ? images[match] : `./src/assets/images/animals/${folder}/${spriteKey}.png`;
}

/**
 * Returns the sprite key for a given breed ID by searching across all species configs.
 */
export function getSpriteKeyForBreed(breedId: string): string {
  const definition = getBreedDefinition(breedId);
  if (definition) return definition.spriteKey;
  
  // Fallback to breedId if not found (assuming breedId might be the spriteKey)
  return breedId;
}
