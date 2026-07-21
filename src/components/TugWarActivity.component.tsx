import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal, Species } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc, getSpriteKeyForBreed } from '../logic/animalAssets.logic';

import familyRoomBg from '../assets/images/backgrounds/family-room.png';

interface TugWarProps {
  pet: Animal;
  onComplete: () => void;
}

export default function TugWarActivity({ pet, onComplete }: TugWarProps) {
  const [tugValue, setTugValue] = useState(50); // 0 = pet wins, 100 = player wins
  const [roundsWon, setRoundsWon] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('Get ready!');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const spriteKey = getSpriteKeyForBreed(pet.breed);
  const spriteSrc = getAnimalSpriteSrc(pet.species, spriteKey);

  const startRound = () => {
    setTugValue(50);
    setIsPlaying(true);
    setMessage('TAP TO PULL!');
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Pet pulls back
    timerRef.current = setInterval(() => {
        setTugValue(prev => {
            const pullStrength = 2 + Math.random() * 3 + (currentRound * 0.5);
            const newValue = prev - pullStrength;
            
            if (newValue <= 0) {
                // Pet wins round
                endRound(false);
                return 0;
            }
            return newValue;
        });
    }, 100);
  };

  const endRound = (playerWon: boolean) => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (playerWon) {
        setRoundsWon(prev => prev + 1);
        setMessage('Round Won!');
    } else {
        setMessage('Pet Won Round!');
    }

    setTimeout(() => {
        if (currentRound < 3) {
            setCurrentRound(prev => prev + 1);
            startRound();
        } else {
            setShowResult(true);
        }
    }, 1500);
  };

  const handlePull = () => {
    if (!isPlaying) return;
    
    setTugValue(prev => {
        const newValue = prev + 8;
        if (newValue >= 100) {
            endRound(true);
            return 100;
        }
        return newValue;
    });
  };

  useEffect(() => {
    setTimeout(() => startRound(), 1000);
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFinish = () => {
    addXP(pet.id, 80);
    markActivityDone(pet.id, 'tugWar');
    onComplete();
  };

  const finalXP = 80 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${familyRoomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl w-full text-center border-4 border-amber-glow relative">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Tug of War</h2>
        
        {!showResult ? (
          <>
            <div className="mb-6 flex gap-4 justify-center items-center">
              <div className="text-[10px] uppercase text-stone-grey">Round {currentRound}/3</div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border ${
                      i < roundsWon ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className={`text-xl font-game mb-8 transition-all ${isPlaying ? 'text-speaker-rose scale-110' : 'text-stone-grey'}`}>
              {message}
            </p>

            <div className="relative w-full h-24 bg-stone-grey/10 rounded-full border-4 border-warm-brown/20 mb-12 overflow-hidden shadow-inner">
               <motion.div 
                 animate={{ left: `${tugValue}%` }}
                 className="absolute top-0 bottom-0 w-4 bg-amber-glow shadow-[0_0_15px_rgba(251,191,36,0.5)] z-20"
               />
               <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-night-plum/10 flex items-center justify-center text-[10px] uppercase opacity-40">Pet Side</div>
                  <div className="flex-1 bg-amber-glow/10 flex items-center justify-center text-[10px] uppercase opacity-40">You</div>
               </div>
               
               {/* The Rope */}
               <div className="absolute top-1/2 left-0 right-0 h-2 bg-warm-brown/40 -translate-y-1/2 border-y border-warm-brown/60" />
            </div>

            <div className="flex justify-between items-center px-10 mb-8">
                <div className="flex flex-col items-center gap-2">
                    <img 
                        src={spriteSrc}
                        onError={(e) => { e.currentTarget.src = pet.species === Species.CAT ? '/src/assets/images/animals/cats/calico-cat.png' : '/src/assets/images/animals/dogs/husky.png'; }}
                        className={`w-24 h-24 object-contain pixelated transition-transform ${isPlaying ? 'scale-x-[-1] animate-pulse' : 'scale-x-[-1]'}`}
                        alt="Pet"
                    />
                    <span className="text-[10px] text-stone-grey uppercase">{pet.name || 'Pet'}</span>
                </div>

                <div className="text-4xl">🪢</div>

                <div className="flex flex-col items-center gap-2">
                   <div className="w-24 h-24 bg-soft-rose/20 rounded-full flex items-center justify-center border-2 border-soft-rose border-dashed">
                      <span className="text-4xl">👋</span>
                   </div>
                   <span className="text-[10px] text-stone-grey uppercase">You</span>
                </div>
            </div>
            
            <button
               onClick={handlePull}
               disabled={!isPlaying}
               className="w-full max-w-sm bg-speaker-rose hover:bg-night-plum text-white font-game text-sm py-5 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] relative overflow-hidden group"
            >
               <span className="relative z-10">PULL!</span>
               <div className="absolute inset-0 bg-white/10 translate-y-full group-active:translate-y-0 transition-transform" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">{roundsWon >= 2 ? '🏆' : '😅'}</span>
            <p className="text-lg text-night-plum mb-8">
                {roundsWon >= 2 
                    ? `Victory! ${pet.name || 'Your pet'} is impressed by your strength.` 
                    : `Close game! ${pet.name || 'Your pet'} is stronger than they look!`}
            </p>
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
