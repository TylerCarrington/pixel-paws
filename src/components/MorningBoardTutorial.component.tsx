import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  highlight: 'callCards' | 'respondButton' | 'speciesBadge';
  text: string;
}

const steps: TutorialStep[] = [
  {
    highlight: 'callCards',
    text: 'Each morning, calls and tips come in from around the town. Tap a card to read the details.'
  },
  {
    highlight: 'respondButton',
    text: 'When you\'re ready, tap "Respond" to go help. You can only respond to one call per morning — choose carefully.'
  },
  {
    highlight: 'speciesBadge',
    text: 'Some cards show the animal type. Others are mysteries — you won\'t know until you arrive.'
  }
];

export default function MorningBoardTutorial({ onDismiss }: { onDismiss: () => void }) {
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
    <div className="absolute inset-0 z-50 pointer-events-none flex font-pixel">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-[#1a1020] opacity-85" />
      
      {/* Highlight masks using pseudo-elements or specific overlays.
          For simplicity, we will just position a glowing border or hole. 
          A simple way is to use border masks, but positioning absolute divs around the target works too.
          Actually, since we know roughly where these elements are:
            - callCards: left 1/3 of the screen, below header
            - respondButton: bottom right of the detail panel
            - speciesBadge: top right corner of the selected card or detail panel
      */}
      
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute flex flex-col bg-[#fdf3e7] border border-[#dcb4aa] rounded-[10px] p-[14px] px-[18px] max-w-[280px] shadow-[0_4px_12px_rgba(90,62,56,0.15)] ${
              step.highlight === 'callCards' 
                ? 'top-[30%] left-[36%]' 
                : step.highlight === 'respondButton'
                ? 'bottom-[20%] right-[30%]'
                : 'top-[35%] right-[40%]'
            }`}
          >
            <div className="flex justify-between items-start mb-2 opacity-60 text-[9px] uppercase tracking-widest text-night-plum">
              <span>Tutorial</span>
              <span>{currentStep + 1} of {steps.length}</span>
            </div>
            <p className="text-[#5a3e38] text-[12px] leading-relaxed mb-4">
              {step.text}
            </p>
            <button 
              onClick={handleNext}
              className="self-end bg-night-plum hover:bg-soft-rose text-warm-cream py-1.5 px-4 rounded text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
            >
              {currentStep === steps.length - 1 ? 'Got it' : 'Next'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Highlighter outlines */}
      {step.highlight === 'callCards' && (
        <div className="absolute top-[120px] bottom-[24px] left-[24px] w-[30%] border-4 border-warm-cream/50 rounded-lg animate-soft-pulse z-20 pointer-events-none" />
      )}
      {step.highlight === 'respondButton' && (
        <div className="absolute bottom-[24px] right-[24px] w-[200px] h-[60px] border-4 border-warm-cream/50 rounded-lg animate-soft-pulse z-20 pointer-events-none" />
      )}
      {step.highlight === 'speciesBadge' && (
        <div className="absolute top-[120px] left-[24px] w-[30%] h-[100px] border-4 border-warm-cream/50 rounded-lg animate-soft-pulse z-20 pointer-events-none" />
      )}
    </div>
  );
}
