import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import { Animal, Species } from '../types/animal.types';
import AnimalSprite from './AnimalSprite.component';
import MoodIndicator from './MoodIndicator.component';
import DesirabilityBar from './DesirabilityBar.component';
import { getBreedDefinition } from '../logic/animalAssets.logic';
import petBedImg from '../assets/images/items/pet-bed.png';
import { Lock } from 'lucide-react';

interface PetBedProps {
  animal?: Animal;
  position: { top: string; left: string };
  onClick?: () => void;
}

export default function PetBed({ animal, position, onClick }: PetBedProps) {
  const isCat = animal?.species === Species.CAT;
  const breed = animal ? getBreedDefinition(animal.breed) : null;
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);

  return (
    <div 
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ top: position.top, left: position.left }}
      onClick={onClick}
    >
      {/* Bed Visual (Asset) - Wait, do cats get a bed too? Yes, we can just use the same image or hide it if it's placed on a tree. Let's make it 90% opacity like before. */}
      <div className="relative w-36 h-24 flex items-center justify-center">
        {(!animal || !isCat) && (
          <img 
            src={petBedImg} 
            alt="Pet Bed" 
            className="absolute inset-0 w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
        )}

        {animal && breed && (
          <div className="relative z-10 flex flex-col items-center translate-y-[-8px]">
            {/* Lock Badge */}
            {animal.isLocked && (
              <div 
                className="absolute -top-8 -left-4 z-20 bg-amber-glow text-warm-brown p-1 rounded-full shadow-md border border-white/60" 
                title="Locked from adoption"
              >
                <Lock size={12} />
              </div>
            )}

            {/* Mood Dot */}
            <div className="absolute -top-8 -right-4 z-20 flex flex-col items-center gap-1">
              <MoodIndicator mood={animal.mood} />
              {/* Actions Indicator */}
              <div className="flex gap-0.5">
                {[...Array(actionsPerPetToday)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < (actionsPerPetToday - animal.actionsUsedToday) ? 'bg-amber-glow shadow-[0_0_4px_#f5c87a]' : 'bg-stone-grey/30'}`} 
                  />
                ))}
              </div>
            </div>

            {/* Pet Sprite */}
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              className="mb-1"
            >
              <AnimalSprite 
                spriteKey={breed.spriteKey} 
                species={animal.species}
                size={isCat ? 16 * 4 : 16 * 5} 
                animation="idle"
              />
            </motion.div>

            {/* Info */}
            <div className="absolute top-full flex flex-col items-center gap-0.5 mt-1">
              <span className="text-[10px] font-pixel text-[#5d4037] leading-none drop-shadow-sm bg-white/40 px-1 rounded">
                {animal.name || 'Unnamed'}
              </span>
              <DesirabilityBar value={animal.desirability} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
