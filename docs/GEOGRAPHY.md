# Camí Curt geographic installation

## Source and fidelity

`data/catalunya-comarques.json` is a byte-for-byte copy of the public Camí Curt map, `public/catalunya-comarques.topojson`, inspected in the existing sibling repository. The source asset's last Git commit is `bb23070d84e05d653f297c76c3b682d4311f92e8` (2026-01-03).

- Public source: https://github.com/drpauu/camicurt.cat/blob/main/public/catalunya-comarques.topojson
- SHA-256: `4040f22c4030f45986216bdba32a1a27888933ed821c8114cef098b467892e4d`
- 41 region geometries, 95 undirected shared-boundary edges.
- This is the **project's map dataset**, not a claim to represent the present-day administrative division of Catalonia. Do not silently change it to 43 comarques or describe it as an up-to-date official map.
- The map remains the exact source geometry. Longitude receives a cosine correction at the map's middle latitude; the local projection is north-up, with north at negative Z. This is an illustrative local projection, not a survey tool.
- The mesh width is 5.8 scene units. Polygon holes and all multipolygon parts are retained. No arbitrary nearby-centroid graph edges are invented.
- The vertical extrusion, lifted selection and geographic plate assembly are artistic treatments, **not measured terrain elevation**.

## Source lineage and attribution

Camí Curt is MIT-licensed, Copyright (c) 2026 Pau Alcázar. Its complete notice is retained in `data/CAMICURT-LICENSE.txt`. This application-level notice does not independently resolve rights in third-party geographic data.

The active Camí Curt preparation script `scripts/build-topojson.mjs` reads `data/comarques_icgc.geojson` first, groups names and simplifies geometry with mapshaper. Despite that filename, **both** `data/comarques_icgc.geojson` and `data/comarques.geojson` are byte-for-byte identical to the public [GeoJSON-Mapas compressed dataset at a09b48c](https://github.com/aariste/GeoJSON-Mapas/blob/a09b48c3e237dfb22347021a224cc764f0d65189/comarques-compressed.geojson). The upstream file's last commit is **2014-05-29**, not the 2026 date of its inclusion in Camí Curt.

Verified 2026-10-14 using fetched raw bytes:

- Upstream and both local GeoJSON files: **117,842 bytes** each.
- All three SHA-256 values: `86a3a4bc3c68acf2f61bf05e4870b752680b96a20305ecdc6d85da2593335cae`.
- Camí Curt's `data/README.md` independently credits GeoJSON-Mapas for `data/comarques.geojson`.
- The source script can also combine GeoJSON-Mapas provincial files as a fallback. It was not rerun against a different edition for this portfolio.

This establishes the immediate source lineage. It does **not** establish ICGC as the original producer. The GeoJSON-Mapas root README gives no origin or license, and its root has no standalone license file. [ICGC's official reuse conditions](https://www.icgc.cat/ca/LICGC/Informacio-publica/Transparencia/Reutilitzacio-de-la-informacio) state CC BY 4.0 for information it owns, with specified exceptions. Those terms do not automatically apply to a file whose ICGC ownership has not been established. No ICGC license is asserted for this snapshot.

Visible credit: **Camí Curt map dataset · GeoJSON-Mapas (2014 snapshot)**. The upstream geographic redistribution license remains a review limitation **before public launch**. Local implementation and an owner-only deployment for review do not constitute license clearance or a public release. Resolve this by establishing the upstream producer/license or obtaining an explicitly licensed matching dataset, then retain the required attribution. Do not silently alter the game's geography to a newer administrative edition.

No GADM data was copied into PAU.OS: this installation uses the comarca topology only, not Camí Curt's separate neighboring-country layer.

## Implementation

`lib/geography.ts` decodes delta-encoded TopoJSON arcs without adding a runtime GIS dependency. Shared arc indices provide adjacency, matching the source application's `topojson-client.neighbors(...)` model. A deterministic breadth-first traversal computes the minimum number of border crossings for this isolated, unweighted graph illustration. Camí Curt's actual game uses Dijkstra and additional rule machinery; this small explorer does not pretend to reproduce all game modes.

`components/3d/scenes/Catalonia.tsx` uses individually extruded comarca geometry with distinct top and side materials. Two merged lower plates share one geometry. Region selection gently lifts a comarca; a bright route and moving marker trace graph-connected region centers. Hover and selection emit names to the parent HTML interface, which owns announcements and the case-study link. Reduced-motion mode disables marker travel and makes region selection immediate. GPU buffers are disposed when the component unmounts.

Integration:

```tsx
<group position={[0, 1.4, 0]}>
  <Catalonia
    reduced={reducedMotion}
    active={station === "camicurt"}
    onHover={setHoveredRegion}
    onSelect={(name, routeNames) => setAnnouncement(routeNames.join(" → "))}
  />
</group>
```

The standalone `features/camicurt/GeographyExplorer.tsx` renders the same map as SVG plus native labeled start and destination selects. It works without WebGL, announces route changes and does not use private records or production APIs. It is an explorer, not a game session.

## Reference lessons

Read-only inspection covered Bruno Simon's `sources/Game/Objects.js` and nothingnothings' `src/Experience.jsx`. Useful lessons were explicit asset ownership, separation of render resources from application state, and keeping HTML interfaces independent from geometry. No reference code, models, materials or textures were copied. PAU.OS uses an original geography instrument instead of a driveable environment or notebook interaction. No physics package or reference project's boot screen was introduced.

## Verification

`npx vitest run tests/geography.test.ts`: four tests passed on 2026-10-14. Tests cover the exact source SHA, unique region count, graph edge count and symmetry, source-verified Barcelonès neighbors, finite closed polygons, north/east orientation, valid routes to every region, and invalid endpoints. ESLint passed for all geographic modules.

Measured resource budget: the committed topology is 9,620 bytes. Three.js extrusion of all source polygons produces 2,648 triangles / 7,944 vertices for one geographic layer. The two lower layers share one merged buffer; three drawn layers contain about 7,944 triangles before route decorations. No bitmap textures or runtime geographic requests are used. These are geometry measurements, not an FPS claim.

Actual Chromium/Playwright checks on the local development app:

- Desktop 1440×1000 and mobile 390×844 explorer screenshots captured and visually inspected: `docs/screenshots/geography-explorer.png` and `docs/screenshots/geography-explorer-mobile.png`.
- Selected Barcelonès → Maresme via the labeled native controls: live result was **1 border crossing**, with the two correct region names.
- Mobile document had no horizontal overflow.
- Zero browser page errors after correcting a React hydration mismatch caused by a split-text SVG `<title>`. The SVG title now has a single string child.
- The first 3D screenshot showed geographic foreshortening and overexposure; material refinement darkened the sage tops, increased roughness and changed the path to muted gold with dark markers. Camera elevation and lighting are owned by the parent scene and were refined separately.
- Refined scene screenshots were visually inspected: `docs/screenshots/observatory-geography-after.png`, `docs/screenshots/camicurt-installation-review.png`, and `docs/screenshots/observatory-mobile-top-review.png`. The gold route and region boundaries are legible; the mobile overview fits the viewport. Pointer hover identified **Bages** in the actual WebGL installation, and selection completed without a browser error.
- `tests/e2e/geography.spec.ts` codifies the explorer checks for the production Playwright suite. The full suite's execution status is tracked in `docs/PROJECT_STATUS.md`.
