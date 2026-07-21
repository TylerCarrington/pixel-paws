import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import PetBed from './PetBed.component';
import PetDetailModal from './PetDetailModal.component';
import SpareRoomTutorial from './SpareRoomTutorial.component';
import { Animal } from '../types/animal.types';
import spareRoomBg from '../assets/images/backgrounds/spare-room.png';

export default function SpareRoomScene() {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const shelterCapacity = useGameStore(state => state.shelterCapacity);
  const dayNumber = useGameStore(state => state.dayNumber);
  const [selectedPet, setSelectedPet] = useState<Animal | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (dayNumber >= 3 && !localStorage.getItem('spareRoomTutorialSeen')) {
      setShowTutorial(true);
    }
  }, [dayNumber]);

  const handleDismissTutorial = () => {
    localStorage.setItem('spareRoomTutorialSeen', 'true');
    setShowTutorial(false);
  };

  // Layouts from plan
  const layout3 = [
    { top: '58%', left: '25%' },
    { top: '58%', left: '50%' },
    { top: '58%', left: '75%' },
  ];

  const layout4 = [
    { top: '58%', left: '20%' },
    { top: '58%', left: '40%' },
    { top: '58%', left: '60%' },
    { top: '58%', left: '80%' },
  ];

  const positions = shelterCapacity === 4 ? layout4 : layout3;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e0d5c5]">
      {showTutorial && <SpareRoomTutorial onDismiss={handleDismissTutorial} />}
      {/* Background Image */}
      <img 
        src={spareRoomBg} 
        alt="Spare Room" 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Rug Overlay Area (visual reference) */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[35%] bg-black/5 rounded-[100%] blur-xl" />

      {/* Beds */}
      {positions.map((pos, index) => (
        <PetBed 
          key={index} 
          position={pos} 
          animal={shelterAnimals[index]} 
          onClick={() => shelterAnimals[index] && setSelectedPet(shelterAnimals[index])}
        />
      ))}

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
