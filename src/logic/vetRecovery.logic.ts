import { Animal, HealthStatus } from '../types/animal.types';
import { SEVERITY_TIERS } from '../config/severity.config';

export interface VetRecoveryUpdate {
  updatedVetAnimals: Animal[];
  dischargedAnimals: Animal[];
}

export function processVetRecovery(
  vetAnimals: Animal[], 
  speedModifier: number
): VetRecoveryUpdate {
  const updatedVetAnimals: Animal[] = [];
  const dischargedAnimals: Animal[] = [];

  vetAnimals.forEach(animal => {
    // Basic daily decrement (default 1) multiplied by speed modifier
    // We'll keep it as a float in state but display rounded? 
    // Or just subtract 1 and use speed modifier as a chance for extra decrement?
    // Let's use the simplest: vetDaysRemaining -= 1 * modifier;
    
    const newDays = Math.max(0, animal.vetDaysRemaining - (1 * speedModifier));
    const isDischarged = newDays <= 0;

    const updatedAnimal = {
      ...animal,
      vetDaysRemaining: newDays
    };

    if (isDischarged) {
      // Apply discharge bonuses
      const severity = SEVERITY_TIERS[animal.healthStatus] || SEVERITY_TIERS[HealthStatus.HEALTHY];
      dischargedAnimals.push({
        ...updatedAnimal,
        healthStatus: HealthStatus.HEALTHY,
        desirability: updatedAnimal.desirability + severity.desirabilityBoost,
        hasHealthCertificate: true,
        vetDaysRemaining: 0
      });
    } else {
      updatedVetAnimals.push(updatedAnimal);
    }
  });

  return {
    updatedVetAnimals,
    dischargedAnimals
  };
}
