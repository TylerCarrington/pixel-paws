import React from 'react';
import { useGameStore } from '../stores/game.store';
import { PROLOGUE_PANELS } from '../config/prologue.config';
import { PROLOGUE_ASSETS } from '../assets/prologue.assets';

export default function CutscenePanel() {
  const panelIndex = useGameStore(state => state.prologuePanelIndex);
  const playerName = useGameStore(state => state.playerName);
  const townName = useGameStore(state => state.townName);

  if (panelIndex === null || panelIndex >= PROLOGUE_PANELS.length) return null;

  const panel = PROLOGUE_PANELS[panelIndex];
  
  let caption = panel.captionTemplate || '';
  caption = caption.replace('{playerName}', playerName);
  caption = caption.replace('{townName}', townName);

  const imgSrc = PROLOGUE_ASSETS[panel.artKey];

  return (
    <div className="flex flex-col items-center justify-center p-8 pointer-events-none w-full h-full">
      <div className="bg-night-plum/40 p-4 rounded-lg backdrop-blur-sm border border-soft-lilac/30 shadow-2xl flex flex-col items-center max-w-2xl w-full">
        <img 
          src={imgSrc} 
          alt={`Scene ${panelIndex + 1}`} 
          className="w-full h-auto aspect-video object-cover rounded shadow-inner" 
          style={{ imageRendering: 'pixelated' }} 
        />
        {caption && (
          <div className="mt-6 px-6 py-4 bg-warm-cream/90 rounded border border-soft-rose/30 w-full">
            <p className="text-dialogue-text font-retro text-center text-2xl leading-tight">{caption}</p>
          </div>
        )}
      </div>
      <div className="mt-8 text-warm-cream/70 font-pixel text-[10px] uppercase tracking-widest animate-pulse">
        Tap to continue
      </div>
    </div>
  );
}
