import React from 'react';
import { useGameStore } from '../stores/game.store';
import VolumeSlider from './VolumeSlider.component';
import { audioManager } from '../audio/audio.manager';
import { motion } from 'framer-motion';

export default function SettingsScreen({ onClose }: { onClose: () => void }) {
  const settings = useGameStore(state => state.settings);
  const updateSettings = useGameStore(state => state.updateSettings);

  const handleMusicChange = (val: number) => {
    updateSettings({ musicVolume: val });
    audioManager.updateMusicVolume(val);
  };

  const handleSFXChange = (val: number) => {
    updateSettings({ sfxVolume: val });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[200] bg-night-plum/90 flex items-center justify-center font-pixel p-4"
    >
      <div className="bg-warm-cream border-2 border-soft-lilac/50 p-10 rounded-[32px] w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-sage hover:text-speaker-rose transition-colors"
        >
          <span className="text-xl">✕</span>
        </button>

        <h2 className="text-xl font-game text-night-plum uppercase tracking-widest mb-10 text-center">Settings</h2>

        <div className="space-y-10">
          <VolumeSlider 
            label="Music Volume" 
            value={settings.musicVolume} 
            onChange={handleMusicChange}
            icon="🎶"
          />

          <VolumeSlider 
            label="SFX Volume" 
            value={settings.sfxVolume} 
            onChange={handleSFXChange}
            icon="🔊"
          />

          <div className="pt-6 border-t border-stone-grey/20">
            <div className="flex justify-between items-center bg-stone-grey/10 p-6 rounded-2xl border border-stone-grey/20">
              <div className="flex flex-col">
                <span className="text-[10px] text-dialogue-text uppercase tracking-widest mb-1">Skip Prologue</span>
                <span className="text-[7px] text-muted-sage uppercase tracking-widest">Start directly from naming</span>
              </div>
              <button 
                onClick={() => updateSettings({ skipPrologue: !settings.skipPrologue })}
                className={`
                  w-12 h-6 rounded-full p-1 transition-all
                  ${settings.skipPrologue ? 'bg-mossy-green' : 'bg-stone-grey/30'}
                `}
              >
                <div className={`
                  w-4 h-4 bg-warm-cream rounded-full transition-transform
                  ${settings.skipPrologue ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[6px] text-stone-grey uppercase tracking-[0.5em] mb-4">Version 1.0.0 Alpha</p>
          <button 
            onClick={onClose}
            className="w-full bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-4 rounded-xl uppercase tracking-widest transition-all"
          >
            Back to Shelter
          </button>
        </div>
      </div>
    </motion.div>
  );
}
