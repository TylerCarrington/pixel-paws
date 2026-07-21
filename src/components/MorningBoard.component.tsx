import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { useMorningBoardStore } from '../stores/morningBoard.store';
import { generateDailyCalls } from '../logic/callGeneration.logic';
import { getEligibleCalls } from '../logic/facilityGating.logic';
import { CALL_POOL } from '../config/callPool.config';
import { TUTORIAL_CALLS } from '../config/tutorialCalls.config';
import CallCard from './CallCard.component';
import CallDetail from './CallDetail.component';
import { DiscoveryMethod, Rarity, Species } from '../types/animal.types';
import MorningBoardTutorial from './MorningBoardTutorial.component';

export default function MorningBoard() {
  const dayNumber = useGameStore(state => state.dayNumber);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const shelterCapacity = useGameStore(state => state.shelterCapacity);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const skipToShelter = useGameStore(state => state.skipToShelter);
  const initializeRescueWash = useGameStore(state => state.initializeRescueWash);
  const completeRescueWash = useGameStore(state => state.completeRescueWash);
  
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);
  const todayCalls = useMorningBoardStore(state => state.todayCalls);
  const setTodayCalls = useMorningBoardStore(state => state.setTodayCalls);
  const selectedCallId = useMorningBoardStore(state => state.selectedCallId);
  const setSelectedCallId = useMorningBoardStore(state => state.setSelectedCallId);
  const markCallResponded = useMorningBoardStore(state => state.markCallResponded);

  const [showTutorial, setShowTutorial] = useState(false);
  const catsUnlocked = useGameStore(state => state.catsUnlocked);
  const rarePetsUnlocked = useGameStore(state => state.rarePetsUnlocked);
  const catCapacity = useGameStore(state => state.catCapacity);
  const catsCount = shelterAnimals.filter(a => a.species === 'CAT').length;
  const dogsCount = shelterAnimals.filter(a => a.species === 'DOG').length;
  
  const isShelterFull = dogsCount >= shelterCapacity && catsCount >= catCapacity;

  useEffect(() => {
    // If todayCalls has cats but cats are not unlocked, reroll
    if (todayCalls.length > 0 && !catsUnlocked) {
      if (todayCalls.some(c => c.species === 'CAT')) {
        setTodayCalls([]);
      }
    }
  }, [todayCalls, catsUnlocked, setTodayCalls]);

  useEffect(() => {
    if (isShelterFull) return; // Don't generate calls if full

    // Generate calls if not already present for today
    if (todayCalls.length === 0) {
      if (dayNumber === 2 && TUTORIAL_CALLS[dayNumber] && TUTORIAL_CALLS[dayNumber].length > 0) {
        const calls = TUTORIAL_CALLS[dayNumber].map((t, i) => ({
          ...t,
          instanceId: `tutorial-${dayNumber}-${i}`,
          responded: false
        }));
        setTodayCalls(calls);
        // Auto-select first call
        if (calls.length > 0) setSelectedCallId(calls[0].instanceId);
      } else if (dayNumber >= 3) {
        const eligible = getEligibleCalls(CALL_POOL, facilityUpgrades, catsUnlocked, rarePetsUnlocked);
        
        // Fallback: if somehow no one is eligible (shouldn't happen with default kennel), 
        // ignore requirements for basic calls
        let finalPool = eligible.length > 0 ? eligible : CALL_POOL.filter(c => !c.requiredFacility || c.requiredFacility.includes('KENNEL_BASIC_3'));
        
        // Ensure we only see Common or Uncommon during Spare Room phase (Days 1 - 7)
        if (dayNumber < 8 && !rarePetsUnlocked) {
          const roomLimitedPool = finalPool.filter(c => c.rarity === Rarity.COMMON || c.rarity === Rarity.UNCOMMON);
          if (roomLimitedPool.length > 0) {
            finalPool = roomLimitedPool;
          }
        }
        
        const generated = generateDailyCalls(finalPool, 3, Date.now(), catsUnlocked);
        
        // Ensure for day 3 we have specific types of calls according to instructions (at least one dog, one mystery)
        if (dayNumber === 3) {
          const dogCall = finalPool.find(c => c.species === Species.DOG && c.discoveryMethod !== DiscoveryMethod.HIDING) || generated[0];
          const mysteryCall = finalPool.find(c => c.discoveryMethod === DiscoveryMethod.HIDING) || generated[1];
          generated[0] = { ...dogCall, instanceId: `day3-dog-${Date.now()}`, responded: false };
          if (generated.length > 1) {
             generated[1] = { ...mysteryCall, instanceId: `day3-mystery-${Date.now()}`, responded: false };
          }
        }
        
        setTodayCalls(generated);
        // Auto-select first call
        if (generated.length > 0) setSelectedCallId(generated[0].instanceId);
      }
    } else if (!selectedCallId && todayCalls.length > 0) {
      // If we have calls but none selected (e.g. after a refresh or day change), select first
      setSelectedCallId(todayCalls[0].instanceId);
    }

    // Check for tutorial visibility
    if (dayNumber === 3 && !localStorage.getItem('morningBoardTutorialSeen')) {
      setShowTutorial(true);
    }
  }, [dayNumber, facilityUpgrades, todayCalls.length, setTodayCalls, selectedCallId, setSelectedCallId]);

  const selectedCall = todayCalls.find(c => c.instanceId === selectedCallId);

  const dogCapacityStr = `${dogsCount}/${shelterCapacity}`;
  const catCapacityStr = `${catsCount}/${catCapacity}`;

  const handleRespond = () => {
    if (!selectedCall) return;

    markCallResponded(selectedCall.instanceId);

    // Pass health status and rarity from the call if available
    initializeRescueWash(Date.now(), selectedCall.healthStatus, selectedCall.rarity, selectedCall.species);
    
    if (selectedCall.discoveryMethod === DiscoveryMethod.SCARED_APPROACH) {
      setPhase6State('alley_rescue');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.FENCE_TANGLED) {
      setPhase6State('fence_rescue');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.DARK_SEARCH) {
      setPhase6State('dark_search');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.FOOD_TEMPT) {
      setPhase6State('food_tempt');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.WOODPILE_TRAPPED) {
      setPhase6State('woodpile_rescue');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.RUNAWAY_CHASE) {
      setPhase6State('runaway_chase');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.PORCH_HIDING) {
      setPhase6State('porch_hiding');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.RIVERSIDE_WARMUP) {
      setPhase6State('riverside_warmup');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.PARK_INJURED) {
      setPhase6State('park_injured');
    } else if (selectedCall.discoveryMethod === DiscoveryMethod.HIDING) {
      setPhase6State('bush_search');
    } else {
      completeRescueWash();
    }
  };

  const handleDismissTutorial = () => {
    localStorage.setItem('morningBoardTutorialSeen', 'true');
    setShowTutorial(false);
  };

  if (isShelterFull) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-warm-cream p-6 overflow-hidden relative">
        <div className="max-w-2xl w-full bg-[#fdfaf7] rounded-[32px] p-8 md:p-12 shadow-xl border-4 border-stone-grey/10 text-center font-pixel">
          <div className="text-6xl mb-6">🏡</div>
          <h2 className="text-2xl text-speaker-rose mb-6 uppercase tracking-widest">Shelter Full</h2>
          
          <div className="space-y-6 text-dialogue-text leading-relaxed">
            <p>
              Word around town is your shelter is full. Others in town are taking care of the animals they find today.
            </p>
            <p>
              Since you have extra time this morning, you can give each animal a little more attention.
            </p>
            <p className="text-amber-glow text-lg">
              You have {actionsPerPetToday} actions per animal today.
            </p>
          </div>

          <button
            onClick={skipToShelter}
            className="mt-10 bg-mossy-green hover:bg-opacity-90 text-white px-8 py-4 rounded-xl shadow-[0_4px_0_rgb(60,95,60)] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest"
          >
            Go to Spare Room (+1 Action Bonus)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-warm-cream p-6 overflow-hidden relative">
      {showTutorial && <MorningBoardTutorial onDismiss={handleDismissTutorial} />}
      
      <header className="mb-8 border-b border-stone-grey/30 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-game text-speaker-rose uppercase tracking-tighter">
            Morning Board
          </h1>
          <p className="text-muted-sage font-pixel text-[10px] uppercase tracking-widest mt-2">
            Incoming Dispatch & Rescue Calls • Day {dayNumber}
          </p>
        </div>
        <div className="text-right flex gap-6 items-end">
           <button 
             onClick={skipToShelter}
             className="bg-stone-grey/10 hover:bg-stone-grey/20 text-[8px] text-muted-sage hover:text-speaker-rose uppercase tracking-widest flex items-center gap-2 transition-all px-4 py-2 rounded-lg relative z-[110] border border-stone-grey/20 h-fit"
           >
             Skip Rescues & Focus on Pet Care (+1 Action) 🐕
           </button>
           <div className="flex gap-4">
            <div>
              <div className="text-[10px] text-stone-grey font-pixel uppercase">Dogs</div>
              <div className="text-deep-moss font-pixel text-[10px] uppercase">{dogCapacityStr}</div>
            </div>
            {catsUnlocked && (
              <div>
                <div className="text-[10px] text-stone-grey font-pixel uppercase">Cats</div>
                <div className="text-deep-moss font-pixel text-[10px] uppercase">{catCapacityStr}</div>
              </div>
            )}
            <div>
              <div className="text-[10px] text-stone-grey font-pixel uppercase">Status</div>
              <div className="text-deep-moss font-pixel text-[10px] uppercase">Operational</div>
            </div>
           </div>
        </div>
      </header>

      <div className="flex-1 flex gap-8 overflow-hidden font-pixel">
        {/* Left: Call List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-stone-grey relative z-0">
          {todayCalls.length > 0 ? (
            todayCalls.map(call => (
              <CallCard 
                key={call.instanceId}
                call={call} 
                isSelected={selectedCallId === call.instanceId}
                onClick={() => setSelectedCallId(call.instanceId)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-stone-grey font-pixel text-xs italic">
              No calls yet today...
            </div>
          )}
        </div>

        {/* Right: Call Detail */}
        <div className="flex-1 flex flex-col relative z-0">
          {selectedCall ? (
            <CallDetail 
              call={selectedCall} 
              onRespond={handleRespond}
            />
          ) : (
            <div className="flex-1 border-2 border-dashed border-stone-grey/20 rounded-lg flex flex-col items-center justify-center text-stone-grey font-pixel text-xs uppercase tracking-widest text-center px-4 gap-6">
              <span className="text-4xl opacity-20">📭</span>
              <div>Select a call to view details</div>
                           {todayCalls.length === 0 && (
                <button
                  onClick={() => {
                    const eligible = getEligibleCalls(CALL_POOL, facilityUpgrades, catsUnlocked, rarePetsUnlocked);
                    let finalPool = eligible.length > 0 ? eligible : CALL_POOL.filter(c => !c.requiredFacility || c.requiredFacility.includes('KENNEL_BASIC_3'));
                    if (dayNumber < 8 && !rarePetsUnlocked) {
                      const roomLimitedPool = finalPool.filter(c => c.rarity === Rarity.COMMON || c.rarity === Rarity.UNCOMMON);
                      if (roomLimitedPool.length > 0) finalPool = roomLimitedPool;
                    }
                    const generated = generateDailyCalls(finalPool, 3, Date.now(), catsUnlocked);
                    setTodayCalls(generated);
                  }}
                  className="bg-stone-grey/20 hover:bg-stone-grey/40 text-dialogue-text px-6 py-3 rounded-lg text-[8px] tracking-widest"
                >
                  Refresh Morning Board
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

