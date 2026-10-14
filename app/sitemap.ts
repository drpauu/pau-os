import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/supabase/content";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://pau-os-laboratory.poeticcrow1.chatgpt.site";
  return [
    "",
    "work/",
    "about/",
    "experience/",
    "resume/",
    "contact/",
    ...(await getProjects()).map((p) => "work/" + p.slug + "/"),
  ].map((path) => ({
    url: base + "/" + path,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
