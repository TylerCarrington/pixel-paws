import { Rarity, DiscoveryMethod } from '../types/animal.types';
import { CallTemplate } from '../types/calls.types';

export const TUTORIAL_CALLS: Record<number, CallTemplate[]> = {
  1: [], // Day 1 is prologue
  2: [
    {
      id: 'tutorial_pug',
      title: 'Found Pup in Box',
      description: 'Someone left a small cardboard box in front of the local grocery store. There\'s a tiny dog inside!',
      species: 'Dog',
      rarity: Rarity.COMMON,
      discoveryMethod: DiscoveryMethod.BOX,
      requiredFacility: ['KENNEL_BASIC_3']
    },
    {
      id: 'tutorial_beagle',
      title: 'Hungry Beagle',
      description: 'A neighborhood resident reports a Beagle hanging around their garbage cans. It looks lost.',
      species: 'Dog',
      rarity: Rarity.COMMON,
      discoveryMethod: DiscoveryMethod.BACKYARD_STRAY,
      requiredFacility: ['KENNEL_BASIC_3']
    }
  ]
};
