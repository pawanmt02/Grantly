# GRANTLY — Unified Scholarship Discovery & Management Platform
> **Rethinking the Educational Financial Assistance Experience**  
> *Developed for Frontend Arena — The Outpost Hackathon (Track 01 Intermediate)*

[![Built With React 19](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🎯 The Challenge & Problem Statement
Accessing educational financial assistance has historically been an overwhelming, fragmented, and stressful journey for students:
1. **The Discovery Trap**: Students spend countless hours on archaic web portals sorting through thousands of scholarships, only to find they miss arbitrary cutoffs (such as GPA, specific major, residency, or citizenship criteria).
2. **Admissions Friction & Blank Page Syndrome**: Every scholarship demands distinct essays, personal statements, and letters of recommendation. Staring at an empty document causes applicant paralysis.
3. **Scattered Materials & 11:59 PM Scramble**: Crucial documents (transcripts, FAFSA/SAR aid reports, faculty letters of recommendation) remain scattered across downloads folders and old email threads.
4. **Zero Visibility & Deadlines Chaos**: Lacking an end-to-end pipeline, students lose track of application stages, renewal terms, and urgent deadlines.

---

## 💡 The Grantly Solution
**Grantly** re-architects this complex ordeal into an intuitive, empowering, and unified digital journey.

```
       ┌────────────────────────────────────────────────────────┐
       │             GRANTLY UNIFIED PLATFORM                   │
       └────────────────────────┬───────────────────────────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    ▼                           ▼                           ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Smart Matching  │    │ Unified Pipeline │    │ AI Essay Studio  │
│  & Eligibility   │    │  Kanban Tracker  │    │  & Copilot       │
│  - Multi-factor  │    │  - 5-stage flow  │    │  - 4-part schema │
│  - Score (0-100) │    │  - Checklists    │    │  - Tone tuner    │
│  - "Why You Fit" │    │  - Goal metric   │    │  - Word metrics  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
    │                           │                           │
    └───────────────────────────┼───────────────────────────┘
                                ▼
               ┌──────────────────────────────────┐
               │  Document Vault & Streamlined    │
               │  One-Click Application Flow     │
               │  - Real-time readiness check     │
               │  - Auto-bundling & confirmation  │
               └──────────────────────────────────┘
```

---

## 🚀 Key Feature Pillars

### 1. ⚡ Explainable Multi-Factor Matching Engine
- Evaluates **Academic Standing (GPA)**, **Education Level**, **Field of Study (Major)**, **Citizenship/Residency Status**, **First-Generation College Status**, and **Demonstrated Financial Need**.
- Generates a transparent **Match Score (0–100%)** with an explicit "Why You Match" breakdown so students understand exactly where they stand without guessing.

### 2. 🔍 Intuitive Discovery Hub
- Comprehensive fuzzy search by scholarship title, sponsor, academic field, or tags.
- Instant filters: Category (STEM, Need-based, Merit, Underrepresented, Arts, Leadership, International), Min Match % threshold, and Multi-Year Renewable grants.
- Urgency-aware deadline countdown timers that visually highlight approaching deadlines.

### 3. 📋 Unified Application Pipeline (Interactive Kanban)
- 5 distinct application stages: **Considering**, **Preparing Documents**, **Submitted**, **Interview / Review**, and **Awarded & Won**.
- Interactive sub-task checklists directly inside cards (transcripts verified, essay drafted, recommendation uploaded).
- Live Financial Progress Meter tracking:
  $$\text{Progress} = \frac{\text{Awarded Aid}}{\text{Target Aid}} \times 100\%$$
- Support for adding **Custom / Local Offline Scholarships** so students can track community grants alongside national ones.
- One-click **Printable Student Aid Summary** report generation.

### 4. ✍️ AI Essay Spark & Narrative Copilot
- Eliminates writer's block for scholarship prompts.
- Built-in **1-Click Structural Blueprint**:
  - *The Catalyst Hook*
  - *The Friction & Grit (Obstacle)*
  - *Quantifiable Community Impact*
  - *Scalable Future Vision*
- Real-time word counter, character counter, reading time estimator, and tone adjuster (Inspiring, Scholarly, Leadership, Resilience).
- Instant one-click save of drafted essays directly into the **Document Vault**.

### 5. 🗄️ Document Vault & Real-Time Readiness Auditor
- Centralized locker for Official Transcripts, Master Resumes, Core Personal Statements, Faculty Recommendations, and FAFSA / Student Aid Reports.
- Live **Vault Readiness Audit (%)** that checks missing criteria across all tracked opportunities.

### 6. ⚖️ Opportunity Trade-off & ROI Comparison Matrix
- Compare up to 4 scholarships side-by-side.
- Analyze award size vs. application effort (1–2 hrs vs. 6+ hrs), acceptance rate, renewal terms, and required essays.

### 7. 🚀 Simulated Streamlined "One-Click Apply" with Confetti
- Auto-bundles verified documents from the Vault.
- 3-step digital confirmation flow with confetti celebration upon successful transmission and instant unique confirmation receipt generation.

---

## 🛠️ Technology Stack
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State & Storage**: Client-side reactive state with robust `localStorage` persistence and 1-click Demo Data reset.

---

## 📦 Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd Grantly

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Compile and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 Hackathon Evaluation Guide
For competition evaluators reviewing Grantly:
1. **Interactive Presets**: Click the student profile in the top-right navbar to test different presets (CS First-Gen, Pre-Med High-GPA, Design/Arts, or International Graduate) and watch the matching engine dynamically recalculate across the catalog!
2. **Kanban Pipeline**: Navigate to the *Application Tracker* tab to move cards across stages, check off application checklist items, and watch the funding progress update.
3. **AI Essay Copilot**: Open the *AI Essay Spark* tab or click "Brainstorm with AI" inside any scholarship modal to interact with the blueprint blocks and tone selector.
4. **Streamlined Apply**: Click "Explore" on any scholarship and press "Streamlined One-Click Apply" to test the document bundling and celebration flow.
5. **Theme Toggle**: Switch between dark and light modes using the moon/sun toggle in the navbar.
