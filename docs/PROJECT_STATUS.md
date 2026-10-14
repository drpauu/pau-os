# PAU.OS — delivery status

Updated: 2026-10-14. Checkout: `/home/pau/Documents/pau-os`. This document supersedes the earlier reactor/Lab implementation status.

## Implemented phases

1. **Discovery:** existing project and clean Git state inspected; original CV found; six references and the four main product implementations reviewed; current six GitHub pins checked against the profile README; source structure reviewed for the four additional pinned repos. The medical repository's data/config values were not read or copied. Exact GitHub Toolbox fetched; shared Supabase resources audited read-only.
2. **Architecture:** existing Next.js static export retained, canonical content models and ordered routes implemented, rendering and professional HTML kept independent. All requested architecture/content/security documents maintained under `docs/`.
3. **Art direction:** original machined observatory, curved lighting gantry, suspended source-derived geographic plate, procedural metal/glass materials and local reflection lighting implemented.
4. **Complete experience:** Camí Curt → ATHRA → Alcoholfabet → TrackFlow across the home dock, Work, case studies and next links, followed by all four additional pinned repos in profile order. All eight projects can now be focused from the main observatory selector; the four additional pinned projects have clickable peripheral 3D studies around the flagship map. Eight responsive project cards/case studies, with original illustration covers for the four extra studies. Home, Work, Experience, About, Contact plus persistent Resume/CV. Standalone Lab removed; legacy project URLs retained. Conventional direct navigation remains available.
5. **Data:** CV-derived public professional model and separately generated sanitized one-page PDF; exact five-category/80-entry Toolbox with build-time sync and tested offline fallback; verified project snapshots. Optional Supabase adapter is validated but disabled by default; no shared production data changed.
6. **Motion/UX:** interruptible camera transitions, skip intro, source-map hover/selection, direct drag-to-orbit controls, reduced motion, native scrolling, mobile disclosure, keyboard controls, three quality tiers and WebGL/context-loss fallback. Mobile uses touch drag to orbit, a horizontally scrollable eight-project dock and large previous/next controls while preserving vertical page scrolling.
7. **Visual refinement:** actual browser renders reviewed; fixed white map overexposure, opaque ground rectangle, scene/text overlap, camera cropping, intersecting gantry and caption contrast. Added an original TrackFlow weekly-planning illustration in the project's editorial visual style; accessible text identifies it as an illustration rather than product UI. Instanced 24 board tiles and 21 planning blocks to reduce repeated draws. Responsive spacing and touch controls reviewed at 375px.
8. **QA:** production export, lint, TypeScript, 33 unit tests and 15 Chromium E2E tests pass. Automated axe WCAG A/AA checks passed across 14 canonical routes. Privacy/artifact and internal-link reviews passed. The full two-page public CV was regenerated from the canonical model shared with HTML Resume and visually checked. After adding all eight observatory exhibits, 390×844 touch emulation measured 60 FPS in Medium with 252 draw calls and 84,978 triangles on the local Intel Iris Xe host; auto chooses Medium on narrow screens. Low skips the initial 3D bundle. See PERFORMANCE.md for measurements and limits.
9. **Production preparation:** reproducible static `out/` artifact, source-only secrets boundary, metadata/sitemap/robots, existing owner-private Sites target retained. Updated owner-private deployment succeeded and all 14 live routes passed browser verification; receipt below.

## Test evidence

- `npm run lint`: pass.
- `npm run typecheck`: pass; now generates route types for clean checkouts.
- `npm test`: 33 tests passed across five files.
- `npm run build`: pass, all required static pages plus legacy aliases emitted; Toolbox live fetch verified exact source.
- `npm run test:e2e`: **15/15 passed** with all eight installations in the main observatory. Includes direct routes for all eight case studies, exact project order, next links, history, rapid camera changes, focused views for all eight, fallback, no-JavaScript content, touch drag-to-orbit and dock access through ESINMATH, TrackFlow image dimensions/alt text, geography, Toolbox exactness and keyboard controls.
- Axe checks: no violations for WCAG 2A/2AA/2.1AA on 14 canonical routes. This is automated coverage, not a complete human accessibility certification.
- Privacy review: original CV/private environments untracked and ignored; original private contacts absent from inspected source/export/PDF artifacts. Only the generated sanitized PDF is served. Source metadata retains no private contact values.
- Static artifact scan: no privileged-key/private-key patterns; original CV and Lab route absent. Exported internal links resolve.
- Dependencies: production audit has 0 vulnerabilities. Five development entries inherit the unresolved `braces` advisory; see SECURITY.md.
- `npm run db:test`: public read succeeds, exits **2** for known stale remote content/order. This is an explicit drift result, not a passing remote-mode check. No live mutation probes were used.

## Screenshot evidence

`docs/screenshots/observatory.png` (initial composition/full scene), `installation-camicurt.png`, `installation-athra.png`, `installation-alcoholfabet.png`, `installation-trackflow.png`, `installation-adhoc-medical-data-processing.png`, `installation-connect4-ai.png`, `installation-checkers-ai.png`, `installation-esinmath.png`, `orbit-drag-desktop.png`, `orbit-drag-mobile.png`, `work-pinned-projects.png`, `mobile-trackflow-card.png`, `mobile-home-interactive.png`, the four `case-*.png` pinned-project case studies, `work-camicurt.png`, `experience.png`, `about.png`, `resume.png`, `resume-mobile.png`, `cv-review/public-cv-1.png`, `cv-review/public-cv-2.png`, `desktop.png`, `desktop-large.png`, `tablet.png`, `mobile.png`, `mobile-work.png` and `fallback.png`. `before-desktop.png` preserves the previous composition. Preliminary development captures are supplemental and may show the Next development overlay; final production captures do not.

## Known limitations and remaining review

- **Public geographic redistribution:** source geometry is the game's exact historical 41-region map, traced to a 2014 GeoJSON-Mapas snapshot. Its upstream redistribution license is not established. Confirm terms or replace it with an explicitly licensed source before public release. Do not call it current official coverage or assume ICGC ownership from an old filename.
- **CV editorial review:** the complete generated public PDF and its HTML counterpart use one canonical model and were checked against the source CV. Private phone/email and client identities are omitted or anonymized. The original is unchanged.
- **Database isolation:** no new dedicated Supabase project was provisioned. The shared connection is read-only audited and untouched; old rows are intentionally not synchronized. Snapshot mode is complete and deployable. Optional remote publishing requires a suitable isolated environment and approved parity data.
- **Device coverage:** desktop Chromium and touch-emulated 375/390px views tested, not physical Safari/iOS/Android devices. No long GPU-memory soak or field Web Vitals dataset.
- **Live rendering performance:** the latest deployment rendered WebGL with three settled 60 FPS samples on the reported local Intel Iris Xe browser. This short owner-session sample does not establish stable performance across devices or longer sessions; quality controls and static fallback remain available.
- **Scope honesty:** illustrative exhibit curves/board/planning structures are not live application data. ATHRA remains a prototype; TrackFlow uses MongoDB. No production game sessions, health records, client records, contact-message endpoint or fabricated project metrics are published.
- **Pinned medical-data repository:** the public repo contains a tracked environment file with a credential-shaped Mongo connection value and bundled data files. Its PAU.OS case study uses only the public profile summary and source-tree metadata; the repository action is withheld. Review and sanitize the upstream GitHub repo before linking it from a publicly accessible portfolio. No credential value or medical data was read into the app or documentation.
- Current owner-only audience is for review, not an externally accessible recruitment URL. No sharing change, paid service or custom domain was requested/performed.

## Resume safely

Read this file and ARCHITECTURE.md. `npm run dev` serves port 3100. Run the documented checks after material changes; use the retained Sites project ID. Do not run seeds/migrations against the shared game database, upload the original CV, or reintroduce outdated project ordering. `scripts/capture-sources.mjs` now accepts only local previews and creates review candidates without replacing approved media/provenance.

## Verified deployment receipt

- Native Sites status: **succeeded**, 2026-10-14T13:16:22Z.
- URL: https://pau-os-laboratory.poeticcrow1.chatgpt.site
- Audience: **owner-only**, unchanged. No public sharing enabled.
- Deployed application/source commit: `a3626c0ade572f42be8c63a66cb857ad840a5c1c`.
- Deployment ID: `appgdep_6acf8095d60c8191ae3dd04b16b3dd37`; saved version 9.
- Live browser verification used the existing owner-authorized read token in memory. No read token was created or rotated. All 14 canonical routes returned 200 with expected headings and zero browser errors. The deployed home dock contains all eight projects in the required order. Desktop WebGL rendered; three settled High samples were 60 FPS. In isolated 375×812 touch emulation, Medium rendered at 60 FPS (252 draw calls, 84,978 triangles); there was no horizontal overflow, dragging orbited the camera, the dock focused ESINMATH, and the TrackFlow cover loaded at 1200px with descriptive alt text. `/resume/` returned the full-name heading and the downloadable PDF matched the local artifact byte for byte (65,039 bytes; SHA-256 `39cdbd1753e60a7d17ce505a781a7cf5ef5258d8136462d543951722fb9b0f06`). Evidence: `docs/live-verification.json`, `docs/screenshots/live-private.png`, `docs/screenshots/live-private-3d.png`, `docs/screenshots/live-private-resume.png`, `docs/screenshots/live-mobile-home.png` and `docs/screenshots/live-mobile-trackflow.png`.
- No shared Supabase resource was modified. The remaining local commit changes only the live verification record and screenshots; the published application matches the feature commit above.

The four new studies appear after the four primary projects; the medical repository link remains withheld pending upstream credential and data cleanup.

Owned development/benchmark servers were stopped after validation. Restart with `npm run dev`.
