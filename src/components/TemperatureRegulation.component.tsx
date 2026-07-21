import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion } from 'framer-motion';
import DialoguePanel from './DialoguePanel';
import AnimalSprite from './AnimalSprite.component';

export default function TemperatureRegulation({ onFinish }: { onFinish?: () => void }) {
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const rescueBreed = useGameStore(state => state.rescueBreed);
  const species = useGameStore(state => state.rescueSpecies) || 'REPTILE';
  
  const [lampDistance, setLampDistance] = useState(50); // 0 to 100
  const [idealDistance, setIdealDistance] = useState(50); // The sweet spot, which will move
  const [temperature, setTemperature] = useState(20); // target 100
  const [prompt, setPrompt] = useState('Keep the lamp distance in the green zone to warm them!');
  const [isDone, setIsDone] = useState(false);

  // Randomize ideal distance
  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      setIdealDistance(prev => {
        // Drift wildly between -35 and +35
        const drift = (Math.random() * 70) - 35;
        let next = prev + drift;
        if (next < 10) next = 10;
        if (next > 90) next = 90;
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isDone]);

  const lampDistanceRef = useRef(lampDistance);
  useEffect(() => { lampDistanceRef.current = lampDistance; }, [lampDistance]);
  
  const idealDistanceRef = useRef(idealDistance);
  useEffect(() => { idealDistanceRef.current = idealDistance; }, [idealDistance]);

  useEffect(() => {
    if (isDone) return;
    
    const interval = setInterval(() => {
      const currentLamp = lampDistanceRef.current;
      const currentIdeal = idealDistanceRef.current;
      const diff = Math.abs(currentLamp - currentIdeal);
      
      setTemperature(prev => {
        let change = 0;
        if (diff <= 10) {
          change = 1.25; // Good spot (1.25 * 4 = 5 per sec)
          if (Math.random() < 0.05) setPrompt("That's it, keeping them in the warmth.");
        } else if (diff > 10 && diff < 25) {
          change = -0.5; // Slightly off (-0.5 * 4 = -2 per sec)
          if (Math.random() < 0.05) {
            if (currentLamp < currentIdeal) {
              setPrompt("A bit too close now.");
            } else {
              setPrompt("A bit too far.");
            }
          }
        } else if (currentLamp < currentIdeal - 25) {
          change = -2; // Too hot! Retreats! (-2 * 4 = -8 per sec)
          if (Math.random() < 0.1) setPrompt("Too close! It's too hot, they are scared!");
        } else {
          change = -1.5; // Too far, getting cold (-1.5 * 4 = -6 per sec)
          if (Math.random() < 0.1) setPrompt("Too far, they are getting cold again.");
        }
        
        let newTemp = prev + change;
        if (newTemp < 0) newTemp = 0;
        if (newTemp >= 100) {
          newTemp = 100;
          setIsDone(true);
          setPrompt("They are warm and active! Let's bring them back.");
          setTimeout(() => {
            if (onFinish) onFinish();
            else setPhase6State('day2_discovery');
          }, 3000);
        }
        return newTemp;
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, [isDone, onFinish, setPhase6State]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-pixel bg-stone-900 select-none">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70" 
        style={{ backgroundImage: "url('./src/assets/images/backgrounds/riverside-path.jpeg')" }}
      />
      
      <div className="absolute inset-x-0 top-24 bottom-64 flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
        <motion.div 
          className="relative"
          animate={{ opacity: temperature < 50 ? 0.6 : 1 }}
        >
          {rescueBreed ? (
            <AnimalSprite 
              spriteKey={rescueBreed.spriteKey} 
              species={species} 
              animation={temperature >= 100 ? "happy" : "idle"}
              size={120} 
            />
          ) : (
            <div className="w-32 h-32 bg-green-800/50 rounded-full" />
          )}

          {/* Heat overlay effect */}
          <div className="absolute inset-0 -m-8 pointer-events-none bg-yellow-400/20 rounded-full blur-2xl transition-opacity duration-500" 
            style={{ opacity: Math.abs(lampDistance - idealDistance) <= 10 ? 0.8 : (Math.abs(lampDistance - idealDistance) < 25 ? 0.4 : 0) }} 
          />
        </motion.div>
      </div>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-md bg-warm-cream/90 border-2 border-stone-400 p-4 rounded-xl z-20 shadow-lg">
        <h3 className="text-center font-bold text-stone-700 mb-2">Turtle Body Temp</h3>
        <div className="w-full h-6 bg-stone-300 rounded-full overflow-hidden border border-stone-400 relative">
          {/* Add a marker for the goal just to make it look cool */}
          <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${temperature}%` }} />
        </div>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-3/4 max-w-md bg-warm-cream border-2 border-stone-400 p-6 rounded-xl z-20 shadow-lg flex flex-col items-center">
        <h3 className="text-center font-bold text-stone-700 mb-2">Lamp Distance</h3>
        
        <div className="relative w-full h-12 flex items-center">
          {/* The optimal zone background */}
          <div className="absolute w-full h-8 bg-stone-300 rounded-full overflow-hidden top-1/2 -translate-y-1/2">
            <div 
              className="absolute h-full bg-green-400/60 transition-all duration-1000 ease-in-out"
              style={{ left: `${idealDistance - 10}%`, width: '20%' }}
            />
          </div>

          <input 
            type="range" 
            min="0" 
            max="100" 
            value={lampDistance}
            onChange={(e) => setLampDistance(Number(e.target.value))}
            disabled={isDone}
            className="absolute w-full h-12 accent-orange-500 cursor-pointer pointer-events-auto bg-transparent appearance-none touch-none"
            style={{ 
              WebkitAppearance: 'none', 
              background: 'transparent'
            }}
          />
          {/* Custom style for the thumb to ensure it shows over transparent bg */}
          <style dangerouslySetInnerHTML={{ __html: `
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              height: 40px;
              width: 40px;
              border-radius: 50%;
              background: #f97316;
              cursor: pointer;
              margin-top: -16px; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }
            input[type=range]::-webkit-slider-runnable-track {
              width: 100%;
              height: 8px;
              cursor: pointer;
              background: transparent;
            }
            input[type=range]::-moz-range-thumb {
              height: 40px;
              width: 40px;
              border-radius: 50%;
              background: #f97316;
              cursor: pointer;
              border: none;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            }
            input[type=range]::-moz-range-track {
              width: 100%;
              height: 8px;
              cursor: pointer;
              background: transparent;
            }
          `}} />
        </div>
        
        <div className="flex justify-between w-full text-xs text-stone-500 mt-4 px-2">
          <span>Too Close</span>
          <span>Too Far</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[200]">
        <DialoguePanel 
          speaker={null}
          text={prompt}
          variant="narration"
          onComplete={() => {}}
        />
      </div>
    </div>
  );
}
