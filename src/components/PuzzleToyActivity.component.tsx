import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import { useGameStore } from '../stores/game.store';

import bedroomBg from '../assets/images/backgrounds/house-interior.png';

interface PuzzleToyProps {
  pet: Animal;
  onComplete: () => void;
}

const GRID_SIZE = 3;

export default function PuzzleToyActivity({ pet, onComplete }: PuzzleToyProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [moves, setMoves] = useState(0);
  
  const addXP = useGameStore(state => state.addXP);
  const markActivityDone = useGameStore(state => state.markActivityDone);

  const initializePuzzle = () => {
    // 0 is the empty tile
    const initialTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    
    // Shuffle tiles
    let shuffled = [...initialTiles];
    for (let i = 0; i < 100; i++) {
        const emptyIndex = shuffled.indexOf(0);
        const neighbors = getNeighbors(emptyIndex);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }
    
    setTiles(shuffled);
    setIsSolved(false);
    setMoves(0);
  };

  const getNeighbors = (index: number) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors = [];
    if (row > 0) neighbors.push(index - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < GRID_SIZE - 1) neighbors.push(index + 1);
    return neighbors;
  };

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    
    const emptyIndex = tiles.indexOf(0);
    const neighbors = getNeighbors(emptyIndex);
    
    if (neighbors.includes(index)) {
        const newTiles = [...tiles];
        [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
        setTiles(newTiles);
        setMoves(prev => prev + 1);
        
        // Check if solved
        if (newTiles.every((val, i) => i === newTiles.length - 1 ? val === 0 : val === i + 1)) {
            setIsSolved(true);
            setTimeout(() => setShowResult(true), 1500);
        }
    }
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  const handleFinish = () => {
    addXP(pet.id, 125);
    markActivityDone(pet.id, 'puzzleToy');
    onComplete();
  };

  const finalXP = 125 + (pet.hiddenBonuses?.activity || 0);

  return (
    <div className="absolute inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url(${bedroomBg})` }}
      />
      
      <div className="z-10 bg-warm-cream/90 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-lg w-full text-center border-4 border-amber-glow relative">
        <h2 className="text-3xl font-game text-speaker-rose mb-4 uppercase tracking-widest">Puzzle Toy</h2>
        
        {!showResult ? (
          <>
            <div className="mb-4 text-stone-grey text-sm">
                Moves: {moves}
            </div>

            <p className="text-stone-grey text-[10px] mb-6 uppercase tracking-wider">
              {isSolved ? "Solved! Here comes the treat!" : "Slide the tiles to unlock the treat!"}
            </p>

            <div className="grid grid-cols-3 gap-2 bg-warm-brown/20 p-2 rounded-xl border-4 border-warm-brown/40 mx-auto aspect-square w-full max-w-[320px]">
              {tiles.map((tile, i) => (
                <motion.button
                  key={i}
                  layout
                  onClick={() => handleTileClick(i)}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl font-game transition-all ${
                    tile === 0 ? 'bg-transparent' : 'bg-white border-b-4 border-stone-grey/20 hover:bg-amber-50 active:translate-y-1 active:border-b-0'
                  }`}
                >
                  {tile !== 0 && (
                      <div className="flex flex-col items-center">
                          <span className={`${isSolved ? 'grayscale-0' : 'grayscale'} transition-all`}>
                             {tile % 2 === 0 ? '🐶' : '🦴'}
                          </span>
                          <span className="text-[8px] text-stone-grey opacity-40">{tile}</span>
                      </div>
                  )}
                </motion.button>
              ))}
            </div>
            
            <button 
                onClick={initializePuzzle}
                className="mt-6 text-[10px] text-speaker-rose hover:underline uppercase tracking-widest"
            >
                Reset Puzzle
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-6xl mb-6">🥓</span>
            <p className="text-lg text-night-plum mb-8">Smart pet! {pet.name || 'Your pet'} solved it in {moves} moves!</p>
            <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-xl mb-8 font-bold">+{finalXP} XP</div>
            
            <button
              onClick={handleFinish}
              className="bg-amber-glow hover:bg-amber-500 text-white font-game text-[12px] px-8 py-4 rounded-xl shadow-md active:scale-95 transition-all uppercase tracking-widest"
            >
              Finish
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-night-plum/60 hover:bg-night-plum text-white rounded-full flex items-center justify-center backdrop-blur-md active:scale-95 transition-all font-pixel text-xl"
      >
        ×
      </button>
    </div>
  );
}
