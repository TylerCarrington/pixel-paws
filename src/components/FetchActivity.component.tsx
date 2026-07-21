import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal, Species } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc, getSpriteKeyForBreed } from '../logic/animalAssets.logic';

import bedroomBg from '../assets/images/backgrounds/house-interior.png';

interface FetchProps {
  pet: Animal;
  onComplete: () => void;
}

const OBSTACLES = [
  { id: 'lamp', x: '25%', y: '40%', w: '40px', h: '80px', emoji: '💡' },
  { id: 'chair', x: '70%', y: '60%', w: '60px', h: '60px', emoji: '🪑' },
];

export default function FetchActivity({ pet, onComplete }: FetchProps) {
  const [successCount, setSuccessCount] = useState(0);
  const [toyPos, setToyPos] = useState({ x: '50%', y: '85%' });
  const [isThrowing, setIsThrowing] = useState(false);
  const [isConfused, setIsConfused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const spriteKey = getSpriteKeyForBreed(pet.breed);
  const spriteSrc = getAnimalSpriteSrc(pet.species, spriteKey);

  const handleThrow = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isThrowing || isConfused || showResult) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsThrowing(true);
    setToyPos({ x: `${x}%`, y: `${y}%` });

    // Check collision with obstacles
    const hitObstacle = OBSTACLES.find(obs => {
        const obsX = parseFloat(obs.x);
        const obsY = parseFloat(obs.y);
        return Math.abs(x - obsX) < 10 && Math.abs(y - obsY) < 10;
    });

    if (hitObstacle) {
      setTimeout(() => {
        setIsConfused(true);
        setTimeout(() => {
            setIsConfused(false);
            setIsThrowing(false);
            setToyPos({ x: '50%', y: '85%' });
        }, 2000);
      }, 500);
    } else {
      setTimeout(() => {
        setSuccessCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setShowResult(true);
            }
            return next;
        });
        setTimeout(() => {
            setIsThrowing(false);
            setToyPos({ x: '50%', y: '85%' });
        }, 1000);
      }, 800);
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 100);
    markActivityDone(pet.id, 'fetch');
    onComplete();
  };

  const finalXP = 100 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${bedroomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl w-full text-center border-4 border-amber-glow relative">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Fetch</h2>
        
        {!showResult ? (
          <>
            <div className="mb-6 flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < successCount ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/30'
                  }`}
                />
              ))}
            </div>

            <p className="text-stone-grey text-sm mb-4">
              {isConfused ? "Oops! Hit furniture! " + (pet.name || 'Your pet') + " is confused!" : "Tap to throw the squeaky toy! Avoid the furniture."}
            </p>

            <div 
                className="relative w-full h-[400px] bg-stone-grey/5 rounded-lg border-2 border-dashed border-stone-grey/20 mb-4 cursor-crosshair"
                onClick={handleThrow}
            >
              {OBSTACLES.map(obs => (
                <div 
                    key={obs.id}
                    style={{ left: obs.x, top: obs.y, width: obs.w, height: obs.h }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-4xl"
                >
                    {obs.emoji}
                </div>
              ))}

              <motion.div
                animate={{ left: toyPos.x, top: toyPos.y }}
                transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
              >
                <span className="text-3xl">🦴</span>
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                 <img 
                    src={spriteSrc}
                    onError={(e) => { e.currentTarget.src = pet.species === Species.CAT ? './src/assets/images/animals/cats/calico-cat.png' : './src/assets/images/animals/dogs/husky.png'; }}
                    className={`w-24 h-24 object-contain pixelated transition-all ${isConfused ? 'animate-bounce grayscale' : ''}`}
                    alt="Pet"
                 />
                 {isConfused && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">❓</span>}
              </div>
            </div>
            
            <p className="text-[10px] text-stone-grey italic">Don't hit the lamp or the chair!</p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">🎾</span>
            <p className="text-lg text-night-plum mb-8">What a catch! {pet.name || 'Your pet'} is tired but happy.</p>
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
