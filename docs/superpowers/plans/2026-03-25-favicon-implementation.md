# Favicon Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and integrate favicons for the FPL website using SVG source with automated PNG generation in the Next.js build pipeline.

**Architecture:** Source favicons as a single SVG file in `public/`, use a Node.js build script with the `sharp` library to convert to PNG formats (32×32, 180×180), integrate favicon references in the root layout, and run generation as part of the Next.js build.

**Tech Stack:** Node.js, Sharp library (image processing), SVG, Next.js

---

## Task 1: Create SVG Favicon Source

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create the SVG favicon file**

Create `public/favicon.svg` with the following content:

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="12" fill="#bef043"/>
  <text
    x="50"
    y="55"
    font-family="'Bebas Neue', Arial, sans-serif"
    font-size="50"
    font-weight="400"
    text-anchor="middle"
    dominant-baseline="middle"
    fill="#050c05"
    letter-spacing="1"
  >FPL</text>
</svg>
```

- [ ] **Step 2: Verify the file exists**

Run: `ls -la public/favicon.svg`

Expected: File exists with content

---

## Task 2: Install Sharp Dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install sharp package**

Run: `npm install --save-dev sharp`

This adds `sharp` as a dev dependency for image processing.

- [ ] **Step 2: Verify installation**

Run: `npm list sharp`

Expected: `sharp@x.x.x` listed in dev dependencies

---

## Task 3: Create Favicon Generation Script

**Files:**
- Create: `scripts/generate-favicons.js`

- [ ] **Step 1: Create the favicon generation script**

Create `scripts/generate-favicons.js` with the following content:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'favicon.svg');

async function generateFavicons() {
  try {
    const svg = fs.readFileSync(svgPath);

    // Generate 32x32 PNG
    await sharp(svg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    console.log('✓ Generated favicon-32x32.png');

    // Generate 180x180 PNG (Apple touch icon)
    await sharp(svg)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon-180x180.png'));

    console.log('✓ Generated apple-touch-icon-180x180.png');

    // Generate favicon.ico from 32x32 (ICO is 32x32)
    await sharp(svg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 190, g: 240, b: 67, alpha: 1 }
      })
      .toFormat('ico')
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✓ Generated favicon.ico');
    console.log('\n✨ All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
```

- [ ] **Step 2: Make script executable and test it**

Run: `node scripts/generate-favicons.js`

Expected: Output shows all three files generated successfully with checkmarks

- [ ] **Step 3: Verify generated files**

Run: `ls -lh public/favicon*.* public/apple-touch-icon-*.png`

Expected: Three new files in public directory (favicon-32x32.png, apple-touch-icon-180x180.png, favicon.ico)

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-favicons.js public/favicon.svg public/favicon-32x32.png public/apple-touch-icon-180x180.png public/favicon.ico
git commit -m "feat: add favicon source and generation script

- Create SVG source with FPL branding (Bebas Neue text, lime green background)
- Add Node.js script to convert SVG to PNG formats (32x32, 180x180, ico)
- Generate initial favicon files for browser tabs and mobile bookmarks"
```

---

## Task 4: Update package.json Build Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update build script to include favicon generation**

In `package.json`, locate the `"scripts"` section and modify it:

**Before:**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

**After:**
```json
"scripts": {
  "dev": "node scripts/generate-favicons.js && next dev",
  "build": "node scripts/generate-favicons.js && next build",
  "start": "next start",
  "lint": "next lint",
  "generate:favicons": "node scripts/generate-favicons.js"
}
```

- [ ] **Step 2: Test the build script**

Run: `npm run generate:favicons`

Expected: All favicons generated successfully

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: add favicon generation to dev and build scripts

- Favicon generation runs before dev and build
- Favicon SVG changes automatically regenerate PNG files
- New script: npm run generate:favicons for manual generation"
```

---

## Task 5: Add Favicon Links to Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add favicon meta tags to the layout head**

In `app/layout.tsx`, update the metadata configuration and add favicon links:

**Before:**
```typescript
export const metadata: Metadata = {
  title: 'Federal Premier League',
  description: '6-team internal organisation football tournament',
}
```

**After:**
```typescript
export const metadata: Metadata = {
  title: 'Federal Premier League',
  description: '6-team internal organisation football tournament',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' }
    ],
    apple: '/apple-touch-icon-180x180.png',
  },
}
```

- [ ] **Step 2: Verify the file is correct**

Run: `grep -A 10 "export const metadata" app/layout.tsx`

Expected: Metadata object includes the icons configuration

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add favicon references to root layout

- SVG favicon for modern browsers
- PNG favicon-32x32 for browser tabs/bookmarks
- apple-touch-icon for iOS home screen
- favicon.ico fallback for older browsers"
```

---

## Task 6: Verify Favicons in Browser

**Files:**
- No files to modify

- [ ] **Step 1: Start the development server**

Run: `npm run dev`

Expected: Server starts successfully, favicon generation runs first

- [ ] **Step 2: Open in browser**

Navigate to: `http://localhost:3000`

- [ ] **Step 3: Verify favicon in browser tab**

Check the browser tab — you should see the lime green FPL favicon instead of the default Next.js icon.

- [ ] **Step 4: Inspect with DevTools**

Right-click → Inspect, go to the `<head>` section, verify these elements exist:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" sizes="32x32" type="image/png" href="/favicon-32x32.png">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png">
```

- [ ] **Step 5: Test on mobile (optional)**

If testing on iOS device, add to home screen — the apple-touch-icon should appear.

- [ ] **Step 6: Final verification and commit notes**

Favicons are now live! No additional commit needed — everything was committed in previous steps.

---

## Success Criteria

✅ SVG source file created and committed
✅ Sharp library installed
✅ Favicon generation script working
✅ PNG favicons generated (32×32, 180×180, .ico)
✅ Build scripts updated to auto-generate favicons
✅ Favicon links added to root layout
✅ Favicons visible in browser tabs
✅ Favicons appear in bookmarks/favorites
✅ Apple touch icon works on iOS

## Future Maintenance

If branding colors change:
1. Update hex colors in `public/favicon.svg` and `scripts/generate-favicons.js`
2. Run `npm run generate:favicons` to regenerate PNGs
3. Commit updated files

No changes needed to `app/layout.tsx` — it references the favicon files by path, which don't change.
