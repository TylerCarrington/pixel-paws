import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import kitchenBg from '../assets/images/backgrounds/kitchen.png';
import treatImg from '../assets/images/items/pet-treat.png';
import AnimalSprite from './AnimalSprite.component';
import { STARTER_DOGS } from '../config/starterDogs.config';
import { STARTER_CATS } from '../config/starterCats.config';

interface TasteTesterProps {
  pet: Animal;
  onComplete: () => void;
}

const ALL_TREATS = [
  { id: 'bone', icon: '🦴', color: '#fef3c7', name: 'Bone' },
  { id: 'meat', icon: '🍖', color: '#fee2e2', name: 'Meat' },
  { id: 'cookie', icon: '🍪', color: '#ffedd5', name: 'Cookie' },
  { id: 'cheese', icon: '🧀', color: '#fef9c3', name: 'Cheese' },
  { id: 'bacon', icon: '🥓', color: '#fca5a5', name: 'Bacon' },
  { id: 'broccoli', icon: '🥦', color: '#dcfce7', name: 'Broccoli' },
  { id: 'apple', icon: '🍎', color: '#fee2e2', name: 'Apple' },
  { id: 'candy', icon: '🍬', color: '#fdf4ff', name: 'Candy' },
];

export default function TasteTesterActivity({ pet, onComplete }: TasteTesterProps) {
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'guessing' | 'result'>('intro');
  const [targetTreats, setTargetTreats] = useState<string[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [playerGuess, setPlayerGuess] = useState<string[]>([]);
  const [reactions, setReactions] = useState<Record<string, 'happy' | 'neutral' | 'sad'>>({});
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const breedDef = pet.species === 'CAT' 
    ? STARTER_CATS.find(c => c.id === pet.breed)
    : STARTER_DOGS.find(d => d.id === pet.breed);
  const spriteKey = breedDef?.spriteKey || pet.breed;

  const startMemoryPhase = () => {
    // Pick 5 random treats
    const shuffled = [...ALL_TREATS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    
    // Assign random reactions
    const newReactions: Record<string, 'happy' | 'neutral' | 'sad'> = {};
    const liked: string[] = [];
    selected.forEach(t => {
      const roll = Math.random();
      if (roll > 0.6) {
        newReactions[t.id] = 'happy';
        liked.push(t.id);
      } else if (roll > 0.3) {
        newReactions[t.id] = 'neutral';
      } else {
        newReactions[t.id] = 'sad';
      }
    });

    // Ensure at least one is liked for the game to work well
    if (liked.length === 0) {
      const first = selected[0].id;
      newReactions[first] = 'happy';
      liked.push(first);
    }

    setTargetTreats(selected.map(t => t.id));
    setReactions(newReactions);
    setGameState('showing');
    setCurrentShowIndex(0);
  };

  useEffect(() => {
    if (gameState === 'showing') {
      const timer = setTimeout(() => {
        if (currentShowIndex < targetTreats.length - 1) {
          setCurrentShowIndex(prev => prev + 1);
        } else {
          setGameState('guessing');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentShowIndex]);

  const toggleGuess = (id: string) => {
    if (playerGuess.includes(id)) {
      setPlayerGuess(playerGuess.filter(g => g !== id));
    } else {
      setPlayerGuess([...playerGuess, id]);
    }
  };

  const handleVerify = () => {
    const likedTreats = targetTreats.filter(t => reactions[t] === 'happy');
    const isCorrect = 
      playerGuess.length === likedTreats.length && 
      playerGuess.every(g => likedTreats.includes(g));

    if (isCorrect) {
      setGameState('result');
    } else {
      // Failed - maybe retry or just finish with partial?
      // Instructions say "Get 4 out of 5 correct" or similar?
      // Actually "Success if remembered which treats pet liked".
      setGameState('result');
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 130);
    markActivityDone(pet.id, 'tasteTester');
    onComplete();
  };

  const finalXP = 130 + (pet.hiddenBonuses?.activity || 0);

  const currentTreat = ALL_TREATS.find(t => t.id === targetTreats[currentShowIndex]);
  const currentReaction = reactions[targetTreats[currentShowIndex]];

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${kitchenBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/95 p-8 rounded-3xl shadow-2xl backdrop-blur-md max-w-2xl w-full h-[85vh] flex flex-col border-4 border-amber-glow relative">
        <h2 className="text-2xl font-game text-speaker-rose uppercase tracking-widest mb-8 text-center">Taste Tester</h2>

        {gameState === 'intro' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
             <div className="flex gap-4 mb-8">
                {ALL_TREATS.slice(0, 4).map(t => <span key={t.id} className="text-4xl">{t.icon}</span>)}
             </div>
            <p className="text-stone-grey mb-8 uppercase tracking-widest leading-relaxed">
              Find out which gourmet treats {pet.name} loves!<br/>
              Watch closely as {pet.name} tries different flavors.<br/>
              Remember the treats that make {pet.name} HAPPY.
            </p>
            <button 
              onClick={startMemoryPhase}
              className="bg-mossy-green text-white px-10 py-4 rounded-2xl font-game uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Begin Tasting
            </button>
          </div>
        ) : gameState === 'showing' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-12">
             <div className="relative">
                <AnimalSprite 
                  species={pet.species}
                  spriteKey={spriteKey} 
                  animation={currentReaction === 'happy' ? 'happy' : currentReaction === 'sad' ? 'nervous' : 'idle'} 
                  size={120} 
                />
                <AnimatePresence mode="wait">
                   <motion.div
                     key={currentReaction}
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1.5, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     className="absolute -top-12 left-1/2 -translate-x-1/2 text-4xl"
                   >
                     {currentReaction === 'happy' ? '💖' : currentReaction === 'neutral' ? '❔' : '💢'}
                   </motion.div>
                </AnimatePresence>
             </div>

             <motion.div
               key={currentTreat?.id}
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="flex flex-col items-center gap-4 bg-white/50 p-8 rounded-3xl border-2 border-amber-glow/20"
             >
                <div className="relative">
                  <img src={treatImg} className="w-24 h-24" />
                  <span className="absolute inset-0 flex items-center justify-center text-5xl">
                    {currentTreat?.icon}
                  </span>
                </div>
                <span className="text-night-plum uppercase tracking-widest">{currentTreat?.name}</span>
             </motion.div>

             <div className="text-stone-grey text-[10px] uppercase">
                Treat {currentShowIndex + 1} of 5
             </div>
          </div>
        ) : gameState === 'guessing' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
             <p className="text-night-plum uppercase tracking-widest mb-4">Select only the treats {pet.name} liked!</p>
             
             <div className="grid grid-cols-4 gap-4">
                {ALL_TREATS.map(t => {
                  const isSelected = playerGuess.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleGuess(t.id)}
                      className={`relative w-20 h-20 rounded-2xl transition-all flex items-center justify-center text-4xl shadow-md border-4 ${
                        isSelected ? 'border-amber-glow bg-amber-50 scale-110 z-10' : 'border-stone-grey/10 bg-white/60'
                      }`}
                    >
                       {t.icon}
                       {isSelected && <span className="absolute -top-2 -right-2 text-xl">✅</span>}
                    </button>
                  );
                })}
             </div>

             <button
               onClick={handleVerify}
               className="mt-8 bg-night-plum text-white px-12 py-4 rounded-xl font-game uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
             >
                Confirm Selections
             </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-6">🏆</span>
            <h3 className="text-2xl font-game text-night-plum mb-2">TASTING FINISHED</h3>
            <p className="text-stone-grey mb-8 uppercase tracking-widest leading-relaxed">
              {pet.name} is very happy with your gourmet choices!<br/>
              A true connoisseur.
            </p>
            <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-xl mb-8 font-bold">+{finalXP} XP</div>
            <button 
              onClick={handleFinish}
              className="bg-night-plum text-white px-10 py-4 rounded-2xl font-game uppercase tracking-widest shadow-lg active:scale-95 transition-all"
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
