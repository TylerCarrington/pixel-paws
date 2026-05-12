import React from 'react';
import PetNameInput from './PetNameInput.component';
import { useGameStore } from '../stores/game.store';
import { createStarterPet } from '../logic/ownedPet.logic';

export default function ShelterNameInput() {
  const setShelterName = useGameStore(state => state.setShelterName);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const addShelterAnimal = useGameStore(state => state.addShelterAnimal);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  
  const purchaseUpgrade = useGameStore(state => state.purchaseUpgrade);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  
  const handleConfirm = (name: string) => {
    setShelterName(name);

    if (!facilityUpgrades.includes('KENNEL_BASIC_3')) {
      // Grant initial capacity if for some reason missing
      purchaseUpgrade({ id: 'KENNEL_BASIC_3', cost: 0 } as any);
    }

    setPhase6State('wash_rescue');
  };

  return (
    <div className="absolute inset-0 z-10 bg-night-plum/60 flex items-center justify-center backdrop-blur-sm">
      <PetNameInput 
        prompt="Name your new Animal Shelter"
        maxLength={24}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
