'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StoryBeat {
  id: string;
  start: number; // 0 to 1
  end: number;   // 0 to 1
  title: string;
  subtitle?: string;
  position: 'center' | 'left' | 'right';
}

const BEATS: StoryBeat[] = [
  {
    id: 'hero',
    start: 0.0,
    end: 0.15,
    title: 'Engineered for Performance.',
    subtitle: 'Precision in every ride.',
    position: 'center',
  },
  {
    id: 'structure',
    start: 0.15,
    end: 0.35,
    title: 'Structural Balance.',
    subtitle: 'High-modulus carbon frame for optimal weight-to-stiffness ratio.',
    position: 'right',
  },
  {
    id: 'motion',
    start: 0.35,
    end: 0.55,
    title: 'Pure Motion.',
    subtitle: 'CeramicSpeed bearings and ultra-lightweight drivetrain.',
    position: 'left',
  },
  {
    id: 'control',
    start: 0.55,
    end: 0.75,
    title: 'Total Control.',
    subtitle: 'Aerodynamic cockpit with integrated hydraulic braking.',
    position: 'center',
  },
  {
    id: 'details',
    start: 0.75,
    end: 0.9,
    title: 'Obsessive Detail.',
    subtitle: 'Every component, one singular vision.',
    position: 'right',
  },
  {
    id: 'reassembly',
    start: 0.9,
    end: 1.0,
    title: 'Built as One.',
    subtitle: 'The pinnacle of modern engineering.',
    position: 'center',
  },
];

export const StoryOverlay: React.FC = () => {
  const { scrollYProgress } = useScroll();

  return (
    <div className="relative w-full z-10">
      {BEATS.map((beat) => (
        <BeatItem key={beat.id} beat={beat} progress={scrollYProgress} />
      ))}
    </div>
  );
};

const BeatItem: React.FC<{ beat: StoryBeat; progress: any }> = ({ beat, progress }) => {
  // Calculate relative progress within the beat
  // We want the text to fade in, stay for a bit, then fade out
  const fadeInStart = beat.start;
  const fadeInEnd = beat.start + (beat.end - beat.start) * 0.2;
  const fadeOutStart = beat.end - (beat.end - beat.start) * 0.2;
  const fadeOutEnd = beat.end;

  const opacity = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    progress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [20, 0, 0, -20]
  );

  const positionClasses = {
    center: 'items-center text-center',
    left: 'items-start text-left pl-12 md:pl-24',
    right: 'items-end text-right pr-12 md:pr-24',
  };

  return (
    <motion.div
      style={{ opacity, y }}
      className={`fixed inset-0 flex flex-col justify-center pointer-events-none ${positionClasses[beat.position]}`}
    >
      <div className="max-w-2xl px-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-sm text-foreground">
          {beat.title}
        </h2>
        {beat.subtitle && (
          <p className="text-xl md:text-2xl text-foreground/60 font-medium">
            {beat.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};
