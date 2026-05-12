import React from 'react';
import { useGameStore } from '../stores/game.store';

export default function SkipButton() {
  const advancePrologue = useGameStore(state => state.advancePrologue);
  
  return (
    <button 
      onClick={advancePrologue}
      className="absolute top-6 right-6 bg-night-plum/60 hover:bg-night-plum text-stone-grey hover:text-warm-cream font-mono px-4 py-2 rounded border border-stone-grey/20 transition-colors z-50 pointer-events-auto backdrop-blur-sm"
    >
      Skip &raquo;
    </button>
  );
}
