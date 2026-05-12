import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Species } from '../types/animal.types';
import { UNLOCK_MESSAGES } from '../config/unlockMessages.config';

interface UnlockNotificationProps {
  species: Species;
  onClose: () => void;
}

export default function UnlockNotification({ species, onClose }: UnlockNotificationProps) {
  const message = UNLOCK_MESSAGES[species];
  if (!message) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md"
    >
      <div className="bg-gradient-to-br from-soft-lilac/20 to-night-plum border-2 border-amber-glow/50 p-6 rounded-3xl shadow-[0_4px_12px_rgba(180,120,100,0.15)]">
        <div className="flex gap-4">
          <div className="text-4xl animate-bounce">📢</div>
          <div className="flex-1">
            <h4 className="text-speaker-rose font-game text-[10px] uppercase tracking-[0.2em] mb-2">New Opportunity</h4>
            <p className="text-dialogue-text text-[9px] font-pixel leading-relaxed uppercase tracking-widest">{message}</p>
            <button 
              onClick={onClose}
              className="mt-6 text-[8px] text-muted-sage hover:text-speaker-rose uppercase tracking-widest transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
