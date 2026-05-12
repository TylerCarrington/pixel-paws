import { Animal, HealthStatus } from '../types/animal.types';
import { CareActionType, CARE_ACTIONS } from '../constants/careActions.constants';
import { determineMood, MoodState } from './moodState.logic';
import { clampDesirability } from './desirability.logic';

export function applyAction(animal: Animal, action: CareActionType): Animal {
  if (animal.vetDaysRemaining > 0) return animal; // Cannot act on vet-admitted animals

  const newAnimal = { ...animal, isRevealed: true }; // Wash reveals them anyway, assume actions reveal
  
  const def = CARE_ACTIONS[action];
  let delta = def.baseDelta;

  const mood = determineMood(animal);

  // Apply mood modifiers
  if (mood === MoodState.SHY && (action === CareActionType.PET || action === CareActionType.FEED)) {
     delta += 5;
  }
  if (mood === MoodState.ANXIOUS && action === CareActionType.TRAIN) {
     delta -= 5;
  }
  
  if (action === CareActionType.VET) {
     if (animal.healthStatus !== HealthStatus.HEALTHY) {
        newAnimal.vetDaysRemaining = 2; // Arbitrary recovery time
     }
  } else {
     newAnimal.desirability = clampDesirability(newAnimal.desirability + delta);
  }

  return newAnimal;
}
