import React from 'react';
import { Animal, Species } from '../types/animal.types';
import DesirabilityBar from './DesirabilityBar.component';
import MoodIndicator from './MoodIndicator.component';
import RarityBadge from './RarityBadge.component';
import AvatarPlaceholder from './AvatarPlaceholder.component';
import HealthCertBadge from './HealthCertBadge.component';
import { determineMood } from '../logic/moodState.logic';
import { getBreedDefinition } from '../logic/animalAssets.logic';
import { Lock } from 'lucide-react';

interface PetCardProps {
  animal: Animal;
}

export default function PetCard({ animal }: PetCardProps) {
  const isRecovering = animal.vetDaysRemaining > 0;
  const mood = determineMood(animal);
  
  const def = getBreedDefinition(animal.breed);

  return (
    <div className="bg-warm-cream border border-stone-grey rounded-lg overflow-hidden shadow-lg flex flex-col h-full w-full relative">
       {isRecovering && (
         <div className="absolute inset-0 bg-soft-lilac/30 z-10 flex items-center justify-center backdrop-blur-sm">
           <div className="bg-warm-cream border border-soft-lilac rounded-lg p-3 text-center shadow-2xl font-pixel">
              <div className="text-xl mb-1">🏥</div>
              <div className="text-night-plum text-[8px] uppercase tracking-wider">In Recovery</div>
              <div className="text-night-plum/80 text-[8px] mt-1">{animal.vetDaysRemaining}d left</div>
           </div>
         </div>
       )}

       {/* Top: Portrait area */}
       <div className="h-32 bg-stone-grey/10 border-b border-stone-grey/30 flex items-center justify-center p-4 relative">
          {def?.spriteKey ? (
             <AvatarPlaceholder spriteKey={def.spriteKey} species={animal.species} />
          ) : (
             <span className="text-4xl">{animal.species === Species.CAT ? '🐱' : '🐶'}</span>
          )}
          <div className="absolute top-2 right-2">
            <RarityBadge rarity={animal.rarity} />
          </div>
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <MoodIndicator mood={mood} />
            {animal.isLocked && (
              <div className="bg-amber-glow text-warm-brown p-1 rounded-full shadow-md border border-white/60" title="Locked from adoption">
                <Lock size={10} />
              </div>
            )}
          </div>
          {animal.hasHealthCertificate && (
            <div className="absolute bottom-2 left-2 scale-75 origin-bottom-left">
              <HealthCertBadge />
            </div>
          )}
       </div>

       {/* Bottom: Info area */}
       <div className="p-4 flex flex-col flex-1 font-pixel">
          <h3 className="text-[10px] text-dialogue-text mb-2 truncate uppercase tracking-tight">
             {animal.isRevealed ? (animal.name || 'Anonymous') : '???'}
          </h3>
          <p className="text-[8px] text-muted-sage mb-4 uppercase tracking-widest truncate">
             {def?.name || animal.species}
          </p>

          <div className="mt-auto">
            <DesirabilityBar value={animal.desirability} />
          </div>
       </div>
    </div>
  );
}
