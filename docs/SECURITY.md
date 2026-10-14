# Security and privacy

## Application boundary

- The application exports static HTML/CSS/JavaScript. It has no command execution endpoint, public write API, contact-message storage, service-role credential or privileged browser connection.
- Project URLs are HTTPS-validated; local cover paths are constrained. React escapes content. Case studies use structured data rather than arbitrary HTML.
- The optional terminal uses a fixed command vocabulary; input is never sent to a shell.
- Default `PAU_CONTENT_SOURCE=snapshot` prevents stale content in the shared database from replacing verified project facts. Explicit remote mode is server-only, publishable-key-only, SELECT-only and requires parity with reviewed source content.
- `.env.local`, dependency/build trees and test traces are excluded from source commits. Deploy only the static export and hosting configuration; never repository roots or private source CVs.
- CV-derived public information comes from the canonical professional content model. See `docs/CONTENT_SOURCES.md` for the document review and redaction decisions. Original CVs are not automatically copied to `public/`.
- Toolbox synchronization fetches the public GitHub README without credentials. Unexpected removals/reordering fail the build; network outages use a validated committed snapshot.

## Supabase audit

The connected project is shared with Tecla&Pau. No remote resources or settings were modified. Existing `portfolio_*` tables have RLS, SELECT-only grants and published-only read policies for `anon` and `authenticated`. Published portfolio metadata was read; private application rows were not. The site's snapshot mode makes no runtime database request. See `docs/DATABASE.md` for exact findings and limits.

The reusable `npm run db:test` is read-only. It currently exits 2 because remote project order/content is stale; it does not try to repair the production database. No live INSERT/UPDATE/DELETE denial probes or unrelated-app E2E tests were run.

The [Supabase changelog](https://supabase.com/changelog) and current [API security guide](https://supabase.com/docs/guides/api/securing-your-api) were reviewed. The upcoming removal of old TLS 1.2 CBC ciphers does not require application changes for the modern Node build runtime used here; unsupported old clients should be upgraded. [Deprecation notice](https://supabase.com/changelog/cbc-tls-ciphers-deprecated).

## Dependency review, 2026-10-14

`npm audit --omit=dev` reports **0 vulnerabilities**. The lockfile pins dependencies; a pre-existing `compression@1.8.2` override remains for the preview tool.

`npm audit` reports **5 high development dependency entries** from one `braces <=3.0.3` stack-exhaustion advisory propagated through `micromatch`, `fast-glob`, Next's ESLint plugin and `eslint-config-next`. These tooling packages are not shipped in the static export. The offered automatic fix downgrades the Next ESLint configuration to a mismatched major version; no such downgrade was made. [Upstream advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Remaining deployment checks include confirming the hosting origin, headers and published artifact contents on the final target.
