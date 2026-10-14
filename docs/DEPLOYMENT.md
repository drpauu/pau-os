# Reproducible deployment

## Local execution

Use Node **24** (implementation verified with 24.16.0) and the committed npm lockfile. No Supabase credentials are needed for the default reviewed-snapshot build.

```bash
cd /home/pau/Documents/pau-os
npm ci
npx playwright install chromium
npm run dev
```

Development serves `http://127.0.0.1:3100`. On another computer, use that checkout's path. Browser installation is only needed for screenshots/PDFs/Playwright, not ordinary builds.

## Build and validate

Set `NEXT_PUBLIC_SITE_URL` to the intended absolute HTTPS origin before building; it controls canonical, Open Graph, sitemap and robots metadata. The existing default is `https://pau-os-laboratory.poeticcrow1.chatgpt.site`. `.env.example` documents optional settings. Keep `PAU_CONTENT_SOURCE=snapshot` for this reviewed release.

```bash
npm run sync:toolbox -- --check
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run preview
```

`build` synchronizes Toolbox first, then creates Next's `out/` static export with trailing-slash routes. Playwright starts its own exported-site server on port 3101. `preview` uses port 3100; stop the development server before previewing the export there. Serve each exported directory's `index.html`; direct URLs must resolve without requiring client-side navigation first.

When intentionally updating public content or scene assets:

```bash
npm run resume:generate  # generates the complete sanitized CV from the shared resume model
npm run capture:assets  # requires the running app at 127.0.0.1:3100 and working WebGL
npm run content:seed    # writes local SQL only; never applies it to a database
npm run build          # rebuild after generated assets change
```

`PAU_CAPTURE_URL` can point asset capture at another local preview. Inspect the public PDF and images before publication. Never package the private original CV, `.env.local`, database credentials, test traces or unrelated application repositories.

## Existing Sites target

The retained `.openai/hosting.json` identifies `appgprj_6aceae30f6588191a9cca2f37434e8f3` with `static.directory = out`. The existing audience is owner-private; retain that audience unless the owner explicitly requests a change. The latest owner-private deployment succeeded on 2026-10-14; all 14 canonical routes passed, along with isolated touch-emulated mobile navigation, the TrackFlow cover and 60 FPS Medium rendering on the host GPU. See `docs/PROJECT_STATUS.md` for its exact deployed source commit and receipt.

The owning agent uses the installed Sites workflow to refresh the Site metadata, open/synchronize its source with a temporary write credential, package the checked static export and publish through the owner-private operation. Credentials pass through hidden stdin, never command arguments/files/output. Preserve the existing project ID and use the workflow's returned commit/archive rather than creating a replacement Site. A new public audience or custom domain is a separate hosting decision.

Before any public launch, resolve the geographic dataset's upstream redistribution terms or replace it with an explicitly licensed source; see [GEOGRAPHY.md](GEOGRAPHY.md). Owner editorial review of the sanitized CV is also recommended. The current owner-private release preserves these review boundaries.

For another static host, upload only `out/`, configure directory-index routing and the final origin, then verify direct routes, browser back navigation, asset paths and CV download on that host. No Node server, service-role key, writable database, or authentication setup is required at runtime.

## Optional Supabase mirror

The available database is shared with another application and still contains stale portfolio content. Do not apply seeds or migrations there as part of deployment. `npm run db:test` is read-only and currently reports drift with exit code 2. Remote content is disabled by default.

Only enable `PAU_CONTENT_SOURCE=supabase` after an appropriate environment and its reviewed published records are ready. Use build-only `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY`. The adapter rejects privileged keys, incomplete/order-mismatched content and divergence from the local reviewed snapshot. See `docs/DATABASE.md` for findings and the retained schema.
