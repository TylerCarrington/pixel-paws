import React from 'react';
import { motion } from 'framer-motion';

interface PayoutSummaryProps {
  total: number;
  adoptedCount: number;
  onFinish: () => void;
}

export default function PayoutSummary({ total, adoptedCount, onFinish }: PayoutSummaryProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-warm-cream border-2 border-speaker-rose p-8 rounded-2xl shadow-2xl max-w-md w-full font-pixel text-center"
    >
      <h2 className="text-xl font-game text-night-plum mb-8 uppercase tracking-widest leading-relaxed">
        Day Summary
      </h2>

      <div className="space-y-6 mb-10">
        <div className="flex justify-between items-center text-sm border-b border-stone-grey/20 pb-4">
          <span className="text-muted-sage uppercase tracking-widest text-[10px]">Adoptions</span>
          <span className="text-dialogue-text font-game text-xs">{adoptedCount}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-speaker-rose uppercase tracking-widest text-[10px] font-bold">Total Earnings</span>
          <span className="text-amber-glow font-game text-sm tracking-tighter">${total}</span>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-5 px-6 rounded-lg transition-all active:scale-95 uppercase tracking-widest shadow-[0_4px_12px_rgba(122,184,122,0.4)]"
      >
        Go Home
      </button>
    </motion.div>
  );
}
