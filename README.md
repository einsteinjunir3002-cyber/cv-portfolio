# Samuel Bekoe — Professional CV & Portfolio Website

> **Computer Science Graduate | Technology & Digital Solutions**  
> *Adentan, Greater Accra, Ghana • BSc. Computer Science, University of Cape Coast (UCC)*

Welcome to the official source repository for Samuel Bekoe's professional CV and portfolio website. This website is engineered to serve as both an interactive digital portfolio and an ATS-compliant, recruiter-friendly personal curriculum vitae.

---

## 🌟 Key Highlights & Design Philosophy

- **Authentic & Honest Representation:** Zero fabricated claims, placeholder text ("Lorem Ipsum"), or invented statistics. Accurately highlights strengths in computer troubleshooting, hardware/OS maintenance, web development, and modern AI-assisted engineering (Prompt Engineering & Vibe Coding).
- **Glassmorphism & Modern Tech Aesthetic:** Built with a sophisticated dark palette (`#080d1a`, `#0f172a`), frosted glass cards (`backdrop-filter: blur(12px)`), subtle neon cyan/purple glowing accents, and fluid typography (`Outfit`, `Plus Jakarta Sans`, `JetBrains Mono`).
- **Fully Responsive & Mobile-Validated:** Rigorously tested across Desktop (1440px/1280px), Tablet (768px), and real Smartphone viewports (390x844 iPhone metrics) with zero horizontal overflow, responsive modals, and an animated mobile navigation drawer.
- **Interactive Project Showcase:** Filter projects dynamically (Web Applications, Academic & AI, Client & Enterprise) with deep-dive modal dialogs, verified GitHub repository links, and architecture overviews.
- **Integrated Downloadable PDF CV:** Generates a 2-page, ATS-friendly, clean PDF CV with semantic headings, high print contrast, and professional typography (`assets/cv/Samuel_Bekoe_CV.pdf`).
- **Direct Contact Integrations:** Features 1-click WhatsApp messaging, direct phone dialing, mailto launcher, and an interactive message form with field validation.

---

## 📁 Repository Structure

```text
CV/
├── Image/                              # Original user images (NEVER modified or overwritten)
│   ├── me.png                          # Original graduation/portrait photograph
│   └── me with some guys from cs class 2026.jpeg # UCC 2026 CS graduating class photo
├── assets/                             # Optimized web assets & generated deliverables
│   ├── cv/
│   │   └── Samuel_Bekoe_CV.pdf         # 2-Page ATS-compliant professional PDF CV
│   └── images/
│       ├── samuel-portrait.webp        # WebP optimized portrait (hero avatar)
│       ├── samuel-ucc-class.webp       # WebP optimized graduation group photo
│       ├── favicon.svg                 # Custom geometric monogram icon
│       ├── project-smartlearn.png      # SmartLearn LMS capstone banner
│       ├── project-likem.jpeg          # LIKEM Perfumes social commerce banner
│       ├── project-harmony.jpeg        # Harmony Haven multi-brand banner
│       ├── project-rent.svg            # Rental property blueprint vector preview
│       └── project-solar.svg           # ARSPCS robotics telemetry vector preview
├── dist/                               # Production-ready static build bundle (for deployment)
├── public/                             # Static assets mirrored for Vite dev/preview server
├── scripts/
│   ├── cv_template.html                # High-fidelity, ATS-compliant HTML template for the CV
│   └── generate_pdf.py                 # Automated headless Chrome script to generate PDF CV
├── index.html                          # Semantic HTML5 website structure & SEO metadata
├── style.css                           # Custom CSS design system, glassmorphism, responsive queries
├── script.js                           # Vanilla JS ES-modules: modals, filters, drawer, toasts
├── vite.config.js                      # Vite build configuration
├── package.json                        # NPM package configuration
└── README.md                           # Documentation & project manual
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Python 3** (with `requests` library, optional for generating the PDF CV)
- **Google Chrome** (for automated headless PDF rendering)

### 2. Install Dependencies
Open PowerShell or your preferred terminal in the project directory:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Any edits to `index.html`, `style.css`, or `script.js` will hot-reload instantly.

### 4. Build for Production
```bash
npm run build
```
This compiles and optimizes all assets into the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```
Spins up a lightweight local server serving the compiled files from `dist/` at `http://localhost:4173`.

---

## 📄 Re-generating the Downloadable PDF CV

If you ever update your qualifications, contact information, or projects and want to regenerate `assets/cv/Samuel_Bekoe_CV.pdf`:

1. Edit [scripts/cv_template.html](file:///c:/Users/einst/Desktop/CV/scripts/cv_template.html) with your updated information.
2. Run the generator script:
   ```bash
   python scripts/generate_pdf.py
   ```
3. The script will automatically launch headless Chrome, render the exact print margins (`0.4 in`), generate the ATS-compliant 2-page PDF, and save it directly to `assets/cv/Samuel_Bekoe_CV.pdf`.
4. Re-run `npm run build` so the new PDF is copied into `dist/`.

---

## 🚢 Free & Easy Deployment

The `dist/` directory contains standard static files (`index.html`, CSS, JS, images, PDF). You can deploy this site online in under 2 minutes:

### Option A: GitHub Pages (Recommended)
1. Push this folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of professional CV & portfolio"
   git remote add origin https://github.com/einsteinjunir3002-cyber/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions** and use the standard "Vite" or "Static HTML" workflow.

### Option B: Vercel (1-Click)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Accept the defaults (Vite preset will be auto-detected, output directory: `dist`).

### Option C: Netlify Drop
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `dist/` folder into the browser window.
3. Your website will be live with a free custom SSL certificate in 10 seconds!

---

## 🛠️ Verified Projects Showcase

1. **SmartLearn — AI-Powered Collaborative Learning Platform**
   - *Role:* Co-Creator & Full-Stack Developer
   - *Academic Capstone:* BSc. Computer Science, University of Cape Coast (UCC), 2025–2026.
   - *Stack:* React, Vite, Node.js, Express, SQLite, JWT Authentication.
   - *GitHub:* [L400-PROJECT-SUBMISSION](https://github.com/einsteinjunir3002-cyber/L400-PROJECT-SUBMISSION)

2. **LIKEM Perfumes — Social-Commerce Platform**
   - *Role:* Lead Web Developer
   - *Client Solution:* Production e-commerce storefront for an independent Ghanaian fragrance vendor.
   - *Features:* Paystack Mobile Money integration (MTN MoMo, Telecel Cash, Cards), WhatsApp 1-click order prefill, Ghanaian regional delivery fees.
   - *Stack:* Next.js, TypeScript, Prisma ORM, PostgreSQL, Paystack API.
   - *GitHub:* [Likem-Store](https://github.com/einsteinjunir3002-cyber/Likem-Store)

3. **Bekoe Rental Property Website & Tenancy Management System**
   - *Role:* Creator & Full-Stack Developer
   - *Enterprise Solution:* Real-world web platform for Richard Bekoe's room rental business in Adenta New Site.
   - *Features:* Room showcase, amenity specs, tenant inquiry workflows, tenancy agreement records.
   - *Stack:* Next.js, React, Prisma ORM, Relational Database.

4. **ARSPCS — Autonomous Robotic Solar Panel Cleaning Simulation**
   - *Role:* Simulation Core & Systems Engineer
   - *Systems Model:* Finite state-machine model and physics-based telemetry simulator testing autonomous robot cleaning in dusty West African tropical climates.
   - *Stack:* Python 3, State Machine Architecture, Matplotlib, Physics Simulation.
   - *GitHub:* [joy-solar-robot-simulator](https://github.com/einsteinjunir3002-cyber/joy-solar-robot-simulator)

5. **Harmony Haven Enterprise — Multi-Brand E-Commerce Platform**
   - *Role:* Platform Architect & Full-Stack Developer
   - *Commercial Hub:* Multi-brand commercial platform powering Kowah's Dishes (culinary) and 4U HEARTLINES (curated gifts & poetry).
   - *Stack:* Next.js App Router, TypeScript, Prisma ORM, Paystack API, WhatsApp Dispatch.
   - *GitHub:* [harmony-haven-enterprise](https://github.com/einsteinjunir3002-cyber/harmony-haven-enterprise)

---

## 📬 Contact & Author Information

- **Name:** Samuel Bekoe
- **Phone:** [+233 59 541 2232](tel:+233595412232)
- **Email:** [einsteinjunir3002@gmail.com](mailto:einsteinjunir3002@gmail.com)
- **WhatsApp:** [+233 59 541 2232](https://wa.me/233595412232)
- **GitHub:** [einsteinjunir3002-cyber](https://github.com/einsteinjunir3002-cyber)
- **Location:** Adentan, Greater Accra, Ghana

---
*Built with craftsmanship, modern web standards, and attention to detail.*
