import fs from "node:fs";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0 && !process.env[line.slice(0, i)])
    process.env[line.slice(0, i)] = line.slice(i + 1);
}
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const { data, error } = await db
  .from("portfolio_projects")
  .select("slug,published")
  .order("sort_order");
assert.equal(error, null);
assert.equal(data.length, 3);
assert.ok(data.every((p) => p.published));
const denied = await db
  .from("portfolio_projects")
  .insert({
    slug: "permission-test",
    title: "Not persisted",
    repository_url: "https://github.com/drpauu",
    cover_image: "/images/athra.webp",
  });
assert.ok(denied.error);
assert.equal(denied.error.code, "42501");
const update = await db
  .from("portfolio_projects")
  .update({ published: false })
  .eq("slug", "permission-test");
assert.ok(update.error);
assert.equal(update.error.code, "42501");
console.log(
  "PASS: published project read; anonymous INSERT and UPDATE denied (42501). No data modified.",
);
