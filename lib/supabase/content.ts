import { createClient } from "@supabase/supabase-js";
import { projectSchema, projects, type Project } from "@/lib/content";
export async function getProjects(): Promise<Project[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return projects;
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
    return (data ?? []).map((row) => {
      const r = projectSchema.safeParse(row);
      if (!r.success) throw new Error("Invalid published project content");
      return r.data;
    });
  } catch {
    throw new Error(
      "Unable to build published portfolio content. Check Supabase availability and the project schema; refusing to publish a stale snapshot.",
    );
  }
}
