import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';

const BUSHES = [
  { id: 'bushLeft', bottom: '6%', left: '4%', width: '28%', zIndex: 60 },
  { id: 'bushRight', bottom: '5%', right: '3%', width: '30%', zIndex: 60 },
  { id: 'bushCenter', top: '46%', left: '54%', width: '20%', zIndex: 40 },
];

const HOTSPOTS = [
  { id: 'bushLeft', top: '58%', left: '4%', width: '30%', height: '30%' },
  { id: 'bushRight', top: '56%', left: '66%', width: '30%', height: '32%' },
  { id: 'bushCenter', top: '46%', left: '52%', width: '22%', height: '24%' },
];

export default function BushSearch({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const assignedBreed = useGameStore(state => state.assignedBreed);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  
  const [targetId] = useState(() => BUSHES[Math.floor(Math.random() * BUSHES.length)].id);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [found, setFound] = useState(false);
  const [prompt, setPrompt] = useState('The dog is hiding somewhere in the park. Search the bushes.');
  const [leaves, setLeaves] = useState<{ id: number; x: string; y: string }[]>([]);

  const handleBushClick = (id: string) => {
    if (found) return;

    setShakingId(id);
    spawnLeaves(id);

    if (id === targetId) {
      setFound(true);
      setPrompt('There you are.');
      setTimeout(() => {
        if (onFinish) {
          onFinish();
        } else {
          setPhase6State('day2_discovery'); 
        }
      }, 2500);
    } else {
      setPrompt('Nothing here. Keep looking.');
      setTimeout(() => setShakingId(null), 300);
    }
  };

  const spawnLeaves = (id: string) => {
    const hotspot = HOTSPOTS.find(h => h.id === id);
    if (!hotspot) return;

    const newLeaf = {
      id: Date.now(),
      x: `calc(${hotspot.left} + ${Math.random() * 20}%)`,
      y: `calc(${hotspot.top} + 20px)`,
    };
    setLeaves(prev => [...prev, newLeaf]);
    setTimeout(() => {
      setLeaves(prev => prev.filter(l => l.id !== newLeaf.id));
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-pixel">
      {/* Park Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('/src/assets/images/park-fountain.png')" }}
      />

      {/* Layered Bush Sprites */}
      {BUSHES.map(bush => (
        <div
          key={bush.id}
          className={`absolute transition-transform ${shakingId === bush.id ? 'animate-bush-shake' : ''}`}
          style={{
            bottom: bush.bottom,
            left: bush.left,
            right: bush.right,
            top: bush.top,
            width: bush.width,
            zIndex: bush.zIndex,
            pointerEvents: 'none'
          }}
        >
          <img 
            src="/src/assets/images/bush.png" 
            alt="Bush" 
            className="w-full h-auto pixelated"
            style={{ transformOrigin: 'bottom center' }}
          />
        </div>
      ))}

      {/* Dog Layer (Corgi) */}
      <AnimatePresence>
        {found && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: '-50%', y: '20px' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '0px' }}
            className="absolute left-1/2 bottom-[30%] z-50 pointer-events-none"
          >
            <div className="relative">
              <img 
                src="/src/assets/images/animals/dogs/corgi.png" 
                alt="Corgi" 
                className="w-48 h-48 pixelated drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] animate-soft-pulse"
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-warm-cream/90 px-3 py-1 rounded-full text-dialogue-text text-[10px] animate-bounce shadow-sm">
                Woof!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible Hotspots */}
      {HOTSPOTS.map(hotspot => (
        <div
          key={hotspot.id}
          onClick={() => handleBushClick(hotspot.id)}
          className="absolute cursor-pointer z-[100]"
          style={{
            top: hotspot.top,
            left: hotspot.left,
            width: hotspot.width,
            height: hotspot.height,
          }}
        />
      ))}

      {/* Leaf Particles */}
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="leaf-particle"
          style={{
            position: 'absolute',
            left: leaf.x,
            top: leaf.y,
            zIndex: 110,
          }}
        />
      ))}

      {/* Dialogue Panel Prompt */}
      <div className="absolute inset-x-0 bottom-0 z-[200]">
        <DialoguePanel 
          speaker={null}
          text={prompt}
          variant="narration"
          onComplete={() => {}}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bushShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-bush-shake {
          animation: bushShake 0.2s ease-in-out;
        }
        .leaf-particle {
          width: 4px;
          height: 6px;
          background: var(--color-deep-moss);
          border-radius: 2px;
          animation: leafFall 0.6s linear forwards;
        }
        @keyframes leafFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(20px) rotate(90deg); opacity: 0; }
        }
      `}} />
    </div>
  );
}
