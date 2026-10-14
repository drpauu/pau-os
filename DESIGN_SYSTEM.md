# Design system

## Identity

PAU.OS: a precision-built instrument for exploring engineering work. The visual anchor is an original reactor suspended above a machined circular platform. A diamond monogram and compact wordmark identify the operating space; the professional name remains the primary headline.

## Tokens

| Token           | Value / use                                  |
| --------------- | -------------------------------------------- |
| Graphite        | `#080e14`, page canvas                       |
| Surface         | `#101b24`, control surfaces                  |
| Structural line | `#25323d`, separators                        |
| Primary ink     | `#edf4f5`                                    |
| Secondary ink   | `#96a8b6`                                    |
| Ice accent      | `#a0ebf8`, actions and emission              |
| Titanium theme  | `#eee2c0` accent, selected from the terminal |

Manrope Variable for editorial content; IBM Plex Mono for small technical labels. Fonts are locally bundled (OFL licenses retained in package dependencies). Body text 13–17px, editorial headings 30–54px, identity up to 135px. Small instrument labels are decorative; every important destination has conventional text navigation.

Spacing follows 4/8/12/16/24/32/48/64/96px with a 4.2% desktop gutter and 6% mobile gutter. Sections use thin structural lines, large negative space and asymmetric editorial layouts. Project images are actual screenshots mounted inside softly illuminated surfaces.

## Interaction

A light primary action always leads somewhere real. Focus rings use a 2px ice outline with 6px offset. Station selection illuminates its button and moves the camera. Motion follows `power3.inOut`: about 2 seconds for entry and 1.35 seconds between stations. Hover translation is at most 2–4px. Reduced motion removes decorative animation. Audio is always opt-in.

Mobile places the identity first, the laboratory second and the compact station dock third. Menu navigation exposes all professional routes. LOW mode uses the original scene render and preserves the entire content/navigation layer.

## Assets and evidence

The monogram/favicon is code-authored SVG. Geometry and shader are original. The fallback is rendered from the actual scene. Project images are verified browser captures (see `docs/screenshots-provenance.json`). There are no fake product mockups, private training records, fictional employers or invented metrics. The reactor’s screen graphics are abstract illustrations, not live product telemetry.
