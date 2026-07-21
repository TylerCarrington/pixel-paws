import { DiscoveryMethod } from '../types/animal.types';

export function getMoodFromDiscovery(method: DiscoveryMethod): 'Happy' | 'Calm' | 'Anxious' | 'Shy' {
  const roll = Math.random();
  
  switch (method) {
    case DiscoveryMethod.DIRTY:
      return roll < 0.7 ? 'Calm' : 'Shy';
    case DiscoveryMethod.HIDING:
    case DiscoveryMethod.PORCH_HIDING:
      if (roll < 0.6) return 'Shy';
      if (roll < 0.9) return 'Anxious';
      return 'Calm';
    case DiscoveryMethod.TANGLED:
    case DiscoveryMethod.FENCE_TANGLED:
    case DiscoveryMethod.WOODPILE_TRAPPED:
    case DiscoveryMethod.PARK_INJURED:
      if (roll < 0.5) return 'Anxious';
      if (roll < 0.9) return 'Calm';
      return 'Shy';
    case DiscoveryMethod.SCARED_APPROACH:
      return roll < 0.7 ? 'Anxious' : 'Shy';
    default:
      if (roll < 0.4) return 'Happy';
      if (roll < 0.8) return 'Calm';
      return 'Shy';
  }
}
