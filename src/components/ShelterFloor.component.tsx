import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { useMorningBoardStore } from '../stores/morningBoard.store';
import SpareRoomScene from './SpareRoomScene.component';
import ShelterInteriorScene from './ShelterInteriorScene.component';
import ShelterListings from './ShelterListings.component';
import ShelterTutorial from './ShelterTutorial.component';
import { ChevronDown, Dog, Cat } from 'lucide-react';

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
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
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
    <div className="flex flex-col h-full bg-[#e0d5c5]">
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
          
          {!spareRoomAccessible && catsUnlocked && (
             <div className="relative pointer-events-auto">
               <button 
                 onClick={() => setShowRoomDropdown(!showRoomDropdown)}
                 className="bg-warm-cream/90 hover:bg-white text-night-plum px-4 py-3 font-pixel text-[10px] rounded-xl transition-all uppercase tracking-widest shadow-xl active:scale-95 border border-white/40 flex items-center gap-2"
               >
                 {activeRoom === 'DOG' ? <Dog size={14}/> : <Cat size={14}/>}
                 Rooms
                 <ChevronDown size={14} className={`transition-transform ${showRoomDropdown ? 'rotate-180' : ''}`} />
               </button>
               
               {showRoomDropdown && (
                 <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-grey/20 overflow-hidden flex flex-col min-w-[140px] z-50">
                   <button 
                     onClick={() => { setActiveRoom('DOG'); setShowRoomDropdown(false); }}
                     className={`px-4 py-3 text-left font-pixel text-[10px] uppercase tracking-widest flex items-center justify-between gap-4 hover:bg-sage-green/20 ${activeRoom === 'DOG' ? 'bg-sage-green/10 text-night-plum' : 'text-stone-grey'}`}
                   >
                     <div className="flex items-center gap-2">
                       <Dog size={14}/> Dogs
                     </div>
                     <span className="opacity-60">{dogsCount}/{shelterCapacity}</span>
                   </button>
                   <button 
                     onClick={() => { setActiveRoom('CAT'); setShowRoomDropdown(false); }}
                     className={`px-4 py-3 text-left font-pixel text-[10px] uppercase tracking-widest flex items-center justify-between gap-4 hover:bg-sage-green/20 ${activeRoom === 'CAT' ? 'bg-sage-green/10 text-night-plum' : 'text-stone-grey'}`}
                   >
                     <div className="flex items-center gap-2">
                       <Cat size={14}/> Cats
                     </div>
                     <span className="opacity-60">{catsCount}/{catCapacity}</span>
                   </button>
                 </div>
               )}
             </div>
          )}

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

