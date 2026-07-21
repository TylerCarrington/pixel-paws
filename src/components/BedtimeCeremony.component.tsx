import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';
import dogHouseBg from '../assets/images/backgrounds/dog-house-interior.png';
import bedroomBg from '../assets/images/backgrounds/house-interior.png';
import familyRoomBg from '../assets/images/backgrounds/family-room.png';
import { DECORATIONS } from '../constants/decorations.constants';

interface BedtimeCeremonyProps {
  pets: Animal[];
  onComplete: () => void;
}

type Step = 'choice' | 'manual_interaction' | 'skip_fade' | 'sleeping' | 'xp_notif';

export default function BedtimeCeremony({ pets, onComplete }: BedtimeCeremonyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<Step>('choice');
  const [manualSubStep, setManualSubStep] = useState<'intro' | 'walk' | 'waiting' | 'tucked'>('intro');
  
  const addXP = useGameStore(state => state.addXP);
  const saveDecoration = useGameStore(state => state.saveDecoration);
  const allDecorations = useGameStore(state => state.petHouseDecorations);
  
  // Provide dependencies
  useEffect(() => {
    if (pets.length === 0) {
      onComplete();
    }
  }, [pets, onComplete]);

  const currentPet = pets[currentIndex];

  useEffect(() => {
    if (currentPet) {
      const decos = allDecorations[currentPet.id] || {};
      const hasBed = Object.values(decos).some(d => d.itemKey === 'PET_BED');
      if (!hasBed) {
        saveDecoration(currentPet.id, 'default_bed', 'PET_BED', 20, 80);
      }
    }
  }, [currentPet, allDecorations, saveDecoration]);
  
  const petHouseDecorations = currentPet ? allDecorations[currentPet.id] || {} : {};
  const bedDecoration = Object.values(petHouseDecorations).find(d => d.itemKey === 'PET_BED');
  const bedX = bedDecoration ? bedDecoration.x : 20;
  const bedY = bedDecoration ? bedDecoration.y : 80;

  const handleChoice = (choice: 'manual' | 'skip') => {
    if (choice === 'skip') {
      setStep('skip_fade');
      setTimeout(nextPet, 1000);
    } else {
      setStep('manual_interaction');
      setManualSubStep('intro');
    }
  };

  const nextPet = () => {
    if (currentIndex < pets.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStep('choice');
      setManualSubStep('intro');
    } else {
      setStep('sleeping');
      setTimeout(onComplete, 2000);
    }
  };

  const handleBedTap = () => {
    if (manualSubStep !== 'intro') return;
    setManualSubStep('walk');
    setTimeout(() => {
      setManualSubStep('waiting');
    }, 1500);
  };

  const handlePetTap = () => {
    if (manualSubStep !== 'waiting') return;
    setManualSubStep('tucked');
    
    // Award XP
    if (currentPet) {
      addXP(currentPet.id, 50);
    }

    setTimeout(() => {
      setStep('xp_notif');
      setTimeout(nextPet, 2000);
    }, 1000);
  };

  const finalXP = currentPet ? 50 + (currentPet.hiddenBonuses?.activity || 0) : 50;

  if (!currentPet) return null;

  const breed = currentPet.species === 'CAT' 
    ? STARTER_CATS.find(c => c.id === currentPet.breed)
    : STARTER_DOGS.find(d => d.id === currentPet.breed);

  const getBackground = () => {
    switch (currentPet.homeLocation) {
      case 'bedroom': return bedroomBg;
      case 'familyRoom': return familyRoomBg;
      default: return dogHouseBg;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'choice' && (
          <motion.div 
            key="choice"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center text-center max-w-md z-10 px-8"
          >
            <h2 className="text-xl font-game text-warm-cream uppercase tracking-[0.2em] mb-4">
              Time to tuck in {currentPet.name}
            </h2>
            <p className="text-[10px] text-soft-lilac uppercase tracking-widest mb-12 leading-relaxed">
              Will you help them get settled for the night?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => handleChoice('manual')}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-3xl transition-all group active:scale-95"
              >
                <span className="block text-amber-glow font-game text-xs mb-2 group-hover:scale-110 transition-transform">Tuck In Manually</span>
                <span className="block text-[8px] text-warm-cream/60 uppercase tracking-widest">+50 XP Bonus</span>
              </button>

              <button
                onClick={() => handleChoice('skip')}
                className="flex-1 bg-night-plum border border-white/5 p-6 rounded-3xl hover:bg-black/40 transition-all group active:scale-95"
              >
                <span className="block text-soft-lilac font-game text-xs mb-2 group-hover:scale-110 transition-transform">Skip Ritual</span>
                <span className="block text-[8px] text-stone-grey uppercase tracking-widest">No XP gained</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'manual_interaction' && (
          <motion.div 
            key="interaction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Bedroom/House Interior Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getBackground()})` }}
            />
            {/* Interaction Layer */}
            <div className="relative w-full h-full p-8 flex items-center justify-center">
              <div className="relative w-full max-w-5xl aspect-[16/10]">
                
                {/* Render Placed Decorations */}
                {Object.entries(petHouseDecorations).map(([instanceId, data]) => {
                  const item = DECORATIONS[data.itemKey];
                  if (!item) return null;
                  const isBed = data.itemKey === 'PET_BED';

                  return (
                    <div
                      key={instanceId}
                      className={`absolute z-10 ${isBed && manualSubStep === 'intro' ? 'cursor-pointer hover:scale-105' : ''}`}
                      style={{ 
                        left: `${data.x}%`, 
                        top: `${data.y}%`,
                        transform: 'translate(-50%, -50%)' // Fix translateX/translateY
                      }}
                      onClick={() => {
                        if (isBed) handleBedTap();
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: item.width * 2, height: item.height * 2 }} 
                        className="drop-shadow-lg pointer-events-none"
                      />
                      {isBed && manualSubStep === 'intro' && (
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-lg whitespace-nowrap z-50 pointer-events-none"
                        >
                          <span className="text-[8px] font-bold text-night-plum uppercase tracking-tighter">Tap Bed</span>
                        </motion.div>
                      )}
                    </div>
                  );
                })}

                {/* The Pet */}
                <motion.div 
                  className="absolute z-20"
                  initial={{ 
                    left: '50%',
                    top: '60%',
                    x: '-50%',
                    y: '-50%'
                  }}
                  animate={{ 
                    left: manualSubStep === 'intro' ? '50%' : `${bedX}%`,
                    top: manualSubStep === 'intro' ? '60%' : `${bedY - 5}%`,
                    x: '-50%',
                    y: '-50%'
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <div 
                    className={`relative group ${manualSubStep === 'waiting' ? 'cursor-pointer' : ''}`}
                    onClick={handlePetTap}
                  >
                    <AnimalSprite 
                      species={currentPet.species}
                      spriteKey={breed?.spriteKey || 'dog_husky'} 
                      size={140} 
                      animation={manualSubStep === 'walk' ? 'happy' : 'idle'} 
                    />

                    {manualSubStep === 'waiting' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-lg whitespace-nowrap"
                      >
                        <span className="text-[8px] font-bold text-night-plum uppercase tracking-tighter">Tuck in {currentPet.name}</span>
                        <div className="flex justify-center gap-1 mt-1">
                          <span className="text-xs">👋</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                
                {/* Blanket Overlay - Rendered AFTER the pet so it overlaps */}
                <AnimatePresence>
                  {manualSubStep === 'tucked' && (
                    <motion.div 
                      key="blanket"
                      initial={{ opacity: 0, x: '-50%', y: '10%' }}
                      animate={{ opacity: 1, x: '-50%', y: '-35%' }}
                      className="absolute z-30 pointer-events-none flex flex-col items-center justify-end"
                      style={{ 
                        left: `${bedX}%`, 
                        top: `${bedY}%`,
                        width: '140px',
                        height: '140px'
                      }}
                    >
                      <div className="w-[120%] h-[70%] bg-soft-lilac rounded-t-[40px] shadow-[0_-10px_20px_rgba(0,0,0,0.3)] mb-2" />
                      <span className="absolute -top-10 right-0 text-4xl animate-bounce">💤</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Darken gradient for bedtime vibe */}
            <div className="absolute inset-0 bg-gradient-to-t from-night-plum/40 via-transparent to-night-plum/60 pointer-events-none" />
          </motion.div>
        )}

        {step === 'xp_notif' && (
          <motion.div 
            key="xp_notif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center z-20"
          >
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-full mb-6 border border-white/20 shadow-2xl">
               <span className="text-4xl">🌟</span>
            </div>
            <h3 className="text-2xl font-game text-amber-glow uppercase tracking-[0.2em] mb-2">+{finalXP} XP</h3>
            <p className="text-[10px] text-warm-cream/60 uppercase tracking-widest">Bond strengthened with {currentPet.name}</p>
          </motion.div>
        )}

        {step === 'skip_fade' && (
          <motion.div 
            key="skip"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            className="absolute inset-0 bg-night-plum"
          />
        )}

        {step === 'sleeping' && (
          <motion.div 
            key="sleeping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl mb-8 animate-pulse text-amber-glow/60">✨🌙✨</span>
            <h2 className="text-xl font-game text-soft-lilac uppercase tracking-[0.3em]">Good Night</h2>
            <p className="text-[8px] text-stone-grey mt-4 uppercase tracking-[0.4em]">Advancing to next morning...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {step !== 'sleeping' && (
        <div className="absolute bottom-12 text-[8px] text-stone-grey/60 uppercase tracking-[0.4em] z-10">
          Bedtime Ceremony • {currentIndex + 1} / {pets.length}
        </div>
      )}
    </div>
  );
}
