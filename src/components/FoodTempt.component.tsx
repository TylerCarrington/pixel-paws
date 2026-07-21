import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { motion, AnimatePresence } from 'motion/react';

export default function FoodTempt({ onFinish }: { onFinish?: () => void }) {
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const rescueSpecies = useGameStore(state => state.rescueSpecies);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  
  // Animal position (x, y percentages)
  // Animal starts deep in the market: x=50, y=20
  const [animalPos, setAnimalPos] = useState({ x: 50, y: 20 });
  const [animalState, setAnimalState] = useState<'nervous' | 'curious' | 'retreat' | 'happy' | 'trusting'>('nervous');
  
  // Placed treats
  const [treatPos, setTreatPos] = useState<{ x: number, y: number } | null>(null);
  const [trustLevel, setTrustLevel] = useState(0); // 0 to 100
  const [isComplete, setIsComplete] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [message, setMessage] = useState('Place a treat to lure the dog out.');
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Acceptable distance from the animal to place a treat.
  // Grows as trust increases. Starts at roughly 30%.
  const acceptableDistance = 30 + (trustLevel / 100) * 40;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isComplete || treatPos !== null || animalState === 'retreat' || animalState === 'curious') return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTreatPos({ x, y });
    
    // Evaluate treat placement
    const dx = x - animalPos.x;
    const dy = y - animalPos.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist < acceptableDistance) {
      if (y > animalPos.y + 5 || dist < 10) {
        // Good placement (closer to player, or right next to animal)
        setAnimalState('curious');
        setMessage('It\'s interested... wait for it.');
        
        setTimeout(() => {
          // Animal moves to treat
          setAnimalPos({ x, y });
          setTreatPos(null);
          
          if (y >= 80) {
            // Reached the player!
            setAnimalState('happy');
            setIsComplete(true);
            setMessage('You\'ve gained its trust!');
            setTimeout(() => setShowCompletion(true), 1500);
          } else {
            setAnimalState('nervous');
            setTrustLevel(prev => Math.min(100, prev + 25));
            setMessage('It ate the treat. Try placing another one a bit closer to you.');
          }
        }, 1500);
      } else {
         // Placed behind or far to side but in range. It'll eat it but maybe not progress much towards player
         setAnimalState('curious');
         setMessage('It\'s eating, but we want to lure it closer to us (downwards).');
         setTimeout(() => {
           setAnimalPos({ x, y });
           setTreatPos(null);
           setAnimalState('nervous');
           setMessage('Try placing a treat a bit closer to you.');
         }, 1500);
      }
      
    } else {
      // Treat placed too far away (unsafe)
      setAnimalState('retreat');
      setMessage('Too far from safety! It got scared.');
      
      setTimeout(() => {
        // Animal retreats slightly
        setAnimalPos(prev => ({
          x: prev.x,
          y: Math.max(10, prev.y - 10)
        }));
        setTrustLevel(prev => Math.max(0, prev - 10)); // lose some trust
        setTreatPos(null); // Bird flies away with it? Treat disappears for now.
        
        setTimeout(() => {
          setAnimalState('nervous');
          setMessage('Try placing the treat closer to the stray.');
        }, 800);
      }, 1000);
    }
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setPhase6State('wash_rescue');
    }
  };

  if (!rescueBreed) return null;

  return (
    <div 
       ref={containerRef}
       className="relative w-full h-full bg-night-plum overflow-hidden font-pixel select-none"
       onPointerDown={handlePointerDown}
       style={{ touchAction: 'none' }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./src/assets/images/backgrounds/marketplace.png" 
          className="w-full h-full object-cover opacity-60"
          alt="Marketplace"
          onError={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a2e';
          }}
        />
        {/* Subtle gradient to darken top (where the dog hides) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Trust radius indicator (dev only, but cool to show subtly?) Let's leave it hidden to make it feel natural, but maybe show a faint glow around the dog if trust is high. */}
      
      {/* Treat Item */}
      <AnimatePresence>
        {treatPos && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute z-10 w-6 h-6"
            style={{
              left: `${treatPos.x}%`,
              top: `${treatPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img src="./src/assets/images/items/pet-treat.png" alt="Treat" className="w-full h-full object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animal Sprite */}
      <motion.div 
        className="absolute z-20 pointer-events-none"
        animate={{
          left: `${animalPos.x}%`,
          top: `${animalPos.y}%`,
        }}
        transition={{
          duration: animalState === 'retreat' ? 0.3 : 1.2,
          ease: "easeInOut"
        }}
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
         <AnimalSprite 
            spriteKey={rescueBreed.spriteKey}
            species={rescueSpecies || 'DOG'}
            animation={animalState}
            size={60 + (animalPos.y * 0.6)} // Gets bigger as it gets closer to camera/player
         />
      </motion.div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between py-6 px-4">
        <header className="text-center space-y-2 drop-shadow-md w-full bg-black/40 backdrop-blur rounded-xl p-3 border border-warm-cream/10 pointer-events-auto">
          <h2 className="text-warm-cream text-xs uppercase tracking-[0.2em] font-game">Tempt with Food</h2>
          <div className="min-h-[25px] flex items-center justify-center">
            <p className="text-warm-cream/80 text-[10px] uppercase tracking-widest">{message}</p>
          </div>
        </header>

        <footer className="w-full max-w-md mx-auto space-y-4 pb-4 pointer-events-auto flex flex-col justify-end">
          {showCompletion && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleFinish}
              className="w-full bg-warm-cream text-night-plum py-4 rounded-xl font-game text-xs uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,245,230,0.4)] hover:bg-white active:scale-95 mb-4"
            >
              Reach Out & Rescue
            </motion.button>
          )}

          {!showCompletion && (
            <div className="w-full px-2">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-warm-cream/60 text-[8px] uppercase tracking-widest">Trust Level</span>
                 </div>
                 <div className="relative h-2 bg-black/50 rounded-full border border-warm-cream/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-warm-cream"
                      initial={{ width: '0%' }}
                      animate={{ width: `${trustLevel}%` }}
                      transition={{ duration: 0.3 }}
                    />
                 </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <button 
              onClick={() => setPhase6State('phone_call')}
              className="text-[8px] text-warm-cream/40 hover:text-warm-cream uppercase tracking-widest transition-colors font-game"
            >
              Step Away (Cancel)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
