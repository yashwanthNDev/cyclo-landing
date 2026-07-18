"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Styles ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  --background: #0A0A0A;
  --foreground: #F9F7F4;
  --muted-foreground: rgba(249, 247, 244, 0.45);
  --primary: #3B82F6;
  --secondary: #8B5CF6;
  --destructive: #EF4444;
  --border: rgba(249, 247, 244, 0.1);
  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}
.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}
.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 15%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
`;

// ─── Magnetic Button (Framer Motion hover) ────────────────────────────────────
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, ref) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Component ref={ref} className={cn("cursor-pointer", className)} {...props}>
        {children}
      </Component>
    </motion.div>
  )
);
MagneticButton.displayName = "MagneticButton";

// ─── Marquee row ──────────────────────────────────────────────────────────────
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Carbon Frame Technology</span>   <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
    <span>CeramicSpeed Bearings</span>     <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
    <span>Aerodynamic Cockpit</span>       <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
    <span>Precision Engineering</span>    <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
    <span>Built to Perform</span>         <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
    <span>Cyclo S&#8901;1 · 2026</span>   <span style={{ color: 'rgba(255,255,255,0.35)' }}>✦</span>
  </div>
);

// ─── Main export ──────────────────────────────────────────────────────────────
export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });

  const giantY     = useTransform(scrollYProgress, [0, 1], ["10vh", "0vh"]);
  const giantScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const giantOp    = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const contentY   = useTransform(scrollYProgress, [0.2, 0.8], [50, 0]);
  const contentOp  = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col items-center justify-between overflow-hidden cinematic-footer-wrapper" style={{ backgroundColor: '#0A0A0A', color: '#F9F7F4' }}>

          {/* Ambient aurora + grid */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background "CYCLO" */}
          <motion.div
            style={{ y: giantY, scale: giantScale, opacity: giantOp }}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            CYCLO
          </motion.div>

          {/* Diagonal marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden py-7 z-10 -rotate-2 scale-110 shadow-2xl" style={{ backgroundColor: '#111111' }}>
            <div className="flex w-max animate-footer-scroll-marquee text-sm md:text-base font-bold tracking-[0.3em] text-white uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Main centre content */}
          <motion.div
            style={{ y: contentY, opacity: contentOp }}
            className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-6 mt-6 w-full max-w-5xl"
          >
            <h2 className="text-6xl md:text-[11vw] font-black footer-text-glow tracking-tighter mb-12 text-center w-full">
              Ready to Ride?
            </h2>

            <div className="flex flex-col items-center gap-6 w-full">
              {/* Primary CTAs */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as="a" href="#"
                  className="footer-glass-pill px-20 py-8 rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3"
                >
                  &nbsp;&nbsp;<svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 6"/><path d="m5.5 14 3.5-7.5L13 9l3-3"/>
                  </svg>
                  Pre-order S&#8901;1&nbsp;&nbsp;
                </MagneticButton>

                <MagneticButton
                  as="a" href="#"
                  className="footer-glass-pill px-20 py-8 rounded-full text-foreground font-bold text-sm md:text-base flex items-center gap-3"
                >
                  &nbsp;&nbsp;<svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6m-6 4h4"/>
                  </svg>
                  View Full Specs&nbsp;&nbsp;
                </MagneticButton>
              </div>

              {/* Secondary links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                {["Find a Dealer", "Privacy Policy", "Terms of Use", "Support"].map((label) => (
                  <MagneticButton
                    key={label} as="a" href="#"
                    className="footer-glass-pill px-14 py-5 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground"
                  >
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </MagneticButton>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 self-stretch">
            <div className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1">
              © 2026 Cyclo Performance Engineering. All rights reserved.
            </div>

            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-border/50">
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-destructive">❤</span>
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">for cyclists</span>
            </div>

            <MagneticButton
              as="button" onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>

        </footer>
      </div>
    </>
  );
}
