import React from 'react';
import { useGameStore } from '../stores/game.store';
import { OUTFITS, Outfit } from '../config/outfits.config';
import { getCompatibleOutfits } from '../logic/outfitCompatibility.logic';
import { Animal } from '../types/animal.types';

interface OutfitSelectorProps {
  pet: Animal;
}

export default function OutfitSelector({ pet }: OutfitSelectorProps) {
  const currentOutfitId = useGameStore(state => state.petOutfits[pet.id]);
  const equipOutfit = useGameStore(state => state.equipOutfit);
  
  const compatibleOutfits = getCompatibleOutfits(pet.species, OUTFITS);

  return (
    <div className="bg-warm-cream/50 p-6 rounded-2xl border border-stone-grey/30">
      <h3 className="text-[10px] text-dialogue-text uppercase tracking-widest mb-4 font-game">Wardrobe</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => equipOutfit(pet.id, null)}
          className={`
            p-3 rounded-xl border text-[8px] uppercase tracking-widest transition-all
            ${!currentOutfitId ? 'bg-soft-lilac/30 border-soft-lilac text-night-plum' : 'bg-stone-grey/10 border-stone-grey text-muted-sage hover:text-dialogue-text'}
          `}
        >
          No Outfit
        </button>
        {compatibleOutfits.map(outfit => (
          <button
            key={outfit.id}
            onClick={() => equipOutfit(pet.id, outfit.id)}
            className={`
              p-3 rounded-xl border text-[8px] uppercase tracking-widest transition-all flex flex-col items-center gap-1
              ${currentOutfitId === outfit.id ? 'bg-soft-lilac/30 border-soft-lilac text-night-plum' : 'bg-stone-grey/10 border-stone-grey text-muted-sage hover:text-dialogue-text'}
            `}
          >
            <span className="text-xl">{outfit.rarity === 'Legendary' ? '✨' : '👕'}</span>
            {outfit.name}
          </button>
        ))}
      </div>
    </div>
  );
}
