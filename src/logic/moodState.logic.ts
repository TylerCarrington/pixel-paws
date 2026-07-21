import { Animal, HealthStatus } from '../types/animal.types';

export type MoodType = 'Happy' | 'Calm' | 'Anxious' | 'Shy';

export function determineMood(animal: Animal /* action history could go here */): MoodType {
  // Use animal.mood if it already has one (new animals)
  if (animal.mood) return animal.mood;

  // Fallback for legacy data or dynamic recalculation if desired
  if (animal.healthStatus !== HealthStatus.HEALTHY) return 'Anxious';
  if (!animal.isRevealed) return 'Shy';
  if (animal.desirability > 70) return 'Happy';
  if (animal.desirability > 30) return 'Calm';
  return 'Anxious';
}
