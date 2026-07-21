import { Rarity, DiscoveryMethod, HealthStatus, Species } from '../types/animal.types';
import { CallTemplate } from '../types/calls.types';

export const CALL_POOL: CallTemplate[] = [
  // DOGS
  {
    id: 'scared_alley_dog',
    title: 'Scared Dog Behind Bakery',
    description: 'There\'s a dog in the alley behind the bakery. Won\'t let anyone near. Growls if you get too close.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.SCARED_APPROACH,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'fence_playground_dog',
    title: 'Fence Rescue near Playground',
    description: 'Dog caught in the chain-link fence near the school playground. Can\'t get free on their own.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.FENCE_TANGLED,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'shed_dark_dog',
    title: 'Trapped in Construction Shed',
    description: 'Someone heard barking from the construction site. Sounds like it\'s coming from inside the old shed.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.DARK_SEARCH,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'market_stray_dog',
    title: 'Hungry at the Market',
    description: 'Stray dog spotted near the farmer\'s market. Keeps running away when approached. Looks hungry.',
    species: Species.DOG,
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.FOOD_TEMPT,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'trapped_woodpile_dog',
    title: 'Trapped Under Woodpile',
    description: 'Dog trapped under a collapsed woodpile in someone\'s backyard. We can hear them but can\'t reach them.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.WOODPILE_TRAPPED,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'runaway_village_dog',
    title: 'Village Runaway',
    description: 'Loose dog running through the village! Someone left a gate open. It\'s heading toward the main road!',
    species: Species.DOG,
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RUNAWAY_CHASE,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'porch_hiding_dog',
    title: 'Porch Hider',
    description: 'Dog hiding under Mrs. Tanaka\'s porch. Been there since this morning. Won\'t come out.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.PORCH_HIDING,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'riverside_warmup_dog',
    title: 'Riverside Rescue',
    description: 'Dog found shivering by the riverside. Soaking wet, possibly fell in. Needs help immediately.',
    species: Species.DOG,
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RIVERSIDE_WARMUP,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'park_injured_dog',
    title: 'Park Rescue',
    description: 'Dog limping near the park. Looks like they hurt their paw. Too scared to let anyone check.',
    species: Species.DOG,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.PARK_INJURED,
    requiredFacility: ['KENNEL_BASIC_3'],
    healthStatus: HealthStatus.MODERATE
  },
  {
    id: 'hiding_bushes_dog',
    title: 'Rustling in the Bushes',
    description: 'There\'s something moving in the bushes near the park exit. Sounds like a soft whimper.',
    species: Species.DOG,
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.HIDING,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'dirty_lab_dog',
    title: 'Muddy Lab by the River',
    description: 'A young Labrador was found covered in mud near the riverbank. Needs a good wash.',
    species: Species.DOG,
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.DIRTY,
    requiredFacility: ['KENNEL_BASIC_3']
  },

  // CATS
  {
    id: 'alley_cat_dirty',
    title: 'Muddy Cat by the River',
    description: 'A cat was found covered in mud near the riverside. Needs a good wash.',
    species: Species.CAT,
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.DIRTY,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'tree_cat_hiding',
    title: 'Cat Stuck in a Tree',
    description: 'A stray cat got scared and ran up a tree. Has been meowing for hours.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.HIDING,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'fence_cat',
    title: 'Tangled in the Fence',
    description: 'A cat tried to jump the community garden fence and got tangled in the netting.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.FENCE_TANGLED,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'feral_cat_tempt',
    title: 'Shy Feral near Dumpster',
    description: 'A very shy feral cat is lingering by the restaurant dumpsters. With some food, it might approach.',
    species: Species.CAT,
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.FOOD_TEMPT,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'hiding_bushes_cat',
    title: 'Rustling in the Bushes',
    description: 'There\'s something moving in the bushes near the park exit. Sounds like a soft meow.',
    species: Species.CAT,
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.HIDING,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'porch_cat',
    title: 'Napping on the Neighbor\'s Porch',
    description: 'A beautiful cat has been hiding under our neighbor\'s porch for three days. Won\'t come out.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.PORCH_HIDING,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'scared_alley_cat',
    title: 'Scared Cat in Back Alley',
    description: 'A tiny cat is huddled behind some trash cans in the dark alley. It looks terrified.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.SCARED_APPROACH,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'riverside_warmup_cat',
    title: 'Riverside Rescue',
    description: 'Cat found shivering by the riverside. Soaking wet, possibly fell in. Needs help immediately.',
    species: Species.CAT,
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RIVERSIDE_WARMUP,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'shed_dark_cat',
    title: 'Trapped in Construction Shed',
    description: 'Someone heard meowing from the construction site. Sounds like it\'s coming from inside the old shed.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.DARK_SEARCH,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'trapped_woodpile_cat',
    title: 'Trapped Under Woodpile',
    description: 'Cat trapped under a collapsed woodpile in someone\'s backyard. We can hear them but can\'t reach them.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.WOODPILE_TRAPPED,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'runaway_village_cat',
    title: 'Village Runaway',
    description: 'Scared cat running through the village! It\'s darting frantically down the street!',
    species: Species.CAT,
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RUNAWAY_CHASE,
    requiredFacility: ['facility_shelter']
  },
  {
    id: 'park_injured_cat',
    title: 'Park Rescue',
    description: 'Cat limping near the park. Looks like they hurt their paw. Too scared to let anyone check.',
    species: Species.CAT,
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.PARK_INJURED,
    requiredFacility: ['facility_shelter'],
    healthStatus: HealthStatus.MODERATE
  }
];
