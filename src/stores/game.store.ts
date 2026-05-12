import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, DayPhase } from '../types/game.types';
import { PlayerAppearance } from '../types/player.types';
import { Species } from '../types/animal.types';
import { StarterDogDef, STARTER_DOGS } from '../config/starterDogs.config';
import { assignStarterBreed } from '../logic/breedAssignment.logic';
import { createStarterPet } from '../logic/ownedPet.logic';
import { AdoptionResult, rollForAdoptions } from '../logic/adoptionRoll.logic';
import { calculatepayout } from '../logic/payoutCalculation.logic';
import { FacilityUpgrade } from '../config/vetUpgrades.config';
import { ShopItem } from '../config/shopItems.config';
import { applyItemEffect } from '../logic/purchaseItem.logic';
import { prepareForVet } from '../logic/vetAdmission.logic';
import { processVetRecovery } from '../logic/vetRecovery.logic';
import { getRecoverySpeedModifier } from '../logic/upgradeEffect.logic';
import { Animal, HealthStatus, Rarity } from '../types/animal.types';
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
  phase6State: 'pending' | 'phone_call' | 'wash_rescue' | 'reflection' | 'naming' | 'exterior' | 'shelter_view' | 'adoption_results' | 'vet_wing' | 'facility_shop' | 'facility_expansion' | 'day2_special' | 'bush_search' | 'day2_discovery' | 'day2_inspiration' | 'home_view' | 'day3_morning' | 'animation_debug' | 'alley_rescue' | 'games_debug' | 'fence_rescue' | 'dark_search' | 'food_tempt' | 'woodpile_rescue' | 'runaway_chase' | 'porch_hiding' | 'riverside_warmup';
  rescueBreed: StarterDogDef | null;
  rescueHealth: HealthStatus | null;
  rescueRarity: Rarity | null;
  secondPetName: string;

  initializeWash: (seed?: number) => void;
  initializeRescueWash: (seed?: number, healthStatus?: HealthStatus, rarity?: Rarity) => void;
  completeWash: () => void;
  completeRescueWash: () => void;
  completePhase4: () => void;
  setPhase5State: (state: 'pending' | 'naming' | 'petting' | 'bedtime' | 'complete') => void;
  setPhase6State: (state: 'pending' | 'phone_call' | 'wash_rescue' | 'reflection' | 'naming' | 'exterior' | 'shelter_view' | 'adoption_results' | 'vet_wing' | 'facility_shop' | 'facility_expansion' | 'day2_special' | 'bush_search' | 'day2_discovery' | 'day2_inspiration' | 'home_view' | 'day3_morning' | 'animation_debug' | 'alley_rescue' | 'games_debug' | 'fence_rescue' | 'dark_search' | 'food_tempt' | 'woodpile_rescue' | 'runaway_chase' | 'porch_hiding' | 'riverside_warmup') => void;
  addOwnedPet: (pet: any) => void;
  addShelterAnimal: (pet: any) => void;
  updateShelterAnimal: (id: string, updates: Partial<Animal>) => void;
  setShelterName: (name: string) => void;
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

  equipOutfit: (petId: string, outfitId: string | null) => void;
  placeFurniture: (id: string, x: number, y: number) => void;
  removeFurniture: (index: number) => void;
  addInventoryItem: (itemId: string) => void;

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
  secondPetName: '',
  adoptionResults: null,
  shelterUnlocked: false,
  morningBoardUnlocked: false,
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
      initializeRescueWash: (seed = Date.now(), healthStatus = HealthStatus.HEALTHY, rarity = Rarity.COMMON) => {
        const state = useGameStore.getState();
        let breed;
        if (state.dayNumber === 1) {
          breed = STARTER_DOGS[0]; // Should not happen in normal flow but for safety
        } else if (state.dayNumber === 2) {
          // Day 2: Force Corgi as per plan
          breed = STARTER_DOGS.find(d => d.id === 'dog_corgi') || STARTER_DOGS[2];
        } else {
          breed = assignStarterBreed(seed);
        }
        set({ 
          rescueBreed: breed, 
          rescueHealth: healthStatus,
          rescueRarity: rarity,
          washComplete: false 
        });
      },
      completeWash: () => set({ washComplete: true }),
      completeRescueWash: () => {
        const state = useGameStore.getState();
        if (state.dayNumber === 2) {
           set({ phase6State: 'day2_discovery' });
        } else if (!state.shelterName) {
           set({ phase6State: 'reflection' });
        } else {
           // If we already have a shelter name, just add the animal and go back to floor
           if (state.rescueBreed) {
              const pet = createStarterPet(state.rescueBreed, "Rescued Animal");
              pet.isMine = false;
              pet.healthStatus = state.rescueHealth || HealthStatus.HEALTHY;
              pet.rarity = state.rescueRarity || Rarity.COMMON;
              
              set((s) => ({ 
                shelterAnimals: [...s.shelterAnimals, pet],
                rescueBreed: null,
                rescueHealth: null,
                rescueRarity: null,
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
      setShelterName: (name) => set({ shelterName: name }),
      setSecondPetName: (name) => set({ secondPetName: name }),
      startDay: (day) => {
        const updates: any = { dayNumber: day };
        if (day >= 3) {
          updates.shelterUnlocked = true;
          updates.morningBoardUnlocked = true;
        }
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
        set(updates);
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
        const adoptedAnimals = state.shelterAnimals.filter(a => adoptedIds.includes(a.id));
        
        // Update reputation
        const newReputation = { ...state.reputationBySpecies };
        adoptedAnimals.forEach(animal => {
          newReputation[animal.species] = (newReputation[animal.species] || 0) + 1;
        });

        const speedModifier = getRecoverySpeedModifier(state.facilityUpgrades);
        const { updatedVetAnimals, dischargedAnimals } = processVetRecovery(state.vetAnimals, speedModifier);

        set((s) => ({
          money: s.money + totalPayout,
          shelterAnimals: [...s.shelterAnimals.filter(a => !adoptedIds.includes(a.id)), ...dischargedAnimals],
          vetAnimals: updatedVetAnimals,
          reputationBySpecies: newReputation,
          adoptionResults: null,
          phase6State: 'home_view'
        }));
      },

      tuckIn: () => {
        const state = useGameStore.getState();
        const nextDay = state.dayNumber + 1;
        useMorningBoardStore.getState().setTodayCalls([]);

        const upgrades = [...state.facilityUpgrades];
        if (!upgrades.includes('KENNEL_BASIC_3')) {
          upgrades.push('KENNEL_BASIC_3');
        }

        let nextPhaseState: typeof state.phase6State = 'phone_call';
        let updates: Partial<GameStore> = {
          dayNumber: nextDay,
          facilityUpgrades: upgrades
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

      addInventoryItem: (itemId) => set((s) => ({
        inventory: [...s.inventory, itemId]
      })),

      updateSettings: (updates) => set((s) => ({
        settings: { ...s.settings, ...updates }
      })),

      resetGame: () => {
        localStorage.removeItem('pawsOpeningSeen');
        localStorage.removeItem('dayOneWalkSeen');
        localStorage.removeItem('morningBoardTutorialSeen');
        localStorage.removeItem('dayThreeSeen');
        set(initialState);
      },
    }),
    {
      name: 'paws-and-purpose-save',
    }
  )
);
