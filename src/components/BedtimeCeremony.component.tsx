import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Animal } from '../types/animal.types';
import AvatarPlaceholder from './AvatarPlaceholder.component';
import { STARTER_DOGS } from '../config/starterDogs.config';

interface BedtimeCeremonyProps {
  pets: Animal[];
  onComplete: () => void;
}

export default function BedtimeCeremony({ pets, onComplete }: BedtimeCeremonyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<'initial' | 'tucking' | 'sleeping'>('initial');

  useEffect(() => {
    if (pets.length === 0) {
      onComplete();
    }
  }, [pets, onComplete]);

  const currentPet = pets[currentIndex];

  const handleNext = () => {
    setStep('tucking');
    setTimeout(() => {
      if (currentIndex < pets.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setStep('initial');
      } else {
        setStep('sleeping');
        setTimeout(onComplete, 2000);
      }
    }, 1500);
  };

  if (!currentPet) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-night-plum flex flex-col items-center justify-center font-pixel">
      <AnimatePresence mode="wait">
        {step === 'sleeping' ? (
          <motion.div 
            key="sleeping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl mb-8 animate-pulse">✨🌙✨</span>
            <h2 className="text-xl font-game text-soft-lilac uppercase tracking-[0.3em]">Good Night</h2>
          </motion.div>
        ) : (
          <motion.div 
            key={currentPet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <div className="mb-12 relative transform scale-150">
               <AvatarPlaceholder spriteKey={STARTER_DOGS.find(d => d.id === currentPet.breed)?.spriteKey || currentPet.breed} />
               {step === 'tucking' && (
                 <motion.span 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute -top-4 -right-4 text-4xl"
                 >
                   💤
                 </motion.span>
               )}
            </div>
            
            <h3 className="text-xl font-game text-warm-cream uppercase tracking-widest mb-4">{currentPet.name}</h3>
            <p className="text-[10px] text-soft-lilac uppercase tracking-widest mb-12">
              {step === 'tucking' ? `${currentPet.name} is fast asleep.` : `Ready for bed, ${currentPet.name}?`}
            </p>

            {step === 'initial' && (
              <button
                onClick={handleNext}
                className="bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-4 px-10 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                Tuck In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-12 text-[8px] text-stone-grey uppercase tracking-[0.4em]">
        Bedtime Ceremony • {currentIndex + 1} / {pets.length}
      </div>
    </div>
  );
}
