# Reference engineering study

Source audit updated 2026-10-14. The six independent local checkouts in `../pau-os-references/` were inspected read-only. This document records source observations and PAU.OS decisions; it does not claim that the reference applications were run, benchmarked or exhaustively audited. No reference repository was overwritten.

## Inspected versions and licenses

| Reference                                                                                                                       | Pinned commit                              | License evidence                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| [Bruno Simon folio-2025](https://github.com/brunosimon/folio-2025/tree/41046b57eeed8d156d9c3fd7fa259900baef7816)                | `41046b57eeed8d156d9c3fd7fa259900baef7816` | `license.md`: MIT, Bruno Simon, 2025. `package.json` says ISC; the explicit license document is the source used for this audit. |
| [Vairuh Mac_OS](https://github.com/Vairuh/Mac_OS/tree/7273681ecbba9ec203428f09dbbf481abb152351)                                 | `7273681ecbba9ec203428f09dbbf481abb152351` | No license file found in this checkout. Inspection only; no copied source or assets.                                            |
| [trevsm 3D-Portfolio](https://github.com/trevsm/3D-Portfolio/tree/690c184f6b1db012152676a7207703d7de1a5df3)                     | `690c184f6b1db012152676a7207703d7de1a5df3` | `LICENSE`: MIT, Trevor Smith, 2022. Package metadata says ISC; explicit license text was inspected.                             |
| [Txemalon 3d-portfolio](https://github.com/Txemalon/3d-portfolio/tree/52cfcb8f8e1c192d9dc44edb3cb70feae79d49d7)                 | `52cfcb8f8e1c192d9dc44edb3cb70feae79d49d7` | `LICENSE`: MIT, Jose Maria Albero Belamendia, 2026.                                                                             |
| [ITomPoland portfolio-itom](https://github.com/ITomPoland/portfolio-itom/tree/3e82d28097eba435a47ac46f9988334379a5ac79)         | `3e82d28097eba435a47ac46f9988334379a5ac79` | `LICENSE`: MIT, Tomasz Szmajda, 2026.                                                                                           |
| [nothingnothings r3f-portfolio](https://github.com/nothingnothings/r3f-portfolio/tree/cbb19ac9cd70f7909273eb0d9795cf96ce953b98) | `cbb19ac9cd70f7909273eb0d9795cf96ce953b98` | `LICENSE`: MIT, Arthur Panazolo, 2024.                                                                                          |

## Graphics, interaction and loading observations

### Bruno Simon

Inspected `sources/Game/Game.js`, `ResourcesLoader.js`, `Ticker.js`, `Quality.js`, `Rendering.js`, `World/World.js`, package metadata and license. `Game` constructs discrete resources, quality and update-loop services. `ResourcesLoader` caches loaders and connects GLTF, Draco and KTX2 loading; KTX2 detects renderer support. `Rendering` uses Three's WebGPU renderer and drives `Ticker` through `setAnimationLoop`. `Ticker` clamps delta and emits ordered update events. `Quality` starts lower on mobile and emits a change event when its tier changes.

The useful lesson is explicit ownership of rendering, resources and quality, with a coherent world assembled from smaller systems. PAU.OS uses R3F with its own WebGL scene, not this singleton runtime, vehicle physics, distinctive environment, TSL shaders or art assets. The portfolio's small procedural scene does not need a driving simulation or the reference's larger compressed-model pipeline.

### Vairuh

Inspected `src/App.jsx`, `src/components/Windows/Macwindow.jsx`, package metadata and repository root. A keyed React object controls which app windows mount; `Macwindow` wraps content in `react-rnd` and updates its named state key when closed. This is a window-management reference, not a 3D renderer.

PAU.OS uses conventional routes, persistent navigation and a bounded optional terminal dialog. It does not introduce draggable desktop windows, a dock or an operating-system imitation. No source was reused from the unlicensed checkout.

### trevsm

Inspected `src/App.js`, `src/components/Camera.js`, package metadata and license. The R3F canvas separates model loading through `Suspense` from an HTML overlay. A GPU-tier check enables a subtle postprocessing noise pass only on stronger tiers. `CustomCamera` fixes a narrow 23-degree field of view and a stable look target. This checkout uses an older React 18 / R3F 8 / react-scripts stack.

PAU.OS keeps the separation of optional GPU visuals and readable HTML content. Its camera targets and quality budgets are original; it does not combine old dependencies with the current React/Next/R3F installation or copy the reference model.

### Txemalon

Inspected `components/FrozenKeyboard.tsx`, the component inventory, package metadata and license. A section-state table defines poses, while `IntersectionObserver` selects the prominent HTML section. Mutable references carry highlighted-key state into frame updates without per-frame React rerenders. Mobile gets a dedicated fixed hero composition. The source stack includes Next, R3F, Drei and Lenis.

PAU.OS uses explicit station targets and a dedicated narrow-screen composition. Its geographic instrument is driven by verified map data; it does not copy the keyboard, section poses, ice materials or seasonal presentation. Long-form content retains native scrolling. No global smooth-scroll dependency was added for this pattern.

### ITomPoland

Inspected `src/context/PerformanceContext.jsx`, `src/hooks/useScrollCamera.js`, `src/components/canvas/Experience.jsx`, package metadata and license. Performance tiers change DPR, shadows and particle budgets; initial heuristics use mobile detection, CPU concurrency and memory, and the context exposes tier downgrade. The scroll-camera hook intercepts the window wheel and lerps a bounded Z target. The scene separates entrance, corridor, room warmup and teleports; its comments record a previous camera-override conflict.

PAU.OS keeps quality presets and one camera owner. It does not reproduce the global wheel interception, mandatory door entry, infinite corridor or competing camera overrides. Its GSAP effects kill previous tweens on cleanup before redirecting to another station, and users can open content routes immediately.

### nothingnothings

Inspected `src/Experience.jsx`, `src/Components/ExperienceWrapper/ExperienceWrapper.jsx`, package metadata and license. A Zustand notebook store separates room, open/closed, power and page states. The scene uses bounds fitting, a separate environment and room, contact shadows and external page buttons. It contains a lazy-loaded word-cloud component and mobile-related state.

PAU.OS uses a small interaction store, separate world components and HTML project controls. It does not copy the notebook, simulated boot sequence, room model, word cloud or embedded pages. The Toolbox is a native accessible category explorer inside About.

## Current PAU.OS decisions

- The existing Next application was extended rather than migrating frameworks. Server-rendered content and direct URLs remain useful without a WebGL context.
- The previous generic central reactor has been replaced by the suspended Camí Curt geographic instrument. A machined circular platform, calibrated pedestal, curved gantry and task lights compose one finite observatory.
- `components/3d/Laboratory.tsx` owns the render boundary, camera rig, quality selection and projected HTML station labels. `scenes/Observatory.tsx` owns the architecture plus distinct performance, board-game and planning exhibits; `scenes/Catalonia.tsx` owns the map installation.
- The station order is **Camí Curt, ATHRA, Alcoholfabet, TrackFlow**. That same order belongs to the content model, Work view and project continuation links.
- Camera transitions are bounded and cancellable. The map uses a higher overview than the secondary instruments; mobile scales composition explicitly. Reduced motion affects render behavior as well as CSS.
- High/medium/low/static choices, lazy scene loading and a static fallback keep GPU work optional. Repeated calibration marks use instancing; geography is a small committed topology. These are architecture decisions, not unmeasured performance claims; see performance documentation for actual measurements.
- The five main routes are Home, Work, Experience, About and Contact, with persistent Resume access. There is no Lab section. Existing unmounted experiment modules are not promoted as navigation.
- No physics dependency, purchased model pack, copied reference shader, texture, illustration, audio or brand treatment was introduced.

## Additional GitHub-pinned projects

The public profile currently pins Camí Curt, Ad-hoc Medical Data Processing, Alcoholfabet, Connect4-AI, Checkers-AI and EsinMath. The first and third are already covered in the primary product section above. The four remaining pins are now represented after TrackFlow in PAU.OS. Source was read selectively to verify implementation descriptions; no project was built or run and no source/artwork was copied into the portfolio.

| Repository snapshot                                                                                                                                                                                 | Read-only source evidence                                                                                                                                                                                                                                                                                                   | License, attribution and publication boundary                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ad-hoc Medical Data Processing at ce45dc4](https://github.com/drpauu/Ad-hoc_medical_data_processing_toward_integration_with_existing_data_platforms/tree/ce45dc4b3e04b220db3656dba08dbed3269b94d9) | Public profile description plus repository tree: ETL/config/ingestion/pipeline structure; Python is the repository's dominant detected language. Medical payloads were not opened. A tracked environment value was checked only for Mongo URI format and obvious placeholder markers; it was not printed, stored or copied. | No repository license detected. The tree contains a tracked `.env`, a Mongo connection value that did not look like an obvious placeholder and bundled data files. PAU.OS includes no value or dataset and withholds its repository action until review; sanitize the upstream repository before linking it in a public portfolio. |
| [Connect4-AI at 2b1bb25](https://github.com/drpauu/Connect4-AI/tree/2b1bb25a8902d89cf86fedf49e7dff8934b4fab9)                                                                                       | `c4_the_game/src/edu/epsevg/prop/lab/c4/MinimaxPlayer.java`: depth-limited minimax, alpha-beta, copied-board exploration, position scoring. The player source names a collaborator.                                                                                                                                         | No repository license detected; supplied course engine/JAR remains in its original repo and is not included here. No runtime or strength benchmark was executed.                                                                                                                                                                   |
| [Checkers-AI at dcea720](https://github.com/drpauu/Checkers-AI/tree/dcea720415b6c17a209ac8f6c67ebf5bdbc3b131)                                                                                       | `PlayerMiniMax.java` and `Board.java`: iterative-deepening minimax, alpha-beta bounds, game-board and heuristic logic.                                                                                                                                                                                                      | No repository license detected; the repository includes a supplied course engine and existing bundled libraries. No engine, code or assets are copied; no fresh run or playing-strength benchmark was done. Individual contribution boundaries are not independently established.                                                  |
| [EsinMath at 0d8c6e3](https://github.com/drpauu/EsinMath/tree/0d8c6e30409ed893091df65043503139fa5a8708)                                                                                             | `expressio.cpp`, `racional.cpp`, `math_sessio.cpp`, `token.cpp`: expression-tree parsing/simplification, rational arithmetic, tokenization, variables and sessions.                                                                                                                                                         | No repository license detected; supplied ESIN teaching libraries and fixtures remain only in their repository. No fresh build or individual contribution split was established.                                                                                                                                                    |

The four additional case covers are original diagrams; they are not screenshots or reimplementations of the linked applications. Their source SVGs are under `assets/project-artwork/` and optimized WebP outputs are produced by `npm run images:pinned`.

## Asset licensing and provenance boundary

The six portfolio references contributed architectural study only. Their licenses were inspected, but no code/model/texture/audio was copied into this implementation, so no copied reference-license blocks are asserted as required. Source links above credit the study. Library notices remain in installed distributions; bundled font OFL notices live in `public/licenses/`.

The **geographic dataset is different**: PAU.OS intentionally incorporates Camí Curt's exact public TopoJSON at the owner's request. Camí Curt's MIT notice is retained in `data/CAMICURT-LICENSE.txt`. Source-file hashing establishes a GeoJSON-Mapas **2014** snapshot lineage. Its original producer and redistribution license remain unresolved; ICGC's general reuse terms are not asserted to apply merely because an intermediate filename contains `icgc`. See [GEOGRAPHY.md](./GEOGRAPHY.md) for hashes, source URLs and the review requirement before public launch. No GADM layer was included.

Professional/project content provenance and authentic application screenshot boundaries are documented separately in [CONTENT_SOURCES.md](./CONTENT_SOURCES.md). No reference application, production database or private health record was changed during this study.
