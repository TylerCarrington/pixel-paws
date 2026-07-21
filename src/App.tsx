/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas.component';
import CharacterBuilder from './components/CharacterBuilder.component';
import CutscenePanel from './components/CutscenePanel.component';
import SkipButton from './components/SkipButton.component';
import DevControls from './components/DevControls.component';
import BreedAnnouncement from './components/BreedAnnouncement.component';
import PetNameInput from './components/PetNameInput.component';
import HeartParticle, { useHeartParticles } from './components/HeartParticle.component';
import ShelterNameInput from './components/ShelterNameInput.component';
import ShelterFloor from './components/ShelterFloor.component';
import MorningBoard from './components/MorningBoard.component';
import AdoptionCeremony from './components/AdoptionCeremony.component';
import VetWing from './components/VetWing.component';
import ShopScreen from './components/ShopScreen.component';
import Day2Call from './components/Day2Call.component';
import BushSearch from './components/BushSearch.component';
import Day2Inspiration from './components/Day2Inspiration.component';
import HomeView from './components/HomeView.component';
import FacilityScreen from './components/FacilityScreen.component';
import UnlockNotification from './components/UnlockNotification.component';
import LevelUpNotification from './components/LevelUpNotification.component';
import ReactWashInteraction from './components/ReactWashInteraction';
import { useGameStore } from './stores/game.store';
import { createStarterPet } from './logic/ownedPet.logic';
import { AnimatePresence } from 'framer-motion';
import { getAvailableSpeciesToUnlock } from './logic/upgradeAvailability.logic';
import { Species } from './types/animal.types';
import LoadingScreen from './components/LoadingScreen.component';
import TitleScreen from './components/TitleScreen.component';
import OpeningSequence from './scenes/OpeningSequence';
import DayOneWalk from './scenes/DayOneWalk';
import DayTwoWalk from './scenes/DayTwoWalk';
import DayThreeMorning from './scenes/DayThreeMorning';
import ShelterPurchaseScene from './scenes/ShelterPurchaseScene.scene';
import AnimationDebug from './components/AnimationDebug.component';
import AlleyRescue from './components/AlleyRescue.component';
import FenceRescue from './components/FenceRescue.component';
import LightSearch from './components/LightSearch.component';
import FoodTempt from './components/FoodTempt.component';
import WoodpileRescue from './components/WoodpileRescue.component';
import ChaseRunaway from './components/ChaseRunaway.component';
import PorchRescue from './components/PorchRescue.component';
import RiversideWarmup from './components/RiversideWarmup.component';
import ParkInjured from './components/ParkInjured.component';
import GamesDebug from './components/GamesDebug.component';
import ActivitiesDebug from './components/ActivitiesDebug.component';
import { audioManager } from './audio/audio.manager';
import { MUSIC_TRACKS } from './config/audio.config';

export default function App() {
  const playerName = useGameStore(state => state.playerName);
  const dayNumber = useGameStore(state => state.dayNumber);
  const phase = useGameStore(state => state.phase);
  const prologueComplete = useGameStore(state => state.prologueComplete);
  const prologuePanelIndex = useGameStore(state => state.prologuePanelIndex);
  const washComplete = useGameStore(state => state.washComplete);
  const phase4Complete = useGameStore(state => state.phase4Complete);
  const phase5State = useGameStore(state => state.phase5State);
  const phase6State = useGameStore(state => state.phase6State);
  const reputation = useGameStore(state => state.reputationBySpecies);
  const facilityUpgrades = useGameStore(state => state.facilityUpgrades);
  const assignedBreed = useGameStore(state => state.assignedBreed);
  const settings = useGameStore(state => state.settings);
  const updateSettings = useGameStore(state => state.updateSettings);

  const setPhase5State = useGameStore(state => state.setPhase5State);
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const addOwnedPet = useGameStore(state => state.addOwnedPet);
  const startDay = useGameStore(state => state.startDay);
  const completeRescueWash = useGameStore(state => state.completeRescueWash);

  const playerAppearance = useGameStore(state => state.playerAppearance);
  const actionsPerPetToday = useGameStore(state => state.actionsPerPetToday);
  const { hearts, addHeart } = useHeartParticles();
  
  // Fix broken phase6State from old 'reflection'
  useEffect(() => {
    if (phase6State === 'reflection') {
      useGameStore.getState().setPhase6State('shelter_view');
    }
  }, [phase6State]);

  const [isLoading, setIsLoading] = useState(true);
  const [showTitleScreen, setShowTitleScreen] = useState(false);
  const [showOpening, setShowOpening] = useState(false);
  const [showDayOneWalk, setShowDayOneWalk] = useState(false);
  const [resumePostReveal, setResumePostReveal] = useState(false);
  const [devJumpId, setDevJumpId] = useState<string | undefined>(undefined);
  const [showDevControls, setShowDevControls] = useState(false);

  // Audio Phase Management
  useEffect(() => {
    if (isLoading || showTitleScreen || showOpening || showDayOneWalk) return;

    if (!prologueComplete && playerName) {
      audioManager.playMusic(MUSIC_TRACKS.PROLOGUE);
    } else if (phase6State === 'home_view') {
      audioManager.playMusic(MUSIC_TRACKS.HOME);
    } else if (phase === 'MORNING') {
      audioManager.playMusic(MUSIC_TRACKS.MORNING);
    } else {
      audioManager.playMusic(MUSIC_TRACKS.SHELTER);
    }
  }, [isLoading, phase, phase6State, prologueComplete, playerName, showOpening]);

  useEffect(() => {
    const handleSpawnHeart = (e: any) => {
      if (e.detail) {
        addHeart(e.detail.x, e.detail.y);
      }
    };
    window.addEventListener('spawn-heart', handleSpawnHeart);
    return () => window.removeEventListener('spawn-heart', handleSpawnHeart);
  }, [addHeart]);

  useEffect(() => {
    const handleDevJump = (e: any) => {
      const target = e.detail?.target;
      if (target) {
        setShowOpening(false);
        setShowTitleScreen(false);
        setResumePostReveal(false);
        
        if (target === 'morning_board') {
          useGameStore.setState({ 
            catsUnlocked: true, 
            facilityUpgrades: [...useGameStore.getState().facilityUpgrades, 'facility_shelter'] 
          });
          useGameStore.getState().setPhase6State('phone_call');
          // Clear calls to force a reroll
          import('./stores/morningBoard.store').then(m => {
            m.useMorningBoardStore.getState().setTodayCalls([]);
          });
          return;
        }
        if (target === 'shelter_view') {
          useGameStore.setState({ 
            catsUnlocked: true, 
            facilityUpgrades: [...useGameStore.getState().facilityUpgrades, 'facility_shelter'] 
          });
          useGameStore.getState().setPhase6State('shelter_view');
          return;
        }
        if (target === 'home_view') {
          useGameStore.setState({ 
            catsUnlocked: true, 
            facilityUpgrades: [...useGameStore.getState().facilityUpgrades, 'facility_shelter'] 
          });
          useGameStore.getState().setPhase6State('home_view');
          return;
        }

        // Define Day 2 and Day 3 targets
        const day2Targets = ['parkScene', 'spareRoomScene', 'day2Petting', 'day2TuckIn'];
        const day3Targets = ['day3Morning', 'morningBoardTutorial'];
        const day4Targets = ['day4Shelter', 'shelterPurchase'];
        
        if (target === 'animation_debug') {
          useGameStore.getState().setPhase6State('animation_debug');
          setShowOpening(false);
          setShowTitleScreen(false);
          setShowDayOneWalk(false);
          return;
        }

        if (target === 'games_debug') {
          useGameStore.getState().setPhase6State('games_debug');
          setShowOpening(false);
          setShowTitleScreen(false);
          setShowDayOneWalk(false);
          return;
        }

        if (target === 'activities_debug') {
          useGameStore.getState().setPhase6State('activities_debug');
          setShowOpening(false);
          setShowTitleScreen(false);
          setShowDayOneWalk(false);
          return;
        }

        if (day2Targets.includes(target)) {
          // Setup for Day 2
          useGameStore.getState().startDay(2);
          useGameStore.getState().setPhase6State('day2_discovery');
          setShowDayOneWalk(false); 
          setDevJumpId(target); 
        } else if (day3Targets.includes(target)) {
          // Setup for Day 3
          useGameStore.getState().startDay(3);
          useGameStore.getState().setPhase6State('day3_morning');
          useGameStore.getState().setPrologueComplete(true);
          setShowDayOneWalk(false);
          setShowOpening(false);
          if (target === 'morningBoardTutorial') {
            localStorage.removeItem('morningBoardTutorialSeen');
            useGameStore.getState().setPhase6State('phone_call'); 
            setDevJumpId(undefined);
          } else {
            setDevJumpId(target);
          }
        } else if (day4Targets.includes(target)) {
          // Setup for Day 4+ Shelter
          useGameStore.getState().startDay(4);
          useGameStore.getState().setPrologueComplete(true);
          useGameStore.getState().setShelterName(useGameStore.getState().shelterName || "Dev Shelter");
          
          if (target === 'shelterPurchase') {
             useGameStore.getState().setPhase6State('shelter_purchase');
             // Reset capacity for test jump to ensure the first-purchase logic triggers
             useGameStore.setState({ shelterCapacity: 3, catCapacity: 0 });
          } else {
             useGameStore.getState().setPhase6State('shelter_view');
          }
          
          setShowDayOneWalk(false);
          setShowOpening(false);
          setShowTitleScreen(false);
          setDevJumpId(undefined);
        } else {
          // Day 1 targets - MUST set devJumpId BEFORE setShowDayOneWalk for startBeatId to be caught
          setDevJumpId(target);
          useGameStore.getState().setPhase6State('pending');
          useGameStore.getState().setPhase5State('pending');
          useGameStore.getState().completeWash();
          useGameStore.getState().advancePrologue();
          if (!useGameStore.getState().assignedBreed) {
            useGameStore.getState().initializeWash();
            useGameStore.getState().completeWash();
          }
          setShowDayOneWalk(true);
        }
      }
    };
    window.addEventListener('dev-jump', handleDevJump);
    return () => window.removeEventListener('dev-jump', handleDevJump);
  }, []);

  const showBuilder = false; // Disabled, replaced by OpeningSequence
  const showPrologueUI = false; // Disabled, replaced by OpeningSequence/DayOneWalk
  const showWashInteraction = (prologueComplete && !washComplete && phase6State === 'pending') || phase6State === 'wash_rescue';
  const showBreedAnnouncement = washComplete && (!phase4Complete || phase6State === 'wash_rescue') && dayNumber !== 1;
  
  const showNaming = phase4Complete && phase5State === 'naming' && !!assignedBreed && dayNumber !== 1;
  const showPhase5Complete = phase4Complete && phase5State === 'complete' && phase6State === 'pending' && dayNumber !== 1;
  const showShelterNaming = phase6State === 'naming';
  const showShelterFloor = phase6State === 'shelter_view';
  const showMorningBoard = phase6State === 'phone_call';
  const showAdoptionCeremony = phase6State === 'adoption_results';
  const showVetWing = phase6State === 'vet_wing';
  const showFacilityShop = phase6State === 'facility_shop';
  const showHomeShop = phase6State === 'home_shop';
  const showDay2Call = phase6State === 'day2_special';
  const showBushSearch = phase6State === 'bush_search';
  const showDay2Discovery = phase6State === 'day2_discovery';
  const showDay2Inspiration = phase6State === 'day2_inspiration';
  const showHomeView = phase6State === 'home_view';
  const showFacilityExpansion = phase6State === 'facility_expansion';
  const showDay3Morning = phase6State === 'day3_morning';
  const showShelterPurchase = phase6State === 'shelter_purchase';
  const showAnimationDebug = phase6State === 'animation_debug';
  const showAlleyRescue = phase6State === 'alley_rescue';
  const showFenceRescue = phase6State === 'fence_rescue';
  const showDarkSearch = phase6State === 'dark_search';
  const showFoodTempt = phase6State === 'food_tempt';
  const showWoodpileRescue = phase6State === 'woodpile_rescue';
  const showChaseRunaway = phase6State === 'runaway_chase';
  const showPorchRescue = phase6State === 'porch_hiding';
  const showRiversideWarmup = phase6State === 'riverside_warmup';
  const showParkInjured = phase6State === 'park_injured';
  const showGamesDebug = phase6State === 'games_debug';
  const showActivitiesDebug = phase6State === 'activities_debug';

  const isShelterView = ['shelter_view', 'vet_wing', 'facility_shop', 'facility_expansion'].includes(phase6State);

  const handleNameConfirm = (name: string) => {
    if (assignedBreed) {
      const pet = createStarterPet(assignedBreed, name);
      addOwnedPet(pet);
      setPhase5State('petting');
    }
  };

  const handleBeginDay2 = () => {
    startDay(2);
    setPhase6State('day2_special');
  };

  const [unlockedNotif, setUnlockedNotif] = useState<Species | null>(null);

  useEffect(() => {
    if (phase6State === 'phone_call' || phase6State === 'shelter_view') {
       const available = getAvailableSpeciesToUnlock(reputation, facilityUpgrades);
       if (available.length > 0) {
         setUnlockedNotif(available[0]);
       }
    }
  }, [phase6State, reputation, facilityUpgrades]);

  const initializeWash = useGameStore(state => state.initializeWash);
  
  // Ensure assignedBreed is present if we are past prologue on day 1
  useEffect(() => {
    if (prologueComplete && dayNumber === 1 && !assignedBreed && !isLoading) {
      initializeWash();
    }
  }, [prologueComplete, dayNumber, assignedBreed, isLoading, initializeWash]);

  const handlePlay = () => {
    setShowTitleScreen(false);
    const seen = localStorage.getItem('pawsOpeningSeen');
    if (seen === 'true') {
      const walkSeen = localStorage.getItem('dayOneWalkSeen');
      if (walkSeen === 'true') {
        // Skip walk if already seen
        setShowDayOneWalk(false);
      } else {
        setShowDayOneWalk(true);
      }
    } else {
      setShowOpening(true);
    }
  };

  return (
    <div className="w-screen h-screen bg-night-plum overflow-hidden flex flex-col text-warm-cream">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen 
            key="loading-screen"
            onFinish={() => {
              setIsLoading(false);
              setShowTitleScreen(true);
            }} 
          />
        )}
        {showTitleScreen && (
          <TitleScreen key="title-screen" onPlay={handlePlay} />
        )}
        {showOpening && (
          <OpeningSequence key="opening-sequence" onFinish={() => {
            setShowOpening(false);
            if (!localStorage.getItem('dayOneWalkSeen')) {
              setShowDayOneWalk(true);
            }
          }} />
        )}
        {showDayOneWalk && (
          <DayOneWalk 
            key="day-one-walk"
            startBeatId={devJumpId}
            onFinish={(nextParam) => {
              setShowDayOneWalk(false);
              setDevJumpId(undefined);
              if (nextParam === 'washInteraction') {
                useGameStore.getState().advancePrologue();
                initializeWash();
              } else if (nextParam === 'dayTwoMorning') {
                useGameStore.getState().completeWash();
                useGameStore.getState().completePhase4();
                useGameStore.getState().setPhase5State('complete');
                useGameStore.getState().tuckIn();
              }
            }} 
          />
        )}
        {unlockedNotif && (
          <UnlockNotification 
            key={`unlock-${unlockedNotif}`}
            species={unlockedNotif} 
            onClose={() => setUnlockedNotif(null)} 
          />
        )}
        <LevelUpNotification key="level-up-notif" />
      </AnimatePresence>

      <div className="fixed top-6 left-6 z-[100] flex gap-4">
        {import.meta.env?.MODE === 'development' && (
          <button 
            onClick={() => setShowDevControls(true)}
            className="w-10 h-10 opacity-0 hover:opacity-100 bg-indigo-900/40 hover:bg-indigo-600/60 backdrop-blur-md rounded-xl border border-indigo-400/20 flex items-center justify-center transition-all group active:scale-95 cursor-pointer"
          >
            <span className="text-lg group-hover:animate-pulse">🛠️</span>
          </button>
        )}
      </div>

      <DevControls isOpen={showDevControls} onClose={() => setShowDevControls(false)} />
      
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Main Content Area */}
        <div className={`absolute inset-0 overflow-hidden`}>
          {/* Game Canvas is always at the bottom */}
          <div className="absolute inset-0 max-w-7xl mx-auto w-full flex items-center justify-center z-0">
            <GameCanvas />
          </div>

          {showWashInteraction && !resumePostReveal && (
            <ReactWashInteraction 
              isRescue={phase6State === 'wash_rescue'} 
              onPostReveal={() => {
                if (dayNumber === 1) {
                  setDevJumpId('postReveal');
                  setShowDayOneWalk(true);
                } else {
                  setResumePostReveal(true);
                }
              }}
            />
          )}

          <HeartParticle hearts={hearts} />

          {showBuilder && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-night-plum">
              <CharacterBuilder />
            </div>
          )}

          {showPrologueUI && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <CutscenePanel />
              <SkipButton />
            </div>
          )}
          
          {showBreedAnnouncement && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <BreedAnnouncement />
            </div>
          )}

          {showNaming && assignedBreed && (
             <div className="absolute inset-0 z-10 bg-night-plum/60 flex items-center justify-center backdrop-blur-sm">
               <PetNameInput 
                 prompt="Name your new companion"
                 breedLabel={assignedBreed.name}
                 spriteKey={assignedBreed.spriteKey}
                 onConfirm={handleNameConfirm}
               />
             </div>
          )}

          {/* Phase 5 Complete */}
          {showPhase5Complete && (
            <div className="absolute inset-0 z-10 bg-night-plum flex flex-col items-center justify-center font-pixel">
                <div className="text-sm font-game text-amber-500 text-center mb-10 tracking-widest leading-relaxed">
                  DAY 01<br/>COMPLETE
                </div>
                <button 
                   onClick={() => setPhase6State('home_view')}
                   className="bg-soft-rose hover:bg-blossom-pink text-warm-cream font-game text-[10px] py-4 px-10 rounded shadow-lg transition-all active:scale-95 uppercase tracking-widest"
                >
                   Go Home
                </button>
            </div>
          )}

          {showShelterNaming && (
            <ShelterNameInput />
          )}

          {showShelterFloor && (
            <div className="absolute inset-0 z-20 bg-warm-cream overflow-hidden">
              <ShelterFloor />
            </div>
          )}

          {showMorningBoard && (
            <div className="absolute inset-0 z-20 bg-warm-cream overflow-hidden">
              <MorningBoard />
            </div>
          )}

          {showAdoptionCeremony && (
             <AdoptionCeremony />
          )}

          {showVetWing && (
             <div className="absolute inset-0 z-20 overflow-hidden">
               <VetWing />
             </div>
          )}

          {(showFacilityShop || showHomeShop) && (
             <div className="absolute inset-0 z-20 overflow-hidden">
               <ShopScreen />
             </div>
          )}

          {showDay2Call && (
             <Day2Call />
          )}

          {showBushSearch && (
             <BushSearch onFinish={completeRescueWash} />
          )}

          {showDay2Discovery && (
            <DayTwoWalk 
              startBeatId={devJumpId}
              onFinish={(nextParam) => {
                setDevJumpId(undefined);
                if (nextParam === 'dayThreeMorning') {
                  // Transition to Day 3
                  useGameStore.getState().tuckIn();
                } else {
                  setPhase6State('day2_inspiration');
                }
              }}
            />
          )}

          {showDay3Morning && (
             <DayThreeMorning 
                startBeatId={devJumpId}
                onFinish={(nextParam) => {
                   setDevJumpId(undefined);
                   if (nextParam === 'morningBoardIntro') {
                      useGameStore.getState().setPhase6State('phone_call'); 
                   } else {
                      // Fallback support for generic finish
                      useGameStore.getState().setPhase6State('shelter_view');
                   }
                }}
             />
          )}

          {showShelterPurchase && (
             <div className="absolute inset-0 z-50">
               <ShelterPurchaseScene onFinish={() => setPhase6State('naming')} />
             </div>
          )}

          {showDay2Inspiration && (
             <div className="hidden">
               {/* Redundant, content is now in DayTwoWalk */}
             </div>
          )}

          {showHomeView && (
             <div className="absolute inset-0 z-30 overflow-hidden">
               <HomeView />
             </div>
          )}

          {showFacilityExpansion && (
             <div className="absolute inset-0 z-20 overflow-hidden bg-night-plum">
               <FacilityScreen />
             </div>
          )}

          {showAnimationDebug && (
            <div className="absolute inset-0 z-[100] bg-night-plum">
              <AnimationDebug />
            </div>
          )}

          {showAlleyRescue && (
            <div className="absolute inset-0 z-[100] bg-night-plum">
              <AlleyRescue onFinish={completeRescueWash} />
            </div>
          )}

          {showFenceRescue && (
            <div className="absolute inset-0 z-[100] bg-stone-grey text-white">
              <FenceRescue onFinish={completeRescueWash} />
            </div>
          )}

          {showDarkSearch && (
            <div className="absolute inset-0 z-[100] bg-black text-white">
              <LightSearch onFinish={completeRescueWash} />
            </div>
          )}

          {showFoodTempt && (
            <div className="absolute inset-0 z-[100] bg-night-plum text-white">
              <FoodTempt onFinish={completeRescueWash} />
            </div>
          )}

          {showWoodpileRescue && (
            <div className="absolute inset-0 z-[100] bg-night-plum text-white">
              <WoodpileRescue onFinish={completeRescueWash} />
            </div>
          )}

          {showChaseRunaway && (
            <div className="absolute inset-0 z-[100] bg-night-plum text-white">
              <ChaseRunaway onFinish={completeRescueWash} />
            </div>
          )}

          {showPorchRescue && (
            <div className="absolute inset-0 z-[100] bg-black text-white">
              <PorchRescue onFinish={completeRescueWash} />
            </div>
          )}

          {showRiversideWarmup && (
            <div className="absolute inset-0 z-[100] bg-black text-white">
              <RiversideWarmup onFinish={completeRescueWash} />
            </div>
          )}

          {showParkInjured && (
            <div className="absolute inset-0 z-[100] bg-black text-white">
              <ParkInjured onFinish={completeRescueWash} />
            </div>
          )}

          {showGamesDebug && (
            <div className="absolute inset-0 z-[100] bg-night-plum">
              <GamesDebug />
            </div>
          )}

          {showActivitiesDebug && (
            <div className="absolute inset-0 z-[100] bg-night-plum">
              <ActivitiesDebug />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
