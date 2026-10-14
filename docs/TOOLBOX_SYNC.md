# GitHub Toolbox synchronization

The authoritative source is the [profile README](https://github.com/drpauu/drpauu/blob/main/README.md), specifically `## Toolbox`. Career information comes from the CV and is separate.

## Implementation

- `scripts/toolbox.mjs` parses inline-code entries under the five exact level-three headings. It preserves spelling, punctuation, case and order, rejects duplicate/empty entries and rejects unknown markup rather than dropping content.
- `scripts/sync-toolbox.mjs` fetches the public raw README without credentials, with an eight-second timeout.
- `data/sources/github-profile-readme.md` is the committed public source snapshot.
- `data/toolbox.json` is generated from that source. Its SHA-256 covers the Toolbox section. No timestamp changes the file on each build.
- `features/toolbox/ToolboxExplorer.tsx` renders all categories as accessible keyboard-operable tabs in About. Item lists preserve source order; counts describe entries, never proficiency.

The verified snapshot on 2026-10-14 contains **80 entries**: 18 languages/data formats, 15 frontend/web, 14 backend/database/security, 16 testing/delivery/operations, and 17 algorithms/computer-science entries.

## Commands

```bash
npm run sync:toolbox                 # fetch, compare, regenerate unchanged structure
npm run sync:toolbox -- --check       # fetch and verify without writing
npm run sync:toolbox -- --offline --check  # validate committed source + generated data
npm run sync:toolbox -- --accept-changes   # explicitly accept reviewed upstream changes
npx vitest run tests/toolbox.test.ts
```

`npm run build` invokes synchronization through `prebuild`.

## Change and outage handling

Missing items, additions, spelling changes and reorderings produce a readable diff and a nonzero exit. Unexpected drift cannot silently remove entries during deployment. Review the upstream README, run `--accept-changes`, inspect the source/data diff, and update the expected test count only when the source actually changed. Category names and order remain mandatory even with this flag.

A network error or unavailable GitHub response uses the committed fallback only after proving that generated data still matches the committed README. It prints an explicit warning. A malformed or changed upstream section fails synchronization; it is not treated as an outage. Neither the UI nor a deployed static site depends on GitHub availability.

The unit suite verifies source/data equality, all headings, order/spelling changes, missing items, duplicate items, unsupported formatting, CRLF handling, exclusion of non-Toolbox text, and credential-free fetch/error behavior. Live and offline verification commands passed during implementation. The recorded snapshot and section hash provide reproducible evidence for the deployed version.
