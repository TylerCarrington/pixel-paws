import React from 'react';
import { useGameStore } from '../stores/game.store';

export default function DevControls() {
  const resetGame = useGameStore(state => state.resetGame);
  const resetDay = useGameStore(state => state.resetDay);

  // Only show in development mode
  // @ts-ignore
  if (import.meta.env?.MODE !== 'development') {
    return null;
  }

  return (
    <div className="shrink-0 h-10 bg-indigo-900 border-b border-indigo-700 z-[100] flex items-center px-4 justify-between font-mono text-xs text-indigo-200">
      <div className="font-bold tracking-widest uppercase">Dev Controls</div>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span>Jump to:</span>
          <select 
            className="bg-indigo-800 border border-indigo-600 rounded px-2 py-1 text-indigo-100 outline-none focus:ring-1 focus:ring-indigo-400"
            onChange={(e) => {
              if (e.target.value) {
                window.dispatchEvent(new CustomEvent('dev-jump', { detail: { target: e.target.value } }));
                e.target.value = ''; // Reset after selection
              }
            }}
          >
            <option value="">-- Select Spot --</option>
            <optgroup label="Day 1">
              <option value="postReveal">Day 1: Post Rescue</option>
              <option value="petting">Day 1: Petting Husky</option>
              <option value="tuckIn">Day 1: Tuck In Husky</option>
            </optgroup>
            <optgroup label="Day 2">
              <option value="parkScene">Day 2: Park Search</option>
              <option value="discovery">Day 2: Post Rescue Corgi</option>
              <option value="spareRoomScene">Day 2: Spare Room (Corgi Bed)</option>
              <option value="day2Petting">Day 2: Petting Husky</option>
              <option value="day2TuckIn">Day 2: Tuck In Husky</option>
            </optgroup>
            <optgroup label="Day 3">
              <option value="day3Morning">Day 3: Morning Sequence</option>
              <option value="morningBoardTutorial">Day 3: Board Tutorial</option>
            </optgroup>
            <optgroup label="Debug">
              <option value="animation_debug">Animations</option>
              <option value="games_debug">Minigames Hub</option>
            </optgroup>
          </select>
        </div>
        
        <div className="h-4 w-px bg-indigo-700 mx-2" />

        <div className="flex gap-2">
          <button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="bg-indigo-700 hover:bg-indigo-500 px-3 py-1 rounded transition-colors whitespace-nowrap"
          >
            Open in New Tab
          </button>
          <button 
            onClick={resetDay}
            className="bg-indigo-700 hover:bg-indigo-500 px-3 py-1 rounded transition-colors"
          >
            Reset Day
          </button>
          <button 
            onClick={() => {
              resetGame();
              window.location.reload();
            }}
            className="bg-indigo-800 hover:bg-indigo-600 px-3 py-1 rounded transition-colors"
          >
            Reset Game
          </button>
        </div>
      </div>
    </div>
  );
}
