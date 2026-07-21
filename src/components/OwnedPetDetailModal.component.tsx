import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';
import AnimalSprite from './AnimalSprite.component';
import { getBreedDefinition } from '../logic/animalAssets.logic';
import { xpToNextLevel } from '../logic/ownedPet.logic';
import { X, Heart, Utensils, Scissors, Play, Edit2, Check } from 'lucide-react';
import { audioManager } from '../audio/audio.manager';
import { SFX } from '../config/audio.config';
import { TRACKED_ITEMS } from '../constants/items.constants';
import { getAssetUrl } from '../logic/assetResolver.logic';

interface OwnedPetDetailModalProps {
  pet: Animal;
  onClose: () => void;
  onPlay: () => void;
}

type InteractionMode = 'none' | 'petting' | 'feeding' | 'grooming';

export default function OwnedPetDetailModal({ pet: initialPet, onClose, onPlay }: OwnedPetDetailModalProps) {
  const performCareAction = useGameStore(state => state.performCareAction);
  const renameOwnedPet = useGameStore(state => state.renameOwnedPet);
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);
  const inventory = useGameStore(state => state.inventory);
  const removeInventoryItem = useGameStore(state => state.removeInventoryItem);
  
  // Select current pet state from store to ensure UI updates during interactions
  const pet = useGameStore(state => state.ownedPets.find(p => p.id === initialPet.id) || initialPet);
  
  const [mode, setMode] = useState<InteractionMode>('none');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pet.name || '');
  const [lastAction, setLastAction] = useState<{ id: string; gain: number; hearts: number } | null>(null);
  const [feedbackAnimation, setFeedbackAnimation] = useState<'idle' | 'happy'>('idle');
  
  const petRef = useRef<HTMLDivElement>(null);
  const [isDraggingFood, setIsDraggingFood] = useState(false);
  
  // Petting State
  const [petsDone, setPetsDone] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  
  // Feeding State
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  
  // Grooming State
  const [groomProgress, setGroomProgress] = useState(0);
  const brushCooldown = useRef(false);

  const breed = getBreedDefinition(pet.breed);

  const ownedTreats = useMemo(() => {
    const counts: Record<string, number> = {};
    inventory.forEach(id => {
      if (TRACKED_ITEMS[id] && TRACKED_ITEMS[id].category === 'Treat') {
        counts[id] = (counts[id] || 0) + 1;
      }
    });
    return counts;
  }, [inventory]);

  const treatList = useMemo(() => {
    const list = [
      {
        id: 'basic_kibble',
        name: 'Basic Kibble',
        image: '🥣',
        count: Infinity,
        compatibleSpecies: [pet.species],
        hungerValue: 10,
        xpBonusValue: 0,
        description: 'Standard, every-day nutritious kibble.'
      }
    ];

    Object.entries(ownedTreats).forEach(([id, count]) => {
      const item = TRACKED_ITEMS[id];
      if (item) {
        list.push({
          id,
          name: item.name,
          image: item.image,
          count,
          compatibleSpecies: item.compatibleSpecies,
          hungerValue: item.hungerValue || 15,
          xpBonusValue: item.xpBonusValue || 0,
          description: item.description
        });
      }
    });

    return list;
  }, [ownedTreats, pet.species]);

  const level = pet.level || 1;
  const currentXP = pet.currentXP || 0;
  const nextLevelXP = xpToNextLevel(level);
  const xpProgress = (currentXP / nextLevelXP) * 100;
  
  const activitiesRemaining = Math.max(0, actionsPerPetToday - (pet.actionsUsedToday || 0));

  const handleRename = () => {
    if (tempName.trim()) {
      renameOwnedPet(pet.id, tempName);
      setIsEditingName(false);
      audioManager.playSFX(SFX.CLICK);
    }
  };

  const triggerFeedback = (actionId: string, extraXP = 0) => {
    // Check if XP will be given (only 1st time per day)
    const willGainXP = !pet.dailyXPFlags?.[actionId as keyof typeof pet.dailyXPFlags];
    const gain = (willGainXP ? 10 : 0) + extraXP;
    
    setLastAction({ id: actionId, gain, hearts: 3 });
    setFeedbackAnimation('happy');
    
    setTimeout(() => {
      setLastAction(null);
      setFeedbackAnimation('idle');
    }, 2000);
  };

  // --- Petting Logic ---
  const handlePet = (e: React.MouseEvent) => {
    if (mode !== 'petting' || petsDone >= 3) return;
    
    const newPets = petsDone + 1;
    setPetsDone(newPets);
    audioManager.playSFX(SFX.PET_INTERACT);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHearts(prev => [...prev, { id: Date.now(), x, y }]);

    if (newPets === 3) {
      setTimeout(() => {
        performCareAction(pet.id, 'pet');
        triggerFeedback('pet');
        setMode('none');
        setPetsDone(0);
      }, 800);
    }
  };

  // --- Feeding Logic ---
  const handleDragEnd = (event: any, info: any) => {
    if (!petRef.current || !selectedFood) return;
    
    const findFood = treatList.find(t => t.id === selectedFood);
    if (!findFood || findFood.count <= 0) return;

    const isComp = findFood.compatibleSpecies.includes(pet.species);
    if (!isComp) {
      audioManager.playSFX(SFX.CLICK);
      setSelectedFood(null);
      setIsDraggingFood(false);
      return;
    }

    const petRect = petRef.current.getBoundingClientRect();
    const pointX = info.point.x;
    const pointY = info.point.y;

    // Check if food dropped within pet area
    if (
      pointX >= petRect.left && pointX <= petRect.right &&
      pointY >= petRect.top && pointY <= petRect.bottom
    ) {
      audioManager.playSFX(SFX.PET_INTERACT);
      performCareAction(pet.id, 'feed');

      if (findFood.id !== 'basic_kibble') {
        removeInventoryItem(findFood.id);
        if (findFood.xpBonusValue > 0) {
          useGameStore.getState().addXP(pet.id, findFood.xpBonusValue);
        }
      }

      triggerFeedback('feed', findFood.xpBonusValue);
      setMode('none');
      setSelectedFood(null);
    }
    setIsDraggingFood(false);
  };

  // --- Grooming Logic ---
  const handleGroomInteraction = (clientX: number, clientY: number) => {
    if (mode !== 'grooming' || brushCooldown.current) return;
    
    brushCooldown.current = true;
    setTimeout(() => { brushCooldown.current = false; }, 80);
    
    const newProgress = Math.min(100, groomProgress + 2);
    setGroomProgress(newProgress);
    
    if (newProgress % 10 === 0) {
      audioManager.playSFX(SFX.CLICK);
    }

    if (newProgress === 100) {
      triggerFeedback('groom');
      setTimeout(() => {
        performCareAction(pet.id, 'groom');
        setMode('none');
        setGroomProgress(0);
      }, 1000);
    }
  };

  const handleGroomMouseMove = (e: React.MouseEvent) => {
    handleGroomInteraction(e.clientX, e.clientY);
  };

  const handleGroomTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleGroomInteraction(touch.clientX, touch.clientY);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-night-plum/80 backdrop-blur-md"
        onClick={() => mode === 'none' && onClose()}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-warm-cream rounded-[40px] shadow-2xl overflow-hidden flex flex-col border-4 border-white/20"
      >
        {/* Header with Name/Rename */}
        <div className="p-8 bg-white border-b-2 border-stone-grey/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {isEditingName ? (
              <div className="flex gap-2">
                <input 
                  autoFocus
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                  className="bg-stone-grey/5 border-2 border-night-plum/20 rounded-xl px-4 py-2 font-pixel text-sm text-night-plum outline-none focus:border-night-plum/50"
                />
                <button onClick={handleRename} className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                  <Check size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-pixel text-night-plum uppercase tracking-tighter">{pet.name || 'Your Pet'}</h2>
                <button onClick={() => setIsEditingName(true)} className="p-2 text-stone-grey/40 hover:text-night-plum transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>
            )}
            <div className="bg-amber-glow/10 px-3 py-1 rounded-full flex items-center gap-2">
               <span className="text-[10px] font-pixel text-warm-brown uppercase tracking-widest font-bold">Lvl {level}</span>
            </div>

            {/* Activities Remaining (Games Only) */}
            <div className="flex items-center gap-1.5 bg-amber-glow/5 px-3 py-1 rounded-full border border-amber-glow/10">
              <div className="flex gap-1">
                {[...Array(actionsPerPetToday)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full ${i < activitiesRemaining ? 'bg-amber-glow' : 'bg-stone-grey/20'}`} 
                  />
                ))}
              </div>
              <span className="text-[8px] font-pixel text-amber-glow uppercase ml-0.5 whitespace-nowrap font-bold">
                {activitiesRemaining} left
              </span>
            </div>
          </div>
          
          <button onClick={onClose} className="p-2 text-stone-grey hover:text-night-plum transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-[400px]">
          {/* Interaction Visual Area */}
          <div className="flex-1 relative bg-gradient-to-b from-white/50 to-stone-grey/5 flex items-center justify-center p-12">
            <div 
              className={`relative touch-none ${mode === 'grooming' ? 'cursor-crosshair' : 'cursor-default'}`}
              onMouseMove={mode === 'grooming' ? handleGroomMouseMove : undefined}
              onTouchMove={mode === 'grooming' ? handleGroomTouchMove : undefined}
              onClick={mode === 'petting' ? handlePet : undefined}
            >
              <AnimatePresence>
                {hearts.map(h => (
                  <motion.div
                    key={h.id}
                    initial={{ scale: 0, opacity: 1, y: 0 }}
                    animate={{ scale: 1.5, opacity: 0, y: -50 }}
                    exit={{ opacity: 0 }}
                    style={{ left: h.x, top: h.y }}
                    className="absolute pointer-events-none text-soft-rose z-50 text-2xl"
                  >
                    ❤️
                  </motion.div>
                ))}
              </AnimatePresence>

            {/* Interaction Specific Overlays */}
            <AnimatePresence mode="wait">
              {mode === 'petting' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-50"
                >
                  <div className="bg-soft-rose text-white px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest animate-pulse border-2 border-white shadow-lg">
                    Tap Pet to show love ({petsDone}/3)
                  </div>
                </motion.div>
              )}
              
              {mode === 'grooming' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 pointer-events-none z-50"
                >
                  <div className="h-4 bg-stone-grey/20 rounded-full overflow-hidden border-2 border-white shadow-inner">
                    <motion.div 
                      className="h-full bg-indigo-500" 
                      animate={{ width: `${groomProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-[8px] uppercase font-bold text-night-plum mt-2 tracking-widest">Brush the pet!</p>
                </motion.div>
              )}

              {mode === 'feeding' && selectedFood && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-amber-glow pointer-events-none z-50"
                >
                  <p className="text-[10px] uppercase font-bold text-night-plum flex items-center gap-2">
                     <Utensils size={14} className="text-amber-glow" />
                     Drag treat to Pet!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

              <div ref={petRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lastAction?.id || 'idle'}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: lastAction ? 1.1 : 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <AnimalSprite 
                      spriteKey={breed?.spriteKey || 'dog_husky'} 
                      species={pet.species} 
                      size={220} 
                      animation={
                        feedbackAnimation === 'happy' 
                        ? 'happy' 
                        : (mode === 'petting' && petsDone > 0 ? 'happy' : (mode === 'grooming' ? 'happy' : 'idle'))
                      }
                      className="transition-transform duration-300"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floaties on Action */}
                {lastAction && (
                  <>
                    {/* Hearts */}
                    {[...Array(lastAction.hearts)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
                        animate={{ 
                          y: -80 - Math.random() * 40, 
                          x: (Math.random() - 0.5) * 80, 
                          opacity: 0,
                          scale: 0.8 + Math.random() * 0.5
                        }}
                        transition={{ duration: 1 + Math.random() * 0.5 }}
                        className="absolute inset-0 m-auto flex items-center justify-center text-3xl z-10 pointer-events-none"
                      >
                        ❤️
                      </motion.div>
                    ))}

                    {/* Text Pop */}
                    {lastAction.gain > 0 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.5 }}
                        animate={{ y: -60, opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 m-auto flex items-center justify-center font-pixel text-2xl text-amber-glow shadow-white drop-shadow-md z-10 pointer-events-none"
                      >
                        +{lastAction.gain} XP!
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats and Action Pane */}
          <div className="w-full md:w-[280px] bg-white border-l-2 border-stone-grey/10 p-8 flex flex-col gap-6">
            {/* XP Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-pixel text-stone-grey/60 uppercase tracking-widest">Level Progress</span>
                <span className="text-[10px] font-pixel text-night-plum font-bold">{Math.floor(xpProgress)}%</span>
              </div>
              <div className="h-4 bg-stone-grey/10 rounded-full p-1 border border-stone-grey/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-glow to-amber-500 rounded-full shadow-[0_0_8px_rgba(255,191,0,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[8px] text-stone-grey/40 text-right mt-1 font-bold">{currentXP} / {nextLevelXP} XP</p>
            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setMode(mode === 'petting' ? 'none' : 'petting')}
                className={`w-full p-2 pr-4 rounded-2xl flex items-center gap-4 transition-all active:scale-95 border-2 ${mode === 'petting' ? 'bg-soft-rose/5 border-soft-rose' : 'bg-white border-stone-grey/5 hover:border-stone-grey/10'}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-soft-rose text-warm-cream flex items-center justify-center shadow-lg shadow-soft-rose/20 transition-transform ${mode === 'petting' ? 'scale-110' : ''}`}>
                  <Heart size={24} className={mode === 'petting' ? 'fill-current' : ''} />
                </div>
                <span className="flex-1 text-left text-[10px] uppercase font-bold tracking-widest text-night-plum">Pet</span>
              </button>
              
              <button 
                onClick={() => setMode(mode === 'feeding' ? 'none' : 'feeding')}
                className={`w-full p-2 pr-4 rounded-2xl flex items-center gap-4 transition-all active:scale-95 border-2 ${mode === 'feeding' ? 'bg-amber-glow/5 border-amber-glow/50' : 'bg-white border-stone-grey/5 hover:border-stone-grey/10'}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-amber-glow text-warm-brown flex items-center justify-center shadow-lg shadow-amber-glow/20 transition-transform ${mode === 'feeding' ? 'scale-110' : ''}`}>
                  <Utensils size={24} />
                </div>
                <span className="flex-1 text-left text-[10px] uppercase font-bold tracking-widest text-night-plum">Feed</span>
              </button>

              <button 
                onClick={() => setMode(mode === 'grooming' ? 'none' : 'grooming')}
                className={`w-full p-2 pr-4 rounded-2xl flex items-center gap-4 transition-all active:scale-95 border-2 ${mode === 'grooming' ? 'bg-mossy-green/5 border-mossy-green/50' : 'bg-white border-stone-grey/5 hover:border-stone-grey/10'}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-mossy-green text-white flex items-center justify-center shadow-lg shadow-mossy-green/20 transition-transform ${mode === 'grooming' ? 'scale-110' : ''}`}>
                  <Scissors size={24} />
                </div>
                <span className="flex-1 text-left text-[10px] uppercase font-bold tracking-widest text-night-plum">Groom</span>
              </button>

              <button 
                onClick={() => { audioManager.playSFX(SFX.CLICK); onPlay(); }}
                disabled={activitiesRemaining === 0}
                className={`w-full p-2 pr-4 rounded-2xl flex items-center gap-4 transition-all active:scale-95 border-2 mt-2 ${activitiesRemaining === 0 ? 'opacity-50 grayscale' : 'bg-white border-stone-grey/5 hover:border-stone-grey/10'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-soft-lilac text-white flex items-center justify-center shadow-lg shadow-soft-lilac/20">
                  <Play size={24} className="fill-current" />
                </div>
                <span className="flex-1 text-left text-[10px] uppercase font-bold tracking-widest text-night-plum">Play Games</span>
              </button>
            </div>

            {/* Food Selection Drawer for Feeding Mode */}
            <AnimatePresence>
              {mode === 'feeding' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-stone-grey/5 rounded-2xl p-4 border-2 border-amber-glow/20"
                >
                  <p className="text-[8px] uppercase font-bold text-stone-grey/60 text-center mb-3">Grab a Treat</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {treatList.map(treat => {
                      const isSelected = selectedFood === treat.id;
                      const isCompatibleWithPet = treat.compatibleSpecies.includes(pet.species);
                      return (
                        <div key={treat.id} className="flex flex-col items-center">
                          <motion.div 
                            drag={isSelected && isCompatibleWithPet && treat.count > 0}
                            onDragStart={() => setIsDraggingFood(true)}
                            onDragEnd={handleDragEnd}
                            whileDrag={{ scale: 1.2, zIndex: 1000 }}
                            onClick={() => { 
                              if (treat.count > 0) {
                                audioManager.playSFX(SFX.CLICK); 
                                setSelectedFood(treat.id); 
                              }
                            }}
                            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-grab active:cursor-grabbing 
                              ${!isCompatibleWithPet || treat.count <= 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                              ${isSelected ? 'bg-amber-glow text-white shadow-amber-glow/40 shadow-lg border-2 border-amber-glow' : 'bg-white text-stone-grey border border-stone-grey/10 hover:scale-105'}
                            `}
                            title={`${treat.name}: ${treat.description} (XP +${treat.xpBonusValue})`}
                          >
                            {treat.id === 'basic_kibble' ? (
                              <span className="text-xl">🥣</span>
                            ) : (
                              <img src={getAssetUrl(treat.image)} alt={treat.name} className="w-8 h-8 object-contain" />
                            )}
                            
                            {treat.count !== Infinity && treat.count > 0 && (
                              <div className="absolute -top-1.5 -right-1.5 bg-speaker-rose text-white text-[7px] font-bold px-1 py-0.5 rounded-full border border-white leading-none">
                                x{treat.count}
                              </div>
                            )}
                          </motion.div>
                          <span className="text-[6px] tracking-tight text-center truncate w-14 mt-1 text-night-plum/60 font-bold uppercase leading-none">
                            {treat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {selectedFood && (() => {
                    const activeTreat = treatList.find(t => t.id === selectedFood);
                    if (!activeTreat) return null;
                    const isComp = activeTreat.compatibleSpecies.includes(pet.species);
                    return (
                      <div className="mt-3 p-2 bg-white border border-stone-grey/10 rounded-xl text-center">
                        <p className="text-[8px] font-bold text-night-plum uppercase tracking-wider leading-none">{activeTreat.name}</p>
                        <p className="text-[7px] text-stone-grey/80 mt-1 leading-normal">{activeTreat.description}</p>
                        <p className="text-[7px] font-bold mt-1 text-amber-glow leading-none">
                          {isComp 
                            ? `Drag to pet for +${activeTreat.xpBonusValue} bonus XP!`
                            : `Not compatible with ${pet.breed.replace('dog_', '').replace('cat_', '')}s!`
                          }
                        </p>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
