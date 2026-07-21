import React, { useState, useEffect } from 'react';
import { Animal } from '../types/animal.types';
import { AdoptionResult } from '../logic/adoptionRoll.logic';
import { motion, AnimatePresence } from 'motion/react';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';
import { Lock } from 'lucide-react';

interface AdoptionResultCardProps {
  animal: Animal;
  result: AdoptionResult;
  isVisible: boolean;
}

export default function AdoptionResultCard({ animal, result, isVisible }: AdoptionResultCardProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    if (!result.isAdopted) {
      setStage(4); // Just show staying state
      return;
    }

    const timer1 = setTimeout(() => setStage(1), 1000); // Glow and text text appears
    const timer2 = setTimeout(() => setStage(2), 2500); // Pet and family fade out, Cash payout appears

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVisible, result.isAdopted]);

  if (!isVisible) return null;

  const breedDef = animal.species === 'CAT'
    ? STARTER_CATS.find(c => c.id === animal.breed)
    : STARTER_DOGS.find(d => d.id === animal.breed);
  const spriteKey = breedDef?.spriteKey || animal.breed;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`
        relative w-full max-w-sm p-8 rounded-2xl font-pixel bg-warm-cream shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-center items-center text-center
        ${result.isAdopted ? 'border-4 border-[#fffdd0] shadow-amber-glow/20' : 'border-4 border-stone-grey/20'}
      `}
    >
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {!result.isAdopted ? (
          <>
            <div className="mb-6 opacity-70 relative">
              <AnimalSprite species={animal.species} spriteKey={spriteKey} size={64} animation="idle" />
              {animal.isLocked && (
                <div className="absolute -top-2 -right-2 bg-amber-glow text-warm-brown p-1.5 rounded-full shadow-md border border-white/60">
                  <Lock size={14} />
                </div>
              )}
            </div>
            <h3 className="text-xl font-game text-dialogue-text uppercase tracking-tight mb-2">
              {animal.name}
            </h3>
            {animal.isLocked ? (
              <>
                <p className="text-sm text-warm-brown italic leading-relaxed mt-2 font-pixel">
                  "Shelter Hold Active — Safe with you!"
                </p>
                <div className="mt-4 px-3 py-1 bg-amber-glow/20 rounded-full border border-amber-glow/40 flex items-center gap-1.5">
                  <Lock size={12} className="text-warm-brown" />
                  <span className="text-[10px] font-pixel text-warm-brown font-bold uppercase tracking-widest">Locked From Adoption</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-stone-grey italic leading-relaxed mt-4">
                  "Not today, but their forever home is out there."
                </p>
                <div className="mt-4 px-3 py-1 bg-stone-grey/5 rounded-full border border-stone-grey/10">
                  <span className="text-[10px] font-pixel text-stone-grey uppercase tracking-widest">{Math.round(result.chance * 100)}% Match Chance</span>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* The Ceremony Container */}
            <div className="relative h-32 w-full flex justify-center items-end mb-6">
              
              <AnimatePresence>
                {stage < 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-end gap-4"
                  >
                    {/* Family Silhouette */}
                    <div className="flex gap-2 opacity-80 text-amber-glow/80 mb-2">
                      <div className="w-6 h-12 bg-current rounded-t-full" />
                      <div className="w-5 h-10 bg-current rounded-t-full" />
                    </div>

                    {/* Pet */}
                    <motion.div
                      animate={stage >= 1 ? { filter: 'drop-shadow(0 0 10px #fffdd0)' } : {}}
                    >
                       <AnimalSprite species={animal.species} spriteKey={spriteKey} size={64} animation="happy" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cash Payout */}
              <AnimatePresence>
                {stage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="text-4xl text-amber-glow font-game drop-shadow-sm">+${result.payout}</span>
                    <span className="text-xs text-muted-sage uppercase tracking-widest mt-2 block">Care Bonus Applied</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-20 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {stage >= 1 && stage < 2 && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-lg text-speaker-rose leading-relaxed font-game"
                  >
                    {animal.name} found a home!
                  </motion.p>
                )}
              </AnimatePresence>
              {stage < 2 && (
                <div className="mt-2 px-3 py-1 rounded-full border border-stone-grey/20">
                  <span className="text-[10px] font-pixel text-muted-sage uppercase tracking-widest">{Math.round((result.chance || 0) * 100)}% Match Chance</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
