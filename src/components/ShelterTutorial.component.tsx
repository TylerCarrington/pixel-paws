import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  highlight: 'none' | 'roomButton' | 'speciesInfo';
  text: string;
}

const steps: TutorialStep[] = [
  {
    highlight: 'none',
    text: 'Welcome to your brand new professional shelter! It\'s a lot bigger and better equipped than the spare room.'
  },
  {
    highlight: 'roomButton',
    text: 'You can now switch between multiple rooms! Each room is specialized for different animals — tap here to switch between Dogs and Cats.'
  },
  {
    highlight: 'speciesInfo',
    text: 'Word of your success has spread! The town will now notify you when Cats are found needing rescue, not just Dogs.'
  },
  {
    highlight: 'none',
    text: 'You also have more space now. Take a look around and make these animals feel at home!'
  }
];

export default function ShelterTutorial({ onDismiss }: { onDismiss: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onDismiss();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none flex font-pixel">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-[#1a1020] opacity-80" />
      
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute flex flex-col bg-[#fdf3e7] border-2 border-[#dcb4aa] rounded-[14px] p-6 max-w-[300px] shadow-[0_8px_24px_rgba(30,20,40,0.4)] ${
              step.highlight === 'roomButton' 
                ? 'top-[80px] left-[320px]' 
                : step.highlight === 'speciesInfo'
                ? 'top-[40%] right-[10%]'
                : 'top-[40%] left-1/2 -translate-x-1/2'
            }`}
          >
            <div className="flex justify-between items-start mb-3 opacity-60 text-[9px] uppercase tracking-widest text-[#5a3e38] font-bold">
              <span>Shelter Guide</span>
              <span>{currentStep + 1} of {steps.length}</span>
            </div>
            <p className="text-[#5a3e38] text-[13px] leading-relaxed mb-6">
              {step.text}
            </p>
            <button 
              onClick={handleNext}
              className="self-end bg-[#5a3e38] hover:bg-[#7a5a54] text-warm-cream py-2 px-6 rounded-lg text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95"
            >
              {currentStep === steps.length - 1 ? 'Start Caring' : 'Next'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Highlighter outlines */}
      {step.highlight === 'roomButton' && (
        <div className="absolute top-[12px] left-[330px] w-[110px] h-[55px] border-4 border-[#ffddaa] rounded-xl animate-pulse z-20 pointer-events-none shadow-[0_0_20px_rgba(255,221,170,0.5)]" />
      )}
      
      {step.highlight === 'speciesInfo' && (
        <div className="absolute top-[40px] left-[20px] w-[200px] h-32 border-4 border-dashed border-[#ffddaa]/40 rounded-2xl z-20 pointer-events-none" />
      )}
    </div>
  );
}
