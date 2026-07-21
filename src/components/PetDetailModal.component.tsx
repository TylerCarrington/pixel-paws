import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../stores/game.store';
import { Animal, Species } from '../types/animal.types';
import AnimalSprite from './AnimalSprite.component';
import MoodIndicator from './MoodIndicator.component';
import DecorationMode from './DecorationMode.component';
import OutfitSelector from './OutfitSelector.component';
import { getBreedDefinition } from '../logic/animalAssets.logic';
import { Heart, Utensils, Baby, Sparkles, X, Edit2, Palette, Lock, Unlock } from 'lucide-react';

interface PetDetailModalProps {
  animal: Animal;
  onClose: () => void;
}

export default function PetDetailModal({ animal: initialAnimal, onClose }: PetDetailModalProps) {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const ownedPets = useGameStore(state => state.ownedPets);
  const performCareAction = useGameStore(state => state.performCareAction);
  const nameShelterAnimal = useGameStore(state => state.nameShelterAnimal);
  const toggleLockShelterAnimal = useGameStore(state => state.toggleLockShelterAnimal);
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);
  const bringPetHome = useGameStore(state => state.bringPetHome);
  const homeDogCapacity = useGameStore(state => state.homeDogCapacity);
  const homeCatCapacity = useGameStore(state => state.homeCatCapacity);
  
  const animal = shelterAnimals.find(a => a.id === initialAnimal.id) || ownedPets.find(a => a.id === initialAnimal.id) || initialAnimal;
  const isCat = animal.species === Species.CAT;
  const breed = getBreedDefinition(animal.breed);

  const canBringHome = !animal.isMine && (
    (animal.species === Species.DOG && ownedPets.filter(p => p.species === Species.DOG).length < homeDogCapacity) ||
    (animal.species === Species.CAT && ownedPets.filter(p => p.species === Species.CAT).length < homeCatCapacity)
  );

  const [lastAction, setLastAction] = useState<{ id: string; gain: number; modifier: number } | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [newName, setNewName] = useState(animal.name || '');
  const [isDecorating, setIsDecorating] = useState(false);
  const [showBringHomeConfirm, setShowBringHomeConfirm] = useState(false);

  const actions = [
    { id: 'pet', label: 'Pet', icon: Heart, color: 'bg-soft-rose' },
    { id: 'feed', label: 'Feed', icon: Utensils, color: 'bg-amber-glow' },
    { id: 'play', label: 'Play', icon: Baby, color: 'bg-soft-lilac' },
    { id: 'groom', label: 'Groom', icon: Sparkles, color: 'bg-mossy-green' }
  ] as const;

  const handleAction = (actionId: 'pet' | 'feed' | 'play' | 'groom') => {
    if (animal.actionsUsedToday >= actionsPerPetToday) return;

    // Calculate effectiveness for UI feedback (must match store logic)
    const baseGains: Record<string, number> = { pet: 5, feed: 8, play: 12, groom: 10 };
    const moodModifiers: Record<string, Record<string, number>> = {
      Happy: { pet: 1.0, feed: 1.0, play: 1.4, groom: 0.9 },
      Calm: { pet: 1.2, feed: 1.0, play: 1.1, groom: 1.3 },
      Anxious: { pet: 1.3, feed: 1.1, play: 0.6, groom: 0.7 },
      Shy: { pet: 1.4, feed: 1.0, play: 0.7, groom: 1.2 }
    };
    
    const base = baseGains[actionId];
    const modifier = moodModifiers[animal.mood]?.[actionId] || 1.0;
    const hiddenBonus = animal.hiddenBonuses?.[actionId] || 0;
    const gain = Math.max(1, Math.round((base * modifier) + hiddenBonus)); // Show total including hidden bonus

    performCareAction(animal.id, actionId);
    setLastAction({ id: actionId, gain, modifier });
    setTimeout(() => setLastAction(null), 1500);
  };

  const handleNameConfirm = () => {
    if (newName.trim()) {
      nameShelterAnimal(animal.id, newName.trim());
      setIsNaming(false);
    }
  };

  const getFeedbackConfig = (mod: number) => {
    if (mod >= 1.2) return { color: 'text-mossy-green', hearts: 6, scale: 1.2, label: 'Great!' };
    if (mod >= 0.9) return { color: 'text-amber-glow', hearts: 3, scale: 1.0, label: 'Nice' };
    return { color: 'text-stone-grey', hearts: 1, scale: 0.8, label: 'Okay' };
  };

  const feedback = lastAction ? getFeedbackConfig(lastAction.modifier) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-night-plum/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-[#f9f4ef] w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl border-4 border-stone-grey/10 custom-scrollbar flex flex-col"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-grey/5 hover:bg-stone-grey/10 rounded-full transition-colors z-20"
          >
            <X size={20} className="text-stone-grey" />
          </button>

          {/* Header/Hero */}
          <div className="relative h-36 sm:h-44 flex items-center justify-center bg-[#fdfaf7] border-b border-stone-grey/5 shrink-0">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#b0a898 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={lastAction?.id || 'idle'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: feedback?.scale || 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <AnimalSprite 
                  spriteKey={breed?.spriteKey || 'dog_husky'} 
                  species={animal.species}
                  size={isCat ? 16 * 4 : 16 * 4.5} 
                  animation={lastAction ? (feedback && feedback.hearts > 3 ? 'happy' : 'idle') : (animal.mood === 'Happy' ? 'happy' : 'idle')}
                />
              </motion.div>
            </AnimatePresence>

            {/* Floaties on Action */}
            {lastAction && feedback && (
              <>
                {/* Hearts */}
                {[...Array(feedback.hearts)].map((_, i) => (
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
                    className="absolute text-xl"
                  >
                    ❤️
                  </motion.div>
                ))}

                {/* Text Pop */}
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.5 }}
                  animate={{ y: -60, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute font-pixel text-lg ${feedback.color} shadow-white drop-shadow-sm`}
                >
                  +{lastAction.gain}!
                </motion.div>
              </>
            )}
            
            {/* Care Points Badge */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-stone-grey/10 flex items-center gap-2 shadow-sm">
              <div className="flex gap-1">
                {[...Array(actionsPerPetToday)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full ${i < (actionsPerPetToday - animal.actionsUsedToday) ? 'bg-amber-glow shadow-[0_0_8px_rgba(245,200,122,0.5)]' : 'bg-stone-grey/20'}`} 
                  />
                ))}
              </div>
              <span className="text-[9px] font-pixel text-stone-grey uppercase tracking-widest">
                {actionsPerPetToday - animal.actionsUsedToday} Left
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-5 flex flex-col gap-3">
            <div className="text-center relative px-4">
              {isNaming ? (
                <div className="bg-white/50 p-2 rounded-2xl border border-amber-glow/30" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => {
                      e.stopPropagation();
                      setNewName(e.target.value);
                    }}
                    className="w-full bg-white border-2 border-amber-glow rounded-xl px-3 py-2 text-center font-pixel text-[10px] focus:outline-none mb-2 text-night-plum"
                    autoFocus
                    placeholder="ENTER NAME..."
                    maxLength={15}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') handleNameConfirm();
                    }}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleNameConfirm} className="flex-1 bg-amber-glow text-warm-brown text-[8px] font-pixel uppercase tracking-widest py-2 rounded-lg hover:brightness-105 active:scale-95 transition-all">
                      Confirm {animal.hasBeenNamed ? '' : '(+10 Desirability)'}
                    </button>
                    <button onClick={() => setIsNaming(false)} className="flex-1 bg-stone-grey/10 text-stone-grey text-[8px] font-pixel uppercase tracking-widest py-2 rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 group">
                    <h3 className="text-base sm:text-lg font-pixel text-night-plum">{animal.name || 'Rescued Pet'}</h3>
                    <button 
                      onClick={() => {
                        setIsNaming(true);
                        // If it's a generic name, clear it for a fresh start
                        if (!animal.name || animal.name === 'Rescued Pet' || animal.name === 'Rescued Animal') {
                          setNewName('');
                        } else {
                          setNewName(animal.name);
                        }
                      }}
                      className="p-1.5 bg-amber-glow text-warm-brown rounded-lg hover:rotate-12 transition-transform shadow-sm"
                      title={animal.hasBeenNamed ? "Change Name" : "Give Name (+10 Desirability bonus)"}
                    >
                       {animal.hasBeenNamed ? <Edit2 size={10} /> : <Heart size={10} fill="currentColor" />}
                    </button>
                  </div>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-stone-grey font-pixel mt-0.5">{breed?.name} • {animal.rarity}</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 bg-stone-grey/5 p-2.5 rounded-2xl">
              <div className="flex items-center gap-2 px-1">
                <MoodIndicator mood={animal.mood} />
                <span className="text-[8px] font-pixel text-stone-grey uppercase tracking-widest">{animal.mood}</span>
              </div>
              <div className="text-right border-l border-stone-grey/10 px-2 flex flex-col justify-center">
                <span className="text-[7px] text-stone-grey font-pixel uppercase tracking-wider">Desirability</span>
                <span className="text-xs font-pixel text-mossy-green">{animal.desirability}/100</span>
              </div>
            </div>

            {/* Desirability Bar (Large) */}
            <div className="h-2.5 w-full bg-stone-grey/10 rounded-full overflow-hidden shrink-0 border border-stone-grey/5">
               <motion.div 
                 className="h-full bg-mossy-green shadow-[0_0_8px_rgba(72,106,80,0.3)]" 
                 initial={{ width: 0 }}
                 animate={{ width: `${animal.desirability}%` }}
                 transition={{ duration: 1 }}
               />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-2">
              {actions.map(action => {
                const Icon = action.icon;
                const used = animal.actionsUsedToday >= actionsPerPetToday;
                return (
                  <button
                    key={action.id}
                    disabled={used}
                    onClick={() => handleAction(action.id as any)}
                    className={`relative p-2 rounded-xl border transition-all flex flex-col items-center gap-1.5 group
                      ${used 
                        ? 'opacity-30 grayscale pointer-events-none bg-stone-grey/5' 
                        : 'bg-white border-stone-grey/10 hover:border-night-plum/20 hover:shadow-md active:scale-95'
                      }
                    `}
                  >
                    <div className={`p-1.5 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={14} className="text-white" />
                    </div>
                    <span className="text-[7px] font-pixel uppercase tracking-widest text-night-plum/60">{action.label}</span>
                  </button>
                );
              })}
            </div>

            {!animal.isMine && (
              <div className="mt-1 bg-stone-grey/5 p-2.5 rounded-2xl border border-stone-grey/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl transition-colors ${animal.isLocked ? 'bg-amber-glow text-warm-brown shadow-sm' : 'bg-stone-grey/10 text-stone-grey'}`}>
                    {animal.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                  </div>
                  <div>
                    <p className="text-[9px] font-pixel text-night-plum uppercase tracking-wider">
                      {animal.isLocked ? 'Hold Active (Locked)' : 'Open for Adoption'}
                    </p>
                    <p className="text-[8px] font-pixel text-stone-grey leading-tight mt-0.5">
                      {animal.isLocked ? 'Protected from adoption ceremony' : 'Can be adopted by visiting families'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleLockShelterAnimal(animal.id)}
                  className={`px-3 py-2 rounded-xl font-pixel text-[8px] uppercase tracking-widest transition-all active:scale-95 shrink-0 ${
                    animal.isLocked
                      ? 'bg-amber-glow text-warm-brown font-bold hover:brightness-105 shadow-sm'
                      : 'bg-stone-grey/10 text-stone-grey hover:bg-stone-grey/20'
                  }`}
                >
                  {animal.isLocked ? 'Unlock' : 'Lock Hold'}
                </button>
              </div>
            )}

            {animal.isMine && (
              <div className="flex flex-col gap-3 pt-2 border-t border-stone-grey/10">
                <OutfitSelector pet={animal} />
                <button
                  onClick={() => setIsDecorating(true)}
                  className="w-full py-3 bg-amber-glow text-warm-brown font-pixel text-[9px] uppercase tracking-widest rounded-xl hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Palette size={14} />
                  Decorate House
                </button>
              </div>
            )}

            {canBringHome && !showBringHomeConfirm && (
              <button
                 onClick={() => setShowBringHomeConfirm(true)}
                 className="w-full mt-2 py-3 bg-amber-glow text-warm-brown font-pixel text-[9px] uppercase tracking-widest rounded-xl hover:brightness-105 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Heart size={14} fill="currentColor" />
                Bring Home Permanently
              </button>
            )}

            {canBringHome && showBringHomeConfirm && (
              <div className="mt-2 p-4 bg-white/50 border-2 border-amber-glow rounded-2xl flex flex-col gap-3">
                <p className="text-[9px] font-pixel text-night-plum text-center leading-relaxed">
                  ARE YOU SURE YOU WANT TO BRING {animal.name?.toUpperCase() || 'THIS PET'} HOME? THEY WILL NO LONGER BE AVAILABLE FOR ADOPTION.
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      bringPetHome(animal.id);
                      onClose();
                    }}
                    className="flex-1 py-2 bg-amber-glow text-warm-brown font-pixel text-[8px] uppercase tracking-widest rounded-lg"
                  >
                    Yes, Welcome Home!
                  </button>
                  <button 
                    onClick={() => setShowBringHomeConfirm(false)}
                    className="flex-1 py-2 bg-stone-grey/10 text-stone-grey font-pixel text-[8px] uppercase tracking-widest rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
               onClick={onClose}
               className="w-full mt-1 py-2.5 bg-night-plum text-warm-cream font-pixel text-[9px] uppercase tracking-widest rounded-xl hover:bg-night-plum/90 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
        
        {isDecorating && (
          <DecorationMode 
            pet={animal} 
            onClose={() => setIsDecorating(false)} 
          />
        )}
      </div>
    </AnimatePresence>
  );
}
