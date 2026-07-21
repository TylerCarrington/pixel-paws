import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';

// We import the background image we just moved
import kitchenBg from '../assets/images/backgrounds/kitchen.png';

interface BakingTreatsProps {
  pet: Animal;
  onComplete: () => void;
}

const INGREDIENTS = ['Flour', 'Egg', 'Honey'];

export default function BakingTreatsActivity({ pet, onComplete }: BakingTreatsProps) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [batchCount, setBatchCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  // Generate sequence
  const startBatch = () => {
    const newSeq = Array.from({ length: 3 + Math.floor(batchCount / 2) }, () => 
      INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)]
    );
    setSequence(newSeq);
    setPlayerInput([]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (batchCount === 0 && !isPlaying && !showResult) {
      startBatch();
    }
  }, [batchCount, isPlaying, showResult]);

  const handleIngredientClick = (ing: string) => {
    if (!isPlaying) return;

    const newPlayerInput = [...playerInput, ing];
    setPlayerInput(newPlayerInput);

    const isCorrect = newPlayerInput.every((val, i) => val === sequence[i]);

    if (!isCorrect) {
      // Failed sequence
      setIsPlaying(false);
      setTimeout(() => startBatch(), 1000); // Retry batch
      return;
    }

    if (newPlayerInput.length === sequence.length) {
      // Completed batch
      setIsPlaying(false);
      const nextBatchCount = batchCount + 1;
      
      if (nextBatchCount >= 5) {
        // Complete activity
        setBatchCount(nextBatchCount);
        setShowResult(true);
      } else {
        setBatchCount(nextBatchCount);
        setTimeout(() => startBatch(), 1000);
      }
    }
  };

  const handleFinish = () => {
    addXP(pet.id, 80);
    markActivityDone(pet.id, 'bakingTreats');
    onComplete();
  };

  const finalXP = 80 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${kitchenBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-xl w-full text-center border-4 border-amber-glow">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Baking Treats</h2>
        
        {!showResult ? (
          <>
            <div className="mb-6 flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 rounded-full border-2 ${
                    i < batchCount ? 'bg-amber-glow border-amber-500' : 'bg-transparent border-stone-grey/30'
                  }`}
                />
              ))}
            </div>

            <p className="text-stone-grey text-sm mb-8">
              {isPlaying 
                ? "Repeat the sequence to bake!" 
                : batchCount < 5 ? "Watch the recipe..." : "Done!"}
            </p>

            <div className="flex gap-4 justify-center mb-8 h-16">
              {sequence.map((ing, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: isPlaying || i < playerInput.length ? 1 : 0.4, 
                    scale: 1,
                    y: isPlaying && i === playerInput.length ? -10 : 0
                  }}
                  className={`w-16 h-16 rounded flex items-center justify-center font-game text-xl bg-white border border-stone-grey/20 transition-all ${
                    playerInput[i] === ing ? 'bg-muted-sage/20 border-muted-sage text-mossy-green' : 'text-night-plum'
                  }`}
                >
                  {ing === 'Flour' ? '🌾' : ing === 'Egg' ? '🥚' : '🍯'}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              {INGREDIENTS.map(ing => (
                <button
                  key={ing}
                  disabled={!isPlaying}
                  onClick={() => handleIngredientClick(ing)}
                  className="w-24 h-24 bg-white border-2 border-warm-brown/20 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-warm-brown/10 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all font-game text-night-plum"
                >
                  <span className="text-3xl">
                    {ing === 'Flour' ? '🌾' : ing === 'Egg' ? '🥚' : '🍯'}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest">{ing}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">🍪</span>
            <p className="text-lg text-night-plum mb-8">Delicious! {pet.name || 'Your pet'} loves them!</p>
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
