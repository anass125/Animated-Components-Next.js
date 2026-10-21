# Animation Components Showcase — complete setup guide

## What is included
- Original user-provided Animated Shader Hero converted to JSX (with WebGL2 shader preserved)
- Original supplied hero demo converted to JSX
- Working fixed shared navigation with all six routes
- Six route pages, currently **placeholders** until source code is copied from earlier projects. The other original code was not available in this conversation. Do not mistake these placeholders for implementations.

## Step 1: Install prerequisites
Install Node.js current LTS (>=20.9), VS Code and optionally Git. Verify with `node --version` and `npm --version`.

## Step 2: Create a Next.js project
Run `npx create-next-app@latest animation-components-showcase`.
Choose JavaScript (NO TypeScript), ESLint, Tailwind yes, src/ no, App Router yes, alias @/*.
Or, if using this folder directly, run `npm install` and `npm run dev` after creating package.json from the provided snippet.

## Step 3: Add source files
Copy all contents of this download into the new project root, merging rather than replacing auto-generated tool configs. Keep the initial `package.json` from create-next-app unless using the standalone approach.

## Step 4: shadcn/ui
Run `npx shadcn@latest init`, choose the defaults for Tailwind v4 and CSS variables.
Note: shadcn init may update globals.css; merge its `@import "tailwindcss"` and variables with provided stylesheet.

## Step 5: npm dependencies
`npm install clsx tailwind-merge lucide-react three simplex-noise framer-motion @paper-design/shaders-react`
Install only what each copied original actually imports; the list above is an initial superset based on previous project summaries, not verified source requirements.

## Step 6: Copy original files
From earlier 21st.dev project: `components/ui/shader-animation.jsx`, `wave-background.jsx`, `kinetic-grid.jsx`, `vapour-text-effect.jsx`.
From your other projects: `liquid-shader.jsx` and `liquid-metal-hero.jsx`.
Preserve related shader GLSL, local CSS, helpers, assets, fonts, etc.
For source that is .tsx, first manually convert TypeScript types to JSX.

## Step 7: Wire route pages
Each `app/<route>/page.js` has a commented import and example JSX. Replace placeholder with the import and `<Component />`. If its original component requires props, pass those from its original demo file. Ensure browser-dependent code is in a `"use client"` component.

## Step 8: Original anime navbar
The included `components/navigation/site-navbar.jsx` is a **functional substitute**, not the exact earlier anime navbar. Once you copy your original `anime-navbar.jsx` and `anime-navbar-demo.jsx`, adapt it to use the `links` array and Next.js `Link` without modifying its animation logic. Keep SiteNavbar exported so app/layout.js needs no change.

## Step 9: Start and verify
`npm run dev`; open http://localhost:3000. Click all links. `npm run build` for build check.
If canvas obscures navbar, ensure nav z-index above animation; if errors mention `window is not defined`, move access into useEffect or client component. If import errors, check `@/*` alias and filename case.

## Route table
| URL | File | Original component |
|---|---|---|
| / | app/page.js | animated-shader-hero.jsx + animated-shader-hero-demo.jsx |
| /nebula | app/nebula/page.js | liquid-shader.jsx |
| /shader | app/shader/page.js | shader-animation.jsx |
| /waves | app/waves/page.js | wave-background.jsx |
| /kinetic | app/kinetic/page.js | kinetic-grid.jsx |
| /vapour | app/vapour/page.js | vapour-text-effect.jsx |
| /liquid-metal | app/liquid-metal/page.js | liquid-metal-hero.jsx |
