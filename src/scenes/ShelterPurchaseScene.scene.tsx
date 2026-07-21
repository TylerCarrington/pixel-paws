import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import DialoguePanel from '../components/DialoguePanel';
import NameInputPanel from '../components/NameInputPanel';
import BlossomLayer from '../components/BlossomLayer';
import { SHELTER_LISTINGS } from '../config/shelters.config';
import { getAssetUrl } from '../logic/assetResolver.logic';
import '../styles/opening.css'; // Reuse opening styles for consistency

interface ShelterPurchaseSceneProps {
  onFinish: () => void;
}

const PURCHASE_SCRIPT = [
  { type: 'pause', ms: 1000 },
  { type: 'dialogue', speaker: 'Marigold', text: "You bought a real shelter! It's beautiful..." },
  { type: 'dialogue', speaker: 'Marigold', text: "The animals are going to love all this extra space." },
  { type: 'dialogue', speaker: 'Marigold', text: "Welcome to the new and improved {{shelterName}}!" },
  { type: 'end' }
];

export default function ShelterPurchaseScene({ onFinish }: ShelterPurchaseSceneProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  const setShelterName = useGameStore(state => state.setShelterName);
  const shelterName = useGameStore(state => state.shelterName) || "Paws & Purpose";
  const shelterExteriorId = useGameStore(state => state.shelterExterior);
  
  const shelterData = SHELTER_LISTINGS.find(s => s.id === shelterExteriorId);
  const bgImage = shelterData?.image || './src/assets/images/shelters/shelter-exterior-1.png';

  const currentBeat = PURCHASE_SCRIPT[currentIndex];

  useEffect(() => {
    if (currentBeat?.type === 'pause') {
      const timer = setTimeout(() => {
        advance();
      }, currentBeat.ms || 1000);
      return () => clearTimeout(timer);
    }
    
    if (currentBeat?.type === 'end') {
      handleEnd();
    }
  }, [currentIndex, currentBeat]);

  const advance = () => {
    if (currentIndex < PURCHASE_SCRIPT.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleEnd = () => {
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 800);
  };

  const processText = (text: string) => {
    return text.replace('{{shelterName}}', shelterName);
  };

  if (currentIndex >= PURCHASE_SCRIPT.length || (isExiting && !currentBeat)) return null;

  return (
    <div className={`opening-sequence ${isExiting ? 'opening-fade-exit' : ''}`}>
      <div className="opening-background-container">
        <div 
          className="opening-background" 
          style={{ backgroundImage: `url('${getAssetUrl(bgImage)}')` }}
        />
        <div className="opening-overlay" />
      </div>

      <BlossomLayer />

      <div className="dialogue-wrapper">
        <div className="marigold-portrait-container" style={{ opacity: currentBeat?.speaker ? 1 : 0 }}>
          <img 
            src={getAssetUrl("./src/assets/images/items/marigold.png")} 
            alt="Marigold"
            className="marigold-portrait"
          />
        </div>

        {currentBeat?.type === 'dialogue' && currentBeat.text && (
          <DialoguePanel
            speaker={currentBeat.speaker ?? null}
            text={processText(currentBeat.text)}
            variant="normal"
            onComplete={advance}
          />
        )}
      </div>
    </div>
  );
}
