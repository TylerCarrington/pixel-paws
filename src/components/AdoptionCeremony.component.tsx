import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import AdoptionResultCard from './AdoptionResultCard.component';
import PayoutSummary from './PayoutSummary.component';
import { motion, AnimatePresence } from 'framer-motion';
import { SHELTER_LISTINGS } from '../config/shelters.config';
import outsideHouseBg from '../assets/images/backgrounds/outside-house.jpeg';

export default function AdoptionCeremony() {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const adoptionResults = useGameStore(state => state.adoptionResults);
  const finalizeAdoptions = useGameStore(state => state.finalizeAdoptions);
  const spareRoomAccessible = useGameStore(state => state.spareRoomAccessible);
  const shelterExteriorId = useGameStore(state => state.shelterExterior);
  
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!adoptionResults) return;

    // Start reveal after short delay
    const startTimer = setTimeout(() => {
       setCurrentIndex(0);
    }, 1000);

    return () => clearTimeout(startTimer);
  }, [adoptionResults]);

  const handleNext = () => {
    if (!adoptionResults) return;

    if (currentIndex === -1) {
      setCurrentIndex(0);
      return;
    }
    
    if (currentIndex < adoptionResults.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (!adoptionResults || currentIndex < 0 || currentIndex >= adoptionResults.length) return;

    // Progress to next after delay
    const nextTimer = setTimeout(handleNext, 4500);

    return () => clearTimeout(nextTimer);
  }, [currentIndex, adoptionResults?.length]);

  if (!adoptionResults) return null;

  const totalPayout = adoptionResults.reduce((acc, r) => acc + r.payout, 0);
  const adoptedCount = adoptionResults.filter(r => r.isAdopted).length;

  const shelterData = SHELTER_LISTINGS.find(s => s.id === shelterExteriorId);
  const bgImage = spareRoomAccessible ? outsideHouseBg : (shelterData?.image || './src/assets/images/shelters/shelter-exterior-1.png');

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden cursor-pointer group"
      onClick={handleNext}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Ceremony Background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-night-plum/85 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center h-full">
        {!isFinished ? (
        <div className="w-full max-w-lg flex flex-col items-center">
           <header className="text-center mb-12">
              <h1 className="text-xl font-game text-speaker-rose uppercase tracking-widest mb-4">
                Adoption Ceremony
              </h1>
              <p className="text-[10px] font-pixel text-muted-sage uppercase tracking-widest">
                The families have arrived...
              </p>
           </header>

           <div 
             className="w-full min-h-[300px] flex flex-col items-center justify-center"
           >
             <AnimatePresence mode="wait">
               {currentIndex >= 0 && currentIndex < adoptionResults.length && (
                 <div className="relative w-full flex flex-col items-center">
                   <AdoptionResultCard 
                     key={adoptionResults[currentIndex].animalId}
                     animal={shelterAnimals.find(a => a.id === adoptionResults[currentIndex].animalId)!}
                     result={adoptionResults[currentIndex]}
                     isVisible={true}
                   />
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: 1 }}
                     className="mt-4 text-[8px] font-pixel text-stone-grey/60 uppercase tracking-[0.2em] group-hover:text-speaker-rose transition-colors"
                   >
                     Tap anywhere to skip
                   </motion.div>
                 </div>
               )}
               {currentIndex === -1 && (
                 <motion.div 
                   key="waiting"
                   exit={{ opacity: 0 }}
                   className="flex flex-col items-center gap-4"
                 >
                   <div className="text-stone-grey font-game text-[10px] uppercase animate-pulse">
                     Gathering potential owners...
                   </div>
                   <div className="text-[8px] font-pixel text-stone-grey/30 uppercase tracking-widest">
                     Tap to skip
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           <div className="mt-12 flex gap-2">
             {adoptionResults.map((_, i) => (
               <div 
                 key={i}
                 className={`h-1.5 w-6 rounded-full transition-colors ${i <= currentIndex ? 'bg-speaker-rose' : 'bg-stone-grey/30'}`}
               />
             ))}
           </div>
        </div>
        ) : (
          <PayoutSummary 
            total={totalPayout} 
            adoptedCount={adoptedCount}
            adoptionResults={adoptionResults}
            shelterAnimals={shelterAnimals}
            onFinish={finalizeAdoptions}
          />
        )}
      </div>
    </div>
  );
}
