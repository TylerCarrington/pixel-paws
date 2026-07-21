import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal, Species } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import { getAnimalSpriteSrc, getSpriteKeyForBreed } from '../logic/animalAssets.logic';

import familyRoomBg from '../assets/images/backgrounds/family-room.png';

interface TricksShowcaseProps {
  pet: Animal;
  onComplete: () => void;
}

const TRICKS = [
    { id: 'sit', name: 'Sit', icon: '🪑' },
    { id: 'spin', name: 'Spin', icon: '🔄' },
    { id: 'playDead', name: 'Play Dead', icon: '💤' },
    { id: 'highFive', name: 'High-Five', icon: '✋' }
];

export default function TricksShowcaseActivity({ pet, onComplete }: TricksShowcaseProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'performing'>('idle');
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const spriteKey = getSpriteKeyForBreed(pet.breed);
  const spriteSrc = getAnimalSpriteSrc(pet.species, spriteKey);

  const startShowcase = () => {
    setIsPlaying(true);
    generateNextStep([]);
  };

  const generateNextStep = (currentSeq: string[]) => {
    const nextTrick = TRICKS[Math.floor(Math.random() * TRICKS.length)].id;
    const newSeq = [...currentSeq, nextTrick];
    setSequence(newSeq);
    setPlayerInput([]);
    showSequence(newSeq);
  };

  const showSequence = async (seq: string[]) => {
    setIsShowingSequence(true);
    for (let i = 0; i < seq.length; i++) {
        setCurrentStep(i);
        await new Promise(r => setTimeout(r, 600));
    }
    setIsShowingSequence(false);
    setCurrentStep(-1);
  };

  const handleTrickClick = (trickId: string) => {
    if (isShowingSequence || !isPlaying) return;

    setAnimState('performing');
    setTimeout(() => setAnimState('idle'), 400);

    const nextInput = [...playerInput, trickId];
    setPlayerInput(nextInput);

    if (trickId !== sequence[nextInput.length - 1]) {
        // Failed
        setIsPlaying(false);
        setTimeout(() => setShowResult(true), 1000);
        return;
    }

    if (nextInput.length === sequence.length) {
        if (sequence.length >= 6) {
            // Completed 6 rounds
            setIsPlaying(false);
            setTimeout(() => setShowResult(true), 1000);
        } else {
            // Next round
            setTimeout(() => generateNextStep(sequence), 1000);
        }
    }
  };

  const handleFinish = () => {
    const finalXP = 150 + (pet.hiddenBonuses?.activity || 0);
    addXP(pet.id, 150);
    markActivityDone(pet.id, 'tricksShowcase');
    onComplete();
  };

  const finalXP = 150 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${familyRoomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl w-full text-center border-4 border-amber-glow relative">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Tricks Showcase</h2>
        
        {!showResult ? (
          <>
            <div className="mb-6 flex gap-2 justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < (sequence.length - 1) || (i === 5 && !isPlaying && sequence.length === 6) ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/30'
                  }`}
                />
              ))}
            </div>

            <p className="text-stone-grey text-sm mb-4">
              {isShowingSequence ? "Watch the routine..." : "Your turn! Repeat the tricks."}
            </p>

            <div className="relative h-64 mb-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {isShowingSequence && currentStep >= 0 && (
                        <motion.div 
                            key={currentStep}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="absolute bg-white rounded-full w-32 h-32 flex items-center justify-center border-4 border-amber-glow shadow-2xl z-20"
                        >
                            <span className="text-5xl">{TRICKS.find(t => t.id === sequence[currentStep])?.icon}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center">
                    <motion.div
                        animate={{ 
                            rotate: animState === 'performing' ? [0, 360] : 0,
                            y: animState === 'performing' ? [0, -20, 0] : 0 
                        }}
                        className="relative"
                    >
                        <img 
                            src={spriteSrc}
                            onError={(e) => { e.currentTarget.src = pet.species === Species.CAT ? '/src/assets/images/animals/cats/calico-cat.png' : '/src/assets/images/animals/dogs/husky.png'; }}
                            className="w-32 h-32 object-contain pixelated"
                            alt="Pet"
                        />
                        {animState === 'performing' && (
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl"
                            >
                                ✨
                            </motion.span>
                        )}
                    </motion.div>
                    <span className="mt-4 text-[10px] text-stone-grey uppercase tracking-widest font-bold">
                        {pet.name || 'Pet'} is ready!
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TRICKS.map(trick => (
                    <button
                        key={trick.id}
                        disabled={isShowingSequence || !isPlaying}
                        onClick={() => handleTrickClick(trick.id)}
                        className="bg-white border-b-4 border-stone-grey/20 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-amber-50 active:translate-y-1 active:border-b-0 disabled:opacity-50 transition-all"
                    >
                        <span className="text-3xl">{trick.icon}</span>
                        <span className="text-[10px] text-night-plum uppercase tracking-tighter">{trick.name}</span>
                    </button>
                ))}
            </div>
            
            {!isPlaying && !showResult && (
                <div className="absolute inset-0 bg-night-plum/60 backdrop-blur-sm z-30 flex items-center justify-center rounded-xl">
                    <button 
                        onClick={startShowcase}
                        className="bg-amber-glow text-white font-game px-12 py-6 rounded-2xl text-xl shadow-2xl"
                    >
                        START SHOWCASE
                    </button>
                </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">{sequence.length >= 6 ? '✨🐩✨' : '💫'}</span>
            <p className="text-lg text-night-plum mb-8">
                {sequence.length >= 6 
                    ? `Flawless performance! ${pet.name || 'Your pet'} is a star!` 
                    : `Routine ended at step ${playerInput.length + 1}. Good effort!`}
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
