import React, { useState, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';
import AnimalSprite from './AnimalSprite.component';

const ROCKS = [
  { id: 'r1', top: '25%', left: '25%' },
  { id: 'r2', top: '20%', left: '55%' },
  { id: 'r3', top: '35%', left: '80%' },
  { id: 'r4', top: '50%', left: '20%' },
  { id: 'r5', top: '55%', left: '50%' },
  { id: 'r6', top: '65%', left: '80%' },
  { id: 'r7', top: '75%', left: '30%' },
  { id: 'r8', top: '80%', left: '60%' },
];

export default function RockHiding({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = useGameStore(state => state.rescueSpecies) || 'REPTILE';
  
  const [hidingSpotId, setHidingSpotId] = useState(() => ROCKS[Math.floor(Math.random() * ROCKS.length)].id);
  const [liftedState, setLiftedState] = useState<Record<string, boolean>>({});
  
  const [draggingRockId, setDraggingRockId] = useState<string | null>(null);
  const [rockY, setRockY] = useState<Record<string, number>>({});
  const lastTouch = useRef<{ y: number, time: number } | null>(null);
  
  const [prompt, setPrompt] = useState('Drag a rock UP slowly to flip it. Jerk it too fast and you might scare them.');
  const [isDone, setIsDone] = useState(false);

  const shuffleReptile = (rockId: string) => {
    const remainingSpots = ROCKS.filter(r => r.id !== rockId && !liftedState[r.id]);
    if (remainingSpots.length > 0) {
      const nextSpot = remainingSpots[Math.floor(Math.random() * remainingSpots.length)];
      setHidingSpotId(nextSpot.id);
      setPrompt('CRASH! You startled them, and you heard scurrying under another rock.');
    } else {
      setPrompt('The rock fell!');
    }
  };

  const dropRock = (rockId: string, message: string) => {
    setPrompt(message);
    setDraggingRockId(null);
    lastTouch.current = null;
    setRockY(prev => ({ ...prev, [rockId]: 0 }));
    
    if (rockId === hidingSpotId) {
      shuffleReptile(rockId);
    }
  };

  const liftRock = (rockId: string) => {
    setLiftedState(prev => ({ ...prev, [rockId]: true }));
    setDraggingRockId(null);
    lastTouch.current = null;
    
    if (rockId === hidingSpotId) {
      setIsDone(true);
      setPrompt('You found them! Gently bringing them out...');
      setTimeout(() => {
        if (onFinish) onFinish();
        else setPhase6State('day2_discovery');
      }, 3000);
    } else {
      setPrompt('Nothing under this rock. Keep looking.');
    }
  };

  const handlePointerDown = (e: React.PointerEvent, rockId: string) => {
    if (isDone) return;
    if (liftedState[rockId]) return;
    
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    
    setDraggingRockId(rockId);
    lastTouch.current = { y: e.clientY, time: performance.now() };
  };

  const handlePointerMove = (e: React.PointerEvent, rockId: string) => {
    if (!draggingRockId || draggingRockId !== rockId || isDone || !lastTouch.current) return;
    
    const now = performance.now();
    const dt = now - lastTouch.current.time;
    const dy = e.clientY - lastTouch.current.y;
    
    if (dt === 0) return;
    
    const speed = dy / dt; // pixels per ms
    lastTouch.current = { y: e.clientY, time: now };

    // Moving up too fast
    if (speed < -0.6) {
      dropRock(rockId, 'Too fast! The rock slipped from your fingers.');
      return;
    }
    
    // Slapped back down too fast
    if (speed > 1.2) {
      dropRock(rockId, 'Clumsy move! The rock fell back down.');
      return;
    }

    setRockY(prev => {
      const current = prev[rockId] || 0;
      const next = Math.max(-120, Math.min(0, current + dy));
      
      if (next <= -115) { // Threshold for full lift
         liftRock(rockId);
         return { ...prev, [rockId]: -120 };
      }
      return { ...prev, [rockId]: next };
    });
  };

  const handlePointerUp = (e: React.PointerEvent, rockId: string) => {
    if (draggingRockId === rockId) {
      const el = e.currentTarget as HTMLElement;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      
      if ((rockY[rockId] || 0) > -115) {
         dropRock(rockId, 'You let go and the rock fell back down.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-pixel bg-stone-900 select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/stone-wall-garden.png')" }}
      />

      {ROCKS.map(rock => {
        const isLifted = liftedState[rock.id];
        const isDragging = draggingRockId === rock.id;
        const hasAnimal = rock.id === hidingSpotId;
        const currentY = rockY[rock.id] || 0;

        return (
          <div 
            key={rock.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: rock.top, left: rock.left }}
          >
            {/* The Animal */}
            <AnimatePresence>
              {isLifted && hasAnimal && rescueBreed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 z-10"
                >
                  <AnimalSprite 
                    spriteKey={rescueBreed.spriteKey} 
                    species={species} 
                    animation="idle" 
                    size={80} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Rock */}
            <motion.div
              className={`w-36 h-28 cursor-grab active:cursor-grabbing relative z-20 flex items-center justify-center touch-none ${isLifted ? 'pointer-events-none' : ''}`}
              animate={{ 
                y: isLifted ? -120 : currentY,
                rotate: isLifted ? -5 : (isDragging ? currentY * 0.05 : 0),
                opacity: isLifted ? 0.3 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onPointerDown={(e) => handlePointerDown(e, rock.id)}
              onPointerMove={(e) => handlePointerMove(e, rock.id)}
              onPointerUp={(e) => handlePointerUp(e, rock.id)}
              onPointerCancel={(e) => handlePointerUp(e, rock.id)}
            >
              <img 
                src="./src/assets/images/items/rock.png" 
                alt="Rock" 
                className="w-[120%] h-[120%] max-w-none object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] pointer-events-none" 
                draggable={false} 
              />
            </motion.div>
          </div>
        )
      })}

      <div className="absolute inset-x-0 bottom-0 z-[200]">
        <DialoguePanel 
          speaker={null}
          text={prompt}
          variant="narration"
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
