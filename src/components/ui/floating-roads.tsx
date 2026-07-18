"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingRoadsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  roadColor?: string;
  dashColor?: string;
  spread?: number;
  depth?: number;
  cp1?: number;
  cp2?: number;
  twist?: number;
  count?: number;
  widthScale?: number;
}

export function FloatingRoadsBackground({
  children,
  className,
  speed = 1.5,
  roadColor = "#1e293b",
  dashColor = "#facc15",
  spread = 1,
  depth = 0.3,
  cp1 = 0.35,
  cp2 = 0.65,
  twist = 0,
  count = 6,
  widthScale = 1,
}: FloatingRoadsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const dashOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    function resize() {
      const rect = wrapper!.getBoundingClientRect();
      W = canvas!.width = rect.width;
      H = canvas!.height = rect.height;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    interface Road {
      x1: number; y1: number;
      cp1x: number; cp1y: number;
      cp2x: number; cp2y: number;
      x2: number; y2: number;
      w: number; a: number;
    }

    function getRoads(): Road[] {
      const OB = 0.55;
      const roads: Road[] = [];
      for (let i = 0; i < count; i++) {
        const frac = i / (count - 1 || 1);
        const fanOffset = (frac - 0.5) * spread;

        const x1 = W * (-OB + fanOffset * 0.3);
        const y1 = H * (-OB + fanOffset * 0.28);
        const x2 = W * (1 + OB + fanOffset * 0.22);
        const y2 = H * (1 + OB - fanOffset * 0.28);

        const depthPx = depth * Math.min(W, H) * 0.45;
        const twistPx = twist * Math.min(W, H) * 0.22;

        const cp1x = x1 + (x2 - x1) * cp1 - depthPx * 0.4 - twistPx;
        const cp1y = y1 + (y2 - y1) * cp1 - depthPx * 0.55 + twistPx;
        const cp2x = x1 + (x2 - x1) * cp2 + depthPx * 0.35 + twistPx;
        const cp2y = y1 + (y2 - y1) * cp2 + depthPx * 0.45 - twistPx;

        const centreDist = Math.abs(frac - 0.5) * 2;
        const w = Math.max(2, (42 - centreDist * 16) * widthScale);
        const a = 0.95 - centreDist * 0.42;

        roads.push({ x1, y1, cp1x, cp1y, cp2x, cp2y, x2, y2, w, a });
      }
      return roads;
    }

    function drawRoad(r: Road) {
      ctx!.save();
      ctx!.rect(0, 0, W, H);
      ctx!.clip();

      ctx!.globalAlpha = r.a;
      ctx!.strokeStyle = roadColor;
      ctx!.lineWidth = r.w;
      ctx!.lineCap = "butt";
      ctx!.beginPath();
      ctx!.moveTo(r.x1, r.y1);
      ctx!.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
      ctx!.stroke();

      ctx!.strokeStyle = "#ffffff";
      ctx!.lineWidth = Math.max(0.5, r.w * 0.055);
      ctx!.globalAlpha = r.a * 0.18;
      ctx!.setLineDash([]);
      ctx!.beginPath();
      ctx!.moveTo(r.x1, r.y1);
      ctx!.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
      ctx!.stroke();

      ctx!.strokeStyle = dashColor;
      ctx!.lineWidth = Math.max(0.4, r.w * 0.038);
      ctx!.globalAlpha = r.a * 0.6;
      ctx!.setLineDash([14, 18]);
      ctx!.lineDashOffset = -dashOffsetRef.current * (r.w / 32);
      ctx!.beginPath();
      ctx!.moveTo(r.x1, r.y1);
      ctx!.bezierCurveTo(r.cp1x, r.cp1y, r.cp2x, r.cp2y, r.x2, r.y2);
      ctx!.stroke();

      ctx!.setLineDash([]);
      ctx!.restore();
    }

    function animate() {
      ctx!.clearRect(0, 0, W, H);
      const roads = getRoads();
      roads.forEach((r) => drawRoad(r));
      dashOffsetRef.current += 1.3 * speed;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [speed, roadColor, dashColor, spread, depth, cp1, cp2, twist, count, widthScale]);

  return (
    <div ref={wrapperRef} className={cn("relative w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
