# PAU.OS status

Updated: 2026-10-14. Workspace: `/home/pau/Documents/pau-os`.

## Delivered implementation

- [x] Audit of local environment, owner content and six independent references; commits/licenses recorded.
- [x] Next.js/TypeScript static architecture, per-route SEO, sitemap/robots, Open Graph, local fonts and favicon.
- [x] Original procedural 3D laboratory: central reactor/shader, machined platform, lit structures, consoles, data/routing motifs and server rack.
- [x] ATHRA, TrackFlow, Camí Curt, engineering experiment and identity destinations; camera transitions plus always-available conventional links.
- [x] HIGH/MEDIUM/LOW/AUTO, reduced motion, actual FPS adaptation, offscreen suspension and WebGL/context-loss fallback.
- [x] Verified editorial case studies and actual application captures. TrackFlow’s broken old deployment is not linked as a live demo.
- [x] About/toolbox, one-page downloadable PDF resume, verified external contact links.
- [x] Terminal allowlist, completion, history, safe internal navigation, themes, live renderer diagnostics, keyboard focus restoration.
- [x] Working Dijkstra experiment with tested optimal paths, connected to the real Camí Curt case study.
- [x] Supabase `portfolio_projects` seeded and used at build time. Isolated RLS-protected optional experience/content tables; owner edits through Studio.
- [x] Public client SELECT works; INSERT/UPDATE denied; anonymous/authenticated draft visibility verified with rollback-only probes.
- [x] Production export, type checking, lint, 11 unit tests and 11 Chromium E2E tests passed on the final application code. Database permissions and production dependency audit also passed.
- [x] Automated WCAG A/AA checks passed on Home, ATHRA, About, Lab, Resume and Contact; manual screenshot review at 1920/1440/768/390px.
- [x] Measured production HIGH/MEDIUM at 60 FPS on the local Intel Iris Xe. No cross-device performance claim.
- [ ] Final source packaging and private Sites publication in progress.

## Current limitations / deliberately absent features

- The current Sites audience is owner-only. A private deployment is for review, not yet a public recruitment URL.
- CMS edits require rebuild/redeploy; no inline admin is claimed. `portfolio_experience` and `portfolio_content` are prepared optional tables, not wired as an editable professional biography.
- No fabricated dates/metrics or private details in the resume. Owner can extend the factual profile later.
- No contact form: LinkedIn/GitHub provide real communication paths without an unprotected message endpoint.
- No first-person physics/free-roam controls; constrained stations offer predictable, accessible exploration.
- No real-device Safari/iOS/Android coverage or long-duration GPU memory soak yet.
- One unpatched advisory remains in the ESLint development dependency chain; runtime audit is clean. See `docs/SECURITY.md`.
- Reference repositories and owner applications are preserved. No GitHub repository push, force-push, application deployment or security configuration changes were made.

## Continue

1. Read this status and the architecture/database docs.
2. `npm run dev` → http://127.0.0.1:3100.
3. After content changes: typecheck/lint/test/build; run relevant browser tests.
4. Use the existing Site identity in `.openai/hosting.json`; never register a duplicate Site.
5. Publish through Sites’ source helper, or publish `out/` to a static host with the documented environment.
