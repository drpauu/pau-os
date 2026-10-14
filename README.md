# PAU.OS

**Pau Alcázar’s Interactive Engineering Laboratory.** An original procedural 3D portfolio, backed by real project case studies and accessible, independently rendered HTML.

## Run locally

Node **24 LTS**, npm and a WebGL2-capable browser are recommended. WebGL is optional for reading the portfolio.

```sh
npm ci
cp .env.example .env.local # skip when your configured .env.local already exists
npm run dev
```

Open **http://127.0.0.1:3100**. The existing local environment is configured for the portfolio content tables. Do not overwrite it just to run the application.

## Commands

```sh
npm run typecheck
npm run lint
npm test
npm run build         # static Next.js export → out/
npm run preview       # serves the production export on port 3100
npx playwright install chromium
npm run test:e2e      # starts its own static preview on 3101
npm run db:test       # read + denied-write verification; needs .env.local
node scripts/export-seed.mjs # prepares SQL, performs no remote changes
```

The Playwright configuration uses the local Intel GPU through ANGLE/OpenGL. On a headless CI host, remove the custom `launchOptions` or use SwiftShader; capture LOW mode for content tests. Software-renderer FPS is not representative of hardware performance.

## Environment

| Variable                               | Purpose                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical origin, Open Graph, sitemap. Set to the actual deployment origin. |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase API origin; optional.                                              |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key only; never a secret/service-role key.                      |

No authentication, payment, mail or analytics credentials are required. If Supabase is not configured, the reviewed local content snapshot is used. Configured backend failures fail the production build (so unpublished content cannot accidentally be republished from an old snapshot).

## Content management

The active integration reads **published `portfolio_projects`** through the public Supabase API **at build time**. Edit content in Supabase Studio, run `npm run build` and deploy `out/`. Updating a project does not require changing components. New slugs need a new build to generate their routes. Images must be added to `public/images/`; `cover_image` accepts local `.webp`, `.png` or `.jpg` files. JSON content is validated with Zod and rendered as plain text, never raw HTML.

`portfolio_experience` and `portfolio_content` are isolated optional expansion tables; the initial professional biography and resume use the verified snapshot in `lib/content.ts`. There is no public admin interface. Studio access is controlled by Supabase project membership. Application users, including signed-in users, cannot write portfolio tables.

Migrations: `supabase/migrations/20261014073010_pau_os_content.sql`. Seed: `supabase/seed.sql` (preserves existing edits). Apply only to the intended project. See [database documentation](docs/DATABASE.md).

## Experience

- Original machined platform, reactor shader, articulated rings, architectural lighting, project stations and camera transitions.
- Direct routes for projects, about, lab, resume and contact; all core content works without WebGL or JavaScript.
- HIGH, MEDIUM, LOW/static and automatic quality; reduced-motion support; optional synthesized ambient audio, off by default.
- Keyboard-accessible terminal (`Ctrl/⌘ K`), command history, completion and a deliberately bounded command interpreter.
- Interactive, tested Dijkstra experiment; downloadable one-page PDF resume.
- Actual ATHRA and TrackFlow local screenshots; actual public Camí Curt screenshot. Captions identify demonstration data.

## Deployment

This is an ordinary static export; no persistent Next.js server is needed.

```sh
npm ci
npm run build
# Publish the contents of out/ using your static host.
```

On Vercel: framework Next.js, build `npm run build`, output `out`, Node 24. On Cloudflare Pages: build `npm run build`, output `out`, set Node version 24. Set the three variables above before building. No SSR, cron, edge functions or new paid services are required. A rebuild is necessary after CMS changes; do not promise realtime updates.

For Sites, `.openai/hosting.json` declares the existing Site ID and `out` directory. Use the Sites source workflow to package the verified build and publish it. Source credentials are short-lived and must never be written to the checkout.

## Further documentation

[Architecture](ARCHITECTURE.md) · [Reference study](REVERSE_ENGINEERING.md) · [Design system](DESIGN_SYSTEM.md) · [Performance](PERFORMANCE.md) · [Status](PROJECT_STATUS.md) · [Content evidence](docs/CONTENT_PROVENANCE.md).
