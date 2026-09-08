# CIH Case Study Website - Deployment & Hosting Guide

This guide details the recommended free / low-cost hosting options for deploying the **CIH Case Study** website live, along with instructions for connecting it as a subdomain (e.g., `casestudy.cih.com.ng`) to the main CIH ecosystem.

---

## Recommended Hosting Providers

| Provider | Plan | Best For | Key Benefits |
|---|---|---|---|
| **Vercel** *(Recommended)* | Hobby (Free) | React / Vite SPA | Instant GitHub CI/CD, global CDN edge network, zero config. |
| **Netlify** | Starter (Free) | Static & SPA Sites | 100GB bandwidth/month, automatic branch previews, custom headers. |
| **GitHub Pages** | Free | Open Source | Simple hosting directly from your repository. |

---

## Option 1: Deploy to Vercel (Recommended)

### Method A: Deploy via GitHub (Automated Continuous Deployment)
1. Push this project to a GitHub repository (e.g., `github.com/your-username/cih-case-study`).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **Add New...** → **Project**.
4. Import your GitHub repository.
5. In **Framework Preset**, Vercel will automatically detect `Vite`.
6. (Optional) Under **Environment Variables**, add:
   - Name: `VITE_GOOGLE_APPS_SCRIPT_URL`
   - Value: Your deployed Google Apps Script URL.
7. Click **Deploy**. Your site will be live in ~30 seconds with a free `.vercel.app` domain.

### Method B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## Option 2: Deploy to Netlify

### Method A: Deploy via GitHub
1. Go to [netlify.com](https://netlify.com) and log in.
2. Click **Add new site** → **Import an existing project** → GitHub.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Under **Environment variables**, add `VITE_GOOGLE_APPS_SCRIPT_URL`.
5. Click **Deploy site**.

### Method B: Drag and Drop `dist` folder
1. Build the production package locally:
   ```bash
   npm run build
   ```
2. In your Netlify dashboard, go to **Sites** → drag and drop the created `dist/` folder.

---

## Setting up Custom Subdomain (`casestudy.cih.com.ng`)

To link this site directly with the main CIH domain (`cih.com.ng`):
1. In your Vercel or Netlify site settings, go to **Domains** → click **Add Domain**.
2. Enter `casestudy.cih.com.ng`.
3. In your DNS provider for `cih.com.ng` (e.g., Cloudflare, Namecheap, cPanel), add a **CNAME** record:
   - **Type**: `CNAME`
   - **Name / Host**: `casestudy`
   - **Target / Value**: `cname.vercel-dns.com` (for Vercel) or your Netlify site URL.
4. SSL certificate will automatically generate in minutes!
