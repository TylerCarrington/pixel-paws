import { Species } from '../types/animal.types';

export const UNLOCK_MESSAGES: Record<Species, string> = {
  [Species.CAT]: "Word is spreading... people are looking for feline companions. Time to build a cat room!",
  [Species.SMALL_ANIMAL]: "Is that a twitching nose? Small mammals are in high demand now.",
  [Species.BIRD]: "The shelter sounds a bit quiet. Some feathered friends would really brighten the place up.",
  [Species.AQUATIC]: "Bubbling with excitement! We're ready for aquatic rescues.",
  [Species.REPTILE]: "A cold-blooded addition to our warm-hearted shelter.",
  [Species.EXOTIC_SMALL]: "You've earned quite a reputation. Rare and exotic animals are being directed to your care.",
  [Species.EXOTIC_LARGE]: "Legends speak of your shelter. Prepare for a truly unique rescue.",
  [Species.DOG]: "" // Starting species
};
