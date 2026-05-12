import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/game.store';
import { getWalkDrop } from '../logic/walkItemDrop.logic';
import { WalkItem } from '../config/walkItems.config';

interface WalkSceneProps {
  onComplete: () => void;
}

export default function WalkScene({ onComplete }: WalkSceneProps) {
  const ownedPets = useGameStore(state => state.ownedPets);
  const addInventoryItem = useGameStore(state => state.addInventoryItem);
  const [distance, setDistance] = useState(0);
  const [findings, setFindings] = useState<WalkItem[]>([]);
  const [isReturning, setIsReturning] = useState(false);
  const [showFinding, setShowFinding] = useState<WalkItem | null>(null);

  const totalDistance = 100;

  useEffect(() => {
    if (isReturning) return;
    
    const interval = setInterval(() => {
      setDistance(prev => {
        const next = prev + 1;
        
        // Chance to find something
        if (Math.random() < 0.05 && next < totalDistance) {
          const drop = getWalkDrop(Date.now());
          if (drop) {
            setFindings(f => [...f, drop]);
            setShowFinding(drop);
            setTimeout(() => setShowFinding(null), 1500);
          }
        }
        
        if (next >= totalDistance) {
          clearInterval(interval);
          setTimeout(() => setIsReturning(true), 1000);
          return totalDistance;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isReturning]);

  const handleFinish = () => {
    findings.forEach(item => addInventoryItem(item.id));
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-warm-cream flex flex-col items-center justify-center font-pixel overflow-hidden">
      {/* Parallax Background (Simplified) */}
      <div className="absolute inset-x-0 bottom-1/4 h-2 w-[400%] bg-soft-lilac/30 translate-x-[-25%]" 
           style={{ transform: `translateX(-${(distance % 25) * 4}%)` }} />
      <div className="absolute inset-x-0 bottom-1/4 translate-y-2 h-1 w-[400%] bg-soft-lilac/15 translate-x-[-25%]" 
           style={{ transform: `translateX(-${(distance % 25) * 8}%)` }} />

      <div className="relative w-full max-w-4xl h-64 flex items-end justify-center px-20">
        {/* Pets & Player (Represented by Emojis/Icons) */}
        <div className="flex items-end gap-4 mb-4">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="text-6xl"
          >
            🚶
          </motion.div>
          {ownedPets.map((pet, i) => (
            <motion.div 
              key={pet.id}
              initial={{ x: -20 * (i + 1) }}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }}
              className="text-4xl"
            >
              🐶
            </motion.div>
          ))}
        </div>

        {/* HUD */}
        <div className="absolute top-0 left-0 right-0 pt-10 flex flex-col items-center">
          <div className="w-64 h-1 bg-stone-grey/20 rounded-full overflow-hidden mb-2">
            <motion.div 
              className="h-full bg-mossy-green"
              initial={{ width: 0 }}
              animate={{ width: `${(distance / totalDistance) * 100}%` }}
            />
          </div>
          <div className="text-[8px] text-muted-sage uppercase tracking-widest">
            {isReturning ? 'Returning Home...' : `Exploring: ${distance}%`}
          </div>
        </div>

        {/* Findings Notification */}
        <AnimatePresence>
          {showFinding && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 bg-speaker-rose/20 border border-speaker-rose/50 px-4 py-2 rounded-lg text-speaker-rose text-[10px] uppercase tracking-widest"
            >
              Found: {showFinding.name}!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isReturning && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-12 flex flex-col items-center bg-warm-cream/90 border border-soft-lilac/50 p-8 rounded-3xl"
        >
          <h3 className="text-sm font-game text-dialogue-text uppercase tracking-[0.2em] mb-6">Walk Summary</h3>
          <div className="space-y-3 mb-8 w-full">
            {findings.length > 0 ? findings.map((f, i) => (
              <div key={i} className="flex justify-between items-center text-[10px] text-muted-sage">
                <span>{f.name}</span>
                <span className="text-speaker-rose text-[8px]">{f.rarity}</span>
              </div>
            )) : (
              <div className="text-center text-[8px] text-stone-grey uppercase py-4">A quiet walk...</div>
            )}
          </div>
          <button 
            onClick={handleFinish}
            className="bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-4 px-10 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest"
          >
            Finish Walk
          </button>
        </motion.div>
      )}
    </div>
  );
}
