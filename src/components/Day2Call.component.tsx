import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/game.store';
import { motion, AnimatePresence } from 'framer-motion';
import DialoguePanel from './DialoguePanel';

const CALL_SCRIPT = [
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The call came in just after breakfast.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'Someone in town — {{playerName}} didn\'t catch their name — had heard about the husky from yesterday.',
    style: 'narration'
  },
  {
    type: 'pause',
    ms: 500
  },
  {
    type: 'dialogue',
    speaker: 'Caller',
    portrait: null,
    text: 'I heard you helped that dog by the river. There\'s another one — in the park near the fountain. It won\'t come to anyone.',
    style: 'phone'
  },
  {
    type: 'dialogue',
    speaker: 'Caller',
    portrait: null,
    text: 'Thought you might know what to do.',
    style: 'phone'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: '{{playerName}} was already reaching for their shoes.',
    style: 'narration'
  }
];

export default function Day2Call() {
  const [step, setStep] = useState<'ringing' | 'talking'>('ringing');
  const [scriptIndex, setScriptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const playerName = useGameStore(state => state.playerName) || "Player";
  const setPhase6State = useGameStore(state => state.setPhase6State);
  const initializeRescueWash = useGameStore(state => state.initializeRescueWash);

  const currentBeat = CALL_SCRIPT[scriptIndex];

  useEffect(() => {
    if (step === 'talking' && currentBeat?.type === 'pause') {
      setIsPaused(true);
      const timer = setTimeout(() => {
        setIsPaused(false);
        advance();
      }, currentBeat.ms);
      return () => clearTimeout(timer);
    }
  }, [step, scriptIndex, currentBeat]);

  const handleAcceptCall = () => {
    setStep('talking');
  };

  const advance = () => {
    if (scriptIndex < CALL_SCRIPT.length - 1) {
      setScriptIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Initialize the rescue for day 2 (second animal)
    initializeRescueWash();
    // Move to bush search mini-game
    setPhase6State('bush_search');
  };

  const processText = (text: string) => {
    return text.replace('{{playerName}}', playerName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-night-plum flex flex-col items-center justify-center font-pixel">
      <AnimatePresence mode="wait">
        {step === 'ringing' && (
          <motion.div 
            key="ringing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-mossy-green rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(122,184,122,0.4)] animate-pulse mb-8">
              <span className="text-4xl">📞</span>
            </div>
            <h2 className="text-xs text-soft-lilac uppercase tracking-widest mb-10 animate-bounce">
              Incoming Call...
            </h2>
            <button 
              onClick={handleAcceptCall}
              className="bg-mossy-green hover:bg-deep-moss text-warm-cream font-game text-[10px] py-4 px-12 rounded-full shadow-lg transition-all active:scale-95 uppercase tracking-widest"
            >
              Answer
            </button>
          </motion.div>
        )}

        {step === 'talking' && !isPaused && currentBeat?.type === 'dialogue' && (
          <motion.div 
            key="talking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col"
          >
             <div className="flex-1 flex items-center justify-center">
                <div className="w-32 h-32 bg-mossy-green/10 rounded-full flex items-center justify-center animate-pulse">
                   <span className="text-4xl opacity-50">📞</span>
                </div>
             </div>

             <DialoguePanel
                speaker={currentBeat.speaker ?? null}
                text={processText(currentBeat.text || '')}
                variant={currentBeat.style as any}
                onComplete={advance}
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
