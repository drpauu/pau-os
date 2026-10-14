# Portfolio database boundary

## Current state, inspected 2026-10-14

The available Supabase MCP connection is scoped to the existing **Tecla&Pau** project, as confirmed against the local application's setup documentation. It contains production application tables and three pre-existing `public.portfolio_*` tables. There is no organization/project enumeration or free-project creation tool in this connection. No project, subscription, schema, migration, record, policy, auth setting or storage object was created or modified in this implementation.

Only schema metadata, access-control metadata and published portfolio slugs/order were queried. No game sessions, personal records, credentials, unpublished content or health data were read into the portfolio. The connected database is not evidence that Camí Curt, ATHRA or TrackFlow use it.

The old published records are `athra` (1), `trackflow` (2), and `cami-curt` (3). They lack Alcoholfabet and conflict with the required flagship/order. They remain untouched.

## Explicit content modes

`PAU_CONTENT_SOURCE=snapshot` is the default. `lib/supabase/content.ts` validates and returns the reviewed local project model. Legacy `.env.local` Supabase settings cannot silently override this mode. Professional content remains CV-derived; Toolbox remains GitHub-derived.

`PAU_CONTENT_SOURCE=supabase` explicitly enables build-time remote reads. Use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`; the earlier `NEXT_PUBLIC_` names are supported for compatibility. The module is marked `server-only`, uses no persistent authentication session, performs SELECT only and times out after five seconds. Privileged Supabase keys are rejected.

Remote data must pass Zod validation, publication checks, unique slug/order checks and this exact first-four sequence:

1. `camicurt`, featured, sort order 1
2. `athra`, featured, sort order 2
3. `alcoholfabet`, featured, sort order 3
4. `trackflow`, featured, sort order 4

It must also match the source-reviewed snapshot. Supabase is a publishing mirror, not an unreviewed source of claims. An outage, incomplete data, unexpected content or stale ordering fails a remote-mode build. Snapshot mode is a deliberate alternative, not a silent fallback after a published record is withdrawn.

## Prepared model

The existing migration `supabase/migrations/20261014073010_pau_os_content.sql` is retained as historical/local setup code. It defines:

| Content | Representation |
| --- | --- |
| Projects and case studies | `portfolio_projects`: slug, explicit order, publication, repository/live URLs, technology array, case-study JSON |
| Media | Local optimized files referenced by `cover_image` and `gallery` |
| Experience | Optional `portfolio_experience`; the CV-derived source model currently supplies the site |
| Public profile and education | Source-controlled professional model; optional `portfolio_content` sections can mirror approved public JSON |
| Contact | Verified external links; no messages table, form endpoint or visitor data collection |

The migration enables RLS and explicitly grants only SELECT to `anon` and `authenticated`. Policies permit `published = true`. Supabase Studio project-owner access is the intended editorial channel; signing into another application on the shared project grants no portfolio editing rights. There are no browser write policies or public administrator functions. Current documentation stresses that grants and RLS are separate controls: [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api) and [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

`npm run content:seed` regenerates a local reviewed-project SQL file. It never contacts Supabase. `ON CONFLICT DO NOTHING` preserves previous edits, so running it against the old shared database would not reconcile stale records. Do not do that automatically. Prefer a separately approved dedicated project; review content and migration scope before applying any SQL.

## Verification actually performed

- Metadata confirmed RLS enabled on all three portfolio tables.
- `pg_policies` confirmed SELECT-only policies for `anon` and `authenticated`, each requiring `published = true`.
- `information_schema.role_table_grants` confirmed only SELECT grants for both client roles on those tables.
- `npm run db:test` performed an anonymous public read successfully, then exited **2** to flag the known project/order mismatch. The command now performs only SELECT; legacy INSERT/UPDATE probes were removed.
- Unit tests verify missing featured projects, incorrect ordering, duplicate slugs, unpublished data and remote content drift are rejected.

No mutation-based RLS probes were run against the shared production application. No isolated database was provisioned, so an executable allow/deny SQL fixture suite against a fresh local database remains unverified. The metadata audit supports the existing boundary; it is not a claim of a complete production database security test.

## Publication and withdrawal

A static export is public until rebuilt/redeployed. Changing database publication flags alone cannot recall existing deployed HTML. Never store confidential drafts in these public editorial tables. The current release uses the reviewed snapshot, so database edits do not affect it until explicitly reviewed and integrated.
