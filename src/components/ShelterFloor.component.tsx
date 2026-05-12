import React, { useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { useShelterStore } from '../stores/shelter.store';
import { useMorningBoardStore } from '../stores/morningBoard.store';
import KennelSlot from './KennelSlot.component';
import ActionPanel from './ActionPanel.component';

export default function ShelterFloor() {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const selectedAnimalId = useShelterStore(state => state.selectedAnimalId);
  const setSelectedAnimalId = useShelterStore(state => state.setSelectedAnimalId);

  // Auto-select first animal if none selected
  useEffect(() => {
    if (!selectedAnimalId && shelterAnimals.length > 0) {
      setSelectedAnimalId(shelterAnimals[0].id);
    }
  }, [shelterAnimals, selectedAnimalId, setSelectedAnimalId]);

  const baseCapacity = facilityUpgrades.includes('KENNEL_BASIC_3') ? 3 : 1;
  const extraSlots = facilityUpgrades.filter(u => u.startsWith('KENNEL_SLOT_')).length;
  const capacity = baseCapacity + extraSlots;
  const slots = Array.from({ length: capacity }, (_, i) => shelterAnimals[i] || null);

  const dayNumber = useGameStore(state => state.dayNumber);
  const processAdoptions = useGameStore(state => state.processAdoptions);
  const setTodayCalls = useMorningBoardStore(state => state.setTodayCalls);

  const handleEndDay = () => {
    // Clear today's calls so they regenerate for the new day
    setTodayCalls([]);
    
    // Trigger adoption ceremony process
    processAdoptions();
  };

  const selectedAnimal = shelterAnimals.find(a => a.id === selectedAnimalId);

  return (
    <div className="flex flex-col h-full bg-warm-cream p-4 overflow-y-auto">
      
      {/* Top section: Kennel Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-game text-speaker-rose uppercase tracking-widest">
          Shelter Floor
        </h2>
        <button 
          onClick={handleEndDay}
          className="bg-warm-brown hover:brightness-110 text-warm-cream px-4 py-2 font-pixel text-[10px] rounded transition-colors uppercase tracking-widest shadow"
        >
           End Day
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((animal, index) => (
            <KennelSlot key={animal ? animal.id : `empty-${index}`} index={index} animal={animal} />
          ))}
        </div>

      {/* Bottom section: Action Panel for selected animal */}
      {selectedAnimal && (
        <div className="mt-auto shrink-0">
           <ActionPanel animal={selectedAnimal} />
        </div>
      )}
      
      {!selectedAnimal && shelterAnimals.length === 0 && (
        <div className="mt-auto flex items-center justify-center h-32 bg-warm-cream border-2 border-stone-grey/20 rounded-lg text-muted-sage font-pixel text-[10px] uppercase text-center px-4">
          No animals in shelter.
        </div>
      )}
    </div>
  );
}
