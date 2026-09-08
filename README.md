# CIH Wednesday Case Study Platform

A digital platform and archive for the **Community Innovation Hub (CIH)** weekly Wednesday Case Study sessions. Designed to bridge physical hub mentorship with digital accessibility, enabling youth, interns, and alumni to explore decision science, ethical case breakdowns, and leadership frameworks.

---

## 🚀 Quick Start for Successors & Maintainers

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Git

### 2. Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd "Case Study website"

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the template `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in the credentials:
- `VITE_GOOGLE_APPS_SCRIPT_URL`: Google Apps Script webhook for spreadsheet sync.
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key.

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Building for Production
```bash
npm run build
```

---

## 🏛 Architecture & Tech Stack

- **Frontend**: React 18 with TypeScript and Vite.
- **Styling**: TailwindCSS with custom brand tokens (CIH Orange & Deep Navy).
- **Icons**: Lucide React + custom inline brand SVG icons.
- **Data & State**:
  - `src/services/storage.ts`: Resilient local storage fallback layer with offline mock dataset.
  - `src/services/api.ts`: Integration with Google Apps Script webhooks for real-time registration sync to Google Sheets.
  - `supabase_schema.sql`: Optional PostgreSQL relational database schema on Supabase.
- **Features**:
  - Weekly Wednesday automated countdown timer.
  - Interactive Case Study reader with embedded video player (`SessionVideoPlayer`).
  - Adaptive Device Share Pop-up (WhatsApp, Instagram, Facebook, Apple Notes, LinkedIn, X, Telegram, Email).
  - Certified CIH Coach selection with high-res portrait avatars.
  - 1-Click "Remember Me on this device" sign-in panel.
  - Dynamic ticket generation for confirmed session participants.

---

## 🚢 Deployment Workflow (Vercel & Git Kept Separate)

Per hub requirements, **GitHub and Vercel are kept independent** (not auto-merged) so maintainers have full control:

1. **Pushing Code Updates to GitHub**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Deploying Live to Vercel**:
   ```bash
   npx vercel deploy --prod --scope hub-s-projects5 --yes
   ```
   Live Production URL: [https://case-study-website-nine.vercel.app](https://case-study-website-nine.vercel.app)

---

## 📁 Key Directories

```
├── public/                 # Static assets, logos, and high-res ticket templates
├── src/
│   ├── components/
│   │   ├── auth/           # Login, signup, and remembered accounts modal
│   │   ├── common/         # CaseStudyModal, ShareModal, SessionVideoPlayer
│   │   └── layout/         # Navbar, Footer
│   ├── context/            # AuthContext (user session and credentials)
│   ├── data/               # Static case studies, coach portraits, initial data
│   ├── pages/              # Main routes (Home, PastStudies, Briefing, Register, Profile)
│   ├── services/           # Storage, API webhooks, Supabase client
│   └── utils/              # Ticket generator, date helpers, validation
├── google-apps-script/     # Backend script for Google Sheets sync
└── supabase_schema.sql     # Database schema definitions
```

---

## 🤝 Community Innovation Hub (CIH)
- **Location**: Plot 104, 5th Avenue Abesan Estate, Ipaja, Lagos, Nigeria
- **Tradition**: Every Wednesday, 10:00 AM – 4:00 PM WAT
