export interface PlayerAppearance {
  faceShape: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitColor: string;
  eyeColor: string;
}

export interface Player {
  id: string;
  appearance: PlayerAppearance;
}
