# Public content and asset provenance

Audited 2026-10-14. This replaces the prior provenance assumptions with the owner-supplied CV and verified project commits. Detailed evidence and qualifications are in `CONTENT_SOURCES.md`.

| Public content | Authority / evidence | Publication boundary |
| --- | --- | --- |
| Name, professional positioning and location | Owner-supplied `Pau_Alcazar_CV.pdf`, page 1 | Public model uses Pau Alcázar, Data & AI Engineer, Barcelona, Spain. |
| Accenture role, dates and responsibilities | CV page 1, Professional Experience | Exact title and dates; responsibilities paraphrased without named clients. |
| Superprof role and dates | CV page 1, Professional Experience | No invented teaching metrics. |
| UPC–EPSEVG degree and dates | CV page 1, Education | Degree title preserved; cybersecurity is a study topic only. |
| Languages | CV page 1, Languages | No proficiency levels or certification claims inferred. |
| GitHub and LinkedIn | Existing public GitHub profile README | Public professional links only. |
| Toolbox | Public GitHub README `## Toolbox` | Exact categories, wording and order; no expertise rankings. |
| Camí Curt implementation | Public commit 612657b plus source geography and worker | Game data, not a claim of current official administrative completeness. |
| ATHRA implementation | Commit c755f20; importer, analytics engine, in-memory repository, API | Development prototype; no production wearable or clinical claims. |
| Alcoholfabet implementation | Public commit d184832, matching local checkout | Source-verified game state, role-aware views and private channels; no production sessions touched. |
| TrackFlow implementation | Commit 1b730d6, frontend and MongoDB API | MongoDB architecture; no incorrect Supabase attribution. |
| Camí Curt image | Existing public-page browser capture | No sign-in or private data. |
| ATHRA image | Existing local application browser capture | Shipped sample data; interface currently calls itself KINETICOS. |
| Alcoholfabet image | Public interface with local menu fixture | Empty score and fictional auth fixture; backend fully intercepted. |
| TrackFlow image | Existing local unauthenticated frontend | No athlete data or login credentials used. |
| Public CV PDF | Generated from `lib/professional.ts` with `scripts/generate-public-resume.mjs` | Private contacts and client-specific detail excluded; one-page output visually reviewed. Owner editorial review recommended before deployment. |

No original CV bytes, personal contact details, private application rows, health records, online player codes or privileged credentials were copied into published assets. Source CV remains ignored. The generator reads the curated TypeScript model and never reads or copies the PDF. `docs/public-cv-review.json` records the source hash and review boundary without sensitive values.
