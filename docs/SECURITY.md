# Security notes

- Application output is static HTML/CSS/JS, with no shell, arbitrary terminal execution, public mail endpoint or privileged server key.
- Content is schema-validated, escaped by React and constrained to HTTPS destinations/local image paths. No `dangerouslySetInnerHTML` is used for CMS content.
- Supabase exposes SELECT-only published rows. Even authenticated application users cannot write. Only project-owner Studio access manages content.
- `.env.local`, dependency trees, build internals and test traces are excluded from source commits. The deployment contains `out/` and the hosting manifest, never environment files.
- Optional ambient audio runs only after a user action. No analytics or trackers were added.

## Dependency review, 2026-10-14

`npm audit --omit=dev` reports **0 vulnerabilities**. A patched `compression@1.8.2` override is used for the local preview tool; see [the upstream advisory](https://github.com/advisories/GHSA-vc2v-76pw-4v95).

The complete development tree still reports the unpatched `braces <=3.0.3` stack-exhaustion advisory through Next’s ESLint plugin → fast-glob → micromatch. It receives checked-in lint glob patterns, not visitor input, and is not part of the deployed static site. [Upstream advisory and patch status](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Do not run automatic major-version downgrades to hide this finding; update the toolchain when an upstream compatible fix exists.

Existing security advisories on the shared Supabase project are outside PAU.OS. No unrelated auth settings, policies or tables were changed to clear them.
