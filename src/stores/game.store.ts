import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, DayPhase } from '../types/game.types';
import { PlayerAppearance } from '../types/player.types';
import { Species } from '../types/animal.types';
import { StarterDogDef, STARTER_DOGS } from '../config/starterDogs.config';
import { assignStarterBreed } from '../logic/breedAssignment.logic';
import { createStarterPet, xpToNextLevel } from '../logic/ownedPet.logic';
import { AdoptionResult, rollForAdoptions } from '../logic/adoptionRoll.logic';
import { calculatepayout } from '../logic/payoutCalculation.logic';
import { FacilityUpgrade } from '../config/vetUpgrades.config';
import { ShopItem } from '../config/shopItems.config';
import { applyItemEffect } from '../logic/purchaseItem.logic';
import { prepareForVet } from '../logic/vetAdmission.logic';
import { processVetRecovery } from '../logic/vetRecovery.logic';
import { getRecoverySpeedModifier } from '../logic/upgradeEffect.logic';
import { getMoodFromDiscovery } from '../logic/moodAssignment.logic';
import { Animal, HealthStatus, Rarity, DiscoveryMethod } from '../types/animal.types';
import { useMorningBoardStore } from './morningBoard.store';

interface GameStore extends GameState {
  setPlayerName: (name: string) => void;
  setTownName: (name: string) => void;
  setPlayerAppearance: (appearance: PlayerAppearance) => void;
  advancePrologue: () => void;
  prologueComplete: boolean;
  prologuePanelIndex: number | null;
  setProloguePanel: (index: number | null) => void;
  setPrologueComplete: (complete: boolean) => void;
  
  assignedBreed: StarterDogDef | null;
  washComplete: boolean;
  phase4Complete: boolean;
  phase5State: 'pending' | 'naming' | 'petting' | 'bedtime' | 'complete';
  phase6State: 'pending' | 'phone_call' | 'wash_rescue' | 'reflection' | 'naming' | 'exterior' | 'shelter_view' | 'adoption_results' | 'vet_wing' | 'facility_shop' | 'facility_expansion' | 'day2_special' | 'bush_search' | 'day2_discovery' | 'day2_inspiration' | 'home_view' | 'day3_morning' | 'animation_debug' | 'alley_rescue' | 'games_debug' | 'activities_debug' | 'fence_rescue' | 'dark_search' | 'food_tempt' | 'woodpile_rescue' | 'runaway_chase' | 'porch_hiding' | 'riverside_warmup' | 'park_injured' | 'shelter_purchase' | 'home_shop';
  rescueBreed: StarterDogDef | null;
  rescueHealth: HealthStatus | null;
  rescueRarity: Rarity | null;
  rescueSpecies: string | null;
  secondPetName: string;

  initializeWash: (seed?: number) => void;
  initializeRescueWash: (seed?: number, healthStatus?: HealthStatus, rarity?: Rarity, species?: string) => void;
  completeWash: () => void;
  completeRescueWash: () => void;
  completePhase4: () => void;
  setPhase5State: (state: 'pending' | 'naming' | 'petting' | 'bedtime' | 'complete') => void;
  setPhase6State: (state: 'pending' | 'phone_call' | 'wash_rescue' | 'reflection' | 'naming' | 'exterior' | 'shelter_view' | 'adoption_results' | 'vet_wing' | 'facility_shop' | 'facility_expansion' | 'day2_special' | 'bush_search' | 'day2_discovery' | 'day2_inspiration' | 'home_view' | 'day3_morning' | 'animation_debug' | 'alley_rescue' | 'games_debug' | 'activities_debug' | 'fence_rescue' | 'dark_search' | 'food_tempt' | 'woodpile_rescue' | 'runaway_chase' | 'porch_hiding' | 'riverside_warmup' | 'park_injured' | 'shelter_purchase' | 'home_shop') => void;
  addOwnedPet: (pet: any) => void;
  addShelterAnimal: (pet: any) => void;
  updateShelterAnimal: (id: string, updates: Partial<Animal>) => void;
  nameShelterAnimal: (id: string, name: string) => void;
  setShelterName: (name: string) => void;
  setPetName: (name: string) => void;
  setSecondPetName: (name: string) => void;
  startDay: (day: number) => void;
  resetDay: () => void;
  buyShopItem: (item: ShopItem) => void;
  tuckIn: () => void;
  
  purchaseUpgrade: (upgrade: FacilityUpgrade) => void;
  sendToVet: (animalId: string) => void;
  vetCareAction: (animalId: string, actionType: 'check' | 'bandage' | 'medicine' | 'comfort') => void;
  
  adoptionResults: AdoptionResult[] | null;
  processAdoptions: () => void;
  finalizeAdoptions: () => void;
  performCareAction: (animalId: string, actionId: 'pet' | 'feed' | 'play' | 'groom') => void;
  renameOwnedPet: (petId: string, newName: string) => void;
  buyExtraBed: () => void;
  purchaseShelter: (exteriorId: string, cost: number) => void;
  skipToShelter: () => void;

  bringPetHome: (animalId: string) => void;
  putPetUpForAdoption: (petId: string) => void;
  swapOwnedPetLocations: (petIdA: string, petIdB: string) => void;
  updateOwnedPet: (petId: string, updates: Partial<Animal>) => void;

  equipOutfit: (petId: string, outfitId: string | null) => void;
  placeFurniture: (id: string, x: number, y: number) => void;
  removeFurniture: (index: number) => void;
  
  saveDecoration: (petId: string, instanceId: string, itemKey: string, x: number, y: number) => void;
  removeDecoration: (petId: string, instanceId: string) => void;
  
  addInventoryItem: (itemId: string) => void;
  removeInventoryItem: (itemId: string) => void;

  addXP: (petId: string, amount: number) => void;
  levelUpQueue: { petId: string, name: string, level: number }[];
  popLevelUp: () => void;
  markActivityDone: (petId: string, activityId: string) => void;

  updateSettings: (updates: Partial<GameState['settings']>) => void;

  resetGame: () => void;
}

const initialState = {
  playerName: '',
  townName: '',
  shelterName: '',
  dayNumber: 1,
  phase: DayPhase.MORNING,
  money: 100, // Start with some money for testing or as default
  shelterAnimals: [],
  ownedPets: [],
  vetAnimals: [],
  facilityUpgrades: ['KENNEL_BASIC_3'],
  shopUnlocks: [],
  reputationBySpecies: {
    [Species.DOG]: 0,
    [Species.CAT]: 0,
    [Species.SMALL_ANIMAL]: 0,
    [Species.BIRD]: 0,
    [Species.REPTILE]: 0,
    [Species.EXOTIC_SMALL]: 0,
    [Species.AQUATIC]: 0,
    [Species.EXOTIC_LARGE]: 0
  },
  noticeBoard: [],
  playerAppearance: null,
  placedFurniture: [],
  petOutfits: {},
  petHouseDecorations: {},
  inventory: [],
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.7,
    skipPrologue: false,
  },
  prologueComplete: false,
  prologuePanelIndex: null,
  assignedBreed: null,
  washComplete: false,
  phase4Complete: false,
  phase5State: 'pending' as const,
  phase6State: 'pending' as const,
  rescueBreed: null,
  rescueHealth: null,
  rescueRarity: null,
  rescueSpecies: null,
  secondPetName: '',
  adoptionResults: null,
  shelterUnlocked: false,
  morningBoardUnlocked: false,
  shelterCapacity: 3,
  catCapacity: 0,
  homeDogCapacity: 1,
  homeCatCapacity: 0,
  homeRabbitCapacity: 0,
  homeBirdCapacity: 0,
  homeReptileCapacity: 0,
  homeAquaticCapacity: 0,
  catsUnlocked: false,
  rarePetsUnlocked: false,
  spareRoomAccessible: true,
  shelterExterior: null,
  actionsPerPetToday: 1,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialState,

      setPlayerName: (name) => set({ playerName: name }),
      setTownName: (name) => set({ townName: name }),
      setPlayerAppearance: (appearance) => set({ playerAppearance: appearance }),
      advancePrologue: () => set({ prologueComplete: true, prologuePanelIndex: null }),
      setProloguePanel: (index) => set({ prologuePanelIndex: index }),
      setPrologueComplete: (complete) => set({ prologueComplete: complete }),
      
      initializeWash: (seed = Date.now()) => {
        const state = useGameStore.getState();
        let breed;
        if (state.dayNumber === 1) {
          breed = STARTER_DOGS[0]; // Day 1: Husky
        } else if (state.dayNumber === 2) {
          // Day 2: Force Corgi as per plan
          breed = STARTER_DOGS.find(d => d.id === 'dog_corgi') || STARTER_DOGS[2];
        } else {
          breed = assignStarterBreed(seed);
        }
        set({ assignedBreed: breed, washComplete: false, phase4Complete: false, phase5State: 'pending' });
      },
      initializeRescueWash: (seed = Date.now(), healthStatus = HealthStatus.HEALTHY, rarity = Rarity.COMMON, species = 'Dog') => {
        const state = useGameStore.getState();
        let breed;
        if (state.dayNumber === 1) {
          breed = STARTER_DOGS[0]; // Should not happen in normal flow but for safety
        } else if (state.dayNumber === 2) {
          // Day 2: Force Corgi as per plan
          breed = STARTER_DOGS.find(d => d.id === 'dog_corgi') || STARTER_DOGS[2];
        } else {
          breed = assignStarterBreed(seed, species, state.rarePetsUnlocked);
        }
        set({ 
          rescueBreed: breed, 
          rescueHealth: healthStatus,
          rescueRarity: rarity,
          rescueSpecies: species,
          washComplete: false 
        });
      },
      completeWash: () => set({ washComplete: true }),
      completeRescueWash: () => {
        const state = useGameStore.getState();
        if (state.dayNumber === 2) {
          set({ phase6State: 'day2_discovery' });
        } else if (state.dayNumber === 1) {
          // Day 1 rescue wash finishing: App.tsx will catch this if we set a specific state 
          // or we can just proceed. For now, let's keep it simple and match the user request for Day 1 walk interactions.
          set({ phase6State: 'pending' }); 
        } else {
          if (state.rescueBreed) {
            const pet = createStarterPet(state.rescueBreed, "Rescued Animal");
            pet.isMine = false;
            pet.healthStatus = state.rescueHealth || HealthStatus.HEALTHY;
            pet.rarity = state.rescueRarity || Rarity.COMMON;

            const searchCalls = useMorningBoardStore.getState().todayCalls;
            const matchingCall = searchCalls.find(c => c.species === (pet.species as any));
            const method = matchingCall?.discoveryMethod || DiscoveryMethod.DIRTY;

            pet.discoveryMethod = method;
            pet.mood = getMoodFromDiscovery(method);

            // Plan-based starting desirability
            const getStartDesirability = (m: DiscoveryMethod) => {
              switch (m) {
                case DiscoveryMethod.DIRTY: return 10 + Math.floor(Math.random() * 11); // 10-20
                case DiscoveryMethod.PORCH_HIDING: return 15 + Math.floor(Math.random() * 11); // 15-25
                case DiscoveryMethod.FENCE_TANGLED: return 20 + Math.floor(Math.random() * 11); // 20-30
                case DiscoveryMethod.SCARED_APPROACH: return 10 + Math.floor(Math.random() * 11); // 10-20
                case DiscoveryMethod.PARK_INJURED: return 25 + Math.floor(Math.random() * 11); // 25-35
                default: return 20;
              }
            };
            
            pet.desirability = getStartDesirability(method);

            set((s) => ({
              shelterAnimals: [...s.shelterAnimals, pet],
              rescueBreed: null,
              rescueHealth: null,
              rescueRarity: null,
              rescueSpecies: null,
              phase6State: 'shelter_view'
            }));
          } else {
            set({ phase6State: 'shelter_view' });
          }
        }
      },
      completePhase4: () => set({ phase4Complete: true, phase5State: 'naming' }),
      setPhase5State: (state) => set({ phase5State: state }),
      setPhase6State: (state) => set({ phase6State: state }),
      addOwnedPet: (pet) => set((state) => ({ ownedPets: [...state.ownedPets, pet] })),
      addShelterAnimal: (pet) => set((state) => ({ shelterAnimals: [...state.shelterAnimals, pet] })),
      updateShelterAnimal: (id, updates) => set((state) => ({
         shelterAnimals: state.shelterAnimals.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      nameShelterAnimal: (id, name) => set((state) => {
        const animal = state.shelterAnimals.find(a => a.id === id);
        if (!animal) return state;
        const desirabilityBonus = animal.hasBeenNamed ? 0 : 10;
        return {
          shelterAnimals: state.shelterAnimals.map(a => 
            a.id === id ? { ...a, name, hasBeenNamed: true, desirability: Math.min(100, a.desirability + desirabilityBonus) } : a
          )
        };
      }),
      setShelterName: (name) => set({ shelterName: name }),
      setPetName: (name) => set((state) => {
        if (state.assignedBreed) {
          const pet = createStarterPet(state.assignedBreed, name);
          pet.homeLocation = 'bedroom';
          return { ownedPets: [...state.ownedPets, pet] };
        }
        return state;
      }),
      setSecondPetName: (name) => set({ secondPetName: name }),
      startDay: (day) => {
        const state = useGameStore.getState();
        const updates: any = { dayNumber: day };
        if (day >= 3) {
          updates.shelterUnlocked = true;
          updates.morningBoardUnlocked = true;
        }

        // Action limit logic: Reset to 1 daily
        updates.actionsPerPetToday = 1;

        set(updates);
      },

      resetDay: () => {
        const state = useGameStore.getState();
        useMorningBoardStore.getState().setTodayCalls([]);
        
        const upgrades = [...state.facilityUpgrades];
        if (!upgrades.includes('KENNEL_BASIC_3')) {
          upgrades.push('KENNEL_BASIC_3');
        }

        if (state.dayNumber === 1) {
          set({ 
            phase6State: 'pending', 
            washComplete: false, 
            phase4Complete: false,
            assignedBreed: null,
            rescueBreed: null,
            phase5State: 'pending',
            facilityUpgrades: upgrades
          });
        } else {
          set({ 
            phase6State: state.dayNumber === 2 ? 'day2_special' : 'phone_call',
            adoptionResults: null,
            washComplete: false,
            rescueBreed: null,
            rescueHealth: null,
            rescueRarity: null,
            rescueSpecies: null,
            facilityUpgrades: upgrades
          });
        }
      },

      purchaseUpgrade: (upgrade) => set((s) => ({
        money: s.money - upgrade.cost,
        facilityUpgrades: [...s.facilityUpgrades, upgrade.id]
      })),

      buyShopItem: (item) => {
        const state = useGameStore.getState();
        const updates = applyItemEffect(item, state);
        
        if (item.effect.type === 'UNLOCK_SHELTER') {
           set({ ...updates, dayNumber: 8, phase6State: 'exterior' });
        } else {
           set(updates);
        }
      },

      sendToVet: (animalId) => set((s) => {
        const animal = s.shelterAnimals.find(a => a.id === animalId);
        if (!animal) return s;
        const vetAnimal = prepareForVet(animal);
        return {
          shelterAnimals: s.shelterAnimals.filter(a => a.id !== animalId),
          vetAnimals: [...s.vetAnimals, vetAnimal]
        };
      }),

      vetCareAction: (animalId, actionType) => set((s) => {
        return {
          vetAnimals: s.vetAnimals.map(a => {
            if (a.id !== animalId) return a;
            let bonus = 0;
            if (actionType === 'bandage') bonus = 0.5;
            if (actionType === 'medicine') bonus = 1.0;
            // Comfort and check-in could increase mood/bond but for now let's just speed up slightly
            if (actionType === 'comfort') bonus = 0.2;
            
            return {
              ...a,
              vetDaysRemaining: Math.max(0, a.vetDaysRemaining - bonus)
            };
          })
        };
      }),

      processAdoptions: () => {
        const state = useGameStore.getState();
        const results = rollForAdoptions(
          state.shelterAnimals, 
          state.dayNumber * 777, // Seed based on day
          calculatepayout,
          state.facilityUpgrades
        );
        set({ adoptionResults: results, phase6State: 'adoption_results' });
      },

      finalizeAdoptions: () => {
        const state = useGameStore.getState();
        if (!state.adoptionResults) return;

        const totalPayout = state.adoptionResults.reduce((acc, r) => acc + r.payout, 0);
        const adoptedResults = state.adoptionResults.filter(r => r.isAdopted);
        const adoptedIds = adoptedResults.map(r => r.animalId);
        
        // Update reputation
        const newReputation = { ...state.reputationBySpecies };
        const adoptedAnimals = state.shelterAnimals.filter(a => adoptedIds.includes(a.id));
        adoptedAnimals.forEach(animal => {
          newReputation[animal.species] = (newReputation[animal.species] || 0) + 1;
        });

        const moods = ['Happy', 'Calm', 'Anxious', 'Shy'] as const;
        // Reset actions for everyone staying AND randomize their mood for the new day
        const remainingAnimals = state.shelterAnimals
          .filter(a => !adoptedIds.includes(a.id))
          .map(a => ({ 
            ...a, 
            actionsUsedToday: 0,
            mood: moods[Math.floor(Math.random() * moods.length)]
          }));

        const speedModifier = getRecoverySpeedModifier(state.facilityUpgrades);
        const { updatedVetAnimals, dischargedAnimals } = processVetRecovery(state.vetAnimals, speedModifier);

        set((s) => ({
          money: s.money + totalPayout,
          shelterAnimals: [...remainingAnimals, ...dischargedAnimals.map(a => ({ ...a, actionsUsedToday: 0 }))],
          ownedPets: s.ownedPets.map(p => ({ ...p, actionsUsedToday: 0, dailyXPFlags: {} })),
          vetAnimals: updatedVetAnimals,
          reputationBySpecies: newReputation,
          adoptionResults: null,
          phase6State: 'home_view'
        }));
      },

      performCareAction: (animalId, actionId) => set((state) => {
        let animal = state.shelterAnimals.find(a => a.id === animalId);
        let isOwned = false;

        if (!animal) {
          animal = state.ownedPets.find(a => a.id === animalId);
          isOwned = true;
        }

        const isActuallyLimited = !isOwned || actionId === 'play';
        if (!animal || (isActuallyLimited && animal.actionsUsedToday >= state.actionsPerPetToday)) return state;

        const baseGains: Record<string, number> = isOwned ? { pet: 10, feed: 10, play: 12, groom: 10 } : { pet: 5, feed: 8, play: 12, groom: 10 };
        const moodModifiers: Record<string, Record<string, number>> = {
          Happy: { pet: 1.0, feed: 1.0, play: 1.4, groom: 0.9 },
          Calm: { pet: 1.2, feed: 1.0, play: 1.1, groom: 1.3 },
          Anxious: { pet: 1.3, feed: 1.1, play: 0.6, groom: 0.7 },
          Shy: { pet: 1.4, feed: 1.0, play: 0.7, groom: 1.2 }
        };

        const base = baseGains[actionId];
        // For owned pets, user requested 10xp for pet/feed/groom regardless of mood
        const modifier = (isOwned && actionId !== 'play') ? 1.0 : (moodModifiers[animal.mood]?.[actionId] || 1.0);
        const variance = (isOwned && actionId !== 'play') ? 1.0 : (0.9 + Math.random() * 0.2);
        
        let gain = 0;

        if (isOwned && actionId !== 'play') {
          // Locked 10 XP gain for basic owned pet care, ONCE per day per action type
          if (!animal.dailyXPFlags?.[actionId as keyof typeof animal.dailyXPFlags]) {
            gain = 10;
          }
        } else {
          // Regular variable gain for shelter animals or playing games
          gain = Math.max(1, Math.round((base * modifier * variance) + (animal.hiddenBonuses?.[actionId] || 0)));
        }

        if (isOwned) {
          // Update owned pet XP
          const petIndex = state.ownedPets.findIndex(p => p.id === animalId);
          if (petIndex === -1) return state;

          const updatedOwnedPets = [...state.ownedPets];
          const pet = updatedOwnedPets[petIndex];
          
          let newCurrentXP = (pet.currentXP ?? 0) + gain;
          let newTotalXP = (pet.totalXP ?? 0) + gain;
          let newLevel = pet.level ?? 1;
          let leveledUp = false;

          while (newCurrentXP >= xpToNextLevel(newLevel)) {
            newCurrentXP -= xpToNextLevel(newLevel);
            newLevel++;
            leveledUp = true;
          }

          updatedOwnedPets[petIndex] = {
            ...pet,
            currentXP: newCurrentXP,
            totalXP: newTotalXP,
            level: newLevel,
            actionsUsedToday: actionId === 'play' ? pet.actionsUsedToday + 1 : pet.actionsUsedToday,
            dailyXPFlags: actionId !== 'play' 
              ? { ...pet.dailyXPFlags, [actionId]: true } 
              : pet.dailyXPFlags
          };

          const newLevelUpQueue = [...state.levelUpQueue];
          if (leveledUp) {
            newLevelUpQueue.push({ petId: pet.id, name: pet.name || 'Your pet', level: newLevel });
          }

          return { 
            ownedPets: updatedOwnedPets,
            levelUpQueue: newLevelUpQueue
          };
        }

        return {
          shelterAnimals: state.shelterAnimals.map(a => 
            a.id === animalId 
              ? { 
                  ...a, 
                  desirability: Math.min(100, a.desirability + gain),
                  actionsUsedToday: a.actionsUsedToday + 1
                } 
              : a
          )
        };
      }),

      buyExtraBed: () => set((s) => ({
        money: s.money - 75,
        shelterCapacity: 4
      })),

      renameOwnedPet: (petId, newName) => set((state) => ({
        ownedPets: state.ownedPets.map(p => p.id === petId ? { ...p, name: newName } : p)
      })),

      purchaseShelter: (exteriorId: string, cost: number) => set((s) => {
        const newUpgrades = [...s.facilityUpgrades];
        if (!newUpgrades.includes('facility_shelter')) {
          newUpgrades.push('facility_shelter');
        }
        
        return {
          money: s.money - cost,
          shelterExterior: exteriorId,
          facilityUpgrades: newUpgrades,
          // Bumping capacity to 4 for both dogs and cats when moving into the formal shelter
          shelterCapacity: 4,
          catCapacity: 4,
          catsUnlocked: true,
          rarePetsUnlocked: true,
          spareRoomAccessible: false,
        };
      }),

      skipToShelter: () => set((state) => ({
        actionsPerPetToday: Math.min(2, state.actionsPerPetToday + 1),
        phase6State: 'shelter_view'
      })),

      bringPetHome: (animalId: string) => set((state) => {
        const animal = state.shelterAnimals.find(a => a.id === animalId);
        if (!animal) return state;

        // Check capacity for species
        const ownedOfSpecies = state.ownedPets.filter(p => p.species === animal.species).length;
        let capacity = 0;
        let location: 'bedroom' | 'dogHouse' | 'familyRoom' | 'sunroom' | 'studyRoom' = 'dogHouse';

        if (animal.species === Species.DOG) {
          capacity = state.homeDogCapacity;
          // Assign location based on what's available
          const hasDogHouseOccupied = state.ownedPets.some(p => p.homeLocation === 'dogHouse');
          location = hasDogHouseOccupied ? 'bedroom' : 'dogHouse';
        } else if (animal.species === Species.CAT) {
          capacity = state.homeCatCapacity;
          location = 'familyRoom';
        }

        if (ownedOfSpecies >= capacity) return state;

        const newOwnedPet: Animal = {
          ...animal,
          isMine: true,
          homeLocation: location,
          actionsUsedToday: 0,
          activityCooldowns: {}
        };

        return {
          shelterAnimals: state.shelterAnimals.filter(a => a.id !== animalId),
          ownedPets: [...state.ownedPets, newOwnedPet]
        };
      }),

      putPetUpForAdoption: (petId: string) => set((state) => {
        const pet = state.ownedPets.find(p => p.id === petId);
        if (!pet) return state;

        const shelterPet: Animal = {
          ...pet,
          isMine: false,
          homeLocation: undefined,
          actionsUsedToday: 0,
          activityCooldowns: {}
        };

        return {
          ownedPets: state.ownedPets.filter(p => p.id !== petId),
          shelterAnimals: [...state.shelterAnimals, shelterPet]
        };
      }),

      swapOwnedPetLocations: (petIdA: string, petIdB: string) => set((state) => {
        const petA = state.ownedPets.find(p => p.id === petIdA);
        const petB = state.ownedPets.find(p => p.id === petIdB);
        if (!petA || !petB) return state;

        const locA = petA.homeLocation;
        const locB = petB.homeLocation;

        return {
          ownedPets: state.ownedPets.map(p => {
            if (p.id === petIdA) return { ...p, homeLocation: locB };
            if (p.id === petIdB) return { ...p, homeLocation: locA };
            return p;
          })
        };
      }),

      updateOwnedPet: (petId: string, updates: Partial<Animal>) => set((state) => ({
        ownedPets: state.ownedPets.map(p => p.id === petId ? { ...p, ...updates } : p)
      })),

      levelUpQueue: [],
      popLevelUp: () => set((state) => ({
        levelUpQueue: state.levelUpQueue.slice(1)
      })),

      markActivityDone: (petId: string, activityId: string) => set((state) => {
        const petIndex = state.ownedPets.findIndex(p => p.id === petId);
        if (petIndex === -1) return state;
        const newPets = [...state.ownedPets];
        newPets[petIndex] = {
          ...newPets[petIndex],
          actionsUsedToday: (newPets[petIndex].actionsUsedToday || 0) + 1,
          activityCooldowns: {
            ...newPets[petIndex].activityCooldowns,
            [activityId]: true
          }
        };
        return { ownedPets: newPets };
      }),

      addXP: (petId: string, amount: number) => set((state) => {
        const petIndex = state.ownedPets.findIndex(p => p.id === petId);
        if (petIndex === -1) return state;

        const pet = state.ownedPets[petIndex];
        const activityBonus = pet.hiddenBonuses?.activity || 0;
        const finalAmount = Math.max(1, amount + activityBonus);

        let newCurrentXP = (pet.currentXP ?? 0) + finalAmount;
        let newTotalXP = (pet.totalXP ?? 0) + finalAmount;
        let newLevel = pet.level ?? 1;
        let leveledUp = false;

        while (newCurrentXP >= xpToNextLevel(newLevel)) {
          newCurrentXP -= xpToNextLevel(newLevel);
          newLevel++;
          leveledUp = true;
        }

        const updatedPet = {
          ...pet,
          currentXP: newCurrentXP,
          totalXP: newTotalXP,
          level: newLevel
        };

        const newOwnedPets = [...state.ownedPets];
        newOwnedPets[petIndex] = updatedPet;

        const newQueue = [...state.levelUpQueue];
        if (leveledUp) {
          newQueue.push({ petId: pet.id, name: pet.name || 'Your Pet', level: newLevel });
        }

        return {
          ownedPets: newOwnedPets,
          levelUpQueue: newQueue
        };
      }),

      tuckIn: () => {
        const state = useGameStore.getState();
        const nextDay = state.dayNumber + 1;
        useMorningBoardStore.getState().setTodayCalls([]);

        const upgrades = [...state.facilityUpgrades];
        if (!upgrades.includes('KENNEL_BASIC_3')) {
          upgrades.push('KENNEL_BASIC_3');
        }

        // Action limit logic: Reset to 1 daily
        const actionsPerPetToday = 1;

        let nextPhaseState: typeof state.phase6State = 'phone_call';
        let updates: Partial<GameStore> = {
          dayNumber: nextDay,
          facilityUpgrades: upgrades,
          actionsPerPetToday: actionsPerPetToday,
          ownedPets: state.ownedPets.map(pet => ({
            ...pet,
            actionsUsedToday: 0,
            activityCooldowns: {}
          })),
          shelterAnimals: state.shelterAnimals.map(pet => ({
            ...pet,
            actionsUsedToday: 0
          }))
        };

        if (nextDay === 2) {
           nextPhaseState = 'day2_special';
        }
        else if (nextDay === 3) {
           nextPhaseState = 'day3_morning';
           updates.shelterUnlocked = true;
           updates.morningBoardUnlocked = true;
           localStorage.setItem('dayThreeSeen', 'true');
        }

        updates.phase6State = nextPhaseState;
        set(updates);
      },
      
      equipOutfit: (petId, outfitId) => set((s) => {
        const newOutfits = { ...s.petOutfits };
        if (outfitId) {
          newOutfits[petId] = outfitId;
        } else {
          delete newOutfits[petId];
        }
        return { petOutfits: newOutfits };
      }),

      placeFurniture: (id, x, y) => set((s) => ({
        placedFurniture: [...s.placedFurniture, { id, x, y }]
      })),

      removeFurniture: (index) => set((s) => ({
        placedFurniture: s.placedFurniture.filter((_, i) => i !== index)
      })),
      
      saveDecoration: (petId, instanceId, itemKey, x, y) => set((s) => {
        const petDecorations = s.petHouseDecorations[petId] || {};
        return {
          petHouseDecorations: {
            ...s.petHouseDecorations,
            [petId]: {
              ...petDecorations,
              [instanceId]: { x, y, itemKey }
            }
          }
        };
      }),

      removeDecoration: (petId, instanceId) => set((s) => {
        const petDecorations = { ...(s.petHouseDecorations[petId] || {}) };
        delete petDecorations[instanceId];
        return {
          petHouseDecorations: {
            ...s.petHouseDecorations,
            [petId]: petDecorations
          }
        };
      }),

      addInventoryItem: (itemId) => set((s) => ({
        inventory: [...s.inventory, itemId]
      })),

      removeInventoryItem: (itemId) => set((s) => {
        const index = s.inventory.indexOf(itemId);
        if (index === -1) return s;
        const newInventory = [...s.inventory];
        newInventory.splice(index, 1);
        return { inventory: newInventory };
      }),

      updateSettings: (updates) => set((s) => ({
        settings: { ...s.settings, ...updates }
      })),

      resetGame: () => {
        localStorage.removeItem('pawsOpeningSeen');
        localStorage.removeItem('dayOneWalkSeen');
        localStorage.removeItem('morningBoardTutorialSeen');
        localStorage.removeItem('shelterTutorialSeen');
        localStorage.removeItem('dayThreeSeen');
        set(initialState);
      },
    }),
    {
      name: 'paws-and-purpose-save',
    }
  )
);
