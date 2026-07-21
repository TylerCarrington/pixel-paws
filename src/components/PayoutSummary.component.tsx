import React from 'react';
import { motion } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { AdoptionResult } from '../logic/adoptionRoll.logic';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';

interface PayoutSummaryProps {
  total: number;
  adoptedCount: number;
  adoptionResults: AdoptionResult[];
  shelterAnimals: Animal[];
  onFinish: () => void;
}

export default function PayoutSummary({ total, adoptedCount, adoptionResults, shelterAnimals, onFinish }: PayoutSummaryProps) {
  const adoptions = adoptionResults.filter(r => r.isAdopted);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-warm-cream border-2 border-speaker-rose p-8 rounded-2xl shadow-2xl max-w-md w-full font-pixel text-center"
    >
      <h2 className="text-xl font-game text-night-plum mb-8 uppercase tracking-widest leading-relaxed">
        Day Summary
      </h2>

      {adoptedCount === 0 && (
        <p className="text-sm text-stone-grey italic mb-8">
          No adoptions today... but you took great care of them. Keep trying!
        </p>
      )}

      {adoptions.length > 0 && (
        <div className="mb-6 space-y-3 bg-stone-grey/5 p-4 rounded-xl border border-stone-grey/10 max-h-48 overflow-y-auto custom-scrollbar">
          {adoptions.map(result => {
            const animal = shelterAnimals.find(a => a.id === result.animalId);
            if (!animal) return null;
            const breedDef = animal.species === 'CAT' 
              ? STARTER_CATS.find(c => c.id === animal.breed)
              : STARTER_DOGS.find(d => d.id === animal.breed);
            const spriteKey = breedDef?.spriteKey || animal.breed;

            return (
              <div key={result.animalId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <AnimalSprite species={animal.species} spriteKey={spriteKey} size={24} animation="idle" />
                  </div>
                  <span className="text-dialogue-text font-game text-xs">{animal.name}</span>
                </div>
                <span className="text-amber-glow font-game text-xs tracking-tighter">+${result.payout}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-6 mb-10">
        <div className="flex justify-between items-center text-sm border-b border-stone-grey/20 pb-4">
          <span className="text-muted-sage uppercase tracking-widest text-[10px]">Adoptions</span>
          <span className="text-dialogue-text font-game text-xs">{adoptedCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-speaker-rose uppercase tracking-widest text-[10px] font-bold">Total Earnings</span>
          <span className="text-amber-glow font-game text-sm tracking-tighter">${total}</span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-5 px-6 rounded-lg transition-all active:scale-95 uppercase tracking-widest shadow-[0_4px_12px_rgba(122,184,122,0.4)]"
      >
        Go Home
      </button>
    </motion.div>
  );
}
