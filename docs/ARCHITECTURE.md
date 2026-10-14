# PAU.OS architecture

## Product boundaries

PAU.OS retains its existing TypeScript, Next.js App Router and React architecture. Next statically exports every professional/project page; Three.js is a progressive enhancement loaded only by the homepage. There is no server required for the deployed site, no production game-session connection, and no dependency on WebGL for reading content.

| Boundary             | Implementation                                                  | Responsibility                                                                                  |
| -------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Pages and metadata   | `app/`                                                          | Shareable routes, semantic HTML, canonical URLs, sitemap and robots                             |
| Navigation           | `components/Shell.tsx`                                          | Home, Work, Experience, About, Contact; persistent Resume/CV; mobile disclosure and route focus |
| Project content      | `lib/content.ts`                                                | Zod schema, verified project facts and explicit editorial order                                 |
| Professional content | `lib/professional.ts`                                           | Privacy-reviewed CV transcription with document hash and per-entry provenance                   |
| Content publishing   | `lib/supabase/`                                                 | Reviewed snapshot by default; explicit, server-only Supabase publishing mirror                  |
| Toolbox              | `scripts/toolbox.mjs`, `data/toolbox.json`, `features/toolbox/` | Exact GitHub synchronization and accessible category explorer                                   |
| Geography            | `data/catalunya-comarques.json`, `lib/geography.ts`             | Verified map, shared-arc adjacency and isolated shortest-hop routes                             |
| Scene                | `components/3d/Laboratory.tsx`, `components/3d/scenes/`         | Rendering, camera, observatory, eight selectable project installations and automatic quality    |
| Scene UI/state       | `features/laboratory/Hero.tsx`, `stores/laboratory.ts`          | Immediate HTML controls, selected installation, orbit and intro state                          |

## Routes and ordering

The canonical routes are `/`, `/work/`, the four featured product studies (`camicurt`, `athra`, `alcoholfabet`, `trackflow`), and the four current pinned GitHub studies (`adhoc-medical-data-processing`, `connect4-ai`, `checkers-ai`, `esinmath`) under `/work/`, plus `/experience/`, `/about/`, `/contact/` and `/resume/`. There is no Lab route or top-level Toolbox section. Legacy `/projects/` URLs remain compatible; the old `cami-curt` alias resolves to the canonical case study and metadata points at `/work/camicurt/`.

Camí Curt → ATHRA → Alcoholfabet → TrackFlow is a content invariant, enforced by published-content validation and tests. The four current pinned projects follow in their GitHub profile order. All eight entries drive the observatory selector, homepage and Work list, direct case-study routes, continuation links and generated local SQL seed. The first four are the large primary installations; the remaining four are compact, clickable studies around the central map. Project navigation uses ordinary Next links and browser history. Camera focus selects an installation without delaying navigation or changing the current page.

## Rendering and camera

`Hero` renders immediate identity, links, project selectors and a static poster while the WebGL renderer loads dynamically with `ssr: false`. Quality is always automatic: viewport and hardware concurrency select the initial tier, sustained slow frames lower it, and unsupported/lost WebGL falls back to the static observatory. No quality preference or selector is exposed; ordinary navigation remains available.

`CameraRig` is the single owner of camera destination/look targets. GSAP interpolates its target values; a frame loop follows them smoothly. Effect cleanup kills both tweens when the destination changes, so rapid station selections redirect the current animation. Reduced-motion mode uses immediate target changes and no pointer parallax. Aspect ratio scales camera framing; mobile CSS supplies a separate composition.

Camí Curt occupies the central suspended installation. Actual TopoJSON regions are extruded into independent meshes; hover/selection names and shortest-hop route feedback come from the same map model as the accessible SVG explorer. The dataset has 41 regions and 95 undirected adjacency edges, reflecting the repository's dataset rather than an invented contemporary boundary set. The illustrated route is isolated and explicitly simpler than the live game's complete rule system. See `docs/GEOGRAPHY.md`.

ATHRA's performance instrument, Alcoholfabet's board and TrackFlow's planning structure are original illustrative installations. They are not live dashboards or screenshots of unavailable product features. Authentic project screenshots and verified scope statements belong to the HTML case studies.

## Quality and lifecycle

High quality uses shadows, capped device pixel ratio, local environment lightformers and restrained bloom. Medium reduces pixel ratio and removes shadows/postprocessing. Low is the static observatory. Auto starts conservatively on smaller/fewer-core devices and degrades after repeated slow frame samples. The selected tier is runtime-only and automatic.

Intersection/document visibility stop the frame loop when the scene is out of view. Reduced motion uses demand rendering. GPU counters and sample FPS are exposed as canvas data attributes for measurement; reported numbers belong in `docs/PERFORMANCE.md`, not inferred from renderer settings.

## Content trust and data flow

- CV → `lib/professional.ts` → About, Experience, HTML Resume and generated sanitized PDF. Original source CV stays private and ignored.
- Public GitHub README → strict build-time parser → committed source/hash/data → About Toolbox. Outages use the validated snapshot; unexpected source drift is explicit.
- Verified project repositories → `lib/content.ts` → schema validation → static case studies. Assertions about implementation and limitations remain distinct.
- Optional Supabase mirror → publishable SELECT → schema/order/snapshot parity → static build. No automatic database writes, personal app records or draft content enter this flow.

The static export is the publication boundary. Retiring content requires rebuilding and redeploying the artifact. Contact links use public professional channels; the site does not collect visitor messages or create app accounts.

## Assets and verification

`public/images/` contains optimized real application screenshots and an observatory poster captured from the actual local renderer. `scripts/generate-assets.mjs` refreshes the poster/Open Graph image. `scripts/generate-public-resume.mjs` creates the public PDF from curated fields without copying the original document.

Vitest covers graph correctness, project order/publication, source provenance, Toolbox exactness/outage behavior, safe image/link schemas and terminal allowlists. Playwright covers the exported site's navigation, responsive behavior, accessibility and render fallback. Final test/build/performance and deployment evidence is maintained in `docs/PROJECT_STATUS.md` and `docs/PERFORMANCE.md`.
