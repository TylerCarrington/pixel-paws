import React from 'react';
import { PlayerAppearance } from '../types/player.types';

interface Props {
  appearance: PlayerAppearance;
}

export default function CharacterPreview({ appearance }: Props) {
  // TODO: Implement full sprite layers in Phase 15.
  // For now, render a coloured silhouette for basic visual feedback.
  return (
    <div className="w-48 h-64 border-4 border-stone-grey/50 bg-stone-grey/10 rounded-lg flex flex-col items-center justify-end pb-8 relative shadow-inner">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-soft-lilac/50 to-transparent"></div>

      {/* Character Group */}
      <div className="relative w-24 h-48 flex flex-col items-center">
        {/* Hair (Background/Volume) */}
        {appearance.hairStyle !== 'Bald' && (
          <div 
            className={`absolute ${
              appearance.hairStyle === 'Long' ? '-top-2 w-16 h-28 rounded-t-full rounded-b-md' :
              appearance.hairStyle === 'Ponytail' ? 'top-2 -right-3 w-8 h-12 rounded-b-full rotate-[20deg]' :
              appearance.hairStyle === 'Curly' ? '-top-4 w-18 h-18 rounded-full' :
              appearance.hairStyle === 'Spiky' ? '-top-4 w-16 h-12' : 
              '-top-2 w-16 h-14 rounded-t-full' // Short
            }`}
            style={{ 
              backgroundColor: appearance.hairColor,
              clipPath: appearance.hairStyle === 'Spiky' ? 'polygon(0% 100%, 15% 0%, 30% 80%, 50% 0%, 70% 80%, 85% 0%, 100% 100%)' : 'none'
            }}
          ></div>
        )}
        
        {/* Head */}
        <div 
          className="absolute top-0 w-14 h-14 flex justify-center items-center overflow-hidden z-10 shadow-sm" 
          style={{ 
            backgroundColor: appearance.skinTone, 
            borderRadius: appearance.faceShape === 'Round' ? '50%' : '20%' 
          }}
        >
          {/* Front Hair (Bangs) */}
          {appearance.hairStyle !== 'Bald' && (
            <div 
              className={`absolute top-0 w-full ${
                appearance.hairStyle === 'Curly' ? 'h-4 rounded-b-full scale-110' : 
                appearance.hairStyle === 'Short' ? 'h-3 scale-110' : 
                'h-4 rounded-b-md'
              }`}
              style={{ backgroundColor: appearance.hairColor }}
            ></div>
          )}

          {/* Eyes */}
          <div className="flex gap-2 mt-2">
            <div className="w-3 h-3 bg-warm-cream rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: appearance.eyeColor }}></div>
            </div>
            <div className="w-3 h-3 bg-warm-cream rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: appearance.eyeColor }}></div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div 
          className="absolute top-12 w-20 h-24 rounded-t-xl" 
          style={{ backgroundColor: appearance.outfitColor }}
        ></div>

        {/* Legs */}
        <div className="absolute top-36 flex gap-2">
           <div className="w-6 h-12 bg-stone-grey/50 rounded-sm"></div>
           <div className="w-6 h-12 bg-stone-grey/50 rounded-sm"></div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 text-xs font-mono bg-night-plum/60 text-warm-cream/70 px-2 py-1 rounded">Live Preview</div>
    </div>
  );
}
