import { Rarity, DiscoveryMethod, HealthStatus } from '../types/animal.types';
import { CallTemplate } from '../types/calls.types';

export const CALL_POOL: CallTemplate[] = [
  {
    id: 'dirty_lab',
    title: 'Muddy Lab Near River',
    description: 'A young Labrador was found wandering near the riverbank. It is covered in thick, stinking mud.',
    species: 'Dog',
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.DIRTY,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'stray_beagle_backyard',
    title: 'Surprise Backyard Visitor',
    description: 'A Beagle with no collar showed up in someone\'s fenced backyard. It looks a bit thin but friendly.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.BACKYARD_STRAY,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'lost_dalmatian_park',
    title: 'Lost in the Park',
    description: 'Park rangers spotted a beautiful Dalmatian hanging around the picnic area. It won\'t let anyone close.',
    species: 'Dog',
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.PARK_FIND,
    requiredFacility: ['PLAYPEN']
  },
  {
    id: 'police_pug',
    title: 'Police Drop-off',
    description: 'The local police found a Pug during a routine stop. They need a temporary place for it.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.POLICE_DROP,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'injured_corgi',
    title: 'Roadside Corgi',
    description: 'A Corgi was found limping on the side of the road. It looks like it needs medical attention.',
    species: 'Dog',
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.DIRTY,
    requiredFacility: ['vet_wing'],
    healthStatus: HealthStatus.MODERATE
  },
  {
    id: 'sickly_husky',
    title: 'Weak Husky in Alley',
    description: 'A pale Husky was found shivering in a cardboard box. It needs a heated bed and medicine.',
    species: 'Dog',
    rarity: Rarity.EXOTIC,
    discoveryMethod: DiscoveryMethod.DIRTY,
    requiredFacility: ['vet_wing'],
    healthStatus: HealthStatus.SERIOUS
  },
  {
    id: 'scared_alley_dog',
    title: 'Scared Dog Behind Bakery',
    description: 'There\'s a dog in the alley behind the bakery. Won\'t let anyone near. Growls if you get too close.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.SCARED_APPROACH,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'fence_playground_dog',
    title: 'Fence Rescue near Playground',
    description: 'Dog caught in the chain-link fence near the school playground. Can\'t get free on their own.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.FENCE_TANGLED,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'shed_dark_dog',
    title: 'Trapped in Construction Shed',
    description: 'Someone heard barking from the construction site. Sounds like it\'s coming from inside the old shed.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.DARK_SEARCH,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'market_stray_dog',
    title: 'Hungry at the Market',
    description: 'Stray dog spotted near the farmer\'s market. Keeps running away when approached. Looks hungry.',
    species: 'Dog',
    rarity: Rarity.COMMON,
    discoveryMethod: DiscoveryMethod.FOOD_TEMPT,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'trapped_woodpile_dog',
    title: 'Trapped Under Woodpile',
    description: 'Dog trapped under a collapsed woodpile in someone\'s backyard. We can hear them but can\'t reach them.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.WOODPILE_TRAPPED,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'runaway_village_dog',
    title: 'Village Runaway',
    description: 'Loose dog running through the village! Someone left a gate open. It\'s heading toward the main road!',
    species: 'Dog',
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RUNAWAY_CHASE,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'porch_hiding_dog',
    title: 'Porch Hider',
    description: 'Dog hiding under Mrs. Tanaka\'s porch. Been there since this morning. Won\'t come out.',
    species: 'Dog',
    rarity: Rarity.UNCOMMON,
    discoveryMethod: DiscoveryMethod.PORCH_HIDING,
    requiredFacility: ['KENNEL_BASIC_3']
  },
  {
    id: 'riverside_warmup_dog',
    title: 'Riverside Rescue',
    description: 'Dog found shivering by the riverside. Soaking wet, possibly fell in. Needs help immediately.',
    species: 'Dog',
    rarity: Rarity.RARE,
    discoveryMethod: DiscoveryMethod.RIVERSIDE_WARMUP,
    requiredFacility: ['KENNEL_BASIC_3']
  }
];
