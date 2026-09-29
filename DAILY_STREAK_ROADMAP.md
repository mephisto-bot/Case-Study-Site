# 🚀 CIH Case Study Website — 30-Day GitHub Streak Roadmap

Welcome to your daily engineering streak challenge! Each day represents one bite-sized, high-impact improvement (10–20 minutes) specifically designed for this codebase.

> **How to Use:**
> 1. Open the project each day.
> 2. Check the task for today or pick the next unchecked box `[ ]`.
> 3. Pair with Antigravity to write/refine the code together.
> 4. Run the recommended `git` commands and push your commit to GitHub to keep your streak green! 🔥

---

## 📅 Roadmap Overview

- [x] **Day 01** • `feat: add Week 21 case study - Psycho-Cybernetics and dynamic date alignment`
- [ ] **Day 02** • `feat(seo): add dynamic OpenGraph social cards and JSON-LD schema`
- [x] **Day 03** • `feat(ui): create custom 404 NotFound page with smart redirect to latest study`
- [ ] **Day 04** • `feat(search): add presenter name and week number filtering to GlobalSearchModal`
- [ ] **Day 05** • `feat(ui): add reading time estimator badge on case study cards`
- [ ] **Day 06** • `feat(study): add Export/Download Case Study as Markdown button in modal`
- [ ] **Day 07** • `feat(archive): add retrospective chronological timeline filter on PastStudiesPage`
- [ ] **Day 08** • `feat(ux): add smooth skeleton shimmer loading states for modal gallery images`
- [ ] **Day 09** • `feat(a11y): add keyboard shortcuts (Esc to close, Left/Right for gallery slides)`
- [ ] **Day 10** • `feat(ui): add animated copy-to-clipboard toast notification on study share`
- [ ] **Day 11** • `style: refine card hover micro-interactions and ambient glow effects`
- [ ] **Day 12** • `feat(ui): add floating scroll-to-top button with circular reading progress ring`
- [ ] **Day 13** • `feat(nav): add Previous/Next case study navigation buttons inside modal`
- [ ] **Day 14** • `feat(registration): add celebratory confetti effect on successful session seat booking`
- [ ] **Day 15** • `feat(testimonials): add topic and cohort filter chips to TestimonialsSection`
- [ ] **Day 16** • `feat(faq): add instant search and category filter on FAQPage`
- [ ] **Day 17** • `feat(forms): add live character counter and word-count validator on mentorship essay`
- [ ] **Day 18** • `feat(admin): add export registrations to CSV button in admin attendees view`
- [ ] **Day 19** • `feat(calendar): generate downloadable .ics calendar invite for upcoming Wednesday session`
- [ ] **Day 20** • `style: add print stylesheet (@media print) for clean case study study-guide handouts`
- [ ] **Day 21** • `feat(ticket): add tap-to-enlarge QR code modal on registration entry pass`
- [ ] **Day 22** • `feat(pwa): add web app manifest and home-screen install metadata`
- [ ] **Day 23** • `perf: preload critical font assets and responsive hero images in index.html`
- [ ] **Day 24** • `test: add Vitest suite for dateHelpers (Wednesday calculation edge cases)`
- [ ] **Day 25** • `test: add unit tests for storage service migration and local cache sync`
- [ ] **Day 26** • `feat(a11y): audit WCAG 2.2 AA aria-labels and screen reader focus traps`
- [ ] **Day 27** • `perf: debounce search input states in past studies and admin tables`
- [ ] **Day 28** • `perf: implement responsive picture elements and native lazy loading on past studies grid`
- [ ] **Day 29** • `feat(admin): add visual analytics summary stats (attendee counts, popular sectors)`
- [ ] **Day 30** • `perf(build): tune Vite rollup chunk splitting for sub-500kB bundles`

---

## 🛠️ Detailed Daily Task Breakdown

### Day 01: Week 21 Case Study: Psycho-Cybernetics [COMPLETED]
- **Target Files:** `src/data/initialData.ts`, `src/services/storage.ts`, `src/pages/PastStudiesPage.tsx`, `public/images/psycho-cybernetics.jpg`
- **What was done:** Added Dr. Maxwell Maltz's *Psycho-Cybernetics* ("The Mind as a Ship"), created high-res image, linked takeaways and questions, and advanced upcoming session to Week 22.
- **Commit Command:**
  ```bash
  git add .
  git commit -m "feat: add Week 21 case study - Psycho-Cybernetics and dynamic date alignment"
  git push
  ```

---

### Day 02: Dynamic OpenGraph & JSON-LD Structured Data
- **Target Files:** `index.html`, `src/components/layout/Navbar.tsx` or new `src/components/common/MetaHead.tsx`
- **Goal:** Improve social sharing preview cards on Twitter, LinkedIn, WhatsApp when linking to the CIH Case Study platform.
- **Time Estimate:** 15 mins.

---

### Day 03: Custom 404 NotFound Page [COMPLETED]
- **Target Files:** `src/pages/NotFoundPage.tsx`, `src/App.tsx`
- **Goal:** Replace default blank page or browser fallback with a branded CIH error page that invites lost users to explore the latest Wednesday session.
- **Commit Command:**
  ```bash
  git add src/pages/NotFoundPage.tsx src/App.tsx DAILY_STREAK_ROADMAP.md
  git commit -m "feat(ui): create custom 404 NotFound page with smart redirect to latest study"
  git push origin main
  ```

---

### Day 04: Presenter & Week Filter in Global Search Modal
- **Target Files:** `src/components/common/GlobalSearchModal.tsx`
- **Goal:** Allow users to search by presenter name (e.g., "Kenny", "Coach Adewale") and specific week number (e.g., "Week 21") directly in the `Ctrl + K` search modal.
- **Time Estimate:** 15 mins.

---

### Day 05: Reading Time Estimator Badge
- **Target Files:** `src/utils/readingTime.ts`, `src/components/common/CaseStudyModal.tsx`, `src/pages/HomePage.tsx`
- **Goal:** Calculate estimated reading time based on `fullContent` word count (average 200 wpm) and display a sleek "📖 4 min read" badge on study cards.
- **Time Estimate:** 10 mins.

---

### Day 06: Export Case Study as Markdown / Text
- **Target Files:** `src/components/common/CaseStudyModal.tsx`
- **Goal:** Add a "Download Study Notes (.md)" button in the case study modal header so attendees can save the key takeaways and questions to their personal Notion or Obsidian vault.
- **Time Estimate:** 15 mins.

---

### Day 07: Retrospective Chronological Filter on Past Studies
- **Target Files:** `src/pages/PastStudiesPage.tsx`
- **Goal:** Add sort order dropdown ("Newest First", "Oldest First", "By Week Number") to the archive header.
- **Time Estimate:** 12 mins.

---

### Day 08: Skeleton Shimmer Loading States
- **Target Files:** `src/components/common/SkeletonLoader.tsx`, `src/components/common/CaseStudyModal.tsx`
- **Goal:** Add subtle CSS shimmer placeholders while gallery images are loading to eliminate layout shift (CLS).
- **Time Estimate:** 15 mins.

---

### Day 09: Keyboard Shortcuts for Modal & Gallery
- **Target Files:** `src/components/common/CaseStudyModal.tsx`
- **Goal:** Listen for `ArrowLeft` / `ArrowRight` to cycle through gallery images, and `Escape` to close modal.
- **Time Estimate:** 10 mins.

---

### Day 10: Copy-to-Clipboard Share Toast
- **Target Files:** `src/components/common/CaseStudyModal.tsx`, `src/components/common/Toast.tsx`
- **Goal:** Provide visual confirmation ("Link copied to clipboard!") when clicking the Share button in the modal.
- **Time Estimate:** 12 mins.

---

*(Days 11 through 30 will be tackled step-by-step as you check in each day!)*
