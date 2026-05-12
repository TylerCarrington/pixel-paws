import React from 'react';
import { Animal } from '../types/animal.types';
import PetCard from './PetCard.component';
import { useShelterStore } from '../stores/shelter.store';

interface KennelSlotProps {
  index: number;
  animal: Animal | null;
}

export default function KennelSlot({ index, animal }: KennelSlotProps) {
  const selectedAnimalId = useShelterStore(state => state.selectedAnimalId);
  const setSelectedAnimalId = useShelterStore(state => state.setSelectedAnimalId);

  const isSelected = animal && selectedAnimalId === animal.id;

  return (
    <div 
      className={`
        relative rounded-xl transition-all duration-200 cursor-pointer h-64
        ${!animal ? 'border-2 border-dashed border-stone-grey/40 hover:border-speaker-rose bg-stone-grey/10 flex flex-col items-center justify-center text-stone-grey hover:text-speaker-rose shadow-inner' : ''}
        ${isSelected ? 'ring-2 ring-speaker-rose ring-offset-2 ring-offset-warm-cream scale-[1.02] shadow-lg' : ''}
        ${animal && !isSelected ? 'hover:scale-[1.01] hover:ring-1 hover:ring-stone-grey hover:ring-offset-1 hover:ring-offset-warm-cream shadow-sm' : ''}
      `}
      onClick={() => {
        if (animal) setSelectedAnimalId(animal.id);
      }}
    >
      {animal ? (
        <PetCard animal={animal} />
      ) : (
        <>
          <div className="text-xl font-game opacity-50 mb-2">EMPTY</div>
          <div className="text-[8px] font-pixel uppercase tracking-widest text-center">Kennel Slot {index + 1}</div>
        </>
      )}
    </div>
  );
}
