export interface ProloguePanelDef {
  artKey: string;
  captionTemplate: string | null;
}

export const PROLOGUE_PANELS: ProloguePanelDef[] = [
  {
    artKey: 'prologue_art_1',
    captionTemplate: 'After a long journey, you finally arrive in {townName}.',
  },
  {
    artKey: 'prologue_art_2',
    captionTemplate: 'The old run-down cottage is exactly as you remember it, {playerName}.',
  },
  {
    artKey: 'prologue_art_3',
    captionTemplate: 'But wait... what is that sound coming from the bushes?',
  },
  {
    artKey: 'prologue_art_4',
    captionTemplate: 'A muddy little blob appears, shaking and scared.',
  }
];
