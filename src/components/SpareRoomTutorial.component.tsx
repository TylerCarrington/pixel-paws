import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpareRoomTutorialProps {
  onDismiss: () => void;
}

export default function SpareRoomTutorial({ onDismiss }: SpareRoomTutorialProps) {
  const steps = [
    {
      title: "Your Shelter",
      text: "Each animal rests in their own bed. Tap a bed to care for them."
    },
    {
      title: "Action Limits",
      text: "You can perform one action per animal each day. Choose carefully — some animals respond better to certain actions."
    },
    {
      title: "Desirability",
      text: "As you care for animals, their desirability increases. The higher it is, the better their chances of finding a home."
    },
    {
      title: "Moods",
      text: "Each animal has a mood. Pay attention — it affects how they respond to your care."
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
      <div className="absolute inset-0 bg-night-plum/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-warm-cream rounded-[32px] p-8 max-w-lg w-full shadow-2xl border-4 border-stone-grey/20 font-pixel text-center"
      >
         <h2 className="text-2xl text-speaker-rose mb-6 uppercase tracking-widest">{steps[currentStep].title}</h2>
         <p className="text-dialogue-text leading-relaxed text-lg mb-10 min-h-[5rem]">
           {steps[currentStep].text}
         </p>

         <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i === currentStep ? 'bg-amber-glow' : 'bg-stone-grey/30'}`} />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="bg-mossy-green hover:bg-opacity-90 text-white px-6 py-3 rounded-xl shadow-[0_4px_0_rgb(60,95,60)] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-widest"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it'}
            </button>
         </div>
      </motion.div>
    </div>
  );
}
