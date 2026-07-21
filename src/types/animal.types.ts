export enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  SMALL_ANIMAL = 'SMALL_ANIMAL',
  BIRD = 'BIRD',
  REPTILE = 'REPTILE',
  EXOTIC_SMALL = 'EXOTIC_SMALL',
  AQUATIC = 'AQUATIC',
  EXOTIC_LARGE = 'EXOTIC_LARGE'
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EXOTIC = 'EXOTIC',
  LEGENDARY = 'LEGENDARY'
}

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  MINOR = 'MINOR',
  MODERATE = 'MODERATE',
  SERIOUS = 'SERIOUS',
  CRITICAL = 'CRITICAL'
}

export enum DiscoveryMethod {
  DIRTY = 'DIRTY',
  HIDING = 'HIDING',
  BOX = 'BOX',
  SOUND = 'SOUND',
  TANGLED = 'TANGLED',
  EGG = 'EGG',
  NOCTURNAL = 'NOCTURNAL',
  CAMOUFLAGED = 'CAMOUFLAGED',
  UNDERWATER = 'UNDERWATER',
  PARENT_BLOCKED = 'PARENT_BLOCKED',
  PARK_FIND = 'PARK_FIND',
  BACKYARD_STRAY = 'BACKYARD_STRAY',
  POLICE_DROP = 'POLICE_DROP',
  SCARED_APPROACH = 'SCARED_APPROACH',
  FENCE_TANGLED = 'FENCE_TANGLED',
  DARK_SEARCH = 'DARK_SEARCH',
  FOOD_TEMPT = 'FOOD_TEMPT',
  WOODPILE_TRAPPED = 'WOODPILE_TRAPPED',
  RUNAWAY_CHASE = 'RUNAWAY_CHASE',
  PORCH_HIDING = 'PORCH_HIDING',
  RIVERSIDE_WARMUP = 'RIVERSIDE_WARMUP',
  PARK_INJURED = 'PARK_INJURED'
}

export interface Animal {
  id: string;
  species: Species;
  breed: string;
  subspecies?: string;
  name: string | null;
  rarity: Rarity;
  isRevealed: boolean;
  desirability: number;
  healthStatus: HealthStatus;
  vetDaysRemaining: number;
  hasHealthCertificate: boolean;
  isMine: boolean;
  outfits: string[];
  discoveryMethod: DiscoveryMethod;
  mood: 'Happy' | 'Calm' | 'Anxious' | 'Shy';
  actionsUsedToday: number;
  level: number;
  currentXP: number;
  totalXP: number;
  hasBeenNamed?: boolean;
  activityCooldowns: { [activityKey: string]: boolean };
  equippedAccessories: {
    head: string | null;
    neck: string | null;
    body: string | null;
    back: string | null;
  };
  hiddenBonuses: {
    pet: number;
    feed: number;
    play: number;
    groom: number;
    activity: number;
  };
  homeLocation?: 'bedroom' | 'dogHouse' | 'familyRoom' | 'sunroom' | 'studyRoom';
  dailyXPFlags?: Partial<Record<'pet' | 'feed' | 'play' | 'groom', boolean>>;
  isLocked?: boolean;
}
