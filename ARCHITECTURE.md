# Architecture

## Decisions

Next.js 16 / React 19 / strict TypeScript, with static export. Each professional route becomes readable and indexable HTML. Three.js/R3F, Drei, GSAP and Zustand are confined to the interaction layer; the heavy scene is dynamically loaded after content. Supabase is a published-content source at build time, not a runtime dependency for visitors.

CSS is a small, original token system rather than Tailwind: the visual language needs a few coordinated surfaces, not a large utility framework. No physics engine is installed: constrained station cameras give deterministic navigation without collision simulation or WASD. No model downloads, external HDRI, texture CDN or protected reference assets are used.

## Boundaries

- `app/`: server-rendered pages, metadata, sitemap, robots and shared layout.
- `lib/content.ts`: verified profile/project schema and offline content snapshot.
- `lib/supabase/content.ts`: public read API, timeout, validation and deployment failure behavior.
- `components/3d/Laboratory.tsx`: scene geometry, original GLSL material, cameras, rendering lifecycle and capability checks.
- `stores/laboratory.ts`: user-selected station, quality, terminal and theme; no mutable geometry or per-frame React updates.
- `features/laboratory/`: entry composition and dual navigation.
- `features/terminal/`: pure allowlisted parser and native modal dialog.
- `features/lab/`: pure shortest-path implementation plus accessible SVG visualization.
- `supabase/`: isolated migration and idempotent seed.
- `tests/`: meaningful parser, algorithm, validation and browser checks.

## Data flow

Supabase Studio → `portfolio_projects` with RLS → publishable-key SELECT during build → Zod validation → static project routes and listing. Project links use HTTPS and local cover-image paths are constrained. React escapes content. No service key, arbitrary HTML or user-supplied scripts enter the frontend.

When no backend is configured, the application builds using the bundled reviewed snapshot. When a configured backend fails, the build must fail instead of exposing stale publication decisions. Existing deployed HTML remains a snapshot until replaced; unpublishing in Studio alone does not retract a previous static deployment.

## Rendering and interaction

R3F owns one Canvas. Procedural geometry creates the circular platform, structural ribs, equipment rack, console stations, three orbiting reactor rings and scan/Fresnel shader. Shared rounded-box geometry and instanced calibration ticks reduce allocation. A generated image of this same scene provides the static fallback.

GSAP moves a camera target and look-at point. The frame loop interpolates camera position and provides a small pointer response. HTML station labels are projected with the active camera, without nested React roots. Shared DOM navigation and station links remain available independently. No information exists only inside the Canvas.

The loop pauses when the canvas is off screen or the tab is hidden. Reduced motion uses demand rendering. Context loss or missing WebGL2 selects the static presentation. Auto quality samples actual frame time and degrades after sustained slow frames; a manual tier is respected. Quality is the only preference saved locally. Ambient oscillators start after an explicit button click and stop on unmount.

## Safe contact and administration

Contact uses verified LinkedIn/GitHub destinations. There is no message collection endpoint, so no unaudited mail handler, rate limiter or message database is shipped. Editorial work uses owner-controlled Supabase Studio. `portfolio_experience` and `portfolio_content` are optional future CMS resources, not falsely advertised as a complete inline editor.
