import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { openingScript } from '../config/openingScript';
import DialoguePanel from '../components/DialoguePanel';
import NameInputPanel from '../components/NameInputPanel';
import TownInputPanel from '../components/TownInputPanel';
import BlossomLayer from '../components/BlossomLayer';
import { getAssetUrl } from '../logic/assetResolver.logic';
import '../styles/opening.css';

interface OpeningSequenceProps {
  onFinish: () => void;
}

export default function OpeningSequence({ onFinish }: OpeningSequenceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerName, setPlayerNameState] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  
  const townName = useGameStore(state => state.townName) || "Hanami Village";
  const setPlayerName = useGameStore(state => state.setPlayerName);
  const setTownName = useGameStore(state => state.setTownName);
  
  const currentBeat = openingScript[currentIndex];

  useEffect(() => {
    if (currentBeat?.type === 'pause') {
      const timer = setTimeout(() => {
        advance();
      }, currentBeat.ms);
      return () => clearTimeout(timer);
    }
    
    if (currentBeat?.type === 'end') {
      handleEnd();
    }
  }, [currentIndex, currentBeat]);

  const advance = () => {
    if (currentIndex < openingScript.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleNameConfirm = (name: string) => {
    setPlayerNameState(name);
    advance();
  };

  const handleTownConfirm = (name: string) => {
    setTownName(name);
    advance();
  };

  const handleEnd = () => {
    localStorage.setItem('pawsOpeningSeen', 'true');
    setPlayerName(playerName);
    
    if (localStorage.getItem('dayOneWalkSeen') === 'true') {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, 800);
    } else {
      onFinish();
    }
  };

  const processText = (text: string) => {
    return text
      .replace('{{playerName}}', playerName)
      .replace('{{townName}}', townName);
  };

  if (currentIndex >= openingScript.length || isExiting && !currentBeat) return null;

  return (
    <div className={`opening-sequence ${isExiting ? 'opening-fade-exit' : ''}`}>
      <div className="opening-background-container">
        <div 
          className="opening-background" 
          style={{ backgroundImage: `url('${getAssetUrl('./src/assets/images/backgrounds/outside-house.jpeg')}')` }}
        />
        <div className="opening-overlay" />
      </div>

      <BlossomLayer />

      <div className="dialogue-wrapper">
        {currentBeat?.portrait && (
          <div className="marigold-portrait-container" style={{ opacity: currentBeat.speaker ? 1 : 0 }}>
            <img 
              src={getAssetUrl("./src/assets/images/items/marigold.png")} 
              alt="Marigold"
              className="marigold-portrait"
            />
          </div>
        )}

        {currentBeat?.type === 'dialogue' && currentBeat.text && (
          <DialoguePanel
            speaker={currentBeat.speaker ?? null}
            text={processText(currentBeat.text)}
            variant={currentBeat.style === 'narration' ? 'narration' : 'normal'}
            onComplete={advance}
          />
        )}

        {currentBeat?.type === 'nameInput' && (
          <NameInputPanel
            placeholder={currentBeat.placeholder ?? '...'}
            onConfirm={handleNameConfirm}
          />
        )}

        {currentBeat?.type === 'townInput' && (
          <TownInputPanel
            suggestion={currentBeat.suggestion ?? 'Hanami Village'}
            confirmLabel={currentBeat.confirmLabel ?? 'keep'}
            changeLabel={currentBeat.changeLabel ?? 'change'}
            onConfirm={handleTownConfirm}
          />
        )}
      </div>
    </div>
  );
}
