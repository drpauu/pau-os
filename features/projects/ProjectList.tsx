import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { Fragment } from "react";
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="project-list">
      {projects.map((p, i) => (
        <Fragment key={p.slug}>
          {i === 4 && (
            <div className="work-divider">
              <span className="eyebrow">MORE PINNED PROJECTS / 05—08</span>
              <span className="mono muted">ALGORITHMS · DATA · COURSEWORK</span>
            </div>
          )}
          <article className={"project-row project-" + p.slug}>
            <Link
              className="project-image"
              href={"/work/" + p.slug + "/"}
              aria-label={"Explore " + p.title}
            >
              <img
                src={p.cover_image}
                alt={
                  p.slug === "trackflow"
                    ? "TrackFlow weekly training plan represented as a running track and connected session timeline"
                    : p.featured
                      ? p.title + " actual application screenshot"
                      : p.title + " original project illustration"
                }
                loading="lazy"
                width={p.slug === "trackflow" ? 1200 : 1440}
                height={p.slug === "trackflow" ? 800 : 1000}
              />
              <span className="image-corner mono">{p.content.status}</span>
              <span className="image-arrow">
                <ArrowUpRight size={25} />
              </span>
            </Link>
            <div className="project-copy">
              <div className="project-index mono">
                0{i + 1}
                <span>{p.category}</span>
              </div>
              <h2>
                <Link href={"/work/" + p.slug + "/"}>{p.title}</Link>
              </h2>
              <p className="project-subtitle">{p.subtitle}</p>
              <p className="muted">{p.description}</p>
              <div className="tags">
                {p.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <Link className="text-link" href={"/work/" + p.slug + "/"}>
                Inside the project <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        </Fragment>
      ))}
    </div>
  );
}
