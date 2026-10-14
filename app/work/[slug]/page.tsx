import { GeographyExplorer } from "@/features/camicurt/GeographyExplorer";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { getProjects } from "@/lib/supabase/content";
import { ButtonLink, Eyebrow } from "@/components/ui/Primitives";
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProjects()).find((p) => p.slug === slug);
  return {
    title: p?.title ?? "Project",
    alternates: { canonical: "/work/" + slug + "/" },
    description: p?.description,
    openGraph: { images: p ? [p.cover_image] : [] },
  };
}
export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const p = projects.find((p) => p.slug === slug);
  const nextProject =
    projects[
      (projects.findIndex((p) => p.slug === slug) + 1) % projects.length
    ];
  if (!p) notFound();
  return (
    <main id="main" tabIndex={-1} className="case-page section-wrap">
      <Link href="/work/" className="back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <div className="case-header">
        <Eyebrow>{p.category}</Eyebrow>
        <h1>{p.title}</h1>
        <p>{p.content.intro}</p>
        <div className="tags">
          {p.technologies.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="button-row">
          {p.repository_url ? (
            <ButtonLink href={p.repository_url} external>
              View source
            </ButtonLink>
          ) : (
            <span className="source-review-note">
              Source link withheld pending repository privacy and credential
              review
            </span>
          )}
          {p.live_url && (
            <ButtonLink href={p.live_url} external primary>
              Open application
            </ButtonLink>
          )}
        </div>
      </div>
      <figure className={"case-image project-" + p.slug}>
        <img
          src={p.cover_image}
          alt={
            p.slug === "trackflow"
              ? "TrackFlow weekly training plan represented as a running track and connected session timeline"
              : p.featured
                ? p.title + " actual application interface"
                : p.title + " original project illustration"
          }
          width={p.slug === "trackflow" ? 1200 : 1440}
          height={p.slug === "trackflow" ? 800 : 1000}
        />
        <figcaption>{p.content.caption}</figcaption>
      </figure>
      {p.slug === "camicurt" && <GeographyExplorer />}
      <div className="case-body">
        <aside>
          <span className="mono muted">PROJECT NOTES</span>
          <dl>
            <dt>Practice</dt>
            <dd>Independent product development</dd>
            <dt>Status</dt>
            <dd>{p.content.status}</dd>
            <dt>Focus</dt>
            <dd>{p.category.toLowerCase()}</dd>
          </dl>
        </aside>
        <div>
          <section>
            <Eyebrow>01 / THE PROBLEM</Eyebrow>
            <h2>{p.subtitle}</h2>
            <p>{p.content.problem}</p>
          </section>
          <section>
            <Eyebrow>02 / THE APPROACH</Eyebrow>
            <h2>How the system fits together.</h2>
            <p>{p.content.approach}</p>
            <div className="architecture-flow">
              {p.content.architecture.map((v, i) => (
                <div key={v}>
                  <span className="mono">0{i + 1}</span>
                  <p>{v}</p>
                  {i < p.content.architecture.length - 1 && (
                    <ArrowDown size={16} />
                  )}
                </div>
              ))}
            </div>
          </section>
          <section>
            <Eyebrow>03 / ENGINEERING DECISIONS</Eyebrow>
            {p.content.challenges.map((c) => (
              <div className="challenge" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </section>
          <section className="scope-note">
            <Eyebrow>CURRENT SCOPE</Eyebrow>
            <p>{p.content.scope}</p>
          </section>
        </div>
      </div>
      <div className="case-end">
        <div>
          <span className="eyebrow">NEXT PROJECT</span>
          <h2>{nextProject.title}</h2>
        </div>
        <ButtonLink href={"/work/" + nextProject.slug + "/"} primary>
          Explore next project
        </ButtonLink>
      </div>
    </main>
  );
}
