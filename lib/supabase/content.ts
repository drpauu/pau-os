import "server-only";
import { createClient } from "@supabase/supabase-js";
import { projects, type Project } from "@/lib/content";
import {
  validatePublishedProjects,
  validateSnapshotParity,
} from "./project-validation";

export async function getProjects(): Promise<Project[]> {
  const source = process.env.PAU_CONTENT_SOURCE ?? "snapshot";
  // A legacy .env must never override newly verified content without an explicit choice.
  if (source === "snapshot") return validatePublishedProjects(projects);
  if (source !== "supabase")
    throw new Error("PAU_CONTENT_SOURCE must be snapshot or supabase.");
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key)
    throw new Error(
      "Remote content requires SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
    );
  if (!url.startsWith("https://"))
    throw new Error("Supabase content requires HTTPS.");
  if (key.startsWith("sb_secret_"))
    throw new Error(
      "Only a Supabase publishable key may be used for portfolio reads.",
    );
  if (!key.startsWith("sb_publishable_") && !key.startsWith("eyJ")) {
    throw new Error(
      "The configured Supabase key must be publishable or a legacy anonymous JWT.",
    );
  }
  // Legacy anonymous keys are JWTs. Reject privileged keys even in server code.
  if (key.startsWith("eyJ")) {
    try {
      const payload = JSON.parse(
        Buffer.from(key.split(".")[1], "base64url").toString("utf8"),
      );
      if (payload.role !== "anon")
        throw new Error("Only an anonymous key is permitted.");
    } catch {
      throw new Error(
        "The configured Supabase key is not an anonymous publishable credential.",
      );
    }
  }
  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, init) =>
          fetch(url, { ...init, signal: AbortSignal.timeout(5000) }),
      },
    });
    const { data, error } = await client
      .from("portfolio_projects")
      .select(
        "slug,title,subtitle,description,technologies,category,repository_url,live_url,cover_image,gallery,featured,published,sort_order,content",
      )
      .eq("published", true)
      .order("sort_order");
    if (error) throw error;
    const remote = validatePublishedProjects(data ?? []);
    validateSnapshotParity(remote, projects);
    return remote;
  } catch (error) {
    throw new Error(
      `Unable to build verified Supabase portfolio content: ${error instanceof Error ? error.message : "request failed"}. Remote mode fails closed; use PAU_CONTENT_SOURCE=snapshot for the reviewed local content.`,
    );
  }
}
