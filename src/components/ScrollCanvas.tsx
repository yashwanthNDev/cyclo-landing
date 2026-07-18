'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MotionValue, useMotionValueEvent } from 'framer-motion';

interface ScrollCanvasProps {
  progress: MotionValue<number>; 
}

const TOTAL_FRAMES = 720;
const SEQUENCES = ['PS1', 'PS2', 'PS3'];
const FRAMES_PER_SEQUENCE = 240;

export const ScrollCanvas: React.FC<ScrollCanvasProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Preload logic
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const loadImages = async () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const seqIndex = Math.floor(i / FRAMES_PER_SEQUENCE);
        const frameInSeq = (i % FRAMES_PER_SEQUENCE) + 1;
        const seqName = SEQUENCES[seqIndex];
        const basePath = process.env.NODE_ENV === "production" ? "/cyclo-landing" : "";
        const fileName = `ezgif-frame-${frameInSeq.toString().padStart(3, '0')}.jpg`;
        const path = `${basePath}/sequences/${seqName}/${fileName}`;

        const img = new Image();
        img.src = path;
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          if (loadedCount === FRAMES_PER_SEQUENCE) {
            // First sequence ready, we can start
            setIsReady(true);
          }
        };
        images[i] = img;
      }
      imagesRef.current = images;
    };

    loadImages();
  }, []);

  // Listening to motion value changes
  useMotionValueEvent(progress, "change", (latest) => {
    if (!isReady || !canvasRef.current || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate current frame
    const frameIndex = Math.min(
      Math.floor(latest * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );
    const img = imagesRef.current[frameIndex];

    if (img && img.complete) {
      renderFrame(ctx, img, canvas);
    }
  });

  const renderFrame = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvas: HTMLCanvasElement
  ) => {
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Enable high-quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Subtle sharpening filter to combat upscaling blur
    ctx.filter = 'contrast(1.02) brightness(1.02)';

    // Cover: fill the container edge-to-edge, no padding, corners clip the image
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = Math.round((height - drawHeight) / 2);
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = Math.round((width - drawWidth) / 2);
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, Math.round(drawWidth), Math.round(drawHeight));
  };

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth * window.devicePixelRatio;
        canvasRef.current.height = canvasRef.current.offsetHeight * window.devicePixelRatio;
        
        // Redraw current frame immediately if ready
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && isReady) {
          const frameIndex = Math.min(
            Math.floor(progress.get() * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          const img = imagesRef.current[frameIndex];
          if (img && img.complete) renderFrame(ctx, img, canvasRef.current);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isReady, progress]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-1000">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground/60 text-sm font-medium uppercase tracking-widest animate-pulse">
            Precision Loading — {Math.floor((imagesLoaded / FRAMES_PER_SEQUENCE) * 100)}%
          </p>
        </div>
      )}
    </div>
  );
};
