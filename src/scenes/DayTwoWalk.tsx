import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { dayTwoScript } from '../config/dayTwoScript';
import DialoguePanel from '../components/DialoguePanel';
import PetNameInput from '../components/PetNameInput.component';
import { AnimatePresence, motion } from 'framer-motion';
import { createStarterPet } from '../logic/ownedPet.logic';
import '../styles/opening.css';

interface DayTwoWalkProps {
  onFinish: (param?: string) => void;
  startBeatId?: string;
}

export default function DayTwoWalk({ onFinish, startBeatId }: DayTwoWalkProps) {
  const [currentBeatIndex, setCurrentBeatIndex] = useState(() => {
    if (startBeatId) {
      const idx = dayTwoScript.findIndex(b => b.id === startBeatId);
      if (idx !== -1) return idx;
    }
    const discoveryIndex = dayTwoScript.findIndex(b => b.id === 'discovery');
    return discoveryIndex !== -1 ? discoveryIndex : 0;
  });
  const [isExiting, setIsExiting] = useState(false);
  const [bgTransitioning, setBgTransitioning] = useState(false);
  const [pettingCount, setPettingCount] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const secondPetNameFromStore = useGameStore(state => state.secondPetName) || "";
  const [secondPetName, setSecondPetNameState] = useState(secondPetNameFromStore);

  const playerName = useGameStore(state => state.playerName) || "Player";
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const assignedBreed = useGameStore(state => state.assignedBreed);
  const setSecondPetName = useGameStore(state => state.setSecondPetName);
  const addOwnedPet = useGameStore(state => state.addOwnedPet);
  const ownedPets = useGameStore(state => state.ownedPets);
  const firstPetName = ownedPets[0]?.name || "the husky";

  const [currentBg, setCurrentBg] = useState('/src/assets/images/park-fountain.png');
  const [lightsDown, setLightsDown] = useState(false);
  const [showTitleCard, setShowTitleCard] = useState<string[] | null>(null);
  const [nightFade, setNightFade] = useState(false);
  
  // Drag and Drop state for dragTuckIn
  const [bedPlaced, setBedPlaced] = useState(true); // Auto-place bed
  const [bedPosition, setBedPosition] = useState({ top: '60%', left: '42%' }); // Removed staging area
  const [isDragging, setIsDragging] = useState(false);
  const [petTucked, setPetTucked] = useState(false);

  // Auto-set background based on initial beat
  useEffect(() => {
    const beat = dayTwoScript[currentBeatIndex];
    if (beat?.type === 'background' && (beat as any).image) {
      setCurrentBg((beat as any).image as string);
    } else {
      // Find latest background image before this beat
      for (let i = currentBeatIndex; i >= 0; i--) {
        const prevBeat = dayTwoScript[i];
        if (prevBeat.type === 'background' && (prevBeat as any).image) {
          setCurrentBg((prevBeat as any).image as string);
          break;
        }
      }
    }
  }, [currentBeatIndex]);

  const currentBeat = dayTwoScript[currentBeatIndex];

  // Handle auto-advancing beats like pause, background, lightsDown, titleCard, nightFade, and end
  useEffect(() => {
    if (!currentBeat) return;

    if (currentBeat.type === 'end') {
      if (currentBeat.next) {
        const nextIndex = dayTwoScript.findIndex(b => b.id === currentBeat.next);
        if (nextIndex !== -1) {
          setCurrentBeatIndex(nextIndex);
        } else {
          handleEnd(currentBeat.next);
        }
      } else {
        handleEnd();
      }
      return;
    }

    if (currentBeat.type === 'pause') {
      const timer = setTimeout(advance, currentBeat.ms || 500);
      return () => clearTimeout(timer);
    }

    if (currentBeat.type === 'background' && currentBeat.image) {
      setBgTransitioning(true);
      setTimeout(() => {
        setCurrentBg(currentBeat.image);
        setBgTransitioning(false);
        advance();
      }, currentBeat.duration || 1000);
    }

    if (currentBeat.type === 'lightsDown') {
      setLightsDown(true);
      setTimeout(advance, currentBeat.duration || 1600);
    }

    if (currentBeat.type === 'titleCard' && currentBeat.lines) {
      setShowTitleCard(currentBeat.lines.map(l => processText(l)));
      // This usually needs a wait or a click to dismiss. 
      // The plan doesn't specify, but usually these auto-advance or need a tap.
      // Let's make it auto-advance after a few seconds.
      const timer = setTimeout(() => {
        setShowTitleCard(null);
        advance();
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (currentBeat.type === 'nightFade') {
      setNightFade(true);
      setTimeout(advance, currentBeat.holdMs || 1400);
    }
  }, [currentBeatIndex]);

  const advance = () => {
    if (!currentBeat) return;
    if (currentBeatIndex < dayTwoScript.length - 1) {
      setCurrentBeatIndex(prev => prev + 1);
    } else {
      handleEnd();
    }
  };

  const handleEnd = (nextParam?: string) => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish(nextParam || (currentBeat?.type === 'end' ? currentBeat.next : undefined));
    }, 800);
  };

  const handleBondWithPet = () => {
    if (currentBeat?.type === 'pettingInteraction') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      
      const newCount = pettingCount + 1;
      setPettingCount(newCount);
      
      window.dispatchEvent(new CustomEvent('spawn-heart', { 
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      }));

      if (newCount >= (currentBeat.requiredPets || 3)) {
        setPettingCount(0);
        advance();
      }
    } else if (currentBeat?.type === 'dragTuckIn' && bedPlaced && !petTucked) {
      setPetTucked(true);
      window.dispatchEvent(new CustomEvent('spawn-heart', { 
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      }));
      setTimeout(advance, 1500);
    } else if (currentBeat?.type === 'tuckInInteraction') {
      setPetTucked(true);
      window.dispatchEvent(new CustomEvent('spawn-heart', { 
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
      }));
      setTimeout(() => {
        setPetTucked(false);
        advance();
      }, 1500);
    }
  };

  const handleNameConfirm = (name: string) => {
    setSecondPetName(name);
    setSecondPetNameState(name);
    
    if (rescueBreed) {
      const pet = createStarterPet(rescueBreed, name);
      addOwnedPet(pet);
    }
    advance();
  };

  // Drag logic for bed
  const handleDragBed = (e: React.DragEvent | React.TouchEvent) => {
    // Simple position update if we were to use a library, but let's do a basic one
  };

  const onBedDrop = () => {
    if (currentBeat?.type !== 'dragTuckIn' || !currentBeat.bedTargetPosition) return;
    
    const targetPos = currentBeat.bedTargetPosition;
    // For simplicity in this environment, since we can't easily do full Dnd without refs/listeners:
    // We'll just toggle it placed if clicked for now, or simulate the drop.
    // Let's actually implement a basic drag state.
    setBedPlaced(true);
    setBedPosition(targetPos);
  };

  const processText = (text: string) => {
    return text
      .replace(/{{playerName}}/g, playerName)
      .replace(/{{secondPetName}}/g, secondPetName)
      .replace(/{{firstPetName}}/g, firstPetName);
  };

  const isNarration = currentBeat?.type === 'dialogue' && !currentBeat.speaker;
  
  const discoveryIndex = dayTwoScript.findIndex(b => b.id === 'discovery');
  const shelterDecisionIndex = dayTwoScript.findIndex(b => b.id === 'shelterDecision');
  const spareRoomIndex = dayTwoScript.findIndex(b => b.id === 'spareRoomScene');

  const showCorgi = (
    currentBeat?.spriteKey === 'corgi' ||
    (currentBeatIndex >= discoveryIndex && currentBeatIndex < shelterDecisionIndex) ||
    (currentBeatIndex >= spareRoomIndex && currentBg.includes('spare-room'))
  );

  const showHusky = (
    currentBeat?.spriteKey === 'husky'
  );

  return (
    <div className={`opening-sequence ${isExiting ? 'opening-fade-exit' : ''}`}>
      {/* Background Layer */}
      <div className="opening-background-container">
        <div 
          className="opening-background"
          style={{ 
            backgroundImage: `url('${currentBg}')`,
            opacity: bgTransitioning ? 0 : 1,
            transition: 'opacity 1.2s ease-in-out'
          }}
        />
        <div className="opening-overlay" />
        
        {/* Night/LightsDown Overlays */}
        <AnimatePresence>
          {lightsDown && (
            <motion.div 
              key="lights-down"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="absolute inset-0 bg-black pointer-events-none z-10"
            />
          )}
          {nightFade && (
            <motion.div 
              key="night-fade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black pointer-events-none z-[100]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Discovery Interaction / Pet View */}
      {/* Discovery Interaction / Pet View */}
      {(showCorgi || showHusky) || currentBeat?.type === 'dragTuckIn' ? (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
          
          {/* Pet Bed Target - Rendered FIRST to be underneath */}
          {(currentBeat?.type === 'dragTuckIn' || currentBeat?.type === 'tuckInInteraction') && (
            <motion.div
              id="pet-bed-target"
              layout
              className="absolute z-30 transition-all touch-none pointer-events-none"
              style={{
                top: currentBeat?.type === 'tuckInInteraction' ? '65%' : bedPosition.top,
                left: currentBeat?.type === 'tuckInInteraction' ? '35%' : bedPosition.left,
                width: currentBeat?.type === 'tuckInInteraction' ? '180px' : '150px'
              }}
            >
              <img src="/src/assets/images/pet-bed.png" alt="Pet Bed" className="w-full pixelated drop-shadow-lg" />
            </motion.div>
          )}

          {/* Standing/Sleeping Pet Layer - Rendered SECOND to be on top */}
          {(showCorgi || showHusky) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute pt-[5vh] transition-transform z-50 touch-none ${isShaking ? 'shake' : ''} ${(currentBeat?.type === 'dragTuckIn' || currentBeat?.type === 'tuckInInteraction') && !petTucked ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : 'pointer-events-auto'}`}
              style={{
                top: petTucked ? (currentBeat?.type === 'tuckInInteraction' ? '58%' : '52%') : '30%',
                left: petTucked ? (currentBeat?.type === 'tuckInInteraction' ? '41%' : '44%') : '50%',
                transform: petTucked ? 'translate(-50%, -50%)' : 'translate(-50%, 0)',
                zIndex: petTucked ? 40 : 50
              }}
              onClick={currentBeat?.type === 'pettingInteraction' ? handleBondWithPet : undefined}
              onPointerDown={(e) => {
                if ((currentBeat?.type === 'dragTuckIn' || currentBeat?.type === 'tuckInInteraction') && !petTucked) {
                  const el = e.currentTarget;
                  try { el.setPointerCapture(e.pointerId); } catch(ex) {}
                  
                  let startX = e.clientX;
                  let startY = e.clientY;
                  let currentTranslateX = 0;
                  let currentTranslateY = 0;
                  
                  // Use transform relative to layout
                  el.style.transform = `translate(calc(-50% + ${currentTranslateX}px), ${currentTranslateY}px) scale(1.05)`;

                  const onPointerMove = (moveEvent: PointerEvent) => {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;
                    startX = moveEvent.clientX;
                    startY = moveEvent.clientY;
                    currentTranslateX += dx;
                    currentTranslateY += dy;
                    el.style.transform = `translate(calc(-50% + ${currentTranslateX}px), ${currentTranslateY}px) scale(1.05)`;
                  };

                  const onPointerUp = () => {
                    el.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    try {
                      if (el.hasPointerCapture(e.pointerId)) {
                        el.releasePointerCapture(e.pointerId);
                      }
                    } catch(ex) {}
                    
                    const rect = el.getBoundingClientRect();
                    const targetRect = document.getElementById('pet-bed-target')?.getBoundingClientRect() || null;
                    
                    if (targetRect) {
                      const petCenterX = rect.left + rect.width / 2;
                      const petCenterY = rect.top + rect.height / 2;
                      const bedCenterX = targetRect.left + targetRect.width / 2;
                      const bedCenterY = targetRect.top + targetRect.height / 2;
                      
                      const dist = Math.sqrt(Math.pow(petCenterX - bedCenterX, 2) + Math.pow(petCenterY - bedCenterY, 2));
                      
                      if (dist < 150) { // Forgiving drag area
                        setPetTucked(true);
                        window.dispatchEvent(new CustomEvent('spawn-heart', { 
                          detail: { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
                        }));
                        el.style.transform = `translate(-50%, -50%)`;
                        setTimeout(() => {
                           setPetTucked(false);
                           advance();
                        }, 1500);
                        return;
                      }
                    }
                    el.style.transform = `translate(-50%, 0)`;
                  };

                  el.addEventListener('pointermove', onPointerMove);
                  window.addEventListener('pointerup', onPointerUp); // Bind to window for better release on touch
                }
              }}
            >
              {showCorgi && (
                 <div className="relative">
                   <img 
                    src="/src/assets/images/animals/dogs/corgi.png" 
                    alt="Corgi" 
                    className={`pixelated w-48 h-48 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] ${petTucked ? 'hidden' : 'animate-soft-pulse'}`}
                  />
                  {petTucked && (
                     <div className="relative">
                       <img 
                        src="/src/assets/images/animals/dogs/corgi.png" 
                        alt="Corgi Sleep" 
                        className="pixelated w-48 h-48 opacity-100 scale-y-75 translate-y-6 animate-gentle-breathe"
                      />
                      <div className="absolute -top-12 right-0 text-soft-rose font-bold text-4xl animate-zzz opacity-0 pointer-events-none">Zzz</div>
                     </div>
                  )}
                 </div>
              )}

              {showHusky && (
                <div className="relative">
                   <img 
                    src={`/src/assets/images/animals/dogs/${assignedBreed ? assignedBreed.spriteKey : 'husky'}.png`}
                    alt="Husky" 
                    className={`pixelated w-56 h-56 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] ${petTucked ? 'hidden' : 'animate-soft-pulse'}`}
                  />
                  {petTucked && (
                    <div className="relative">
                       <img 
                        src={`/src/assets/images/animals/dogs/${assignedBreed ? assignedBreed.spriteKey : 'husky'}.png`}
                        alt="Husky Sleep" 
                        className="pixelated w-56 h-56 opacity-100 scale-y-75 translate-y-12 animate-gentle-breathe"
                      />
                      <div className="absolute -top-12 right-0 text-soft-rose font-bold text-4xl animate-zzz opacity-0 pointer-events-none">Zzz</div>
                    </div>
                  )}
                 </div>
              )}
            </motion.div>
          )}
        </div>
      ) : null}

      {/* Interactions Overlay */}
      {currentBeat?.type === 'nameInput' && (
         <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-night-plum/40 backdrop-blur-sm">
           <PetNameInput 
             prompt={processText(currentBeat.placeholder || "Name your corgi")}
             spriteKey="corgi"
             onConfirm={handleNameConfirm}
           />
         </div>
      )}

      {/* Floating Interaction Instructions */}
      {['pettingInteraction', 'tuckInInteraction', 'dragTuckIn'].includes(currentBeat?.type) && !bgTransitioning && (
        <div className="absolute top-[12vh] left-1/2 -translate-x-1/2 z-[100] w-[85%] max-w-sm text-center pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             key={currentBeatIndex + (bedPlaced ? '-placed' : '')}
             className="bg-warm-cream/80 backdrop-blur-md px-6 py-4 rounded-3xl border-2 border-soft-rose/30 shadow-lg"
           >
              <p className="text-sm font-medium text-night-plum/90 leading-relaxed">
                {petTucked ? "Perfect." : processText(
                  (currentBeat.type === 'dragTuckIn' && !bedPlaced) 
                  ? (currentBeat.promptText || '') 
                  : (currentBeat.confirmText || currentBeat.promptText || '')
                )}
              </p>
              {currentBeat.type === 'pettingInteraction' && !petTucked && (
                 <div className="mt-3 flex justify-center gap-1.5">
                  {Array.from({ length: currentBeat.requiredPets || 3 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < pettingCount ? 'bg-soft-rose scale-110' : 'bg-stone-grey/20 scale-100'}`} 
                    />
                  ))}
                </div>
              )}
           </motion.div>
        </div>
      )}

      {/* Title Card */}
      <AnimatePresence>
        {showTitleCard && (
          <motion.div 
            key="title-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-night-plum flex flex-col items-center justify-center text-center p-12"
          >
            {showTitleCard.map((line, i) => (
              <motion.p
                key={`title-card-line-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.8 }}
                className={`${i === 0 ? 'text-xl font-game text-warm-cream mb-4' : 'text-sm text-soft-lilac italic'}`}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue Panel */}
      <div className="dialogue-wrapper">
        {currentBeat?.type === 'dialogue' && currentBeat.text && !bgTransitioning && (
          <DialoguePanel
            speaker={currentBeat.speaker ?? null}
            text={processText(currentBeat.text)}
            variant={currentBeat.style as any}
            onComplete={advance}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .pixelated { image-rendering: pixelated; }
        .shake { animation: shake 0.3s ease-in-out; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-gentle-breathe {
          animation: gentle-breathe 2s ease-in-out infinite;
        }
        @keyframes gentle-breathe {
          0%, 100% { transform: scaleY(0.75) translateY(40px); }
          50% { transform: scaleY(0.78) translateY(38px); }
        }
        .animate-zzz {
          animation: zzz 3s ease-in-out infinite;
        }
        @keyframes zzz {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          30% { opacity: 0.8; transform: translateY(-20px) scale(1) translateX(10px); }
          60% { opacity: 0.4; transform: translateY(-40px) scale(1.2) translateX(-10px); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.4) translateX(10px); }
        }
      `}} />
    </div>
  );
}
