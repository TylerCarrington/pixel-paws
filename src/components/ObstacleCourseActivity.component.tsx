import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';

import familyRoomBg from '../assets/images/backgrounds/family-room.png';

interface ObstacleCourseProps {
  pet: Animal;
  onComplete: () => void;
}

type Lane = 0 | 1 | 2; // Left, Middle, Right

interface Obstacle {
    id: number;
    lane: Lane;
    type: 'hurdle' | 'cone' | 'tunnel';
    pos: number; // 0 to 100
}

export default function ObstacleCourseActivity({ pet, onComplete }: ObstacleCourseProps) {
  const [lane, setLane] = useState<Lane>(1);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [distance, setDistance] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasCrashed, setHasCrashed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  
  const gameRef = useRef<NodeJS.Timeout | null>(null);
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const startGame = () => {
    setIsPlaying(true);
    setDistance(0);
    setTimeLeft(20);
    setHasCrashed(false);
    setObstacles([]);
    
    gameRef.current = setInterval(() => {
        setDistance(prev => {
            const next = prev + 2;
            if (next >= 100) {
                 endGame(true);
                 return 100;
            }
            return next;
        });

        setTimeLeft(prev => {
            const next = prev - 0.1;
            if (next <= 0) {
                endGame(false);
                return 0;
            }
            return next;
        });

        // Spawn obstacles
        setObstacles(prev => {
            const lastObs = prev[prev.length - 1];
            if (!lastObs || lastObs.pos < distance + 30) {
                if (Math.random() > 0.7) {
                    return [...prev, {
                        id: Date.now(),
                        lane: Math.floor(Math.random() * 3) as Lane,
                        type: ['hurdle', 'cone', 'tunnel'][Math.floor(Math.random() * 3)] as any,
                        pos: 100 + Math.random() * 50
                    }];
                }
            }
            // Move obstacles relative to distance
            return prev.filter(o => o.pos > distance - 10);
        });
    }, 100);
  };

  const endGame = (win: boolean) => {
    setIsPlaying(false);
    if (gameRef.current) clearInterval(gameRef.current);
    setShowResult(true);
  };

  const handleAction = (action: 'LEFT' | 'RIGHT' | 'JUMP') => {
    if (!isPlaying || hasCrashed) return;

    if (action === 'LEFT') setLane(prev => Math.max(0, prev - 1) as Lane);
    if (action === 'RIGHT') setLane(prev => Math.min(2, prev + 1) as Lane);
    if (action === 'JUMP' && !isJumping) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
    }
  };

  useEffect(() => {
    // Collision check
    const playerPos = distance + 5; // offset for player position in the "track"
    const collider = obstacles.find(o => Math.abs(o.pos - playerPos) < 3);
    
    if (collider) {
        if (collider.lane === lane) {
            if (collider.type === 'hurdle' && !isJumping) {
                setHasCrashed(true);
                setTimeout(() => setHasCrashed(false), 1000);
            } else if (collider.type === 'tunnel' && isJumping) {
                 // Too high for tunnel!
                 setHasCrashed(true);
                 setTimeout(() => setHasCrashed(false), 1000);
            } else if (collider.type === 'cone') {
                 setHasCrashed(true);
                 setTimeout(() => setHasCrashed(false), 1000);
            }
        }
    }
  }, [distance, lane, isJumping, obstacles]);

  const handleFinish = () => {
    addXP(pet.id, 110);
    markActivityDone(pet.id, 'obstacleCourse');
    onComplete();
  };

  const finalXP = 110 + (pet.hiddenBonuses?.activity || 0);

  useEffect(() => {
    return () => { if (gameRef.current) clearInterval(gameRef.current); };
  }, []);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${familyRoomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl w-full text-center border-4 border-amber-glow relative h-[600px] flex flex-col">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Obstacle Course</h2>
        
        {!showResult ? (
          <>
            <div className="flex justify-between items-center mb-4 px-4">
                <div className="text-[10px] uppercase text-stone-grey">Time: {timeLeft.toFixed(1)}s</div>
                <div className="w-48 h-2 bg-stone-grey/20 rounded-full overflow-hidden">
                    <div className="h-full bg-speaker-rose" style={{ width: `${distance}%` }} />
                </div>
                <div className="text-[10px] uppercase text-stone-grey">Goal</div>
            </div>

            <div className="flex-1 relative bg-night-plum/20 rounded-xl border-2 border-warm-brown/30 overflow-hidden mb-6">
                {/* Lanes */}
                <div className="absolute inset-0 flex">
                    <div className="flex-1 border-r border-white/5" />
                    <div className="flex-1 border-r border-white/5" />
                    <div className="flex-1" />
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => (
                    <motion.div
                        key={obs.id}
                        style={{ 
                            left: `${(obs.lane * 33.3) + 16.6}%`,
                            bottom: `${(obs.pos - distance) * 5}%`,
                            opacity: (obs.pos - distance) > 20 ? 0 : 1
                        }}
                        className="absolute -translate-x-1/2 flex items-center justify-center text-3xl"
                    >
                        {obs.type === 'hurdle' ? '🚧' : obs.type === 'cone' ? '🚩' : '💠'}
                    </motion.div>
                ))}

                {/* Pet */}
                <motion.div
                    animate={{ 
                        left: `${(lane * 33.3) + 16.6}%`,
                        scale: isJumping ? 1.4 : 1,
                        y: isJumping ? -40 : 0
                    }}
                    className={`absolute bottom-10 -translate-x-1/2 z-20 transition-all ${hasCrashed ? 'opacity-50 blur-sm' : ''}`}
                >
                    <img 
                        src={`./src/assets/images/animals/dogs/${pet.breed.toLowerCase()}.png`}
                        onError={(e) => { e.currentTarget.src = './src/assets/images/animals/dogs/husky.png'; }}
                        className="w-20 h-20 object-contain pixelated"
                        alt="Pet"
                    />
                    {hasCrashed && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">💫</span>}
                </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-24">
                <button 
                    onMouseDown={() => handleAction('LEFT')}
                    className="bg-white border-b-4 border-stone-grey/20 rounded-xl flex items-center justify-center text-xl hover:bg-amber-50 active:translate-y-1 active:border-b-0"
                >
                    ⬅️
                </button>
                <div className="flex flex-col gap-2">
                    <button 
                        onMouseDown={() => handleAction('JUMP')}
                        className="flex-1 bg-amber-glow text-white rounded-xl font-game text-xs uppercase tracking-widest shadow-md hover:bg-amber-500 active:scale-95 transition-all"
                    >
                        JUMP
                    </button>
                </div>
                <button 
                    onMouseDown={() => handleAction('RIGHT')}
                    className="bg-white border-b-4 border-stone-grey/20 rounded-xl flex items-center justify-center text-xl hover:bg-amber-50 active:translate-y-1 active:border-b-0"
                >
                    ➡️
                </button>
            </div>
            
            {!isPlaying && !showResult && (
                <div className="absolute inset-0 bg-night-plum/40 backdrop-blur-sm z-30 flex items-center justify-center">
                    <button 
                        onClick={startGame}
                        className="bg-amber-glow text-white font-game px-12 py-6 rounded-2xl text-xl shadow-2xl animate-pulse"
                    >
                        START COURSE
                    </button>
                </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="text-6xl mb-6">{distance >= 100 ? '🏃‍♂️💨' : '💤'}</span>
            <p className="text-lg text-night-plum mb-8">
                {distance >= 100 
                    ? `Amazing speed! ${pet.name || 'Your pet'} cleared the course perfectly.` 
                    : `Nice try! A bit more practice and you'll clear it!`}
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
