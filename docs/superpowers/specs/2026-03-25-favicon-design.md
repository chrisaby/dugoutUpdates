# Favicon Design Specification

**Date:** 2026-03-25
**Status:** Approved

## Overview

Create favicons for the Federal Premier League website using the FPL branding established in the navbar. The favicons will appear in browser tabs, bookmarks, and mobile home screens.

## Design Approach

**SVG-based with PNG export:** Create a source SVG file that defines the favicon design, then use a build script to convert it to required PNG formats. This approach provides:

- Scalability: The same SVG scales perfectly to any size
- Maintainability: Branding changes can be made in one SVG file
- Consistency: Matches the navbar logo styling exactly
- Automation: Regenerate PNG files if branding changes

## Visual Design

### Design Elements

- **Shape:** Square with rounded corners (12px radius at 100px scale)
- **Background Color:** Lime green (#bef043)
- **Text:** "FPL"
- **Font:** Bebas Neue (400 weight, matching the display font from globals.css)
- **Text Color:** Dark (#050c05)
- **Letter Spacing:** 1px at 100px scale

### SVG Structure

```xml
<svg viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="#bef043"/>
  <text x="50" y="55"
        font-family="'Bebas Neue', Arial, sans-serif"
        font-size="50"
        font-weight="400"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#050c05"
        letter-spacing="1">FPL</text>
</svg>
```

The viewBox="0 0 100 100" provides a clean 1:1 aspect ratio that scales perfectly when rendering at different sizes.

## Technical Specifications

### Required Files

1. **Source file:** `public/favicon.svg`
   - SVG vector format
   - Serves as the single source of truth
   - Can be used directly on modern browsers

2. **Generated files:**
   - `public/favicon-32x32.png` — Browser tab icon
   - `public/apple-touch-icon-180x180.png` — iOS home screen bookmark
   - `public/favicon.ico` — Fallback for older browsers (can be generated from 32x32)

### File Locations

All favicon files go in the `public/` directory to be served by Next.js.

### HTML References

In `app/layout.tsx`, add the following to the `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
<link rel="icon" href="/favicon.ico" />
```

## Implementation Approach

1. **Create SVG source** — Write the favicon.svg file with the design
2. **Build script** — Create a Node.js script using `sharp` library to:
   - Convert SVG to PNG at 32×32 resolution
   - Convert SVG to PNG at 180×180 resolution
   - Generate favicon.ico from the 32×32 PNG
3. **Integrate into build** — Run the favicon generation script as part of the Next.js build
4. **Update HTML** — Add favicon references to the root layout
5. **Test** — Verify favicons appear in browser tabs, bookmarks, and DevTools

## Color Reference

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Lime Green | #bef043 |
| Text | Dark | #050c05 |

These colors match the existing `--primary` and text colors in `app/globals.css`.

## Success Criteria

- ✅ Favicon appears in browser tab
- ✅ Favicon appears in bookmarks/favorites
- ✅ Apple touch icon displays correctly on iOS home screen
- ✅ Design is consistent with navbar logo styling
- ✅ SVG and PNG files are optimized (minimal file size)
