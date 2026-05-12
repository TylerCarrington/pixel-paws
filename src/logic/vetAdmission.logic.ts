import { Animal, HealthStatus } from '../types/animal.types';
import { SEVERITY_TIERS } from '../config/severity.config';

export function prepareForVet(animal: Animal): Animal {
  const severity = SEVERITY_TIERS[animal.healthStatus] || SEVERITY_TIERS[HealthStatus.HEALTHY];
  
  return {
    ...animal,
    vetDaysRemaining: severity.baseDays
  };
}
