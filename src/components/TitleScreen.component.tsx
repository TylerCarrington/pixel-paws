import React from 'react';
import { motion } from 'framer-motion';

interface TitleScreenProps {
  onPlay: () => void;
}

export default function TitleScreen({ onPlay }: TitleScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-night-plum flex items-center justify-center font-pixel"
    >
      {/* Background Splash Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-screen"
        style={{ backgroundImage: `url('/src/assets/images/pixel-paws-splash.jpeg')` }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-night-plum via-transparent to-night-plum/40" />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-game text-warm-cream drop-shadow-[0_4px_12px_rgba(180,120,100,0.8)] uppercase">
            Pixel Paws
          </h1>
          <p className="text-speaker-rose text-sm tracking-[0.8em] mt-4 uppercase font-bold">
            Rescuing hope, one pixel at a time
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 4px 20px rgba(176,112,96,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay}
          className="px-12 py-5 bg-mossy-green text-warm-cream rounded-2xl font-game text-2xl uppercase tracking-widest shadow-2xl border-4 border-mossy-green/30 transition-all"
        >
          Press Start
        </motion.button>

        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] text-warm-cream tracking-[0.3em] uppercase">v1.0.0 Alpha</span>
          <div className="flex gap-4 text-xl">
             <span>🐈</span>
             <span>🐕</span>
             <span>🦜</span>
             <span>🐰</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
