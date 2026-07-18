'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const WatermarkCover: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/30 px-5 py-2.5 rounded-full shadow-2xl shadow-black/5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">VEO S-1</span>
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 whitespace-nowrap">Performance Engineering</span>
        </div>
        <div className="w-[1px] h-6 bg-black/10 mx-1" />
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
        </div>
      </div>
    </motion.div>
  );
};
