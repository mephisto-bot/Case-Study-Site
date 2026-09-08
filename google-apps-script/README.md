# Google Apps Script Registration Pipeline Setup Guide

This guide explains how to set up the **Google Apps Script Web App** backend for the **CIH Case Study** website registration form (`/register`).

---

## What This Pipeline Does
1. **Google Sheets Logging**: Whenever a visitor fills the registration form on the website, their name, email, attendee status (Hub Member or New Attendee), and submission timestamp are appended as a new row to your Google Sheet.
2. **Automated Gmail Confirmation**: Sends a beautifully styled, branded HTML confirmation email to the participant with Wednesday session logistics, meeting details, and preparation guidelines.
3. **Zero Hosting Cost**: Runs entirely on Google's free infrastructure without needing a separate Node.js/Python server.

---

## 5-Minute Setup Steps

### Step 1: Create a New Google Sheet
1. Open [Google Sheets](https://sheets.new) in your browser while logged into your CIH Google Workspace or Gmail account.
2. Rename the spreadsheet to: `CIH Case Study Registrations`.

### Step 2: Open the Apps Script Editor
1. In the Google Sheet top menu, click **Extensions** → **Apps Script**.
2. Rename the Apps Script project to `CIH Case Study Webhook`.

### Step 3: Paste the Script Code
1. Delete any sample code in the `Code.gs` editor.
2. Copy the entire content of [`google-apps-script/Code.gs`](file:///c:/Users/bilal/Downloads/Case%20Study%20website/google-apps-script/Code.gs) and paste it into the editor.
3. Click the **Save** (💾 disk) icon.

### Step 4: (Optional) Run Initial Setup
1. In the function dropdown at the top toolbar, select `setupSheet`.
2. Click **Run**.
3. Google will ask for initial authorization permissions (to write to Sheets and send email via Gmail) — click **Review Permissions** → choose your account → click **Advanced** → click **Go to CIH Case Study Webhook (unsafe)** → **Allow**.
4. Check your Google Sheet: it will now have bold navy header columns!

### Step 5: Deploy as a Web App
1. Click the blue **Deploy** button in the top-right corner → select **New deployment**.
2. Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `CIH Case Study v1.0`
   - **Execute as**: `Me (your email address)`
   - **Who has access**: `Anyone` *(Crucial: this allows the website to send registration data without requiring visitors to sign in to Google)*
4. Click **Deploy**.
5. Copy the **Web App URL** generated (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Connecting the Web App URL to the Website

You can connect your new Web App URL in two easy ways:

### Option A: Via the Admin Portal (Easiest & Live)
1. Open the website and navigate to `/admin` (or click the shield icon in the top navbar).
2. Enter the organizer passcode: `cih2024`.
3. Go to the **Integration & Apps Script** tab.
4. Paste your Web App URL into the input field and click **Save Integration Settings**.

### Option B: Via `.env` Environment Variable
1. In the project root, create a `.env` file with:
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec
   ```
2. When deploying to Vercel or Netlify, add `VITE_GOOGLE_APPS_SCRIPT_URL` to your environment variables dashboard.
