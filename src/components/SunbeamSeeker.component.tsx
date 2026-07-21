import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';
import AnimalSprite from './AnimalSprite.component';
import { getAssetUrl } from '../logic/assetResolver.logic';

const SPOTS = [
  { id: 'spot1', top: '30%', left: '15%', width: '15%', height: '15%', zIndex: 50 },
  { id: 'spot2', top: '45%', left: '10%', width: '12%', height: '12%', zIndex: 60 },
  { id: 'spot3', top: '65%', left: '20%', width: '15%', height: '15%', zIndex: 70 },
  { id: 'spot4', top: '35%', left: '40%', width: '15%', height: '15%', zIndex: 40 },
  { id: 'spot5', top: '55%', left: '45%', width: '12%', height: '12%', zIndex: 50 },
  { id: 'spot6', top: '40%', left: '70%', width: '15%', height: '15%', zIndex: 60 },
  { id: 'spot7', top: '65%', left: '75%', width: '15%', height: '15%', zIndex: 70 },
  { id: 'spot8', top: '25%', left: '60%', width: '12%', height: '12%', zIndex: 45 },
  { id: 'spot9', top: '50%', left: '80%', width: '12%', height: '12%', zIndex: 55 },
];

export default function SunbeamSeeker({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = useGameStore(state => state.rescueSpecies) || 'REPTILE';
  
  const [targetId, setTargetId] = useState(() => SPOTS[Math.floor(Math.random() * SPOTS.length)].id);
  const [timesFound, setTimesFound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [gameStatus, setGameStatus] = useState<'playing' | 'revealing' | 'done'>('playing');
  const [isPenalty, setIsPenalty] = useState(false);
  const [prompt, setPrompt] = useState(`A reptile was spotted in the greenhouse. Find it 3 times within the time limit! Look for subtle movement.`);
  
  // Animation state for subtle movement
  const [twitched, setTwitched] = useState(false);

  // Timer logic
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          // ran out of time
          setTimesFound(0);
          setTargetId(SPOTS[Math.floor(Math.random() * SPOTS.length)].id);
          setPrompt("They hid somewhere new! You need to be faster. Let's start over.");
          return 25;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    // Random twitching logic
    const tick = () => {
      setTwitched(true);
      setTimeout(() => setTwitched(false), 200 + Math.random() * 300); // Only twitch for 200-500ms
    };

    // Twitch every 2 to 5 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
         tick();
      }
    }, 2000 + Math.random() * 3000); 

    return () => clearInterval(interval);
  }, [gameStatus]);

  const handleSpotClick = (id: string) => {
    if (gameStatus !== 'playing' || isPenalty) return;

    if (id === targetId) {
      if (timesFound + 1 >= 3) {
        setGameStatus('done');
        setPrompt('You caught them 3 times! They seem calm now.');
        setTimeout(() => {
          if (onFinish) {
            onFinish();
          } else {
            setPhase6State('day2_discovery'); 
          }
        }, 3000);
      } else {
        setGameStatus('revealing');
        setPrompt('Spotted! But they scurry to a new sunbeam. Keep up!');
        setTimeout(() => {
           let nextSpot = SPOTS[Math.floor(Math.random() * SPOTS.length)].id;
           while(nextSpot === targetId) {
              nextSpot = SPOTS[Math.floor(Math.random() * SPOTS.length)].id;
           }
           setTargetId(nextSpot);
           setTimesFound(prev => prev + 1);
           setGameStatus('playing');
        }, 2000);
      }
    } else {
      setIsPenalty(true);
      setPrompt('Nothing here. Wait a second... then keep looking.');
      setTimeout(() => {
        setIsPenalty(false);
        setPrompt('Look for subtle movement.');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-pixel">
      {/* Greenhouse Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url('${getAssetUrl('./src/assets/images/backgrounds/greenhouse.png')}')` }}
      />
      
      {/* Timer Bar */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-64 h-4 bg-stone-300 rounded-full border-2 border-stone-400 overflow-hidden z-[150] transition-opacity ${gameStatus === 'playing' ? 'opacity-100' : 'opacity-0'}`}>
         <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${(timeLeft / 25) * 100}%` }} />
      </div>

      {/* Progress Icons */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex space-x-2 z-[150]">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 border-orange-500 shadow-sm ${timesFound > i ? 'bg-orange-500' : 'bg-transparent'}`} />
        ))}
      </div>

      {/* Spots overlay */}
      {SPOTS.map((spot) => {
        const isTarget = spot.id === targetId;

        return (
          <div
            key={spot.id}
            onClick={() => handleSpotClick(spot.id)}
            className="absolute cursor-pointer group"
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
              zIndex: spot.zIndex,
            }}
          >
            {/* Visual indicator (sunbeam) */}
            <div className={`w-full h-full bg-yellow-200/20 group-hover:bg-yellow-200/30 transition-colors pointer-events-none ${isTarget && twitched && gameStatus === 'playing' ? 'animate-twitch' : ''}`} />

            {/* Animal Sprite */}
            <AnimatePresence>
              {isTarget && gameStatus !== 'playing' && rescueBreed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                >
                  <div className="relative">
                    <AnimalSprite 
                      spriteKey={rescueBreed.spriteKey} 
                      species={species}
                      animation="idle" 
                      size={100} 
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-warm-cream/90 px-3 py-1 rounded-full text-dialogue-text text-[10px] animate-bounce shadow-sm">
                      *Blinks*
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

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
        @keyframes twitch {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-twitch {
          animation: twitch 0.3s ease-in-out;
        }
      `}} />
    </div>
  );
}
