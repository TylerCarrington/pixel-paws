export enum CareActionType {
  WASH = 'WASH',
  FEED = 'FEED',
  GROOM = 'GROOM',
  PET = 'PET',
  PHOTO = 'PHOTO',
  TRAIN = 'TRAIN',
  SOCIALIZE = 'SOCIALIZE',
  VET = 'VET'
}

export interface CareActionDef {
  key: CareActionType;
  label: string;
  baseDelta: number;
  unlockRequirement: string | null;
  emoji: string;
}

export const CARE_ACTIONS: Record<CareActionType, CareActionDef> = {
  [CareActionType.WASH]: { key: CareActionType.WASH, label: 'Wash', baseDelta: 10, unlockRequirement: null, emoji: '🛁' },
  [CareActionType.FEED]: { key: CareActionType.FEED, label: 'Feed', baseDelta: 5, unlockRequirement: 'KENNEL_BASIC_3', emoji: '🦴' },
  [CareActionType.GROOM]: { key: CareActionType.GROOM, label: 'Groom', baseDelta: 8, unlockRequirement: 'ACTION_GROOM', emoji: '✂️' },
  [CareActionType.PET]: { key: CareActionType.PET, label: 'Pet', baseDelta: 5, unlockRequirement: null, emoji: '🐾' },
  [CareActionType.PHOTO]: { key: CareActionType.PHOTO, label: 'Photo', baseDelta: 12, unlockRequirement: 'ACTION_PHOTO', emoji: '📸' },
  [CareActionType.TRAIN]: { key: CareActionType.TRAIN, label: 'Train', baseDelta: 15, unlockRequirement: 'ACTION_TRAIN', emoji: '🎾' },
  [CareActionType.SOCIALIZE]: { key: CareActionType.SOCIALIZE, label: 'Socialize', baseDelta: 10, unlockRequirement: 'ACTION_SOCIALIZE', emoji: '🐕' },
  [CareActionType.VET]: { key: CareActionType.VET, label: 'Vet', baseDelta: 0, unlockRequirement: 'vet_wing', emoji: '🩺' }
};
