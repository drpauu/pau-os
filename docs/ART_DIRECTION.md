# Art direction — The Engineering Observatory

## Composition

An intentionally compact observatory built around a suspended geographic instrument. The first view balances large editorial identity at left with the actual Camí Curt comarca silhouette at right. The map is the largest exhibit and the first link in every project surface. The architectural gantry frames it; a machined circular stage connects the secondary exhibits.

The central assembly has beveled lathed titanium drums, a brushed collar, an inset glass-like instrument surface, a restrained warm calibration ring, instanced machining details and four bolted mounts. A curved task-light gantry provides spatial context. The tilted, layered comarca plate is made from the actual game geometry. Hover raises a region; selection updates an adjacent-region route and announces it in HTML. Four compact peripheral exhibits represent the other pinned projects; every project is reachable in editorial order from the main dock and selects a camera view without requiring free exploration.

## Material and lighting vocabulary

Graphite and dark titanium surfaces, muted sage geographic tops, dark extruded edges, warm brass routing, cool white task lights. No downloaded models, protected reference textures, stock HDRIs or generated fake project screenshots. Environment reflections come from local procedural lightformers. A soft directional key and restrained point lights reveal the layers. High quality adds shadows and subtle selective bloom; medium keeps the authored shapes/materials.

## Four installations

1. **Camí Curt:** dominant 41-region geographic plate, shared-boundary graph, animated route courier, independently selectable comarques. Data is the historical game snapshot; no claim of current administrative completeness or genuine terrain elevation.
2. **ATHRA:** three spatial performance curves on a precision instrument, with a moving sample marker. Curves are illustrative, not wearable records or product analytics.
3. **Alcoholfabet:** machined physical board, colored perimeter positions, sculpted player pieces and a die. This is an artistic interpretation, not a replica of a live session.
4. **TrackFlow:** three supported planning layers with arranged task blocks and a moving temporal marker. An illustration of coordination, not a live dashboard.

The Work-list and case-study cover use an original editorial illustration: a running track connects to six translucent weekly session panels through precise timeline rails. It replaces the unauthenticated login capture and is labeled as an illustration, not an application screenshot.

## Motion and access

Camera destinations are centralized. GSAP tweens a shared camera position and look target; changing selection kills the prior tweens and continues from their current values. Normal transitions last 0.95 seconds, initial reveal 1.6 seconds and can be skipped. Pointer motion is small. Reduced motion removes cinematic travel and uses demand rendering. No scroll hijacking or exploration controls stand between a visitor and content.

On small screens, the identity is presented first, with a separately composed scene below and a horizontally scrollable, ordered project dock. Dragging the scene orbits the camera; large previous/next buttons choose installations, while vertical page scroll remains native. Native HTML remains primary for long content. Headings use local Manrope; instrumentation uses local IBM Plex Mono. Mint accents are used sparingly, warm gold belongs to the route and board.

## Visual iteration evidence

`docs/screenshots/before-desktop.png` retains the previous reactor composition. The first new pass revealed a gray ground-plane rectangle and overly white map. These were corrected with a transparent shadow receiver, lower exposure/key intensity, sage materials and a warm route. The map was tilted toward the viewer to improve silhouette readability. Focus cameras were widened and non-selected labels removed to reduce clutter. Live verification caught a sticky-header fragment in the static poster; capture now hides the header and keeps the fallback image free of HTML overlays.

Final browser evidence is collected in `docs/screenshots/`. Visual review is human/agent inspection of those renders, not inferred from build success. Further authored surface detail and device testing remain possible improvements; the current assets are entirely procedural.
