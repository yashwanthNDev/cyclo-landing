# VEO — The Future of Performance Cycling

A cinematic, scroll-driven product reveal site for the **VEO S·1**, a high-performance bicycle concept. Built as a portfolio piece to showcase interactive frontend engineering: smooth scrolling, scroll-linked animation, canvas rendering, and motion design.

**Live demo:** _add your deployed URL here_

## Overview

The site walks visitors through a full-screen hero, a scroll-scrubbed canvas animation, a parallax product shot, a "coming soon" countdown with email capture, and a cinematic footer — all wrapped in a floating glass-morphism navbar and an animated splash screen.

## Features

- **Splash screen** with animated intro before the main content reveals
- **Scroll-linked canvas animation** (`ScrollCanvas`) that scrubs through frames as the user scrolls, powered by Framer Motion's `useScroll` / `useSpring`
- **Isometric bike illustration** rendered on canvas (`drawIsoMTB.ts`)
- **Parallax hero imagery** section
- **Live countdown timer** with an email waitlist form (`ComingSoon`)
- **Smooth scrolling** across the whole site via Lenis (`LenisProvider`)
- **Floating, blur-backed navbar** that reacts to scroll position
- **Cinematic animated footer**
- Fully responsive, built with Tailwind CSS v4 and TypeScript
- Playwright end-to-end test setup included

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.types