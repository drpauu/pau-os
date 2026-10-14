import { registerHooks } from "node:module";
import fs from "node:fs/promises";
// Next resolves extensionless TS imports; Node's native TS loader needs the suffix.
// Restrict this compatibility hook to local relative imports during snapshot loading.
const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { projects } = await import("../lib/content.ts");
hook.deregister();
const json = JSON.stringify(projects).replaceAll("'", "''");
const sql = `-- Verified source snapshot. Existing editorial changes are preserved.\ninsert into public.portfolio_projects (slug,title,subtitle,description,technologies,category,repository_url,live_url,cover_image,gallery,featured,published,sort_order,content)\nselect slug,title,subtitle,description,technologies,category,repository_url,live_url,cover_image,gallery,featured,published,sort_order,content\nfrom jsonb_to_recordset('${json}'::jsonb) as p(slug text,title text,subtitle text,description text,technologies text[],category text,repository_url text,live_url text,cover_image text,gallery jsonb,featured boolean,published boolean,sort_order integer,content jsonb)\non conflict(slug) do nothing;\n`;
await fs.writeFile("supabase/seed.sql", sql);
console.log("Wrote supabase/seed.sql; no remote writes performed.");
