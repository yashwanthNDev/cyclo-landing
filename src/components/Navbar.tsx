'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 flex justify-center pt-6 transition-all duration-500 pointer-events-none ${
        scrolled ? 'pt-4' : 'pt-8'
      }`}
    >
      <div 
        className={`flex items-center w-[92%] max-w-5xl h-14 px-8 rounded-2xl transition-all duration-500 pointer-events-auto border ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-zinc-200/50 shadow-xl shadow-black/[0.03]' 
            : 'bg-white/20 backdrop-blur-md border-white/30 shadow-none'
        } justify-between`}
      >
        {/* Logo / Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
          </div>
          <div className="text-lg font-bold tracking-tight text-black flex items-baseline">
            VEO <span className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Engineering</span>
          </div>
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Overview</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Aero</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Performance</a>
          <a href="#" className="hover:text-black transition-colors whitespace-nowrap">Specs</a>
        </div>

        {/* CTA */}
        <div className="flex items-center space-x-6">
          <button className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-black transition-colors">
            Support
          </button>
          <button className="bg-black text-white px-6 h-9 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
            Pre-order S-1
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
