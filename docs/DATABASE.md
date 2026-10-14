# Portfolio database

The connected Supabase account exposed one project-scoped MCP connection; organization enumeration and free project creation were not available. No new subscription or project was created. PAU.OS uses isolated `public.portfolio_*` tables in the connected project. Existing application tables, policies, auth configuration and private data were not modified.

## Current integration

`portfolio_projects` contains ATHRA, TrackFlow and Camí Curt, all explicitly published. The Next.js build reads these records using a publishable key. Every project uses the same Zod schema and case-study template. `portfolio_experience` and `portfolio_content` are empty optional extension tables; the factual professional snapshot remains source-controlled. No messages table is needed because contact is through verified external links.

## Owner administration

Open Supabase Studio → Table Editor → `portfolio_projects`. The project owner’s Supabase organization membership authorizes Studio edits. Application clients have SELECT only. There are deliberately no authenticated-user INSERT/UPDATE/DELETE grants and no write policies; simply signing into an unrelated application on this project does not grant editorial access.

1. Edit a project’s text/JSON or insert a complete record with a unique slug.
2. Upload its image through the source workflow to `public/images/`; set the local path.
3. Set `published=true` only when content is verified and public.
4. Set `updated_at=now()` in SQL when editing; no global trigger was introduced.
5. Run `npm run build` and publish the new static export.

**Publication boundary:** cached/static HTML is public once deployed. Turning `published` off only affects the next build. Rebuild/redeploy to withdraw content. Never store sensitive data in these editorial tables, even as unpublished drafts. A configured backend error fails the build; it does not silently restore older content.

## Migration and rollback

`20261014073010_pau_os_content.sql` creates three namespaced tables, enables RLS, adds a partial published/sort-order index and grants only SELECT. Re-running it changes only its own named policies. `seed.sql` uses `ON CONFLICT DO NOTHING` to preserve editorial edits.

For a new dedicated project, run the migration and seed in Studio, set the new URL/publishable key, verify with `npm run db:test`, rebuild and deploy. No secret key is needed.

Rollback is deliberately **manual and approval-gated** because removing the three tables destroys editorial content. Export their data first, remove PAU.OS deployment references, then drop only `portfolio_projects`, `portfolio_experience` and `portfolio_content`. Do not run broad schema cleanup or reset the shared project.

## Verification performed

- Public REST query returned three published slugs.
- Anonymous INSERT and UPDATE were rejected with PostgreSQL `42501`.
- Transaction-local unpublished probes were invisible to `anon` and `authenticated`; probes were rolled back.
- All three tables have RLS enabled and SELECT-only policies.
- Security advisors reported no findings for PAU.OS tables. Existing project advisories concern unrelated resources and were left untouched. [Supabase advisor reference](https://supabase.com/docs/guides/database/database-linter).

The reusable REST test is `scripts/verify-database.mjs`. It tests denied writes against a nonexistent `permission-test` slug and never requests a privileged key.
