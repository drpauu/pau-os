# Performance

## Measurement environment

Measured **2026-10-14** against the local production export, Chromium 156, Linux Mint 22.3, Intel Iris Xe through ANGLE/OpenGL, 1440 × 1000 CSS pixels at DPR 1. Network and CPU were not throttled. These are local engineering measurements, not field Core Web Vitals or a promise for all devices.

Raw output: `docs/performance-measurements.json`; script: `scripts/benchmark.mjs` (expects a production server on port 3102).

| Mode   |     Sampled FPS | Render calls / frame | Triangles / frame |
| ------ | --------------: | -------------------: | ----------------: |
| HIGH   |              60 |                  266 |            87,523 |
| MEDIUM |              60 |                  161 |            55,282 |
| LOW    | No WebGL canvas |                    0 |                 0 |

The scene counter includes shadow/postprocessing passes; geometry count is not a claim about unique mesh faces. Initial LCP was approximately **1.54 s**, CLS **0.0003** in that local run. All resources loaded during the benchmark totalled about **784 KB transferred**, including ~513 KB encoded JavaScript. Later LCP timestamps in the raw LOW sample result from switching the poster during the same navigation, not LOW-mode startup time.

Headless Chromium’s default software renderer initially measured around 1 FPS in HIGH. Hardware acceleration was explicitly selected and independently verified against the renderer string; the discrepancy was not hidden. Auto mode provides a quality reduction for genuinely slow devices.

## Implemented controls

- HTML content arrives before the dynamic WebGL bundle.
- No model/HDRI downloads; geometry, panels and shader are procedural.
- One canvas; shared rounded-box geometry and instanced calibration ticks.
- HIGH caps DPR at 1.5, uses one 1024 shadow map and moderate bloom.
- MEDIUM uses DPR 1 and disables shadows, postprocessing and particles.
- LOW uses a ~48 KB scene render and unmounts the WebGL runtime.
- Auto mode selects from width/concurrency and degrades after two slow samples (<25 FPS).
- Camera/geometry animation uses refs; no frame-rate React state updates.
- Rendering pauses offscreen and on hidden tabs; reduced motion uses demand rendering.
- React/R3F disposes scene resources on unmount; event observers, timers, GSAP tweens and audio contexts have cleanup.
- Images are compressed WebP with intrinsic sizes; offscreen project images lazy-load.
- Locally bundled fonts avoid remote font requests.

## Limits

Only Chromium was exercised automatically, with responsive viewports rather than physical mobile devices. Safari/iOS, Android GPUs, long-duration memory soak and remote-network Web Vitals remain unmeasured. The HIGH path favours image quality; shadow passes can be the first cost to remove on a weaker GPU. A CDN/static deployment will have different cache/network timings. Do not interpret the local FPS or LCP as a cross-device guarantee.
