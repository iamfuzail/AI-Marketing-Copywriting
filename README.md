# CopyCraft · AI Marketing Copy Generator 🚀

CopyCraft is a production-grade, AI-powered marketing copy generation tool meticulously designed for Indian brand teams. Built to streamline content creation operations, CopyCraft aligns custom brand voices, marketing channels, and localized Indian festive calendars into a seamless drafting workflow powered by the Gemini AI ecosystem.

## 🌟 Key Features

* **AI Copy Generation Engine**: Utilizes an autonomous cascaded architecture (`Gemini 2.5` → `Gemini 2.0` → `Gemini 1.5`) delivering streaming text formats.
* **Format-Specific Output**: Supports structured templates natively for Emailers, Social Media (Instagram/LinkedIn/X), WhatsApp / SMS, Performance Ads, and Push Notifications. 
* **Dynamic Brand Store**: Multi-profile brand management system (saving exact Brand Name, Tone, Indian localized Target Audiences, Languages like Hinglish, USPs, and Offers) via a strict Zustand `localStorage` pipeline.
* **Intelligent Calendar CRM**: A custom-tailored 2026 Indian Content Calendar supporting automated Click-To-Generate and saving arbitrary non-festive exact-date schedules. Includes `.ics` calendar reminder synching natively (Outlook/Google/Apple Calendar).
* **Rich State History System**: Save your AI-drafted outputs to an aggregated, searchable history archive with bulk copy hooks, CSV exporting, array-level favoriting, and persistent bulk deletion controls.
* **"Editorial Dark Studio" Design Pipeline**: Framer-Motion integrated ultra-modern UI, implementing deep Dark Mode optimizations, sub-pixel glassmorphic cards, and micro-animations to feel remarkably premium.

## 🏗 System Architecture

CopyCraft is optimized entirely on the cutting-edge **Next.js 16 (App Router)** environment backed by the performant **Turbopack** engine.

### Tech Stack
* **Framework:** Next.js 16 (React 19 ecosystem)
* **Language:** TypeScript (Strict typing enforcement across generic hooks and models)
* **State Management:** Zustand (with JSON-serialized `persist` middleware)
* **Styling Ecosystem:** Purist Global Vanilla CSS (`globals.css`) infused tightly with CSS Variables to enable zero-bundle dark mode layouts—intentionally sidestepping Tailwind for utmost custom UI aesthetic control.
* **Component Library:** Headless React (`lucide-react` for SVG iconography)
* **AI Provider:** `@google/generative-ai` (Gemini Flash Cascade Route Handler)

### Application Directory Structure
```
copycraft/
├── app/
│   ├── api/generate/route.ts  # Main backend route for AI streaming
│   ├── brand/                 # Brand profile management page
│   ├── calendar/              # Marketing Calendar dashboard
│   ├── generate/              # Split-pane AI generating playground
│   ├── history/               # Archive of drafted copy copies
│   └── globals.css            # The Master Style Node (Editorial Dark Studio)
│
├── components/
│   ├── calendar/              # Interactive date selection elements
│   ├── generator/             # Context inputs, Format selectors
│   ├── history/               # Interactive lists and CSV hook triggers
│   ├── layout/                # Global persistent application Header
│   ├── output/                # AI streaming layout parsers, Skeleton flows
│   └── ui/Toast.tsx           # Global non-blocking notification portal
│
├── constants/
│   ├── categories.ts          # Taxonomies for Industry and Tone
│   ├── formats.ts             # Platform constraint references
│   └── navigation.ts          # Core route structures
│
├── hooks/
│   ├── useGenerate.ts         # Orchestrator wrapping core stream parsing
│   └── useTheme.ts            # Hydration-safe dark mode toggle hook
│
├── lib/
│   ├── festivals.ts           # Highly accurate 2026 Indian Occasion Map
│   ├── prompts.ts             # LLM chunk prompt builders mapping schemas
│   └── utils.ts               # Core utility transformations
│
├── store/
│   ├── brandStore.ts          # Zustand store for multi-tenant profiles
│   ├── historyStore.ts        # Zustand architecture for generated drafts
│   └── generateStore.ts       # Context orchestrator handling live output
│
└── types/
    └── index.ts               # Total foundational Type definitions
```

## ⚙️ Getting Started

To launch CopyCraft securely in your environment:

1. **Clone the repository** standard pull workflow.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Establish Environment Scope:** Copy `.env.example` to `.env.local` and inject your active Gemini API Key.
   ```
   GEMINI_API_KEY=AIzaSy...
   ```
4. **Boot Development Environment:**
   ```bash
   npm run dev
   ```
5. Dive directly into `http://localhost:3000` to start crafting.

## 🧠 The Fallback Routing System

CopyCraft includes a sophisticated auto-reverting model cascade logic loop. Since free tier or new-tier API keys often trigger 404/429 endpoints depending on Google's rollout phase:
The Next.js backend intelligently cascades requests:
`gemini-2.5-flash` ➡️ fallback ➡️ `gemini-2.0-flash` ➡️ fallback ➡️ `gemini-1.5-flash-latest` ➡️ fallback ➡️ `gemini-1.5-flash`.
This completely eradicates standard model-not-found bottlenecks. 
