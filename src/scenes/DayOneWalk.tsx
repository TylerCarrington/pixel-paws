import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { dayOneScript } from '../config/dayOneScript';
import DialoguePanel from '../components/DialoguePanel';
import BlossomLayer from '../components/BlossomLayer';
import PetNameInput from '../components/PetNameInput.component';
import { createStarterPet } from '../logic/ownedPet.logic';
import '../styles/opening.css';

interface DayOneWalkProps {
  onFinish: (nextParam?: string) => void;
  startBeatId?: string;
}

export default function DayOneWalk({ onFinish, startBeatId }: DayOneWalkProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (startBeatId) {
      const idx = dayOneScript.findIndex(b => b.id === startBeatId);
      return Math.max(0, idx);
    }
    return 0;
  });
  const [isExiting, setIsExiting] = useState(false);

  const [bgImage, setBgImage] = useState(() => {
    if (startBeatId === 'postReveal') return './src/assets/images/backgrounds/riverside-bridge-close.png';
    return './src/assets/images/backgrounds/outside-house.jpeg';
  });
  const [bgTransitioning, setBgTransitioning] = useState(false);
  const [bgFadeOpacity, setBgFadeOpacity] = useState(1);

  const [nightActive, setNightActive] = useState(false);
  const [starsVisible, setStarsVisible] = useState(false);
  const [lightsDownActive, setLightsDownActive] = useState(false);

  const [titleCardLines, setTitleCardLines] = useState<string[]>([]);
  const [visibleTitleLines, setVisibleTitleLines] = useState<Set<number>>(new Set());

  const [dayCardLabel, setDayCardLabel] = useState<string | null>(null);
  const [dayCardVisible, setDayCardVisible] = useState(false);

  const townName = useGameStore(state => state.townName) || "Hanami Village";
  const playerName = useGameStore(state => state.playerName) || "Player";
  const assignedBreed = useGameStore(state => state.assignedBreed);
  const addOwnedPet = useGameStore(state => state.addOwnedPet);
  const firstPetName = useGameStore(state => state.ownedPets[state.ownedPets.length - 1]?.name) || "Husky";

  // Interaction states
  const [petCount, setPetCount] = useState(0);
  const [sceneState, setSceneState] = useState<'prompt' | 'completion'>('prompt');
  const [bedTapped, setBedTapped] = useState(false);
  const [huskyTucked, setHuskyTucked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const currentBeat = dayOneScript[currentIndex];

  useEffect(() => {
    if (!currentBeat) return;

    setPetCount(0);
    setSceneState('prompt');
    setBedTapped(false);
    // setHuskyTucked(false); // PERSISTENCE: Don't reset if they've tucked it in
    setIsShaking(false);

    if (currentBeat.type === 'pause') {
      const timer = setTimeout(() => {
        advance();
      }, currentBeat.ms);
      return () => clearTimeout(timer);
    }
    
    if (currentBeat.type === 'background') {
      if (currentBeat.transition === 'none') {
        setBgImage(currentBeat.image);
        setBgFadeOpacity(1);
        setBgTransitioning(false);
        advance();
        return;
      }
      handleBackgroundBeat(currentBeat);
    }

    if (currentBeat.type === 'nightFade') {
      handleNightFade(currentBeat);
    }

    if (currentBeat.type === 'titleCard') {
      handleTitleCard(currentBeat);
    }

    if (currentBeat.type === 'dayCard') {
      handleDayCard(currentBeat);
    }

    if (currentBeat.type === 'lightsDown') {
      setLightsDownActive(true);
      setTimeout(() => {
         advance();
      }, currentBeat.duration || 1600);
    }

    if (currentBeat.type === 'end') {
      handleEnd(currentBeat.next);
    }
  }, [currentIndex, currentBeat]);

  const advance = () => {
    if (currentIndex < dayOneScript.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBackgroundBeat = (beat: any) => {
    setBgTransitioning(true);
    setBgFadeOpacity(0);
    
    const halfDuration = (beat.duration || 1000) / 2;
    
    setTimeout(() => {
      setBgImage(beat.image);
      setBgFadeOpacity(1);
      
      setTimeout(() => {
        setBgTransitioning(false);
        advance();
      }, halfDuration);

    }, halfDuration);
  };

  const handleNightFade = (beat: any) => {
    setNightActive(true);
    
    setTimeout(() => {
      setStarsVisible(true);
      
      setTimeout(() => {
        advance();
      }, beat.holdMs || 1800);
      
    }, 1000); // Wait for background to go dark
  };

  const handleTitleCard = (beat: any) => {
    setTitleCardLines(beat.lines);
    setVisibleTitleLines(new Set());
    
    beat.lines.forEach((_: any, idx: number) => {
      setTimeout(() => {
        setVisibleTitleLines(prev => new Set(prev).add(idx));
      }, idx * 600);
    });

    const totalAnimTime = (beat.lines.length - 1) * 600 + 600;
    
    setTimeout(() => {
      advance();
    }, totalAnimTime + 2400); // 2400ms hold
  };

  const handleDayCard = (beat: any) => {
    setDayCardLabel(beat.label);
    setDayCardVisible(true);
    setNightActive(false);
    setStarsVisible(false);
    setLightsDownActive(false);
    setTitleCardLines([]);
    
    setTimeout(() => {
      setDayCardVisible(false);
      setTimeout(() => advance(), 400);
    }, 2000); // 400 fade in + 1600 hold
  };

  const handleEnd = (nextParam?: string) => {
    setIsExiting(true);
    if (nextParam === 'dayTwoMorning') {
      localStorage.setItem('dayOneWalkSeen', 'true');
    }
    setTimeout(() => {
      onFinish(nextParam);
    }, 800);
  };

  const handleNameConfirm = (name: string) => {
    if (assignedBreed) {
      const pet = createStarterPet(assignedBreed, name);
      addOwnedPet(pet);
    }
    advance();
  };

  const handleBondWithPet = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (sceneState === 'completion') {
      advance();
      return;
    }
    
    const newCount = petCount + 1;
    setPetCount(newCount);
    
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const event = new CustomEvent('spawn-heart', {
      detail: { x: clientX, y: clientY }
    });
    window.dispatchEvent(event);

    if (newCount >= (currentBeat.requiredPets || 3)) {
      setSceneState('completion');
      // They can click to advance now
    }
  };

  const handleTuckInHusky = () => {
    if (bedTapped && !huskyTucked) {
      setHuskyTucked(true);
      setSceneState('completion');
      setTimeout(() => advance(), 2000); // give it a moment to show completion text
    } else if (huskyTucked && sceneState === 'completion') {
      advance();
    }
  };

  const processText = (text: string) => {
    return text
      .replace('{{playerName}}', playerName)
      .replace('{{townName}}', townName)
      .replace('{{firstPetName}}', firstPetName)
      .replace('{{breedName}}', (assignedBreed?.name || 'husky').toLowerCase());
  };

  const getSpriteKey = (beat: any) => {
    if (beat?.spriteKey === 'DYNAMIC') {
      return assignedBreed?.spriteKey || 'husky';
    }
    return beat?.spriteKey || 'husky';
  };

  const postRevealIndex = dayOneScript.findIndex(b => b.id === 'postReveal');
  const gatheredIndex = dayOneScript.findIndex(b => b.text === '{{playerName}} gathered them up carefully and started back up the hill.');
  
  // Show pet standing in the middle from reveal until gathered
  const showStandingPetRiverside = currentIndex >= postRevealIndex && 
                                   currentIndex <= gatheredIndex && 
                                   postRevealIndex !== -1 &&
                                   gatheredIndex !== -1;

  // Show pet standing in the middle when in the interior but not yet tucked in
  const showStandingPetInterior = bgImage.includes('house-interior') && 
                                   !huskyTucked;

  const showInteriorBed = bgImage.includes('house-interior');

  if (currentIndex >= dayOneScript.length || (isExiting && !currentBeat)) return null;

  const showMist = bgImage.includes('riverside');

  const getHalfDurationStr = () => {
    if (currentBeat?.type === 'background' && currentBeat.duration) {
      return `${currentBeat.duration / 2 / 1000}s`;
    }
    return '0.5s';
  };

  return (
    <div className={`opening-sequence ${isExiting ? 'opening-fade-exit' : ''}`}>
      <div className={`opening-background-container ${lightsDownActive ? 'brightness-50' : ''}`} style={{ transition: `opacity ${getHalfDurationStr()} ease-in-out, filter 1.6s ease-in-out`, opacity: bgFadeOpacity }}>
        <div 
          className="opening-background" 
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className={`mist-overlay ${showMist ? 'visible' : ''}`} />
      </div>

      {!bgImage.includes('house-interior') && <BlossomLayer />}
      
      <div className={`night-overlay ${nightActive ? 'visible' : ''}`} />
      
      {/* Stars */}
      <div className={`star ${starsVisible ? 'visible' : ''}`} style={{ top: '18%', left: '22%', '--star-opacity': 0.9, width: '2px', height: '2px', transitionDelay: '0ms' } as React.CSSProperties} />
      <div className={`star ${starsVisible ? 'visible' : ''}`} style={{ top: '12%', left: '55%', '--star-opacity': 0.7, width: '1.5px', height: '1.5px', transitionDelay: '200ms' } as React.CSSProperties} />
      <div className={`star ${starsVisible ? 'visible' : ''}`} style={{ top: '25%', left: '72%', '--star-opacity': 0.85, width: '2px', height: '2px', transitionDelay: '350ms' } as React.CSSProperties} />
      <div className={`star ${starsVisible ? 'visible' : ''}`} style={{ top: '10%', left: '38%', '--star-opacity': 0.6, width: '1.5px', height: '1.5px', transitionDelay: '500ms' } as React.CSSProperties} />
      <div className={`star ${starsVisible ? 'visible' : ''}`} style={{ top: '20%', left: '85%', '--star-opacity': 0.8, width: '2px', height: '2px', transitionDelay: '650ms' } as React.CSSProperties} />

      {/* Standing Pet Positioning Layer */}
      {(showStandingPetRiverside || (showStandingPetInterior && currentBeat?.type !== 'tuckInInteraction')) && currentBeat?.type !== 'nameInput' && (
        <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none transition-filter duration-[1600ms] ${lightsDownActive ? 'brightness-50' : ''}`}>
          <div className="relative pt-[5vh]">
            <img 
              src={`./src/assets/images/animals/dogs/${assignedBreed?.spriteKey || 'husky'}.png`} 
              alt={assignedBreed?.name || "Husky"} 
              className={`pixelated w-48 h-48 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] animate-soft-pulse ${isShaking ? 'shake' : ''}`}
            />
          </div>
        </div>
      )}

      {showInteriorBed && (
        <div 
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: 'calc(50% - 150px)', 
            top: 'calc(50% + 120px)',
            transform: 'translate(-50%, -50%)',
            width: '280px',
            height: '140px',
            zIndex: 30,
            opacity: bgFadeOpacity,
            filter: lightsDownActive ? 'brightness(0.5)' : 'none',
            transition: 'opacity 0.5s ease-in-out, filter 1.6s ease-in-out'
          }}
        >
          <img src="./src/assets/images/items/pet-bed.png" alt="Pet bed" className="w-[200px] h-auto pixelated drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
        </div>
      )}

      {/* Persistence: Show sleeping husky in bed if tucked and still in interior */}
      {showInteriorBed && huskyTucked && (
        <div 
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: 'calc(50% - 150px)', 
            top: 'calc(50% + 120px)',
            transform: 'translate(-50%, -50%)',
            zIndex: 35,
            opacity: bgFadeOpacity,
            filter: lightsDownActive ? 'brightness(0.5)' : 'none',
            transition: 'opacity 0.5s ease-in-out, filter 1.6s ease-in-out'
          }}
        >
          <div className="relative pt-[5vh]">
            <img 
              src={`./src/assets/images/animals/dogs/${assignedBreed?.spriteKey || 'husky'}.png`} 
              alt={`${assignedBreed?.name || 'Husky'} in bed`} 
              className="pixelated w-48 h-48 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] animate-soft-pulse"
            />
            <div className="absolute top-0 right-10 text-warm-cream font-game text-sm animate-bounce z-20">Zzz...</div>
          </div>
        </div>
      )}

      {/* Interactions */}
      {currentBeat?.type === 'nameInput' && (
         <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
           <PetNameInput 
             prompt={processText(currentBeat.placeholder || "Name your husky")}
             spriteKey={assignedBreed?.spriteKey || "husky"}
             onConfirm={handleNameConfirm}
           />
         </div>
      )}

      {currentBeat?.type === 'pettingInteraction' && !bgTransitioning && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none">
          <div 
             className="relative pt-[5vh] cursor-pointer hover:scale-105 active:scale-95 transition-transform pointer-events-auto" 
             onMouseDown={handleBondWithPet} 
             onTouchStart={handleBondWithPet}
          >
             <img 
               src={`./src/assets/images/animals/dogs/${getSpriteKey(currentBeat)}.png`} 
               alt={assignedBreed?.name || "Husky"} 
               className={`pixelated w-48 h-48 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] pointer-events-none animate-soft-pulse ${isShaking ? 'shake' : ''}`}
             />
          </div>
        </div>
      )}

      {currentBeat?.type === 'tuckInInteraction' && !bgTransitioning && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {/* Draggable Husky handled by the global showInteriorBed and internal logic */}
          {!huskyTucked && (
            <div
               className="absolute transition-all pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-105 flex flex-col items-center justify-center"
               style={{
                 left: '50%',
                 top: '50%',
                 transform: 'translate(-50%, -50%)',
                 zIndex: 50,
                 touchAction: 'none'
               }}
               onPointerDown={(e) => {
                 if (huskyTucked) return;
                 const el = e.currentTarget;
                 el.setPointerCapture(e.pointerId);
                 
                 let startX = e.clientX;
                 let startY = e.clientY;
                 
                 let currentTranslateX = 0;
                 let currentTranslateY = 0;
                 if (el.dataset.translateX) currentTranslateX = parseFloat(el.dataset.translateX);
                 if (el.dataset.translateY) currentTranslateY = parseFloat(el.dataset.translateY);
                 
                 el.style.transition = 'none';

                 const onPointerMove = (moveEvent: React.PointerEvent | PointerEvent) => {
                   const dx = moveEvent.clientX - startX;
                   const dy = moveEvent.clientY - startY;
                   startX = moveEvent.clientX;
                   startY = moveEvent.clientY;
                   
                   currentTranslateX += dx;
                   currentTranslateY += dy;
                   
                   el.dataset.translateX = currentTranslateX.toString();
                   el.dataset.translateY = currentTranslateY.toString();
                   
                   // Combined transform to avoid overwriting centering
                   el.style.transform = `translate(calc(-50% + ${currentTranslateX}px), calc(-50% + ${currentTranslateY}px)) scale(1.05)`;
                 };
                 
                 const onPointerUp = () => {
                   el.removeEventListener('pointermove', onPointerMove as any);
                   el.removeEventListener('pointerup', onPointerUp);
                   el.releasePointerCapture(e.pointerId);
                   el.style.transition = 'transform 0.3s ease-out';
                   el.style.transform = `translate(calc(-50% + ${currentTranslateX}px), calc(-50% + ${currentTranslateY}px)) scale(1)`;

                   const rect = el.getBoundingClientRect();
                   const centerX = rect.left + rect.width / 2;
                   const centerY = rect.top + rect.height / 2;

                   const parentRect = el.parentElement!.getBoundingClientRect();
                   const bedCenterX = parentRect.left + parentRect.width / 2 - 150; 
                   const bedCenterY = parentRect.top + parentRect.height / 2 + 120;

                   const distance = Math.sqrt(Math.pow(centerX - bedCenterX, 2) + Math.pow(centerY - bedCenterY, 2));

                   if (distance < 120) {
                     setBedTapped(true);
                     setHuskyTucked(true);
                     setSceneState('completion');
                     setTimeout(() => advance(), 2000);
                   }
                 };
                 
                 el.addEventListener('pointermove', onPointerMove as any);
                 el.addEventListener('pointerup', onPointerUp);
               }}
            >
               <div className="pt-[5vh]">
                 <img 
                   src={`./src/assets/images/animals/dogs/${getSpriteKey(currentBeat)}.png`} 
                   alt={assignedBreed?.name || "Husky"} 
                   className={`pixelated w-48 h-48 drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] pointer-events-none animate-soft-pulse`}
                 />
               </div>
            </div>
          )}
        </div>
      )}

      {/* Title Card */}
      {titleCardLines.length > 0 && (
        <div className="title-card">
          {titleCardLines.map((line, idx) => (
            <div key={idx} className={`title-card-line ${visibleTitleLines.has(idx) ? 'visible' : ''}`}>
              {processText(line)}
            </div>
          ))}
        </div>
      )}

      {/* Day Card */}
      {dayCardLabel && (
        <div className={`day-card ${dayCardVisible ? 'visible' : ''}`}>
          {dayCardLabel}
        </div>
      )}

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

      {/* Interaction Prompts displayed as floating text - Outside dialogue wrapper for z-index purposes */}
      {currentBeat?.type === 'pettingInteraction' && !bgTransitioning && (
        <div className="absolute inset-x-0 top-[12vh] flex justify-center z-[200] pointer-events-none">
          <div className="text-center text-warm-cream italic text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/20 rounded-full py-2 px-6 backdrop-blur-sm opacity-90 animate-pulse">
            {processText(sceneState === 'prompt' ? ((currentBeat as any).promptText || '') : ((currentBeat as any).completionText || ''))}
          </div>
        </div>
      )}

      {currentBeat?.type === 'pettingInteraction' && sceneState === 'completion' && (
        <div className="absolute inset-0 z-50 cursor-pointer" onClick={advance} />
      )}

      {currentBeat?.type === 'tuckInInteraction' && !bgTransitioning && (
        <div className="absolute inset-x-0 top-[12vh] flex justify-center z-[200] pointer-events-none">
          <div className="text-center text-warm-cream italic text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/20 rounded-full py-2 px-6 backdrop-blur-sm opacity-90 animate-pulse">
            {processText(huskyTucked ? ((currentBeat as any).confirmText || '') : ((currentBeat as any).promptText || ''))}
          </div>
        </div>
      )}

    </div>
  );
}
