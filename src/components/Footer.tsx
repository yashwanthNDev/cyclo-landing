"use client";

import React from "react";
import { motion } from "framer-motion";

const NAV = {
  Product:  ["S-1 Overview", "Technical Specs", "Configure", "Compare Models"],
  Company:  ["About Cyclo", "Careers", "Press & Media", "Investors"],
  Support:  ["Contact Us", "Warranty", "Dealer Locator", "Service Centers"],
};

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full overflow-hidden" style={{ backgroundColor: "#0A0A0A" }}>

      {/* ── Brand hero ─────────────────────────────────────── */}
      <div className="flex flex-col items-center pt-28 pb-20 px-8 border-b border-white/[0.06]">

        {/* Eyebrow */}
        <motion.p
          {...inView(0)}
          className="text-[9.5px] font-bold tracking-[0.45em] uppercase mb-8"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Cyclo &nbsp;·&nbsp; S&#8901;1 &nbsp;·&nbsp; 2026
        </motion.p>

        {/* ── Cyclo wordmark with clip reveal + shimmer ─── */}
        <div className="relative overflow-hidden mb-8">
          {/* The text itself slides up */}
          <motion.h2
            initial={{ y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-black uppercase leading-none select-none"
            style={{
              fontSize: "clamp(80px, 15vw, 220px)",
              letterSpacing: "-0.02em",
              color: "#F9F7F4",
            }}
          >
            Cyclo
          </motion.h2>

          {/* Metallic shimmer sweeps left→right after the text settles */}
          <motion.div
            initial={{ x: "-110%" }}
            whileInView={{ x: "210%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.95, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          {...inView(0.55)}
          className="text-[13px] font-medium italic mb-12"
          style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.01em" }}
        >
          Engineered for the Road.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.04, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] transition-colors"
          style={{ backgroundColor: "#F9F7F4", color: "#0A0A0A" }}
        >
          Pre-order S&#8901;1
        </motion.button>
      </div>

      {/* ── Nav links ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 px-12 py-20">
        {Object.entries(NAV).map(([category, items], colIdx) => (
          <motion.div key={category} {...inView(colIdx * 0.1)}>
            <p
              className="text-[9px] font-bold tracking-[0.4em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {category}
            </p>
            <ul className="flex flex-col gap-3.5">
              {items.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13.5px] font-medium transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
                    }
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 px-12 py-6 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p
          className="text-[10px] font-medium tracking-wide"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          © 2026 Cyclo Performance Engineering. All rights reserved.
        </p>
        <div className="flex gap-7">
          {["Privacy Policy", "Terms of Use", "Cookie Settings"].map((label) => (
            <a
              key={label}
              href="#"
              className="text-[10px] font-medium tracking-wide transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)")
              }
            >
              {label}
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
};
