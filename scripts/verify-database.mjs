import fs from "node:fs";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
for (const line of (fs.existsSync(".env.local")
  ? fs.readFileSync(".env.local", "utf8")
  : ""
).split("\n")) {
  const i = line.indexOf("=");
  if (i > 0 && !process.env[line.slice(0, i)])
    process.env[line.slice(0, i)] = line.slice(i + 1);
}
const db = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const { data, error } = await db
  .from("portfolio_projects")
  .select("slug,published,sort_order")
  .order("sort_order");
assert.equal(error, null);
assert.ok(data.length > 0);
assert.ok(data.every((p) => p.published));
console.log(
  "PASS: anonymous read returns published portfolio records. This command makes SELECT requests only.",
);
const expected = ["camicurt", "athra", "alcoholfabet", "trackflow"];
if (
  JSON.stringify(data.slice(0, 4).map((project) => project.slug)) !==
  JSON.stringify(expected)
) {
  console.warn(
    "CONTENT DRIFT: remote project order does not match PAU.OS. Keep PAU_CONTENT_SOURCE=snapshot. No remote changes made.",
  );
  process.exitCode = 2;
}
