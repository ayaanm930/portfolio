# 🏔 Metroidvania Portfolio — Ancient Digital Archive

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-pink?logo=framer)](https://www.framer.com/motion/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)

> A single-scroll portfolio experience built as an atmospheric metroidvania-like archive. Each section is a distinct biome, blending subtle gameplay-inspired visuals, audio, and narrative hints while showcasing skills, projects, and experience.

---

## ✨ What this project is

This is a portfolio built with **Next.js + TypeScript + Tailwind CSS** and styled like a modern game world.

It uses:

- **Custom canvas rendering** for layered backgrounds, silhouettes, fog, and zone-specific particle effects
- **Framer Motion** for UI transitions, overlays, and the world discovery experience
- **Howler.js** for immersive audio cues and UI sound feedback
- **IntersectionObserver** to detect which zone is active and trigger "Area Discovered" notifications
- A single central `data.ts` file to manage projects, skills, experience, and contact content

---

## 🚀 Features

- **Five immersive zones** with unique palettes, textures, and particle behaviors
- **Zone discovery overlay** that fades in and out when you enter a new area
- **Interactive world map modal** with clickable rooms and visited-zone tracking
- **Subtle lore-inspired copy** that hints at what each zone represents without being explicit
- **Custom cursor glow effect** that follows the pointer without changing the actual cursor
- **Resume modal + download support** for in-site resume review and PDF download
- **Responsive styling** for desktop and mobile
- **Sound-enabled UI** with gate, map, click, and ambient effects

---

## 🧩 Project structure

```text
portfolio/
├── public/
│   ├── audio/                # audio assets for sound effects
│   ├── resume_AyaanMughal.pdf # downloadable resume asset
│   └── ...
├── src/
│   ├── app/
│   │   ├── globals.css        # global styling + custom theme rules
│   │   ├── layout.tsx         # root layout and metadata
│   │   └── page.tsx           # main portfolio page, zone definitions
│   ├── components/
│   │   ├── audio/
│   │   │   └── AudioProvider.tsx
│   │   ├── ui/
│   │   │   ├── CursorGlow.tsx
│   │   │   └── SfxButton.tsx
│   │   ├── world/
│   │   │   ├── AreaDiscoveredOverlay.tsx
│   │   │   ├── WorldHud.tsx
│   │   │   ├── WorldMapModal.tsx
│   │   │   ├── useZoneDiscovery.ts
│   │   │   └── types.ts
│   │   └── zones/
│   │       ├── ZoneCanvas.tsx
│   │       └── ZoneSection.tsx
│   └── lib/
│       ├── data.ts            # resume content, skills, projects, education
│       └── utils.ts           # helper utilities
├── package.json
├── postcss.config.mjs
├── tailwind.config.js?       # if present in workspace
├── next.config.js
└── tsconfig.json
```

---

## 🛠 Tech stack

- **Next.js 14.2.35**
- **React 18.3.1**
- **TypeScript 5.7.3**
- **Tailwind CSS v4**
- **Framer Motion**
- **Howler.js**
- **Tabler Icons**

---

## 📦 Installation

```bash
npm install
```

## 🔧 Local development

```bash
npm run dev
```

Open `http://localhost:3000` after the server starts.

## 📦 Build for production

```bash
npm run build
npm start
```

---

## 🧠 How content is managed

All portfolio content is centralized in `src/lib/data.ts`.

This includes:

- personal information
- skills and technical categories
- project metadata
- experience entries
- education entries

This makes it easy to update the portfolio without changing page layout logic.

---

## 🎮 Design notes

This project is intentionally styled as a **world map experience** rather than a traditional resume page.

Each zone is designed to feel like a chapter or biome with:

- a distinct visual identity
- a particle system that matches the zone theme
- subtle narrative copy inspired by exploratory games
- an ambient motion and audio layer

---

## ✅ Notes for contributors

- Keep new sections **modular** and add them as new zones in `src/app/page.tsx`
- Add new audio cues via `public/audio` and `src/components/audio/AudioProvider.tsx`
- Prefer **data-driven content** in `src/lib/data.ts` over hardcoded strings in components
- Use `ZoneConfig` in `src/components/world/types.ts` for any new zone fields

---

## 📬 License

This repository is intended as a personal portfolio showcase.

Feel free to adapt it for your own use.
