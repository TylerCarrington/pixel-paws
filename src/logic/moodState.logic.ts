import { Animal, HealthStatus } from '../types/animal.types';

export enum MoodState {
  HAPPY = 'HAPPY',
  CALM = 'CALM',
  ANXIOUS = 'ANXIOUS',
  SHY = 'SHY'
}

export function determineMood(animal: Animal /* action history could go here */): MoodState {
  // Simplified logic for now
  if (animal.healthStatus !== HealthStatus.HEALTHY) return MoodState.ANXIOUS;
  if (!animal.isRevealed) return MoodState.SHY;
  if (animal.desirability > 70) return MoodState.HAPPY;
  if (animal.desirability > 30) return MoodState.CALM;
  return MoodState.ANXIOUS;
}
