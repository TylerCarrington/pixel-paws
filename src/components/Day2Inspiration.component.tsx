import React from 'react';
import { useGameStore } from '../stores/game.store';
import { motion } from 'framer-motion';

export default function Day2Inspiration() {
  const setPhase6State = useGameStore(state => state.setPhase6State);

  const handleNextStep = () => {
    setPhase6State('naming');
  };

  return (
    <div className="fixed inset-0 z-50 bg-night-plum flex flex-col items-center justify-center p-12 font-pixel">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-12">
           <motion.span 
             animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-6xl block drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
           >
             💡
           </motion.span>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-warm-cream text-sm md:text-base leading-relaxed mb-10 italic"
        >
          "That's the second animal in two days... If things keep going like this, I'm going to need more than just my spare room."
        </motion.p>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-speaker-rose text-sm md:text-base font-game leading-relaxed mb-16 uppercase tracking-tighter shadow-speaker-rose/20"
        >
          "Maybe it's time to make this official. Every town needs a sanctuary... a shelter."
        </motion.p>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          onClick={handleNextStep}
          className="bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] md:text-xs py-6 px-12 rounded shadow-[0_4px_12px_rgba(122,184,122,0.4)] transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap"
        >
          Start Your Shelter
        </motion.button>
      </motion.div>
    </div>
  );
}
