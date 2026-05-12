import React from 'react';
import { useGameStore } from '../stores/game.store';
import { FURNITURE } from '../config/furniture.config';
import { calculateRoomComfort } from '../logic/roomComfort.logic';

export default function RoomGrid() {
  const placedFurniture = useGameStore(state => state.placedFurniture);
  const removeFurniture = useGameStore(state => state.removeFurniture);
  const comfort = calculateRoomComfort(placedFurniture);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-[10px] text-soft-lilac uppercase tracking-widest font-game">Room Layout</div>
        <div className="bg-soft-lilac/10 px-4 py-2 rounded-lg border border-soft-lilac/20">
          <span className="text-[8px] text-muted-sage uppercase tracking-widest mr-2">Comfort Rating:</span>
          <span className="text-sm font-game text-amber-glow">{comfort}</span>
        </div>
      </div>

      <div className="flex-1 bg-stone-grey/5 border-2 border-dashed border-stone-grey/20 rounded-2xl relative overflow-hidden grid grid-cols-6 grid-rows-6 gap-1 p-2">
        {/* Simple grid visualization */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border border-stone-grey/10 rounded-sm" />
        ))}

        {/* Placed Items */}
        {placedFurniture.map((p, index) => {
          const item = FURNITURE[p.id];
          if (!item) return null;
          return (
            <div
              key={index}
              style={{
                gridColumn: `${p.x + 1} / span ${item.width}`,
                gridRow: `${p.y + 1} / span ${item.height}`,
              }}
              className="bg-blossom-pink/20 border border-blossom-pink/40 rounded-lg flex flex-col items-center justify-center relative group cursor-pointer"
              onClick={() => removeFurniture(index)}
            >
              <span className="text-2xl">📦</span>
              <span className="text-[6px] uppercase tracking-tighter text-warm-cream opacity-0 group-hover:opacity-100 absolute -bottom-4 bg-night-plum/80 px-1 rounded">Remove</span>
              <div className="text-[8px] text-night-plum mt-1 font-game">{item.name}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h4 className="text-[8px] text-stone-grey uppercase tracking-[0.2em] mb-4">Your Inventory</h4>
        <FurnitureInventory />
      </div>
    </div>
  );
}

function FurnitureInventory() {
  const placeFurniture = useGameStore(state => state.placeFurniture);
  const available = Object.values(FURNITURE);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {available.map(item => (
        <button
          key={item.id}
          onClick={() => placeFurniture(item.id, Math.floor(Math.random() * 4), Math.floor(Math.random() * 4))}
          className="bg-warm-cream border border-stone-grey/20 p-4 rounded-xl flex flex-col items-center flex-shrink-0 min-w-[80px] hover:border-blossom-pink/50 transition-all shadow-sm"
        >
          <span className="text-2xl mb-2">🎁</span>
          <span className="text-[8px] text-night-plum uppercase tracking-widest">{item.name}</span>
          <span className="text-[6px] text-mossy-green mt-1">Comfort +{item.comfortValue}</span>
        </button>
      ))}
    </div>
  );
}
