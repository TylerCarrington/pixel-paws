import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { dayThreeScript } from '../config/dayThreeScript';
import DialoguePanel from '../components/DialoguePanel';
import { AnimatePresence, motion } from 'framer-motion';
import BlossomLayer from '../components/BlossomLayer';
import '../styles/opening.css';

interface DayThreeMorningProps {
  onFinish: (param?: string) => void;
  startBeatId?: string;
}

export default function DayThreeMorning({ onFinish, startBeatId }: DayThreeMorningProps) {
  const [currentBeatIndex, setCurrentBeatIndex] = useState(() => {
    if (startBeatId) {
      const idx = dayThreeScript.findIndex(b => (b as any).id === startBeatId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [isExiting, setIsExiting] = useState(false);
  const [bgTransitioning, setBgTransitioning] = useState(false);

  const playerName = useGameStore(state => state.playerName) || "Player";
  const townName = useGameStore(state => state.townName) || "Town";

  const [currentBg, setCurrentBg] = useState('./src/assets/images/backgrounds/house-evening.png');

  // Auto-set background based on initial beat
  useEffect(() => {
    const beat = dayThreeScript[currentBeatIndex];
    if (beat?.type === 'background' && (beat as any).image) {
      setCurrentBg((beat as any).image as string);
    } else {
      for (let i = currentBeatIndex; i >= 0; i--) {
        const prevBeat = dayThreeScript[i];
        if (prevBeat.type === 'background' && (prevBeat as any).image) {
          setCurrentBg((prevBeat as any).image as string);
          break;
        }
      }
    }
  }, [currentBeatIndex]);

  const currentBeat = dayThreeScript[currentBeatIndex];

  useEffect(() => {
    if (!currentBeat) return;

    if (currentBeat.type === 'end') {
      handleEnd((currentBeat as any).next);
      return;
    }

    if (currentBeat.type === 'pause') {
      const timer = setTimeout(advance, (currentBeat as any).ms || 500);
      return () => clearTimeout(timer);
    }

    if (currentBeat.type === 'background' && (currentBeat as any).image) {
      setBgTransitioning(true);
      setTimeout(() => {
        setCurrentBg((currentBeat as any).image as string);
        setBgTransitioning(false);
        advance();
      }, (currentBeat as any).duration || 1000);
    }
  }, [currentBeatIndex]);

  const advance = () => {
    if (!currentBeat) return;
    if (currentBeatIndex < dayThreeScript.length - 1) {
      setCurrentBeatIndex(prev => prev + 1);
    } else {
      handleEnd();
    }
  };

  const handleEnd = (nextParam?: string) => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish(nextParam || (currentBeat?.type === 'end' ? (currentBeat as any).next : undefined));
    }, 800);
  };

  const processText = (text: string) => {
    return text
      .replace(/{{playerName}}/g, playerName)
      .replace(/{{townName}}/g, townName);
  };

  return (
    <div className={`opening-sequence ${isExiting ? 'opening-fade-exit' : ''}`}>
      <div className="opening-background-container">
        <div 
          className="opening-background"
          style={{ 
            backgroundImage: `url('${currentBg}')`,
            opacity: bgTransitioning ? 0 : 1,
            transition: 'opacity 1.2s ease-in-out'
          }}
        />
        <div className="opening-overlay" />
      </div>

      {currentBg.includes('house-evening') && <BlossomLayer />}

      {currentBeat?.type === 'dayCard' && (
        <div className="absolute inset-0 z-[150] bg-night-plum flex flex-col items-center justify-center text-center p-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-game text-warm-cream mb-4"
          >
             {(currentBeat as any).label}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-soft-lilac italic"
          >
             Tap to start
          </motion.p>
          <button className="absolute inset-0 w-full h-full cursor-pointer z-50 opacity-0" onClick={advance} />
        </div>
      )}

      <div className="dialogue-wrapper">
        {currentBeat?.type === 'dialogue' && (currentBeat as any).text && !bgTransitioning && (
          <DialoguePanel
            speaker={(currentBeat as any).speaker ?? null}
            text={processText((currentBeat as any).text)}
            variant={(currentBeat as any).style as any}
            onComplete={advance}
          />
        )}
      </div>
    </div>
  );
}
