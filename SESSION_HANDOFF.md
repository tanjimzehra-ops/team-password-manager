# Session Handoff: Jigsaw 1.6 RSA Demo

**Date:** 2026-01-21
**Repository:** https://github.com/nicopt-io/Jigsaw-1.6-RSA
**Local Path:** `/Users/nicolaspt/Jigsaw-1.6-RSA`

---

## What Was Completed

1. **Clean repository created** from Jigsaw 1.6 source
   - Removed internal docs (sessions/, pm/, agents/, etc.)
   - Kept only essential frontend source (~136 files, ~670KB)

2. **Configured for pnpm + Vercel**
   - Added `packageManager: "pnpm@9.15.0"` to package.json
   - Created vercel.json with pnpm build commands
   - Build tested successfully

3. **Demo mode enabled**
   - Uses JSON fallback data (no database needed)
   - 7 demo systems available: MERA, Kiraa, Levur, CPF, Councils

4. **Pushed to GitHub**
   - Repository: nicopt-io/Jigsaw-1.6-RSA
   - Branch: main

---

## Next Steps: Deployment Testing

### 1. Deploy to Vercel

```
1. Go to https://vercel.com
2. Sign in with GitHub (nicopt-io)
3. Add New > Project
4. Import "Jigsaw-1.6-RSA"
5. Click "Deploy" (no config changes needed)
6. Wait ~2 minutes
7. Get deployment URL
```

### 2. Verification Checklist

After deployment, test these:

- [ ] Homepage loads with system selector sidebar
- [ ] Can select different systems (MERA, Kiraa, etc.)
- [ ] **Logic Model view** displays correctly with all rows
- [ ] **Contribution Map** matrix shows Outcomes x Value Chain
- [ ] **Development Pathways** matrix shows Resources x Value Chain
- [ ] **Convergence Map** matrix shows Value Chain x External Factors
- [ ] **Agents Canvas** loads and displays nodes
- [ ] Theme toggle (dark/light) works
- [ ] Edit mode buttons appear (View/Edit/Colour/Order/Delete)
- [ ] No console errors in browser DevTools

### 3. Known Behaviors

- "Missing Supabase environment variables" message is **expected** (app uses JSON data)
- First load may take a moment (Next.js cold start on Vercel)

---

## Local Development

```bash
cd ~/Jigsaw-1.6-RSA
pnpm dev
# Opens at http://localhost:3000
```

---

## Technical Details

| Aspect | Value |
|--------|-------|
| Framework | Next.js 16.0.10 |
| React | 19.2.0 |
| Package Manager | pnpm 9.15.0 |
| UI Library | shadcn/ui + Radix |
| Styling | Tailwind CSS 4.1.9 |
| Data Mode | JSON fallback (demo) |
| Supabase | Disabled for demo |

---

## Files Structure

```
Jigsaw-1.6-RSA/
├── app/               # Next.js App Router (2 files)
├── components/        # UI components (112 files)
│   ├── ui/            # shadcn/ui primitives
│   ├── agents-canvas/ # Flow visualization
│   └── layout/        # Nav, footer
├── hooks/             # React hooks (12 files)
├── lib/               # Utilities (7 files)
├── data/              # JSON demo data (10 files)
├── public/            # Static assets
├── vercel.json        # Vercel config
└── package.json       # Dependencies
```

---

## Troubleshooting

### Build fails on Vercel
- Check that pnpm is being used (vercel.json should have pnpm commands)
- Verify packageManager field in package.json

### App shows blank page
- Check browser console for errors
- Verify all files were pushed to GitHub

### Canvas not working
- @xyflow/react requires pnpm (not npm)
- Ensure Vercel is using pnpm install

### Module not found: @swc/helpers or scheduler (RESOLVED)
**Problem:** After switching from npm to pnpm, the app failed with:
```
Module not found: Can't resolve '@swc/helpers/_/_interop_require_default'
Module not found: Can't resolve 'scheduler'
```

**Root cause:** pnpm's lockfile had broken dependency resolution - packages existed in `.pnpm/` store but weren't properly hoisted.

**Solution applied (2026-01-21):**
1. Copied working `pnpm-lock.yaml` from `~/Jigsaw_2.0_dev/jigsaw-1.6/frontend/`
2. Deleted `node_modules/`
3. Ran `pnpm install`

**If issue recurs:**
```bash
cd ~/Jigsaw-1.6-RSA
rm -rf node_modules pnpm-lock.yaml
cp ~/Jigsaw_2.0_dev/jigsaw-1.6/frontend/pnpm-lock.yaml .
pnpm install
```

---

## Contact

Repository owner: nicopt-io
Session completed by: Claude Opus 4.5

---

## Session Log

### 2026-01-21 - Dependency Resolution Fix
- **Issue:** `@swc/helpers` and `scheduler` module resolution errors after npm→pnpm switch
- **Resolution:** Replaced lockfile with working version from source project
- **Status:** App now starts successfully with `pnpm dev`
