# PDF Loading Fix - Implementation Plan

## Problem Analysis
- `react-pdf` ^10.2.0 bundles its own `pdfjs-dist` version (5.x compatible)
- Direct `pdfjs-dist` ^4.4.168 in package.json causes version mismatch
- Current worker configuration using `import.meta.url` may not resolve correctly in Vite
- Missing CORS handling for external PDF URLs

## Fix Plan

### Step 1: Update vite.config.js
- [x] Remove `__PDF_WORKER_CDN__` define that points to old CDN version
- [x] Add Vite-compatible worker configuration

### Step 2: Update Library.jsx
- [x] Fix `pdfjs.GlobalWorkerOptions.workerSrc` to use correct Vite-compatible approach
- [x] Add `withCredentials: false` to `<Document />` file prop
- [x] Ensure no `width` prop on `<Page />` (use only `scale`)

### Step 3: Update DigitalBookshelf.jsx
- [x] Apply same fixes as Library.jsx
- [x] Fix Document file prop to include `withCredentials: false`

### Step 4: Test the changes
- [ ] Run `npm run dev` and verify PDF loads correctly
- [ ] Check browser console for any errors

