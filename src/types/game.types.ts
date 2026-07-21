import { Animal, Species } from './animal.types';
import { Call } from './call.types';
import { PlayerAppearance } from './player.types';

export enum DayPhase {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING'
}

export interface GameState {
  playerName: string;
  townName: string;
  shelterName: string;
  dayNumber: number;
  phase: DayPhase;
  money: number;
  shelterAnimals: Animal[];
  ownedPets: Animal[];
  vetAnimals: Animal[];
  facilityUpgrades: string[];
  shopUnlocks: string[];
  reputationBySpecies: Record<Species, number>;
  noticeBoard: Call[];
  playerAppearance: PlayerAppearance | null;
  placedFurniture: { id: string; x: number; y: number }[];
  petOutfits: Record<string, string>;
  petHouseDecorations: Record<string, { [instanceId: string]: { x: number; y: number; itemKey: string } }>;
  inventory: string[];
  settings: {
    musicVolume: number;
    sfxVolume: number;
    skipPrologue: boolean;
  };
  shelterUnlocked: boolean;
  morningBoardUnlocked: boolean;
  shelterCapacity: number; // We'll keep this as dogs capacity or total capacity. But if we need separate capacity for cats... Let's just use `shelterCapacity` for dogs, and add `catCapacity`.
  catCapacity: number;
  homeDogCapacity: number;
  homeCatCapacity: number;
  homeRabbitCapacity: number;
  homeBirdCapacity: number;
  homeReptileCapacity: number;
  homeAquaticCapacity: number;
  catsUnlocked: boolean;
  rarePetsUnlocked: boolean;
  spareRoomAccessible: boolean;
  shelterExterior: string | null;
  actionsPerPetToday: number;
}
