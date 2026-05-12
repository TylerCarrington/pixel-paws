import React from 'react';
import { Animal } from '../types/animal.types';
import { AdoptionResult } from '../logic/adoptionRoll.logic';
import { motion, AnimatePresence } from 'framer-motion';
import AvatarPlaceholder from './AvatarPlaceholder.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

interface AdoptionResultCardProps {
  animal: Animal;
  result: AdoptionResult;
  isVisible: boolean;
}

export default function AdoptionResultCard({ animal, result, isVisible }: AdoptionResultCardProps) {
  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`
        relative p-6 rounded-xl border-2 font-pixel bg-warm-cream shadow-2xl overflow-hidden
        ${result.isAdopted ? 'border-speaker-rose shadow-speaker-rose/20' : 'border-stone-grey'}
      `}
    >
      {/* Background Glow for Adopted */}
      {result.isAdopted && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-speaker-rose pointer-events-none"
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-20 h-20 flex items-center justify-center transform origin-top-left">
             <AvatarPlaceholder spriteKey={STARTER_DOGS.find(d => d.id === animal.breed)?.spriteKey || animal.breed} />
          </div>
          <div className="flex-1">
             <h3 className="text-sm font-game text-dialogue-text uppercase tracking-tight mb-2">
               {animal.name}
             </h3>
             <div className="text-[10px] text-muted-sage uppercase tracking-widest">
               {animal.species} • {animal.rarity}
             </div>
          </div>
        </div>

        <div className="border-t border-stone-grey/20 pt-4 mt-4">
          {result.isAdopted ? (
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-mossy-green/10 p-2 rounded border border-mossy-green/30">
                  <span className="text-deep-moss text-[10px] uppercase">Status</span>
                  <span className="text-mossy-green text-[10px] uppercase font-bold">Adopted!</span>
               </div>
               <div className="flex justify-between items-center bg-stone-grey/10 p-2 rounded border border-stone-grey/30">
                  <span className="text-muted-sage text-[10px] uppercase tracking-tighter">Adoption Fee</span>
                  <span className="text-amber-glow text-[10px] uppercase font-bold font-game">${result.payout}</span>
               </div>
               <p className="text-[10px] text-speaker-rose italic text-center leading-relaxed">
                 "A perfect match found! They look so happy together."
               </p>
             </div>
          ) : (
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-stone-grey/20 p-2 rounded border border-stone-grey/30">
                  <span className="text-muted-sage text-[10px] uppercase">Status</span>
                  <span className="text-stone-grey text-[10px] uppercase">Staying</span>
               </div>
               <p className="text-[10px] text-stone-grey italic text-center leading-relaxed">
                 "Not today, but their forever home is out there somewhere."
               </p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
