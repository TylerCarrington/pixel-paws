import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import AdoptionResultCard from './AdoptionResultCard.component';
import PayoutSummary from './PayoutSummary.component';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdoptionCeremony() {
  const shelterAnimals = useGameStore(state => state.shelterAnimals);
  const adoptionResults = useGameStore(state => state.adoptionResults);
  const finalizeAdoptions = useGameStore(state => state.finalizeAdoptions);
  
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

  useEffect(() => {
    if (!adoptionResults || currentIndex < 0 || currentIndex >= adoptionResults.length) return;

    // Progress to next after delay
    const nextTimer = setTimeout(() => {
       if (currentIndex < adoptionResults.length - 1) {
          setCurrentIndex(prev => prev + 1);
       } else {
          // All shown, wait a bit then show summary
          setTimeout(() => setIsFinished(true), 1500);
       }
    }, 2000);

    return () => clearTimeout(nextTimer);
  }, [currentIndex, adoptionResults?.length]);

  if (!adoptionResults) return null;

  const totalPayout = adoptionResults.reduce((acc, r) => acc + r.payout, 0);
  const adoptedCount = adoptionResults.filter(r => r.isAdopted).length;

  return (
    <div className="fixed inset-0 z-50 bg-night-plum/95 flex flex-col items-center justify-center p-6 overflow-hidden">
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

           <div className="w-full min-h-[300px] flex items-center justify-center">
             <AnimatePresence mode="wait">
               {currentIndex >= 0 && currentIndex < adoptionResults.length && (
                 <AdoptionResultCard 
                   key={adoptionResults[currentIndex].animalId}
                   animal={shelterAnimals.find(a => a.id === adoptionResults[currentIndex].animalId)!}
                   result={adoptionResults[currentIndex]}
                   isVisible={true}
                 />
               )}
               {currentIndex === -1 && (
                 <motion.div 
                   key="waiting"
                   exit={{ opacity: 0 }}
                   className="text-stone-grey font-game text-[10px] uppercase animate-pulse"
                 >
                   Gathering potential owners...
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
          onFinish={finalizeAdoptions}
        />
      )}
    </div>
  );
}
