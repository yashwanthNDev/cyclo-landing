"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const VARIANTS = ["Carbon Black", "Timber Oak", "Ocean Blue", "Forest Green", "Dune White"];

export function ParallaxVariants() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Image drifts upward as the section scrolls through the viewport
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    // ── Point 4: increased top margin for gap above this section ──
    <div className="mx-4 mt-32 mb-16 overflow-hidden rounded-4xl">
      <div
        ref={containerRef}
        className="relative flex h-[85vh] items-end overflow-hidden"
        style={{ clipPath: "inset(0 round inherit)" }}
      >
        {/* ── Parallax image ── */}
        <div className="absolute inset-0 h-[125%] -top-[12.5%] w-full">
          <motion.div className="relative h-full w-full" style={{ y }}>
            <Image
              alt="Five Cyclo S·1 electric bikes lined up on a city street"
              fill
              sizes="100vw"
              src="/hero-bikes.jpg"
              // ── Point 2: shift image up to reveal the bottom of the photo ──
              style={{ objectFit: "cover", objectPosition: "center 55%" }}
              priority
            />
          </motion.div>
        </div>

        {/* ── Bottom-up gradient ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 42%, transparent 70%)",
          }}
        />

        {/* ── Point 5: minimal left-to-right fade to lift foreground text ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 40%, transparent 65%)",
          }}
        />

        {/* ── Content ── */}
        <div
          className="relative z-10 flex flex-col items-start gap-5"
          style={{ padding: "clamp(2.5rem, 5vw, 5rem) clamp(2rem, 6vw, 6rem)" }}
        >
          {/* Eyebrow */}
          <p
            className="font-black uppercase tracking-[0.45em]"
            style={{ fontSize: "clamp(12px, 1.1vw, 14px)", color: "rgba(255,255,255,0.9)" }}
          >
            Cyclo&nbsp;&nbsp;·&nbsp;&nbsp;S&#8901;1&nbsp;&nbsp;·&nbsp;&nbsp;2026
          </p>

          {/* Headline */}
          <div className="flex flex-col gap-0.5">
            <h2
              className="font-black uppercase tracking-tight text-white leading-none"
              style={{ fontSize: "clamp(44px, 7.5vw, 110px)" }}
            >
              All Variants.
            </h2>
            <h2
              className="font-black uppercase tracking-tight text-white leading-none italic"
              style={{ fontSize: "clamp(44px, 7.5vw, 110px)" }}
            >
              One Vision.
            </h2>
          </div>

          {/* Divider */}
          <div className="w-10 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.28)" }} />

          {/* ── Point 1: body copy now italic ── */}
          <p
            className="font-semibold italic leading-relaxed max-w-md"
            style={{ fontSize: "clamp(16px, 1.4vw, 20px)", color: "rgba(255,255,255,0.95)" }}
          >
            Five exclusive finishes — from raw carbon to warm timber.
            <br />
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              Be the next proud owner of something built to last.
            </span>
          </p>

          {/* Variant pills */}
          <div className="flex flex-wrap gap-2">
            {VARIANTS.map((v) => (
              <span
                key={v}
                className="font-bold uppercase tracking-[0.18em] rounded-full"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  padding: "6px 16px",
                }}
              >
                {v}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            className="mt-2 rounded-full font-bold italic uppercase tracking-[0.2em] transition-opacity hover:opacity-80"
            style={{
              fontSize: "13px",
              padding: "14px 36px",
              backgroundColor: "#F9F7F4",
              color: "#0A0A0A",
              border: "none",
              cursor: "pointer",
            }}
          >
            &nbsp;&nbsp;Reserve Yours&nbsp;&nbsp;
          </button>
        </div>
      </div>
    </div>
  );
}
