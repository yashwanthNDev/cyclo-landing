"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { drawIsoMTB } from "@/lib/drawIsoMTB";

// ── Road parameters — mirrors the FloatingRoadsBackground in this splash ──────
const SPEED      = 0.6;
const ROAD_COLOR = "#161616";
const DASH_COLOR = "#F9F7F4";
const SPREAD     = 2.6;
const DEPTH      = 1.25;
const CP1        = 0.10;
const CP2        = 0.96;
const TWIST      = -1.14;
const COUNT      = 6;
const WIDTH_SCALE = 0.9;
const OB         = 0.55;   // how far roads bleed off-screen
const BIKE_ROAD  = 2;      // index of road the bike follows (0-based, middle-ish)

interface Road {
  x1: number; y1: number;
  cp1x: number; cp1y: number;
  cp2x: number; cp2y: number;
  x2: number; y2: number;
  w: number; a: number;
}

function getRoads(W: number, H: number): Road[] {
  const roads: Road[] = [];
  for (let i = 0; i < COUNT; i++) {
    const frac      = i / (COUNT - 1 || 1);
    const fanOffset = (frac - 0.5) * SPREAD;

    const x1 = W * (-OB + fanOffset * 0.3);
    const y1 = H * (-OB + fanOffset * 0.28);
    const x2 = W * (1 + OB + fanOffset * 0.22);
    const y2 = H * (1 + OB - fanOffset * 0.28);

    const depthPx = DEPTH * Math.min(W, H) * 0.45;
    const twistPx = TWIST * Math.min(W, H) * 0.22;

    const cp1x = x1 + (x2 - x1) * CP1 - depthPx * 0.4 - twistPx;
    const cp1y = y1 + (y2 - y1) * CP1 - depthPx * 0.55 + twistPx;
    const cp2x = x1 + (x2 - x1) * CP2 + depthPx * 0.35 + twistPx;
    const cp2y = y1 + (y2 - y1) * CP2 + depthPx * 0.45 - twistPx;

    const centreDist = Math.abs(frac - 0.5) * 2;
    const w = Math.max(2, (42 - centreDist * 16) * WIDTH_SCALE);
    const a = 0.95 - centreDist * 0.42;

    roads.push({ x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, w, a });
  }
  return roads;
}

/** Cubic bezier point at parameter t */
function bezierPt(r: Road, t: number) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*r.x1 + 3*mt*mt*t*r.cp1x + 3*mt*t*t*r.cp2x + t*t*t*r.x2,
    y: mt*mt*mt*r.y1 + 3*mt*mt*t*r.cp1y + 3*mt*t*t*r.cp2y + t*t*t*r.y2,
  };
}

/** Tangent angle of cubic bezier at t (radians) */
function bezierAngle(r: Road, t: number) {
  const mt = 1 - t;
  const dx = 3*(mt*mt*(r.cp1x-r.x1) + 2*mt*t*(r.cp2x-r.cp1x) + t*t*(r.x2-r.cp2x));
  const dy = 3*(mt*mt*(r.cp1y-r.y1) + 2*mt*t*(r.cp2y-r.cp1y) + t*t*(r.y2-r.cp2y));
  return Math.atan2(dy, dx);
}

function drawRoad(ctx: CanvasRenderingContext2D, r: Road, dashOffset: number, W: number, H: number) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.clip();

  // Surface
  ctx.globalAlpha = r.a;
  ctx.strokeStyle = ROAD_COLOR;
  ctx.lineWidth   = r.w;
  ctx.lineCap     = "butt";
  ctx.beginPath();
  ctx.moveTo(r.x1, r.y1);
  ctx.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
  ctx.stroke();

  // Edge shimmer
  ctx.strokeStyle  = "#ffffff";
  ctx.lineWidth    = Math.max(0.5, r.w * 0.055);
  ctx.globalAlpha  = r.a * 0.18;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(r.x1, r.y1);
  ctx.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
  ctx.stroke();

  // Centre dashes
  ctx.strokeStyle    = DASH_COLOR;
  ctx.lineWidth      = Math.max(0.4, r.w * 0.038);
  ctx.globalAlpha    = r.a * 0.6;
  ctx.setLineDash([14, 18]);
  ctx.lineDashOffset = -dashOffset * (r.w / 32);
  ctx.beginPath();
  ctx.moveTo(r.x1, r.y1);
  ctx.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
  ctx.stroke();

  ctx.setLineDash([]);
  ctx.restore();
}

interface SplashScreenProps {
  isAssetReady?: boolean;
  onComplete?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────
export const SplashScreen: React.FC<SplashScreenProps> = ({ isAssetReady = true, onComplete }) => {
  const [visible, setVisible]       = useState(true);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [bikeCrossed, setBikeCrossed]    = useState(false);
  const bikeCrossedRef = useRef(false);   // ref so the rAF loop can read it without stale closure
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const animRef      = useRef<number>(0);
  const dashOffset   = useRef(0);
  const riderT       = useRef(0.05);   // start slightly into the road (not off-edge)
  const wheelRot     = useRef(0);

  // Short minimum so the wordmark text has time to animate in
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Dismiss only when all three conditions are met
  useEffect(() => {
    if (minTimePassed && isAssetReady && bikeCrossed) {
      setVisible(false);
    }
  }, [minTimePassed, isAssetReady, bikeCrossed]);

  // onComplete is called via AnimatePresence.onExitComplete below,
  // so the hero animations play only after the splash has fully cleared.

  // Animation loop
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const roads = getRoads(W, H);

      // Draw all roads first
      roads.forEach(r => drawRoad(ctx, r, dashOffset.current, W, H));

      // Advance rider
      riderT.current   = (riderT.current + 0.003 * SPEED) % 1;
      wheelRot.current += 0.065 * SPEED;
      dashOffset.current += 1.3 * SPEED;

      // Signal once the bike is off the right edge (~t=0.70 from bezier geometry)
      // 0.74 gives a brief moment of clear road before dismissal
      if (!bikeCrossedRef.current && riderT.current >= 0.74) {
        bikeCrossedRef.current = true;
        setBikeCrossed(true);
      }

      // Bike position & angle — follows BIKE_ROAD exactly
      const road  = roads[BIKE_ROAD];
      const t     = riderT.current;
      const pos   = bezierPt(road, t);
      const angle = bezierAngle(road, t);

      // Offset the bike above the road surface (perpendicular to road direction)
      const lift  = road.w * 0.9;
      const bikeX = pos.x + Math.sin(angle) * lift;
      const bikeY = pos.y - Math.cos(angle) * lift;

      ctx.globalAlpha = 1;
      drawIsoMTB(ctx, bikeX, bikeY, angle, 2.8, wheelRot.current);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [visible]);

  return (
    <AnimatePresence onExitComplete={() => onComplete?.()}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] overflow-hidden"
        >
          {/* Single canvas — roads + bike */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Wordmark overlay */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-5">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[80px] md:text-[108px] font-black tracking-[0.18em] uppercase leading-none select-none text-white"
                >
                  Cyclo
                </motion.h1>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] w-16 origin-left bg-white/20"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-[10px] font-semibold tracking-[0.45em] uppercase text-white/35"
              >
                Performance Cycling
              </motion.p>
            </div>

            {/* Progress bar */}
            <div
              className="absolute bottom-14 left-1/2 -translate-x-1/2 overflow-hidden rounded-full"
              style={{ width: 72, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 2.6, delay: 0.4, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-white/50"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
