import React from 'react';
import { Animal, HealthStatus } from '../types/animal.types';
import { CareActionType, CARE_ACTIONS } from '../constants/careActions.constants';
import { useGameStore } from '../stores/game.store';
import { applyAction } from '../logic/careActions.logic';
import { getTotalVetBeds } from '../logic/upgradeEffect.logic';

interface ActionPanelProps {
  animal: Animal;
}

export default function ActionPanel({ animal }: ActionPanelProps) {
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const updateShelterAnimal = useGameStore(state => state.updateShelterAnimal);
  const sendToVet = useGameStore(state => state.sendToVet);
  const vetAnimals = useGameStore(state => state.vetAnimals);

  const hasVet = facilityUpgrades.includes('vet_wing');
  const needsVet = animal.healthStatus !== HealthStatus.HEALTHY;
  const vetBeds = getTotalVetBeds(facilityUpgrades);
  const isVetFull = vetAnimals.length >= vetBeds;

  const handleAction = (actionKey: CareActionType) => {
    const updatedAnimal = applyAction(animal, actionKey);
    updateShelterAnimal(animal.id, updatedAnimal);
  };

  const actionKeys = Object.values(CareActionType);

  return (
    <div className="bg-warm-cream/50 p-4 rounded-lg border border-stone-grey/30 font-pixel">
      <h3 className="text-[10px] text-muted-sage uppercase tracking-widest mb-4">Care Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {actionKeys.map(key => {
          const action = CARE_ACTIONS[key];
          const isUnlocked = !action.unlockRequirement || facilityUpgrades.includes(action.unlockRequirement);
          const isDisabled = !isUnlocked || animal.vetDaysRemaining > 0;

          return (
            <button
              key={key}
              onClick={() => handleAction(key)}
              disabled={isDisabled}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border transition-all
                ${isDisabled 
                  ? 'bg-stone-grey/10 border-stone-grey/20 text-stone-grey cursor-not-allowed opacity-50 shadow-inner' 
                  : 'bg-warm-cream border-stone-grey/30 hover:bg-blossom-pink/20 hover:border-speaker-rose hover:text-speaker-rose text-dialogue-text active:scale-95 shadow-sm'
                }
              `}
              title={!isUnlocked ? `Requires ${action.unlockRequirement}` : ''}
            >
              <span className="text-lg mb-1">{!isUnlocked ? '🔒' : action.emoji}</span>
              <span className="text-[8px] tracking-wider uppercase">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {hasVet && needsVet && (
        <div className="mt-6 pt-6 border-t border-stone-grey/30 text-center">
           <button
             disabled={isVetFull}
             onClick={() => sendToVet(animal.id)}
             className={`
               w-full py-3 rounded border font-bold uppercase tracking-widest text-[10px] transition-all
               ${isVetFull
                 ? 'bg-stone-grey/20 border-stone-grey/30 text-stone-grey cursor-not-allowed'
                 : 'bg-soft-lilac/20 border-soft-lilac/40 text-night-plum hover:bg-soft-lilac hover:text-warm-cream shadow-md'
               }
             `}
           >
             {isVetFull ? 'Vet Beds Full' : 'Send to Vet Triage'}
           </button>
           {isVetFull && (
             <p className="text-[8px] text-stone-grey text-center mt-3 italic opacity-60">
               Waiting for a recovery bed to clear...
             </p>
           )}
        </div>
      )}
    </div>
  );
}
