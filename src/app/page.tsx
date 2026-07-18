'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ScrollCanvas } from '@/components/ScrollCanvas';
import { SplashScreen } from '@/components/SplashScreen';
import { ComingSoon } from '@/components/ComingSoon';
import { ParallaxVariants } from '@/components/ui/parallax-hero';
import { CinematicFooter } from '@/components/ui/motion-footer';

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* 1 — Hero: full-screen, off-white, centered text */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ backgroundColor: '#F9F7F2' }}
      >
        <p
          className="font-bold uppercase tracking-[0.5em] text-black/35 mb-7"
          style={{ fontSize: '11px' }}
        >
          VEO Engineering &nbsp;·&nbsp; S&#8901;1 &nbsp;·&nbsp; 2026
        </p>

        <h1
          className="font-black uppercase leading-none text-black"
          style={{ fontSize: 'clamp(52px, 9vw, 128px)', letterSpacing: '-0.025em' }}
        >
          The Future of
          <br />
          <span className="italic">Performance.</span>
        </h1>

        <div className="w-10 h-px bg-black/20 my-7" />

        <p
          className="font-medium text-black/40"
          style={{ fontSize: 'clamp(14px, 1.3vw, 18px)' }}
        >
          Scroll to explore the S&#8901;1
        </p>

        {/* subtle down-arrow hint */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-black/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.section>

      {/* 2 — Scroll video: dark, 75% centred, no text */}
      <div ref={containerRef} className="relative h-[800vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#F9F7F2' }}>
          <div className="relative w-3/4 h-[80vh] rounded-2xl overflow-hidden">
            <ScrollCanvas progress={smoothProgress} />
          </div>
        </div>
      </div>

      {/* 3 — Parallax photo */}
      <ParallaxVariants />

      {/* 4 — Countdown */}
      <ComingSoon />

      {/* 5 — Footer */}
      <CinematicFooter />
    </>
  );
}

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <main className="relative" style={{ backgroundColor: '#F9F7F2' }}>
      <SplashScreen isAssetReady={true} onComplete={() => setSplashDone(true)} />
      {splashDone && <HeroSection />}
    </main>
  );
}
