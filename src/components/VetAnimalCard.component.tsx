import React from 'react';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import RecoveryProgress from './RecoveryProgress.component';
import { SEVERITY_TIERS } from '../config/severity.config';
import { motion } from 'framer-motion';
import AvatarPlaceholder from './AvatarPlaceholder.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

interface VetAnimalCardProps {
  animal: Animal;
}

export default function VetAnimalCard({ animal }: VetAnimalCardProps) {
  const vetCareAction = useGameStore(state => state.vetCareAction);
  const severity = SEVERITY_TIERS[animal.healthStatus];

  const handleAction = (type: 'check' | 'bandage' | 'medicine' | 'comfort') => {
    vetCareAction(animal.id, type);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-warm-cream/50 border border-soft-lilac/30 rounded-xl overflow-hidden shadow-lg p-5 flex flex-col font-pixel"
    >
      <div className="flex gap-4 mb-6">
        <div className="w-16 h-16 flex items-center justify-center transform scale-75 origin-top-left">
          <AvatarPlaceholder spriteKey={STARTER_DOGS.find(d => d.id === animal.breed)?.spriteKey || animal.breed} />
        </div>
        <div className="flex-1">
          <h3 className="text-[10px] text-dialogue-text uppercase mb-1">{animal.name}</h3>
          <div className="text-[8px] text-speaker-rose uppercase tracking-widest mb-2">
            {severity?.label || 'Condition Unknown'}
          </div>
          <RecoveryProgress 
            daysRemaining={animal.vetDaysRemaining} 
            totalDays={severity?.baseDays || 1} 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => handleAction('check')}
          className="bg-stone-grey/20 hover:bg-soft-lilac/30 text-[8px] text-night-plum py-2 border border-soft-lilac/20 rounded uppercase tracking-tighter"
        >
          Check In
        </button>
        <button 
          onClick={() => handleAction('bandage')}
          className="bg-stone-grey/20 hover:bg-soft-lilac/30 text-[8px] text-night-plum py-2 border border-soft-lilac/20 rounded uppercase tracking-tighter"
        >
          Change Bandage
        </button>
        <button 
          onClick={() => handleAction('medicine')}
          className="bg-stone-grey/20 hover:bg-soft-lilac/30 text-[8px] text-night-plum py-2 border border-soft-lilac/20 rounded uppercase tracking-tighter"
        >
          Give Meds
        </button>
        <button 
          onClick={() => handleAction('comfort')}
          className="bg-stone-grey/20 hover:bg-soft-lilac/30 text-[8px] text-night-plum py-2 border border-soft-lilac/20 rounded uppercase tracking-tighter"
        >
          Comfort Visit
        </button>
      </div>
    </motion.div>
  );
}
