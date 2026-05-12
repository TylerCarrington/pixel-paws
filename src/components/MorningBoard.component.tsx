import React, { useEffect, useState } from 'react';
import { useGameStore } from '../stores/game.store';
import { useMorningBoardStore } from '../stores/morningBoard.store';
import { generateDailyCalls } from '../logic/callGeneration.logic';
import { getEligibleCalls } from '../logic/facilityGating.logic';
import { CALL_POOL } from '../config/callPool.config';
import { TUTORIAL_CALLS } from '../config/tutorialCalls.config';
import CallCard from './CallCard.component';
import CallDetail from './CallDetail.component';
import { DiscoveryMethod } from '../types/animal.types';
import MorningBoardTutorial from './MorningBoardTutorial.component';

export default function MorningBoard() {
  const dayNumber = useGameStore(state => state.dayNumber);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const initializeRescueWash = useGameStore(state => state.initializeRescueWash);
  
  const todayCalls = useMorningBoardStore(state => state.todayCalls);
  const setTodayCalls = useMorningBoardStore(state => state.setTodayCalls);
  const selectedCallId = useMorningBoardStore(state => state.selectedCallId);
  const setSelectedCallId = useMorningBoardStore(state => state.setSelectedCallId);
  const markCallResponded = useMorningBoardStore(state => state.markCallResponded);

  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
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
        const eligible = getEligibleCalls(CALL_POOL, facilityUpgrades);
        
        // Fallback: if somehow no one is eligible (shouldn't happen with default kennel), 
        // ignore requirements for basic calls
        const finalPool = eligible.length > 0 ? eligible : CALL_POOL.filter(c => !c.requiredFacility || c.requiredFacility.includes('KENNEL_BASIC_3'));
        
        const generated = generateDailyCalls(finalPool, 3, dayNumber * 100);
        
        // Ensure for day 3 we have specific types of calls according to instructions (at least one dog, one mystery)
        if (dayNumber === 3) {
          const dogCall = finalPool.find(c => c.species === 'Dog' && c.discoveryMethod !== DiscoveryMethod.HIDING) || generated[0];
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

  const handleRespond = () => {
    if (!selectedCall) return;

    markCallResponded(selectedCall.instanceId);

    // Pass health status and rarity from the call if available
    initializeRescueWash(Date.now(), selectedCall.healthStatus, selectedCall.rarity);
    
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
    } else {
      setPhase6State('wash_rescue');
    }
  };

  const handleDismissTutorial = () => {
    localStorage.setItem('morningBoardTutorialSeen', 'true');
    setShowTutorial(false);
  };

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
        <div className="text-right">
           <div className="text-[10px] text-stone-grey font-pixel uppercase">Facility Status</div>
           <div className="text-deep-moss font-pixel text-[10px] uppercase">Operational</div>
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
                    const eligible = getEligibleCalls(CALL_POOL, facilityUpgrades);
                    const finalPool = eligible.length > 0 ? eligible : CALL_POOL.filter(c => !c.requiredFacility || c.requiredFacility.includes('KENNEL_BASIC_3'));
                    const generated = generateDailyCalls(finalPool, 3, Date.now());
                    setTodayCalls(generated);
                  }}
                  className="bg-stone-grey/20 hover:bg-stone-grey/40 text-dialogue-text px-6 py-3 rounded-lg text-[8px] tracking-widest"
                >
                  Refresh Morning Board
                </button>
              )}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setPhase6State('shelter_view')}
              className="text-[8px] text-muted-sage hover:text-speaker-rose uppercase tracking-widest flex items-center gap-2 transition-colors relative z-0"
            >
              Skip to Kennels 🐕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

