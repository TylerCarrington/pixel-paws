import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { useMorningBoardStore } from '../stores/morningBoard.store';
import SpareRoomScene from './SpareRoomScene.component';
import ShelterInteriorScene from './ShelterInteriorScene.component';
import ShelterListings from './ShelterListings.component';
import ShelterTutorial from './ShelterTutorial.component';
import { Dog, Cat } from 'lucide-react';

export default function ShelterFloor() {
  const dayNumber = useGameStore(state => state.dayNumber);
  const money = useGameStore(state => state.money);
  const shelterName = useGameStore(state => state.shelterName) || "Paws & Purpose";
  const spareRoomAccessible = useGameStore(state => state.spareRoomAccessible);
  const catsUnlocked = useGameStore(state => state.catsUnlocked);
  const shelterCapacity = useGameStore(state => state.shelterCapacity);
  const catCapacity = useGameStore(state => state.catCapacity);
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const processAdoptions = useGameStore(state => state.processAdoptions);
  const setTodayCalls = useMorningBoardStore(state => state.setTodayCalls);
  
  const [showListings, setShowListings] = useState(false);
  const [activeRoom, setActiveRoom] = useState<'DOG' | 'CAT'>('DOG');
  const [showTutorial, setShowTutorial] = useState(() => {
    return !spareRoomAccessible && !localStorage.getItem('shelterTutorialSeen');
  });

  const dogsCount = shelterAnimals.filter(a => a.species === 'DOG').length;
  const catsCount = shelterAnimals.filter(a => a.species === 'CAT').length;

  const handleEndDay = () => {
    setTodayCalls([]);
    processAdoptions();
  };

  const handleDismissTutorial = () => {
    localStorage.setItem('shelterTutorialSeen', 'true');
    setShowTutorial(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#e0d5c5] relative">
      {showTutorial && <ShelterTutorial onDismiss={handleDismissTutorial} />}
      <div className="flex-1 relative">
         {spareRoomAccessible ? <SpareRoomScene /> : <ShelterInteriorScene activeRoom={activeRoom} />}
      </div>
      
      {/* Simple HUD Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
        <div className="flex gap-4 items-start pointer-events-auto">
          <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <h2 className="text-[10px] font-pixel text-warm-cream uppercase tracking-[0.2em] mb-1">
              {spareRoomAccessible ? "Makeshift Shelter" : shelterName}
            </h2>
            <div className="text-[8px] font-pixel text-warm-cream/60 uppercase">
              {spareRoomAccessible ? "Spare Room" : "Main Facility"} • Day {dayNumber}
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-center">
             <span className="text-amber-glow font-pixel text-sm drop-shadow-sm">${money}</span>
          </div>

          <button 
            onClick={() => useGameStore.getState().setPhase6State('facility_shop')}
            className="bg-amber-glow hover:bg-amber-600 text-white px-4 py-3 font-pixel text-[10px] rounded-xl transition-all uppercase tracking-widest shadow-xl active:scale-95 border border-white/10 pointer-events-auto"
          >
             Shop
          </button>

          {spareRoomAccessible && money >= 500 && (
            <button 
              onClick={() => setShowListings(true)}
              className="bg-speaker-rose hover:bg-opacity-90 text-white px-4 py-3 font-bold text-sm rounded-xl transition-all shadow-xl active:scale-95 pointer-events-auto animate-pulse border border-white/20"
            >
              Browse Upgrades
            </button>
          )}
        </div>

        <button 
          onClick={handleEndDay}
          className="bg-night-plum hover:bg-black text-warm-cream px-6 py-3 font-pixel text-[10px] rounded-xl transition-all uppercase tracking-widest shadow-xl pointer-events-auto active:scale-95 border border-white/5"
        >
           End Day
        </button>
      </div>

      {/* Bottom Room Switcher Bar */}
      {!spareRoomAccessible && catsUnlocked && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 flex items-center gap-2 shadow-2xl">
          <button 
            onClick={() => setActiveRoom('DOG')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-pixel text-[10px] uppercase tracking-wider transition-all ${
              activeRoom === 'DOG' 
                ? 'bg-warm-cream text-night-plum shadow-lg scale-105 font-bold' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Dog size={16} />
            <span>Dogs</span>
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono ${
              activeRoom === 'DOG' ? 'bg-night-plum/10 text-night-plum font-bold' : 'bg-white/15 text-white'
            }`}>
              {dogsCount}/{shelterCapacity}
            </span>
          </button>

          <button 
            onClick={() => setActiveRoom('CAT')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-pixel text-[10px] uppercase tracking-wider transition-all ${
              activeRoom === 'CAT' 
                ? 'bg-warm-cream text-night-plum shadow-lg scale-105 font-bold' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Cat size={16} />
            <span>Cats</span>
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono ${
              activeRoom === 'CAT' ? 'bg-night-plum/10 text-night-plum font-bold' : 'bg-white/15 text-white'
            }`}>
              {catsCount}/{catCapacity}
            </span>
          </button>
        </div>
      )}

      {showListings && (
        <ShelterListings 
          onClose={() => setShowListings(false)} 
          onPurchaseComplete={() => {
            setShowListings(false);
            useGameStore.getState().setPhase6State('shelter_purchase');
          }} 
        />
      )}
    </div>
  );
}


