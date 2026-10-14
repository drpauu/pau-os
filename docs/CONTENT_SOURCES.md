# Content sources

Reviewed 2026-10-14. Career information, the Toolbox and project facts deliberately have different authorities.

## Professional information

The owner-supplied root `Pau_Alcazar_CV.pdf` is the canonical CV. It is a two-page document with no explicit version date. It was extracted privately with `pdftotext`; extraction files are outside the repository. SHA-256: `07af49c0bf51e57e743a24b2aa4dd4c5d88baa2e6d7bb960b387a1663cfb522f`.

The pre-existing `public/pau-alcazar-resume.pdf` was a generated, incomplete summary. It was inspected, not treated as a second authoritative CV. The owner-provided original supersedes it based on provenance and content, not filesystem timestamps.

`lib/professional.ts` contains the public transcription and section-level provenance. About, Experience and the HTML resume use that model. The public PDF is generated from it by `node scripts/generate-public-resume.mjs` and was visually inspected as a one-page A4 document. Its extracted text was checked for original private contacts and for the expected positions and dates. The source PDF is ignored by Git and never copied to `public/`.

Verified CV facts include Data & AI Engineer positioning; Accenture, Data & AI Analyst (AI Decision Science), Jun 2023–Present; Superprof, Technology Subjects Tutor, Sep 2021–Present; UPC–EPSEVG, Bachelor of Science in Computer Engineering, 2020–2024; Catalan, Spanish and English without inferred levels. Responsibilities are concise paraphrases of page 1. No certifications or quantified professional outcomes were added.

Private contacts, client identities, client-specific projects and implementation details from the CV are omitted. Unverified prior sport claims were removed. Cybersecurity appears only as a degree study topic, as documented; it is not presented as professional cybersecurity employment. Owner editorial review of the sanitized PDF is recommended before deployment; no deployment is implied by its generation.

## Toolbox

[GitHub profile README](https://github.com/drpauu/drpauu/blob/main/README.md), `## Toolbox`, is the sole inventory source. See `docs/TOOLBOX_SYNC.md`. The CV's technical skills are not merged into that list. Project technology labels describe verified implementations rather than rewriting the personal Toolbox.

## Featured projects, in editorial order

| Order | Source | Reviewed implementation |
| --- | --- | --- |
| 1. Camí Curt | [Public repository at 612657b](https://github.com/drpauu/camicurt.cat/tree/612657b49898c7df3136dd922ae4753782c6770c), [live game](https://camicurt.cat), existing local checkout at 98c7005 | Public README, `src/lib/pathfinding.js`, `src/lib/geography.js`; local TopoJSON/geographic data, worker, React interface. Dijkstra enumerates optimal paths; A* checks length consistency; a worker builds cached routes. Daily, normal, timed and exploration modes. Shared daily calendar through Supabase with a local fallback. |
| 2. ATHRA | [Repository at c755f20](https://github.com/drpauu/athra/tree/c755f2041290f7e56220f9a807feb098aa46ec41) | `server.ts`, FIT importer, recovery engine, API router and repository implementation. Garmin FIT SDK parsing; deterministic recovery/load calculations; React views. Server constructs an in-memory repository with shipped sample records and uses a default user ID. |
| 3. Alcoholfabet | [Repository at d184832](https://github.com/drpauu/Alcoholfabet/tree/d18483234a47567f8827f8c2fbd099549398aead), [live site](https://alcoholfabet.cat) | Existing `tecla-pau-app` checkout has the exact same commit as the public Alcoholfabet head despite its old remote name. React/TypeScript, SVG board, reference game rules, session reducer, private Realtime channel and Supabase repository reviewed. SQL game-write functions verify state versions and idempotency; role-aware views restrict answer visibility. |
| 4. TrackFlow | [Repository at 1b730d6](https://github.com/drpauu/TrackFlow/tree/1b730d68d52a4d7da56587ab79fc1b8a84279f53) | README, React/Vite frontend, Express API, MongoDB provider, projections and incremental synchronization. `tf_*` compatibility cache projects into canonical collections, scoped by `coachId`. The source documents Vercel static/serverless deployment. |

### Scope and unresolved conflicts

- Camí Curt’s public head is newer than the initial local checkout. Current public pathfinding and README were retrieved separately, without modifying the original repository. The game dataset has 41 geometries. Its own README marks validation against the current official administrative map as pending. PAU.OS does not claim current administrative completeness. It does not independently repeat the CV's route-rule count.
- ATHRA is presented as a development prototype. No durable persistence, production authentication, live wearable connection or clinical validation is claimed. A checked-in SQL schema is not evidence of an active PostgreSQL deployment. Optional AI coaching code exists, but its remote provider was not invoked or presented as a verified live integration.
- Alcoholfabet supports public in-person entry and private-code online roles in source. Verification did not create a game, authenticate against production, read player data or rerun its production-writing E2E tests. The board installation is an illustration, not a live session.
- TrackFlow uses **MongoDB**, not Supabase. Its documented authentication limitations mean PAU.OS does not describe the application as security-hardened or ready for public deployment. The previously advertised deployment was unavailable during the earlier capture, so no live button is offered.

## Other public repositories

The public GitHub API inventory was inspected without opening medical/client data repositories. Root structures were checked for Checkers-AI, Route-calculating-interactive-algorithm and Quicksight-Custom-Visual. A deeper follow-up reviewed Connect4-AI's Java minimax/alpha-beta player at `2b1bb25` and EsinMath's C++ expression, rational-arithmetic and session modules at `0d8c6e3`.

Both are technically substantive coursework. Neither received a fresh build/runtime test, and individual contribution scope and third-party teaching-library rights were not established. They were therefore not added as extra product case studies or described as sole-authored production software. The four required products already provide a focused selection. File-level evidence and exact commits are in [REVERSE_ENGINEERING.md](./REVERSE_ENGINEERING.md).

## Media

Existing Camí Curt, ATHRA and TrackFlow captures were retained with their source metadata. ATHRA shows its repository's sample athlete; TrackFlow is an unauthenticated entry view. Alcoholfabet's authentic public interface was captured using **isolated menu-only responses**: all Supabase requests were fulfilled or aborted locally, with a fictional anonymous session and empty score. No production request reached auth or game endpoints. `scripts/capture-alcoholfabet.mjs` makes this repeatable. No screenshot implies unimplemented functionality.

Raw evidence: `docs/*-source.png`; optimized media: `public/images/*.webp`; details: `docs/screenshots-provenance.json`. The original procedural PAU.OS scene and source-derived geographical installation are separate from these application screenshots.
