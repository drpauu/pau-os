# Performance measurements

Measured on 2026-10-14 against the final static export with Chromium, 1440×1000/DPR1 and **Intel Iris Xe (Mesa/ANGLE OpenGL4.6)**. A fresh browser context and preselected quality were used per mode. No competing GPU browser test was running. Raw result: `docs/performance-measurements.json`.

| Mode | Sample FPS | Draw calls | Triangles | Local LCP | CLS | Encoded JS transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| High | 60 | 401 | 98,609 | 1,604ms | 0 | 529,163bytes |
| Medium | 60 | 219 | 63,676 | 224ms | 0.0021 | 529,163bytes |
| Low/static | No canvas | 0 | 0 | 232ms | 0.0021 | 192,404bytes |

Low mode skips the 3D bundle on a fresh visit: about **64% less encoded JavaScript** in this run. Total transfer was1,004,589bytes in High/Medium and667,230bytes in Low, including project images preloaded/prefetched by the page. Heap samples were24MB,23MB and7MB respectively; these are brief samples, not leak/soak guarantees.

The contexts have isolated caches, but later runs share the browser process, OS and local server. Do not interpret the LCP difference as a controlled cross-device benchmark, or the localhost measurements as field Web Vitals. This run replaces an earlier same-page quality-switch measurement: LCP after a quality switch was not an initial-load metric and was intentionally discarded.

## Rendering budget and controls

- High: maximum 1.5 device pixel ratio, local 128px procedural reflection environment, 2048px key-light shadows, modest bloom.
- Medium: DPR1, no shadow render pass or postprocessing; same essential exhibits and interaction.
- Low: optimized WebP capture of the actual scene. No WebGL canvas or initial 3D bundle; all content and routes remain available.
- Auto: conservative initial tier on small/low-concurrency devices and sustained frame-time monitoring. Two slow samples below 25 FPS downgrade a tier; manual selection is respected.
- Rendering pauses offscreen or when the document is hidden. Reduced motion uses demand rendering and removes camera travel.
- Heavy scene modules are dynamically loaded independently from useful HTML. Fonts are self-hosted. There are no model, HDRI or texture CDN requests.

The geographic source is 9,620 bytes. Its 41 region extrusions total 2,648 triangles per layer; base geometry is merged/reused. Calibration details are instanced. Geometry/material lifecycle is owned by R3F and explicit geography disposal.

## Method

`PAU_BENCHMARK_URL=http://127.0.0.1:3102/ node scripts/benchmark.mjs` measures the static export in Chromium at 1440×1000, DPR1. It records actual renderer identity, sampled FPS, draw calls, triangles, heap, resource transfer, LCP and CLS. Run without concurrent GPU browser tests. Localhost timings and a single GPU do not establish real-world network/mobile performance.

Known limits: no Safari/iOS/Android device measurements, no long-duration GPU-memory soak, and no field Core Web Vitals dataset. Software-rendered CI screenshots must not be reported as representative hardware FPS.
