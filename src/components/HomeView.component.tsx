import React, { useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import OutfitSelector from './OutfitSelector.component';
import RoomGrid from './RoomGrid.component';
import WalkScene from './WalkScene.component';
import BedtimeCeremony from './BedtimeCeremony.component';
import AvatarPlaceholder from './AvatarPlaceholder.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

type HomeTab = 'pets' | 'walk' | 'room';

export default function HomeView() {
  const ownedPets = useGameStore(state => state.ownedPets);
  const tuckIn = useGameStore(state => state.tuckIn);
  const petOutfits = useGameStore(state => state.petOutfits);
  
  const [activeTab, setActiveTab] = useState<HomeTab>('pets');
  const [selectedPet, setSelectedPet] = useState<Animal | null>(ownedPets[0] || null);
  const [interactionText, setInteractionText] = useState<string>('Home Sweet Home');
  const [isTuckingIn, setIsTuckingIn] = useState(false);
  const [isWalking, setIsWalking] = useState(false);

  const handleTuckInComplete = () => {
    tuckIn();
  };

  const handleInteract = (type: 'pet' | 'feed' | 'play') => {
    if (!selectedPet) return;
    
    const responses = {
      pet: [`${selectedPet.name} leans into your hand.`, `A happy tail wag!`, `${selectedPet.name} purrs softly.`],
      feed: [`Munch munch...`, `Delicious!`, `${selectedPet.name} looks satisfied.`],
      play: [`Catch!`, `Zoomies!`, `${selectedPet.name} is having a blast!`]
    };
    
    const randomResponse = responses[type][Math.floor(Math.random() * responses[type].length)];
    setInteractionText(randomResponse);
  };

  const tabs: { id: HomeTab; label: string; icon: string }[] = [
    { id: 'pets', label: 'My Pets', icon: '🐾' },
    { id: 'walk', label: 'Go Walk', icon: '🌳' },
    { id: 'room', label: 'Customize', icon: '🏠' },
  ];

  return (
    <div className="flex flex-col h-full bg-night-plum font-pixel overflow-hidden relative">
      {isTuckingIn && (
        <BedtimeCeremony pets={ownedPets} onComplete={handleTuckInComplete} />
      )}

      {isWalking && <WalkScene onComplete={() => setIsWalking(false)} />}

      <header className="p-8 pb-4 flex justify-between items-center bg-night-plum border-b border-soft-lilac/30">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-game text-soft-lilac uppercase tracking-tighter">Your Home</h1>
            <p className="text-[10px] text-muted-sage uppercase tracking-widest mt-1">Evening relaxation</p>
          </div>
          
          <nav className="flex gap-2 bg-night-plum p-1 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-lg text-[8px] uppercase tracking-widest transition-all
                  ${activeTab === tab.id ? 'bg-soft-lilac text-night-plum shadow-[0_0_15px_rgba(200,168,216,0.3)]' : 'text-soft-lilac hover:text-warm-cream'}
                `}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button 
           onClick={() => setIsTuckingIn(true)}
           className="bg-soft-rose hover:bg-blossom-pink text-warm-cream font-game text-[10px] py-4 px-8 rounded-lg shadow-[0_4px_12px_rgba(180,120,100,0.15)] transition-all active:scale-95 uppercase tracking-widest"
        >
          Tuck In Animals
        </button>
      </header>

      <main className="flex-1 p-8 overflow-hidden">
        {activeTab === 'pets' && (
          <div className="h-full flex flex-col md:flex-row gap-8">
            {/* Pets Selection */}
            <div className="w-full md:w-48 overflow-y-auto pr-2 flex md:flex-col gap-4">
              {ownedPets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`
                     p-4 rounded-xl border transition-all flex flex-col items-center flex-shrink-0
                     ${selectedPet?.id === pet.id ? 'bg-soft-lilac/20 border-soft-lilac shadow-[0_0_15px_rgba(200,168,216,0.2)]' : 'bg-night-plum border-stone-grey/20 opacity-60 hover:opacity-100'}
                  `}
                >
                   <div className="mb-2 scale-75 origin-bottom">
                     <AvatarPlaceholder spriteKey={STARTER_DOGS.find(d => d.id === pet.breed)?.spriteKey || pet.breed} />
                   </div>
                   <span className="text-[8px] text-warm-cream uppercase tracking-widest">{pet.name}</span>
                   {petOutfits[pet.id] && <span className="text-[6px] text-amber-glow mt-1 uppercase">Dressed</span>}
                </button>
              ))}
            </div>

            {/* Interaction Area */}
            <div className="flex-1 bg-night-plum border border-soft-lilac/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-radial from-soft-lilac/10 to-transparent pointer-events-none" />
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {selectedPet ? (
                    <motion.div 
                      key={selectedPet.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-8 drop-shadow-2xl relative transform scale-150">
                        <AvatarPlaceholder spriteKey={STARTER_DOGS.find(d => d.id === selectedPet.breed)?.spriteKey || selectedPet.breed} />
                        {petOutfits[selectedPet.id] && (
                           <span className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</span>
                        )}
                      </div>
                      
                      <h3 className="text-lg text-warm-cream font-game uppercase mb-2 tracking-widest">{selectedPet.name}</h3>
                      <div className="text-[10px] text-muted-sage uppercase tracking-widest mb-8">{selectedPet.breed || 'Unknown Breed'}</div>
                      
                      <div className="h-12 flex items-center justify-center mb-8">
                        <motion.p 
                          key={interactionText}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-soft-lilac uppercase tracking-widest italic"
                        >
                          {interactionText}
                        </motion.p>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleInteract('pet')}
                          className="bg-night-plum hover:bg-warm-brown text-warm-cream text-[8px] px-6 py-3 rounded-full uppercase tracking-widest border border-stone-grey/20 active:scale-95"
                        >
                          Pet
                        </button>
                        <button 
                          onClick={() => handleInteract('feed')}
                          className="bg-night-plum hover:bg-warm-brown text-warm-cream text-[8px] px-6 py-3 rounded-full uppercase tracking-widest border border-stone-grey/20 active:scale-95"
                        >
                          Feed
                        </button>
                        <button 
                          onClick={() => handleInteract('play')}
                          className="bg-night-plum hover:bg-warm-brown text-warm-cream text-[8px] px-6 py-3 rounded-full uppercase tracking-widest border border-stone-grey/20 active:scale-95"
                        >
                          Play
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-stone-grey text-[10px] uppercase">No family pets yet</div>
                  )}
                </AnimatePresence>
              </div>

              {selectedPet && (
                <div className="w-full md:w-72">
                  <OutfitSelector pet={selectedPet} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'walk' && (
          <div className="h-full flex flex-col items-center justify-center bg-night-plum rounded-3xl border border-soft-lilac/20 p-12 text-center">
             <span className="text-6xl mb-8">🌳</span>
             <h2 className="text-2xl font-game text-soft-lilac uppercase tracking-widest mb-4">Evening Walk</h2>
             <p className="text-muted-sage text-[10px] uppercase tracking-[0.2em] max-w-sm mb-12 leading-relaxed">
               Take your companions for a sunset stroll. You might even find some treats or treasures along the way!
             </p>
             <button 
               onClick={() => setIsWalking(true)}
               className="bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[12px] py-6 px-16 rounded-2xl shadow-[0_4px_12px_rgba(122,184,122,0.4)] transition-all active:scale-95 uppercase tracking-widest"
             >
               Start Walk
             </button>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="h-full bg-night-plum rounded-3xl border border-soft-lilac/20 p-8 overflow-hidden">
            <RoomGrid />
          </div>
        )}
      </main>
    </div>
  );
}
