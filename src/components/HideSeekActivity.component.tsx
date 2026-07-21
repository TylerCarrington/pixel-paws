import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal, Species } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc, getSpriteKeyForBreed } from '../logic/animalAssets.logic';

import bedroomBg from '../assets/images/backgrounds/house-interior.png';

interface HideSeekProps {
  pet: Animal;
  onComplete: () => void;
}

const HIDING_SPOTS = [
  { id: 'bed', name: 'Bed', x: '20%', y: '60%' },
  { id: 'dresser', name: 'Dresser', x: '75%', y: '50%' },
  { id: 'curtain', name: 'Curtain', x: '50%', y: '40%' }
];

export default function HideSeekActivity({ pet, onComplete }: HideSeekProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [hidingSpotId, setHidingSpotId] = useState<string | null>(null);
  const [foundSpotId, setFoundSpotId] = useState<string | null>(null);
  const [isFound, setIsFound] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const startRound = () => {
    const randomSpot = HIDING_SPOTS[Math.floor(Math.random() * HIDING_SPOTS.length)].id;
    setHidingSpotId(randomSpot);
    setFoundSpotId(null);
    setIsFound(false);
  };

  useEffect(() => {
    if (currentRound === 0 && !hidingSpotId) {
      startRound();
    }
  }, [currentRound, hidingSpotId]);

  const handleSpotClick = (spotId: string) => {
    if (isFound) return;
    
    setFoundSpotId(spotId);
    if (spotId === hidingSpotId) {
      setIsFound(true);
      setTimeout(() => {
        if (currentRound < 2) {
          setCurrentRound(prev => prev + 1);
          startRound();
        } else {
          setShowResult(true);
        }
      }, 1500);
    } else {
      // Wrong spot, shake maybe
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 80);
    markActivityDone(pet.id, 'hideSeek');
    onComplete();
  };

  const finalXP = 80 + (pet.hiddenBonuses?.activity || 0);

  const spriteKey = pet.breed.toLowerCase().replace(' ', ''); // Simplified

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${bedroomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl w-full text-center border-4 border-amber-glow relative">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Hide and Seek</h2>
        
        {!showResult ? (
          <>
            <div className="mb-6 flex gap-2 justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < currentRound || (i === currentRound && isFound) ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/30'
                  }`}
                />
              ))}
            </div>

            <p className="text-stone-grey text-sm mb-8">
              {isFound ? "You found them!" : "Where is your pet hiding?"}
            </p>

            <div className="relative w-full h-[300px] bg-stone-grey/5 rounded-lg border-2 border-dashed border-stone-grey/20 mb-4">
              {/* This mimics the room and interactive zones */}
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center text-4xl">
                🏠
              </div>
              
              {HIDING_SPOTS.map(spot => (
                <button
                  key={spot.id}
                  onClick={() => handleSpotClick(spot.id)}
                  style={{ left: spot.x, top: spot.y }}
                  className={`absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all ${
                    foundSpotId === spot.id 
                      ? (spot.id === hidingSpotId ? 'bg-accent-peach/40 border-accent-peach border-2 scale-110' : 'bg-stone-grey/20 border-stone-grey/40 border-2') 
                      : 'hover:bg-warm-brown/10'
                  }`}
                >
                  <span className="text-2xl">
                    {spot.id === 'bed' ? '🛏️' : spot.id === 'dresser' ? '🪑' : 'カーテン'}
                  </span>
                  
                  <AnimatePresence>
                    {isFound && spot.id === hidingSpotId && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, y: 0 }}
                        animate={{ scale: 1, opacity: 1, y: -40 }}
                        className="absolute"
                      >
                         <img 
                            src={`./src/assets/images/animals/dogs/${pet.breed.toLowerCase()}.png`}
                            onError={(e) => { e.currentTarget.src = './src/assets/images/animals/dogs/husky.png'; }}
                            className="w-16 h-16 object-contain pixelated"
                            alt="Pet"
                         />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
            
            <p className="text-[10px] text-stone-grey italic">Tap where you think they are hiding!</p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">🎉</span>
            <p className="text-lg text-night-plum mb-8">Great job! {pet.name || 'Your pet'} was having so much fun!</p>
            <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-xl mb-8 font-bold">+{finalXP} XP</div>
            
            <button
              onClick={handleFinish}
              className="bg-amber-glow hover:bg-amber-500 text-white font-game text-[12px] px-8 py-4 rounded-xl shadow-md active:scale-95 transition-all uppercase tracking-widest"
            >
              Finish
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-night-plum/60 hover:bg-night-plum text-white rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-all font-pixel text-xl"
      >
        ×
      </button>
    </div>
  );
}
