import React from 'react';
import { useGameStore } from '../stores/game.store';

export default function BreedAnnouncement() {
  const assignedBreed = useGameStore(state => state.assignedBreed);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const completePhase4 = useGameStore(state => state.completePhase4);
  const completeRescueWash = useGameStore(state => state.completeRescueWash);

  const breed = rescueBreed || assignedBreed;
  const isRescue = !!rescueBreed;

  if (!breed) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-night-plum/90 backdrop-blur pointer-events-auto font-pixel">
      <div className="bg-warm-cream p-8 rounded-xl shadow-2xl border border-soft-rose/50 flex flex-col items-center max-w-sm w-full animate-in fade-in zoom-in duration-500">
        <h2 className="text-sm font-game text-speaker-rose mb-6 uppercase">Clean!</h2>
        <p className="text-dialogue-text text-center mb-8 text-[10px] leading-relaxed italic">
          You washed off all the mud and revealed a beautiful...
        </p>
        
        <div className="bg-stone-grey/10 w-full rounded-lg py-8 flex flex-col items-center border border-stone-grey/20 shadow-inner mb-10">
          <div className="text-[10px] font-game text-night-plum mb-4 uppercase">{breed.name}</div>
          <div className="uppercase tracking-widest text-[8px] text-soft-lilac px-3 py-1 bg-soft-lilac/10 rounded border border-soft-lilac/30">
            {breed.rarity}
          </div>
        </div>

        <button 
          onClick={isRescue ? completeRescueWash : completePhase4}
          className="w-full bg-mossy-green hover:bg-deep-moss text-warm-cream py-4 px-6 rounded-lg font-game text-[10px] transition-colors border border-deep-moss shadow-lg uppercase"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
