# FabricID

**AI-powered textile authentication for India's textile manufacturers — MSME Idea Hackathon 6.0 submission.**

## The Problem

Textile counterfeiting costs Indian manufacturers — especially MSMEs — a significant share of revenue every year. Buyers have no fast, reliable way to verify that a fabric or garment is genuine, and small manufacturers have no affordable way to prove it. Existing anti-counterfeiting solutions (holograms, RFID tags) are expensive and easy to physically clone.

## The Solution

FabricID gives every piece of fabric a unique digital fingerprint, generated from its visual and physical properties (weave pattern, fiber composition, thread count, color profile), and ties that fingerprint to a QR code printed on the product.

- **Manufacturers** upload photos of a new fabric batch. FabricID analyzes it and generates a unique Fabric ID + fingerprint hash, which gets embedded in a QR code for labeling.
- **Buyers** scan the QR code with their phone. FabricID re-analyzes the scanned data against the original fingerprint and returns a match score and authenticity verdict — in seconds, no app install required.
- **Manufacturers** get a dashboard to track their registered products and scan activity, giving visibility into where and how often their goods are being verified (and a signal for counterfeit activity if scans spike in unexpected regions).

## How it Works

1. **Registration** — Manufacturer uploads fabric images + batch info via the Dashboard.
2. **Fingerprinting** — The analysis engine extracts weave pattern, fabric type, texture, thread count, GSM weight, and color profile, then hashes them into a unique 16-character fingerprint.
3. **QR Generation** — The Fabric ID and fingerprint are encoded into a QR code, ready to print on labels/tags.
4. **Verification** — Anyone scans the QR via the Verify page. The app compares the scanned fingerprint against the registered one across four weighted checks (weave, fabric type, thread count, color) and returns a match percentage and authenticity result.

> **Note on the current build:** the fabric analysis engine in this prototype uses a deterministic simulation to demonstrate the full authentication flow end-to-end. In production, this step would call a real computer vision model (e.g. a fine-tuned vision model analyzing weave/texture from the uploaded images) instead of the simulated analysis — the QR generation, verification, matching logic, and dashboard are all fully functional as built.

## Tech Stack

- **Frontend:** React 19 + Vite, Tailwind CSS, Framer Motion
- **Auth & Data:** Firebase (Auth, Firestore, Storage) with a localStorage fallback for demo/offline use
- **QR:** `qrcode.react` for generation, `html5-qrcode` for camera-based scanning
- **Routing:** React Router

## Getting Started

```bash
npm install
npm run dev
```

The app works out of the box with demo data and localStorage — no Firebase project required to try it. To connect a real Firebase backend, add your config as environment variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Project Structure

```
src/
  components/   # Navbar, Footer, FabricCard, QRGenerator
  context/      # AuthContext, ProductContext (state + persistence)
  pages/        # Home, Login, Signup, Dashboard, Verify, Marketplace
  utils/        # fabricAnalysis.js (fingerprinting engine), firebase.js, demoData.js
```

## Why This Matters for MSMEs

FabricID is designed around the reality of small textile manufacturers: no expensive hardware, no per-unit licensing fees for exotic tags, and no dependency on buyers having a special app — just a QR code and a phone camera. It's built to be affordable enough for a family-run textile business to adopt directly.

## Roadmap

- Replace simulated analysis with a trained computer vision model for real weave/texture classification
- Batch QR generation and printable label export
- Manufacturer verification/KYC to prevent fake registrations
- Public verification API for marketplaces and retailers to integrate directly
