import React, { useState, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'motion/react';
import { Animal } from '../types/animal.types';
import BedtimeCeremony from './BedtimeCeremony.component';
import AnimalSprite from './AnimalSprite.component';
import IdleAnimalSprite from './IdleAnimalSprite.component';
import OwnedPetDetailModal from './OwnedPetDetailModal.component.tsx';
import { getBreedDefinition } from '../logic/animalAssets.logic';
import ActivitySelection from './ActivitySelection.component';
import { DECORATIONS } from '../constants/decorations.constants';
import { Sparkles, Moon, Play, ShoppingBag, Home, LogOut, Users, X } from 'lucide-react';
import DecorationMode from './DecorationMode.component';
import { Species } from '../types/animal.types';

// Activity Components
import BakingTreatsActivity from './BakingTreatsActivity.component';
import FruitCatchActivity from './FruitCatchActivity.component';
import CookingTogetherActivity from './CookingTogetherActivity.component';
import TasteTesterActivity from './TasteTesterActivity.component';
import HideSeekActivity from './HideSeekActivity.component';
import FetchActivity from './FetchActivity.component';
import PuzzleToyActivity from './PuzzleToyActivity.component';
import TugWarActivity from './TugWarActivity.component';
import ObstacleCourseActivity from './ObstacleCourseActivity.component';
import TricksShowcaseActivity from './TricksShowcaseActivity.component';

// Background asset
import dogHouseBg from '../assets/images/backgrounds/dog-house-interior.png';
import bedroomBg from '../assets/images/backgrounds/house-interior.png';
import familyRoomBg from '../assets/images/backgrounds/family-room.png';
import ItemCard from './PetCard.component'; // We might use PetCard for selection

export default function HomeView() {
  const ownedPets = useGameStore(state => state.ownedPets);
  const swapOwnedPetLocations = useGameStore(state => state.swapOwnedPetLocations);
  const homeDogCapacity = useGameStore(state => state.homeDogCapacity);
  const homeCatCapacity = useGameStore(state => state.homeCatCapacity);
  const tuckIn = useGameStore(state => state.tuckIn);
  const petHouseDecorations = useGameStore(state => state.petHouseDecorations);
  const saveDecoration = useGameStore(state => state.saveDecoration);
  const money = useGameStore(state => state.money);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  const [currentRoom, setCurrentRoom] = useState<'bedroom' | 'dogHouse' | 'familyRoom'>('bedroom');
  const [showManagePets, setShowManagePets] = useState(false);
  const [selectedOwnedPet, setSelectedOwnedPet] = useState<Animal | null>(null);

  const isDogHouseUnlocked = homeDogCapacity > 1;
  const isLivingRoomUnlocked = homeCatCapacity > 0;
  const showRoomSwitcher = isDogHouseUnlocked || isLivingRoomUnlocked;

  const [petToAdoptOut, setPetToAdoptOut] = useState<string | null>(null);
  const putPetUpForAdoption = useGameStore(state => state.putPetUpForAdoption);

  const selectedPet = ownedPets.find(p => p.homeLocation === currentRoom) || null;

  React.useEffect(() => {
    if (currentRoom === 'dogHouse' && !isDogHouseUnlocked) setCurrentRoom('bedroom');
    if (currentRoom === 'familyRoom' && !isLivingRoomUnlocked) setCurrentRoom('bedroom');
  }, [currentRoom, isDogHouseUnlocked, isLivingRoomUnlocked]);

  const breed = selectedPet ? getBreedDefinition(selectedPet.breed) : null;

  React.useEffect(() => {
    if (selectedPet) {
      const decos = petHouseDecorations[selectedPet.id] || {};
      const hasBed = Object.values(decos).some(d => d.itemKey === 'PET_BED');
      if (!hasBed) {
        saveDecoration(selectedPet.id, 'default_bed', 'PET_BED', 20, 80);
      }
    }
  }, [selectedPet, petHouseDecorations, saveDecoration]);

  const [isTuckingIn, setIsTuckingIn] = useState(false);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [showActivitySelection, setShowActivitySelection] = useState(false);
  const [isDecorating, setIsDecorating] = useState(false);

  const handleTuckInComplete = () => {
    tuckIn();
    setIsTuckingIn(false);
  };

  const getBackground = () => {
    switch (currentRoom) {
      case 'bedroom': return bedroomBg;
      case 'familyRoom': return familyRoomBg;
      default: return dogHouseBg;
    }
  };

  return (
    <div className="flex flex-col h-full bg-night-plum font-pixel overflow-hidden relative">
      <AnimatePresence>
        {selectedPet && activeActivity === 'bakingTreats' && (
          <BakingTreatsActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'fruitCatch' && (
          <FruitCatchActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'cookingTogether' && (
          <CookingTogetherActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'tasteTester' && (
          <TasteTesterActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'hideSeek' && (
          <HideSeekActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'fetch' && (
          <FetchActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'puzzleToy' && (
          <PuzzleToyActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'tugWar' && (
          <TugWarActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'obstacleCourse' && (
          <ObstacleCourseActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
        {selectedPet && activeActivity === 'tricksShowcase' && (
          <TricksShowcaseActivity pet={selectedPet} onComplete={() => setActiveActivity(null)} />
        )}
      </AnimatePresence>

      {isTuckingIn && (
        <BedtimeCeremony pets={ownedPets} onComplete={handleTuckInComplete} />
      )}

      {selectedPet && isDecorating && (
        <DecorationMode pet={selectedPet} onClose={() => setIsDecorating(false)} />
      )}

      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 flex justify-between items-start pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <div className="bg-black/20 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center mr-2">
             <span className="text-[10px] text-warm-cream/60 uppercase tracking-widest leading-none mb-1">Funds</span>
             <span className="text-amber-glow font-pixel text-sm drop-shadow-sm">${money}</span>
          </div>

          <button 
             onClick={() => setPhase6State('home_shop')}
             className="bg-white/80 backdrop-blur-md hover:bg-white text-night-plum p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            <span className="text-[9px] uppercase tracking-widest font-bold">Shop</span>
          </button>

          <button 
             onClick={() => setShowActivitySelection(true)}
             disabled={!selectedPet}
             className={`bg-white/80 backdrop-blur-md hover:bg-white text-night-plum p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 ${!selectedPet && 'opacity-50 pointer-events-none'}`}
          >
            <Play size={20} className="fill-night-plum" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Activities</span>
          </button>
          <button 
             onClick={() => setIsDecorating(true)}
             disabled={!selectedPet}
             className={`bg-white/80 backdrop-blur-md hover:bg-white text-night-plum p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 ${!selectedPet && 'opacity-50 pointer-events-none'}`}
          >
            <Sparkles size={20} />
            <span className="text-[9px] uppercase tracking-widest font-bold">Decorate</span>
          </button>

          <button 
             onClick={() => setShowManagePets(true)}
             className="bg-white/80 backdrop-blur-md hover:bg-white text-night-plum p-3 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Users size={20} />
            <span className="text-[9px] uppercase tracking-widest font-bold">Pets</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto">
          <button 
             onClick={() => setIsTuckingIn(true)}
             className="bg-night-plum/80 backdrop-blur-md hover:bg-night-plum text-warm-cream p-3 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Moon size={20} />
            <span className="text-[9px] uppercase tracking-widest font-bold">Bedtime</span>
          </button>
        </div>
      </div>

      {/* Room Navigation */}
      {showRoomSwitcher && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20 flex gap-2">
          <button 
             onClick={() => setCurrentRoom('bedroom')}
             className={`p-3 px-6 rounded-full transition-all text-[9px] font-bold uppercase tracking-widest ${currentRoom === 'bedroom' ? 'bg-white text-night-plum' : 'text-white/60 hover:text-white'}`}
          >
            Bedroom
          </button>
          {isLivingRoomUnlocked && (
            <button 
               onClick={() => setCurrentRoom('familyRoom')}
               className={`p-3 px-6 rounded-full transition-all text-[9px] font-bold uppercase tracking-widest ${currentRoom === 'familyRoom' ? 'bg-white text-night-plum' : 'text-white/60 hover:text-white'}`}
            >
              Living Room
            </button>
          )}
          {isDogHouseUnlocked && (
            <button 
               onClick={() => setCurrentRoom('dogHouse')}
               className={`p-3 px-6 rounded-full transition-all text-[9px] font-bold uppercase tracking-widest ${currentRoom === 'dogHouse' ? 'bg-white text-night-plum' : 'text-white/60 hover:text-white'}`}
            >
              Dog House
            </button>
          )}
        </div>
      )}

      {/* Main Scene Area */}
      <div 
        className="flex-1 relative bg-cover bg-center overflow-hidden flex items-center justify-center p-8 transition-all duration-700"
        style={{ backgroundImage: `url(${getBackground()})` }}
      >
        <div className="relative w-full max-w-5xl aspect-[16/10]">
          {/* Render Placed Decorations */}
          {selectedPet && Object.entries(petHouseDecorations[selectedPet.id] || {}).map(([instanceId, data]) => {
            const item = DECORATIONS[data.itemKey];
            if (!item) return null;
            return (
              <div
                key={instanceId}
                className="absolute z-[15]"
                style={{ 
                  left: `${data.x}%`, 
                  top: `${data.y}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <img src={item.image} alt={item.name} className="drop-shadow-lg" style={{ width: item.width * 2, height: item.height * 2 }} />
              </div>
            );
          })}

          {/* The Pet */}
          {selectedPet && (
            <motion.div 
              key={selectedPet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-[15%] left-[24%] z-20"
            >
              <div className="relative group cursor-pointer" onClick={() => setSelectedOwnedPet(selectedPet)}>
                <IdleAnimalSprite 
                  pet={selectedPet}
                  size={140} 
                />
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                  <span className="text-[10px] uppercase font-bold text-night-plum tracking-tighter">Level {selectedPet.level} {selectedPet.name}</span>
                </div>
              </div>
            </motion.div>
          )}

          {!selectedPet && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-center">
                   <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold">This room is empty</p>
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Manage Pets Modal */}
      <AnimatePresence>
        {showManagePets && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-night-plum/60 backdrop-blur-sm"
              onClick={() => setShowManagePets(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#f9f4ef] rounded-[32px] overflow-hidden shadow-2xl flex flex-col border-4 border-stone-grey/10"
            >
              <div className="p-6 bg-white flex justify-between items-center border-b border-stone-grey/10">
                <h2 className="font-pixel text-night-plum uppercase tracking-widest text-xs">Your Home Pets</h2>
                <button onClick={() => setShowManagePets(false)} className="text-stone-grey hover:text-night-plum">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                 {[
                   { id: 'bedroom', label: 'Bedroom', unlocked: true },
                   { id: 'dogHouse', label: 'Dog House', unlocked: isDogHouseUnlocked },
                   { id: 'familyRoom', label: 'Living Room', unlocked: isLivingRoomUnlocked }
                 ].filter(r => r.unlocked).map(room => {
                   const pet = ownedPets.find(p => p.homeLocation === room.id);
                   const pBreed = pet ? getBreedDefinition(pet.breed) : null;

                   return (
                     <div key={room.id} className="bg-white/50 border border-stone-grey/10 p-4 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 bg-white rounded-xl border border-stone-grey/5 flex items-center justify-center relative shadow-inner">
                           {pet ? (
                             <AnimalSprite 
                               spriteKey={pBreed?.spriteKey || 'dog_husky'} 
                               species={pet.species}
                               size={48} 
                             />
                           ) : (
                             <div className="text-[8px] text-stone-grey/40 uppercase font-bold">Empty</div>
                           )}
                         </div>
                         <div>
                           <span className="text-[10px] text-stone-grey/60 uppercase font-bold tracking-widest">{room.label}</span>
                           <h4 className="text-sm font-pixel text-night-plum">{pet?.name || '---'}</h4>
                         </div>
                       </div>

                       <div className="flex gap-2">
                         {pet && !petToAdoptOut && (
                           <>
                             <button 
                               onClick={() => {
                                 setCurrentRoom(room.id as any);
                                 setShowManagePets(false);
                               }}
                               className="bg-amber-glow text-warm-brown text-[8px] font-pixel uppercase tracking-widest px-4 py-2 rounded-lg"
                             >
                               Visit
                             </button>
                             <button 
                               onClick={() => setPetToAdoptOut(pet.id)}
                               className="bg-stone-grey/10 text-stone-grey text-[8px] font-pixel uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-soft-rose/20 hover:text-soft-rose transition-colors"
                             >
                               Adopt Out
                             </button>
                           </>
                         )}
                       </div>
                     </div>
                   );
                 })}

                 {petToAdoptOut && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-4 bg-soft-orange/10 border-2 border-soft-orange/30 rounded-2xl flex flex-col gap-3"
                   >
                     <p className="text-[9px] font-pixel text-night-plum text-center leading-relaxed">
                       ARE YOU SURE? {ownedPets.find(p => p.id === petToAdoptOut)?.name?.toUpperCase() || 'THIS PET'} WILL MOVE TO THE SHELTER AND COULD BE ADOPTED BY SOMEONE ELSE.
                     </p>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           putPetUpForAdoption(petToAdoptOut);
                           setPetToAdoptOut(null);
                         }}
                         className="flex-1 py-2 bg-soft-rose text-white font-pixel text-[8px] uppercase tracking-widest rounded-lg"
                       >
                         Yes, Move to Shelter
                       </button>
                       <button 
                         onClick={() => setPetToAdoptOut(null)}
                         className="flex-1 py-2 bg-stone-grey/10 text-stone-grey font-pixel text-[8px] uppercase tracking-widest rounded-lg"
                       >
                         Cancel
                       </button>
                     </div>
                   </motion.div>
                 )}

                 {ownedPets.length >= 2 && (
                   <div className="mt-2 p-4 bg-soft-blue/10 border border-soft-blue/20 rounded-2xl">
                     <p className="text-[9px] text-soft-blue font-bold uppercase tracking-wider mb-2 text-center underline">Swap Pets</p>
                     <div className="flex justify-between items-center gap-4">
                        <div className="flex-1 text-center">
                          <p className="text-[8px] text-stone-grey/60 uppercase">{ownedPets[0].name}</p>
                        </div>
                        <button 
                          onClick={() => swapOwnedPetLocations(ownedPets[0].id, ownedPets[1].id)}
                          className="bg-soft-blue text-white p-3 rounded-full hover:rotate-180 transition-all duration-500"
                        >
                          <Users size={16} />
                        </button>
                        <div className="flex-1 text-center">
                          <p className="text-[8px] text-stone-grey/60 uppercase">{ownedPets[1].name}</p>
                        </div>
                     </div>
                   </div>
                 )}
              </div>

              <div className="p-6 bg-stone-grey/5">
                <button 
                  onClick={() => setShowManagePets(false)}
                  className="w-full bg-night-plum text-warm-cream py-3 rounded-xl font-pixel text-[9px] uppercase tracking-widest"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activity Selection Modal */}
      <AnimatePresence>
        {selectedOwnedPet && (
          <OwnedPetDetailModal 
            pet={selectedOwnedPet} 
            onClose={() => setSelectedOwnedPet(null)}
            onPlay={() => {
              setSelectedOwnedPet(null);
              setShowActivitySelection(true);
            }}
          />
        )}
        {showActivitySelection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-night-plum/60 backdrop-blur-sm"
              onClick={() => setShowActivitySelection(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-warm-cream rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-white flex justify-between items-center border-b border-stone-grey/10">
                <h2 className="font-game text-night-plum uppercase tracking-widest text-sm">Select Activity</h2>
                <button onClick={() => setShowActivitySelection(false)} className="text-stone-grey hover:text-night-plum">
                  <Play size={20} className="rotate-90" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {selectedPet && (
                  <ActivitySelection 
                    pet={selectedPet} 
                    onPlay={(act) => {
                      setActiveActivity(act.id);
                      setShowActivitySelection(false);
                    }} 
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
