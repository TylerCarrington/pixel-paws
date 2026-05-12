import React, { useState } from 'react';
import AppearanceSelector from './AppearanceSelector.component';
import CharacterPreview from './CharacterPreview.component';
import NameInput from './NameInput.component';
import { CHARACTER_OPTIONS } from '../assets/character.assets';
import { PlayerAppearance } from '../types/player.types';
import { validateName } from '../logic/characterBuilder.logic';
import { useGameStore } from '../stores/game.store';

export default function CharacterBuilder() {
  const storePlayerName = useGameStore(state => state.playerName);
  const storeTownName = useGameStore(state => state.townName);
  const setPlayerName = useGameStore(state => state.setPlayerName);
  const setTownName = useGameStore(state => state.setTownName);
  const setPlayerAppearance = useGameStore(state => state.setPlayerAppearance);
  const advancePrologue = useGameStore(state => state.advancePrologue);

  const [appearance, setAppearance] = useState<PlayerAppearance>({
    faceShape: CHARACTER_OPTIONS.faceShapes[0],
    skinTone: CHARACTER_OPTIONS.skinTones[0],
    hairStyle: CHARACTER_OPTIONS.hairStyles[0],
    hairColor: CHARACTER_OPTIONS.hairColors[0],
    outfitColor: CHARACTER_OPTIONS.outfitColors[0],
    eyeColor: CHARACTER_OPTIONS.eyeColors[0],
  });

  const [localPlayerName, setLocalPlayerName] = useState(storePlayerName || '');
  const [localTownName, setLocalTownName] = useState(storeTownName || '');

  const isPlayerNameValid = validateName(localPlayerName);
  const isTownNameValid = validateName(localTownName);
  const canConfirm = isPlayerNameValid && isTownNameValid;

  const handleConfirm = () => {
    if (canConfirm) {
      setPlayerName(localPlayerName.trim());
      setTownName(localTownName.trim());
      setPlayerAppearance(appearance);
    }
  };

  return (
    <div className="w-full h-full bg-warm-cream/50 text-dialogue-text flex flex-col md:flex-row overflow-hidden font-pixel border-none z-10 text-left">
      {/* Preview Section */}
      <div className="w-full md:w-1/3 bg-warm-cream flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-stone-grey/30 shadow-xl overflow-y-auto">
        <h2 className="text-sm font-game mb-10 text-center tracking-tight text-night-plum leading-relaxed uppercase">Create Character</h2>
        <CharacterPreview appearance={appearance} />
        <div className="mt-12 h-12 flex items-center justify-center">
          {localPlayerName ? (
             <div className="text-[10px] font-pixel text-night-plum bg-stone-grey/20 px-4 py-2 rounded shadow-md border border-stone-grey/30 uppercase tracking-widest">
               {localPlayerName}
             </div>
          ) : (
             <div className="text-stone-grey text-[10px] italic uppercase tracking-widest">Name not set</div>
          )}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col h-full bg-warm-cream/90 backdrop-blur-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
          <NameInput 
            label="Player Name" 
            value={localPlayerName} 
            onChange={setLocalPlayerName} 
            maxLength={20} 
          />
          <NameInput 
            label="Town Name" 
            value={localTownName} 
            onChange={setLocalTownName} 
            maxLength={20} 
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-4 space-y-6 shrink scrollbar-thin scrollbar-thumb-stone-grey/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            <AppearanceSelector 
              label="Face Shape" 
              options={CHARACTER_OPTIONS.faceShapes} 
              selectedValue={appearance.faceShape} 
              onSelect={(val) => setAppearance(prev => ({...prev, faceShape: val}))} 
            />
            
            <AppearanceSelector 
              label="Skin Tone" 
              options={CHARACTER_OPTIONS.skinTones} 
              selectedValue={appearance.skinTone} 
              onSelect={(val) => setAppearance(prev => ({...prev, skinTone: val}))} 
            />

            <AppearanceSelector 
              label="Hair Style" 
              options={CHARACTER_OPTIONS.hairStyles} 
              selectedValue={appearance.hairStyle} 
              onSelect={(val) => setAppearance(prev => ({...prev, hairStyle: val}))} 
            />

            <AppearanceSelector 
              label="Hair Color" 
              options={CHARACTER_OPTIONS.hairColors} 
              selectedValue={appearance.hairColor} 
              onSelect={(val) => setAppearance(prev => ({...prev, hairColor: val}))} 
            />

            <AppearanceSelector 
              label="Eye Color" 
              options={CHARACTER_OPTIONS.eyeColors} 
              selectedValue={appearance.eyeColor} 
              onSelect={(val) => setAppearance(prev => ({...prev, eyeColor: val}))} 
            />

            <AppearanceSelector 
              label="Outfit Color" 
              options={CHARACTER_OPTIONS.outfitColors} 
              selectedValue={appearance.outfitColor} 
              onSelect={(val) => setAppearance(prev => ({...prev, outfitColor: val}))} 
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-grey/30 flex justify-end shrink-0">
          <button 
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-10 py-5 text-sm font-game uppercase tracking-widest transition-all shadow-lg ${
              canConfirm 
                ? 'bg-mossy-green hover:bg-deep-moss text-warm-cream cursor-pointer active:scale-95' 
                : 'bg-stone-grey/20 text-stone-grey cursor-not-allowed border border-stone-grey/30'
            }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
