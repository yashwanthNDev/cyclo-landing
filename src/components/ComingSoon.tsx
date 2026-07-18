"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const BG  = "#F9F7F4";
const INK = "#0A0A0A";

// ─── Countdown helpers ────────────────────────────────────────────────────────
function getTimeLeft() {
  const now      = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  return {
    h: Math.floor(diff / 3600),
    m: Math.floor((diff % 3600) / 60),
    s: diff % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Single digit segment — fades + slides on change ─────────────────────────
function Seg({ value }: { value: number }) {
  const [shown, setShown]   = useState(value);
  const [fading, setFading] = useState(false);
  const prev                = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    setFading(true);
    const t = setTimeout(() => {
      setShown(value);
      setFading(false);
      prev.current = value;
    }, 280);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span
      style={{
        display:    "inline-block",
        width:      "2ch",
        textAlign:  "center",
        transition: "opacity 0.28s ease, transform 0.28s ease",
        opacity:    fading ? 0.08 : 1,
        transform:  fading ? "translateY(6px)" : "translateY(0)",
      }}
    >
      {pad(shown)}
    </span>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function ComingSoon() {
  const [time, setTime]           = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef                = useRef<HTMLElement>(null);
  const isInView                  = useInView(sectionRef, { once: true, margin: "-10%" });

  useEffect(() => {
    setTime(getTimeLeft());
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 18 },
    animate:    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  const slideUp = (delay = 0) => ({
    initial:    { y: "105%" },
    animate:    isInView ? { y: "0%" } : { y: "105%" },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700&display=swap');
        @keyframes cs-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden"
        style={{
          backgroundColor: BG,
          padding: "clamp(2.5rem, 5vw, 5rem) clamp(3rem, 8vw, 8rem)",
        }}
      >

        {/* ── Ghost timer — absolute centre watermark ── */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ padding: "0 clamp(2rem, 5vw, 5rem)" }}
          aria-hidden
        >
          {time && (
            <div style={{ display: "flex", alignItems: "flex-start" }}>

              {/* Each unit: number on top, label pinned below */}
              {([
                { val: time.h, label: "HRS" },
                { val: time.m, label: "MIN" },
                { val: time.s, label: "SEC" },
              ] as { val: number; label: string }[]).reduce<React.ReactNode[]>((acc, unit, i) => {
                if (i > 0) {
                  acc.push(
                    <span
                      key={`colon-${i}`}
                      style={{
                        fontFamily:    "'Inter', system-ui, sans-serif",
                        fontSize:      "clamp(110px, 22vw, 240px)",
                        fontWeight:    300,
                        lineHeight:    1,
                        color:         "rgba(10,10,10,0.05)",
                        margin:        "0 clamp(6px, 1vw, 16px)",
                        paddingBottom: "clamp(18px, 2.2vw, 26px)",
                        alignSelf:     "flex-end",
                      }}
                    >:</span>
                  );
                }
                acc.push(
                  <div
                    key={unit.label}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(6px, 0.8vw, 10px)" }}
                  >
                    {/* Number */}
                    <span
                      style={{
                        fontFamily:    "'Inter', system-ui, sans-serif",
                        fontSize:      "clamp(110px, 22vw, 240px)",
                        fontWeight:    700,
                        letterSpacing: "-0.03em",
                        lineHeight:    1,
                        color:         "rgba(10,10,10,0.07)",
                        display:       "inline-block",
                        width:         "2ch",
                        textAlign:     "center",
                      }}
                    >
                      <Seg value={unit.val} />
                    </span>
                    {/* Label — sits directly below its number */}
                    <span
                      style={{
                        fontSize:      "clamp(9px, 0.9vw, 11px)",
                        fontWeight:    700,
                        letterSpacing: "0.45em",
                        textTransform: "uppercase",
                        color:         "rgba(10,10,10,0.13)",
                      }}
                    >
                      {unit.label}
                    </span>
                  </div>
                );
                return acc;
              }, [])}

            </div>
          )}
        </div>

        {/* ── TOP — eyebrow + headline ── */}
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">

          {/* Eyebrow — larger and more visible */}
          <motion.p
            {...fadeUp(0)}
            className="flex items-center justify-center gap-2.5 font-black uppercase"
            style={{
              fontSize:       "clamp(11px, 1.1vw, 13px)",
              letterSpacing:  "0.42em",
              color:          "rgba(0,0,0,0.55)",
            }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ backgroundColor: "#4ade80", animation: "cs-pulse 2s ease-in-out infinite" }}
            />
            Coming Soon &nbsp;·&nbsp; Cyclo S&#8901;1 &nbsp;·&nbsp; 2026
          </motion.p>

          {/* Headline */}
          <div className="overflow-hidden leading-none">
            <motion.h2
              {...slideUp(0.1)}
              className="font-black uppercase tracking-tight whitespace-nowrap"
              style={{ fontSize: "clamp(36px, 6.5vw, 100px)", color: INK, lineHeight: 0.92 }}
            >
              Be First <span className="italic">In Line.</span>
            </motion.h2>
          </div>
        </div>

        {/* ── BOTTOM — description + pills + form ── */}
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg" style={{ paddingTop: "calc(clamp(5rem, 16vw, 18rem) + 8px)" }}>

          {/* Thin divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-10 h-[1px] origin-center"
            style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
          />

          {/* Body copy */}
          <motion.p
            {...fadeUp(0.45)}
            className="font-medium leading-relaxed text-center"
            style={{ fontSize: "clamp(15px, 1.3vw, 17px)", color: "rgba(0,0,0,0.42)", marginTop: "5px" }}
          >
            Be among the first to experience our revolutionary new platform.
            <br />
            <span className="italic" style={{ color: "rgba(0,0,0,0.28)" }}>
              Reserve your spot before the timer runs out.
            </span>
          </motion.p>

          {/* Feature pills */}
          <motion.div {...fadeUp(0.55)} className="flex gap-2 flex-wrap justify-center">
            {["Early access", "No spam, ever", "Free to join"].map((label) => (
              <span
                key={label}
                className="text-[10px] font-bold tracking-[0.22em] uppercase rounded-full"
                style={{
                  color:   "rgba(0,0,0,0.35)",
                  border:  "0.5px solid rgba(0,0,0,0.13)",
                  padding: "5px 16px",
                }}
              >
                {label}
              </span>
            ))}
          </motion.div>

          {/* Email form */}
          <motion.form
            {...fadeUp(0.65)}
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-2.5 items-center justify-center"
          >
            {!submitted ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="rounded-full text-[12px] font-medium outline-none placeholder:text-[rgba(0,0,0,0.25)] focus:border-[rgba(0,0,0,0.3)] transition-colors"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.04)",
                    border:          "0.5px solid rgba(0,0,0,0.14)",
                    color:           INK,
                    padding:         "10px 20px",
                    minWidth:        "clamp(160px, 22vw, 240px)",
                    letterSpacing:   "0.01em",
                  }}
                />
                <button
                  type="submit"
                  className="rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-75"
                  style={{ backgroundColor: INK, color: BG, padding: "10px 28px", border: "none", cursor: "pointer" }}
                >
                  &nbsp;&nbsp;Get Notified&nbsp;&nbsp;
                </button>
              </>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[11px] font-bold tracking-[0.3em] uppercase"
                style={{ color: "#4ade80" }}
              >
                ✓ &nbsp;You're on the list
              </motion.p>
            )}
          </motion.form>
        </div>

      </section>
    </>
  );
}
