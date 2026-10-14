# Performance measurements

Measured on 2026-10-14 against the final static export with Chromium, 1440×1000/DPR1 and **Intel Iris Xe (Mesa/ANGLE OpenGL4.6)**. A fresh browser context and preselected quality were used per mode. No competing GPU browser test was running. Raw result: `docs/performance-measurements.json`.

| Mode | Sample FPS | Draw calls | Triangles | Local LCP | CLS | Encoded JS transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| High | 60 | 401 | 98,609 | 1,572ms | 0 | 529,125bytes |
| Medium | 60 | 219 | 63,676 | 220ms | 0.0021 | 529,125bytes |
| Low/static | No canvas | 0 | 0 | 240ms | 0.0021 | 192,366bytes |

Low mode skips the 3D bundle on a fresh visit: about **64% less encoded JavaScript** in this run. Total transfer was about 1.00MB in High/Medium and 667,169bytes in Low, including project images preloaded/prefetched by the page. Heap samples were 24MB, 23MB and 7MB respectively; these are brief samples, not leak/soak guarantees.

The contexts have isolated caches, but later runs share the browser process, OS and local server. Do not interpret the LCP difference as a controlled cross-device benchmark, or the localhost measurements as field Web Vitals. This run replaces an earlier same-page quality-switch measurement: LCP after a quality switch was not an initial-load metric and was intentionally discarded.

## Mobile touch emulation

A separate Chromium run used a 390×844 viewport, DPR1 and touch/mobile emulation on the same Intel Iris Xe host. After instancing repeated board and planning details, the latest 6.8-second sample rendered at **60 FPS in Medium** with 196 draw calls and 63,676 triangles; High reached 38 FPS. Medium LCP was 536ms with CLS 0. Low retained the static scene at 480ms LCP and loaded no canvas. Earlier Medium samples ranged from 30–56 FPS before this optimization, so these short runs still do not guarantee the same rate on a physical phone. Auto selects Medium below 800px, keeping the 3D exhibit interactive at the lower render cost. Raw results: `docs/performance-mobile-emulation.json`.

This measures a phone-shaped viewport and touch event model on the desktop host GPU. It does **not** predict physical iPhone or Android performance. The emulated sample also shares the limitations of a short localhost run and cannot replace testing on representative devices.

The latest owner-private deployment was verified with independent desktop and mobile browser contexts so the desktop renderer did not compete with the mobile sample. Desktop High settled at three 60 FPS samples. At 375×812, mobile Medium measured **60 FPS**, 196 draw calls and 63,676 triangles; touch navigation and the TrackFlow cover also passed. This is a short host-GPU emulation result, not a physical phone benchmark or a long-term performance guarantee. Raw deployed evidence: `docs/live-verification.json`.

## Rendering budget and controls

- High: maximum 1.5 device pixel ratio, local 128px procedural reflection environment, 2048px key-light shadows, modest bloom.
- Medium: DPR1, no shadow render pass or postprocessing; same essential exhibits and interaction.
- Low: optimized WebP capture of the actual scene. No WebGL canvas or initial 3D bundle; all content and routes remain available.
- Auto: conservative initial tier on small/low-concurrency devices and sustained frame-time monitoring. Two slow samples below 25 FPS downgrade a tier; manual selection is respected.
- Rendering pauses offscreen or when the document is hidden. Reduced motion uses demand rendering and removes camera travel.
- Heavy scene modules are dynamically loaded independently from useful HTML. Fonts are self-hosted. There are no model, HDRI or texture CDN requests.

The geographic source is 9,620 bytes. Its 41 region extrusions total 2,648 triangles per layer; base geometry is merged/reused. Calibration details are instanced. Geometry/material lifecycle is owned by R3F and explicit geography disposal.

## Method

`PAU_BENCHMARK_URL=http://127.0.0.1:3102/ node scripts/benchmark.mjs` measures the static export in Chromium at 1440×1000, DPR1. Add `PAU_BENCHMARK_VIEWPORT=mobile` for 390×844 touch emulation; it writes `docs/performance-mobile-emulation.json` without replacing the desktop baseline. Both modes record renderer identity, sampled FPS, draw calls, triangles, heap, resource transfer, LCP and CLS. Run without concurrent GPU browser tests. Localhost timings and a single GPU do not establish real-world network/mobile performance.

Known limits: no Safari/iOS/Android device measurements, no long-duration GPU-memory soak, and no field Core Web Vitals dataset. Software-rendered CI screenshots must not be reported as representative hardware FPS.
