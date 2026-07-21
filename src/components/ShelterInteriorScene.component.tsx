import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { Animal } from '../types/animal.types';
import PetBed from './PetBed.component';
import PetDetailModal from './PetDetailModal.component';
import dogKennelsBg from '../assets/images/backgrounds/shelter-dog-kennels.png';
import catPlaygroundBg from '../assets/images/backgrounds/shelter-cat-playground.png';

interface ShelterInteriorSceneProps {
  activeRoom: 'DOG' | 'CAT';
}

export default function ShelterInteriorScene({ activeRoom }: ShelterInteriorSceneProps) {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const shelterCapacity = useGameStore(state => state.shelterCapacity);
  const catCapacity = useGameStore(state => state.catCapacity);
  const [selectedPet, setSelectedPet] = useState<Animal | null>(null);

  const dogs = shelterAnimals.filter(a => a.species === 'DOG');
  const cats = shelterAnimals.filter(a => a.species === 'CAT');

  // Kennel layout for dogs
  const dogPositions = [
    { top: '25%', left: '12%' },
    { top: '25%', left: '42%' },
    { top: '25%', left: '72%' },
    { top: '55%', left: '12%' },
    { top: '55%', left: '42%' },
    { top: '55%', left: '72%' }
  ].slice(0, shelterCapacity);

  // Bed layout for cats
  const catPositions = [
    { top: '30%', left: '8%' },
    { top: '30%', left: '70%' },
    { top: '35%', left: '42%' },
    { top: '52%', left: '28%' },
    { top: '52%', left: '56%' },
    { top: '72%', left: '42%' }
  ].slice(0, catCapacity);

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: activeRoom === 'DOG' ? 1 : 0, pointerEvents: activeRoom === 'DOG' ? 'auto' : 'none' }}>
         <img src={dogKennelsBg} alt="Dog Kennels" className="absolute inset-0 w-full h-full object-cover" />
         {dogPositions.map((pos, index) => (
           <PetBed 
             key={`dog-${index}`} 
             position={pos} 
             animal={dogs[index]} 
             onClick={() => dogs[index] && setSelectedPet(dogs[index])}
           />
         ))}
      </div>

      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: activeRoom === 'CAT' ? 1 : 0, pointerEvents: activeRoom === 'CAT' ? 'auto' : 'none' }}>
         <img src={catPlaygroundBg} alt="Cat Playground" className="absolute inset-0 w-full h-full object-cover" />
         {catPositions.map((pos, index) => (
           <PetBed 
             key={`cat-${index}`} 
             position={pos} 
             animal={cats[index]} 
             onClick={() => cats[index] && setSelectedPet(cats[index])}
           />
         ))}
      </div>

      {/* Pet Detail Modal */}
      {selectedPet && (
        <PetDetailModal 
          animal={selectedPet} 
          onClose={() => setSelectedPet(null)} 
        />
      )}
    </div>
  );
}
