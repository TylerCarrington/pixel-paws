import React from 'react';
import { motion } from 'framer-motion';

export default function HealthCertBadge() {
  return (
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-mossy-green/10 border border-mossy-green/50 rounded px-1.5 py-0.5 flex items-center gap-1 shadow-sm"
      title="Health Certified: Fully recovered and vet-inspected"
    >
      <span className="text-[10px]">⚖️</span>
      <span className="text-[8px] font-pixel text-deep-moss uppercase tracking-tighter">Certified</span>
    </motion.div>
  );
}
