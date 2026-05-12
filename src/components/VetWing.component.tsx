import React from 'react';
import { useGameStore } from '../stores/game.store';
import VetAnimalCard from './VetAnimalCard.component';
import { getTotalVetBeds } from '../logic/upgradeEffect.logic';
import { motion } from 'framer-motion';

export default function VetWing() {
  const vetAnimals = useGameStore(state => state.vetAnimals);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const totalBeds = getTotalVetBeds(facilityUpgrades);

  const emptyBeds = totalBeds - vetAnimals.length;

  return (
    <div className="flex flex-col h-full bg-warm-cream p-6 overflow-hidden font-pixel">
      <header className="mb-8 border-b border-soft-lilac/30 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-game text-night-plum uppercase tracking-tighter">
            Vet Triage Wing
          </h1>
          <p className="text-muted-sage text-[10px] uppercase tracking-widest mt-2">
            Recovery & Medical Care • Capacity: {vetAnimals.length}/{totalBeds} Beds
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-soft-rose/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vetAnimals.map(animal => (
            <VetAnimalCard key={animal.id} animal={animal} />
          ))}

          {Array.from({ length: emptyBeds }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="h-[200px] border-2 border-dashed border-stone-grey/20 rounded-xl flex flex-col items-center justify-center text-stone-grey opacity-50"
            >
               <span className="text-2xl mb-2">🏥</span>
               <div className="text-[8px] uppercase tracking-widest">Available Bed</div>
            </div>
          ))}
        </div>

        {vetAnimals.length === 0 && emptyBeds === 0 && (
           <div className="h-64 flex flex-col items-center justify-center text-stone-grey space-y-4">
              <span className="text-4xl">🔒</span>
              <p className="text-[10px] uppercase tracking-widest text-center">
                Vet wing not yet established.<br/>Purchase the triage upgrade from the facility shop.
              </p>
           </div>
        )}
      </div>
    </div>
  );
}
