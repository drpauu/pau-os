import CaseStudy, {
  generateMetadata as metadataFor,
} from "../../work/[slug]/page";
import { getProjects } from "@/lib/supabase/content";
export async function generateStaticParams() {
  return [
    ...(await getProjects()).map((p) => ({ slug: p.slug })),
    { slug: "cami-curt" },
  ];
}
type Props = { params: Promise<{ slug: string }> };
const canonical = async (params: Props["params"]) => {
  const { slug } = await params;
  return { slug: slug === "cami-curt" ? "camicurt" : slug };
};
export async function generateMetadata({ params }: Props) {
  return metadataFor({ params: canonical(params) });
}
export default async function LegacyCase({ params }: Props) {
  return CaseStudy({ params: canonical(params) });
}
