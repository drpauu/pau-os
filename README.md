# PAU.OS — The Engineering Observatory

Pau Alcázar’s portfolio: an original interactive 3D observatory around **Camí Curt**, followed by **ATHRA**, **Alcoholfabet** and **TrackFlow**, then four additional pinned GitHub projects. Professional information and case studies are independently rendered HTML; WebGL is optional.

## Local execution

Use Node 24 LTS and npm. Existing `.env.local` is optional for snapshot mode and should not be overwritten.

```sh
cd /home/pau/Documents/pau-os
npm ci
npm run dev
```

Open **http://127.0.0.1:3100**.

```sh
npm run sync:toolbox  # exact public GitHub Toolbox, with validated offline fallback
npm run typecheck
npm run lint
npm test
npm run build         # synchronizes Toolbox, then exports static pages to out/
npm run preview       # production export on http://localhost:3100
npm run test:e2e      # owns production preview on port 3101
```

For first-time browser setup: `npx playwright install chromium`. On CI use `PAU_SOFTWARE_GPU=1 npm run test:e2e`; its render speed is not representative of hardware. The local default uses ANGLE/OpenGL on the available GPU.

## Architecture

Next.js static export, React/TypeScript, Three.js / React Three Fiber / Drei, GSAP and a small Zustand interaction store. HTML is separate from the lazy-loaded scene. Native scrolling and shareable routes include the four additional pinned case studies at `/work/adhoc-medical-data-processing`, `/work/connect4-ai`, `/work/checkers-ai` and `/work/esinmath`, as well as the four main products and professional pages. Legacy `/projects` links are retained; there is no Lab page.

- `lib/professional.ts`: privacy-reviewed CV facts shared by About, Experience, Resume and the optional terminal.
- `lib/content.ts`: validated project facts, sources, links and explicit ordering.
- `assets/project-artwork/`: editable vector illustrations for the four additional pinned projects, regenerated to optimized WebP by `npm run images:pinned`.
- `data/toolbox.json` and `data/sources/github-profile-readme.md`: exact generated inventory and committed public source.
- `lib/geography.ts` / `data/catalunya-comarques.json`: original game map decoding, shared-boundary adjacency and local routing.
- `components/3d/`: independent scene, quality lifecycle, cancellation-safe cameras, four primary installations and four compact pinned-project studies around the central Camí Curt map.
- `features/camicurt/`: accessible isolated geographic explorer, available without WebGL.
- `lib/supabase/`: optional build-only published-content adapter with strict validation.

The Toolbox has no ratings or invented additions. Updates that change items/order require explicit review via the synchronization command; network failures use the validated committed snapshot. See [synchronization](docs/TOOLBOX_SYNC.md).

## Content and privacy

The original `Pau_Alcazar_CV.pdf` is private, ignored by Git and never copied into served assets. The curated public one-page PDF omits original private contact details and named clients. Its generator consumes only `lib/professional.ts`; review the derivative before a public launch. Source dates, titles, project maturity and screenshot limitations are documented in [content sources](docs/CONTENT_SOURCES.md).

Featured-product imagery shows actual applications. The observatory and four pinned-project covers are original illustrations. ATHRA curves contain no health data. Alcoholfabet's screenshot uses isolated menu fixtures so capture never creates production sessions. The pinned medical data repository contains a tracked environment file and bundled data; PAU.OS withholds its source link until a privacy and credential review.

## Supabase and deployment

`PAU_CONTENT_SOURCE=snapshot` is the default. No database request or credentials are needed for visitors or this build mode. The available Supabase connection is shared with an existing game; **this revision modifies no remote data**. Its old portfolio ordering differs from the new brief. `npm run db:test` is read-only and reports that drift; it is not a passing deployment check for remote mode. Prepared SQL is local only. See [database boundaries](docs/DATABASE.md).

Publish only `out/`, never the repository root. The existing Sites identity is retained with its owner-only audience. See [deployment](docs/DEPLOYMENT.md) and the current [status](docs/PROJECT_STATUS.md) for actual release and test results.

[Architecture](docs/ARCHITECTURE.md) · [Art direction](docs/ART_DIRECTION.md) · [Reference study](docs/REVERSE_ENGINEERING.md) · [Performance](docs/PERFORMANCE.md) · [Security](docs/SECURITY.md) · [Geographic provenance](docs/GEOGRAPHY.md).
