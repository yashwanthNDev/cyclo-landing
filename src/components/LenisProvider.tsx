'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
};