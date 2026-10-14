import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="project-list">
      {projects.map((p, i) => (
        <article className={"project-row project-" + p.slug} key={p.slug}>
          <Link
            className="project-image"
            href={"/projects/" + p.slug + "/"}
            aria-label={"Explore " + p.title}
          >
            <img
              src={p.cover_image}
              alt={p.title + " application screenshot"}
              loading="lazy"
              width={1440}
              height={1000}
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
            <h3>
              <Link href={"/projects/" + p.slug + "/"}>{p.title}</Link>
            </h3>
            <p className="project-subtitle">{p.subtitle}</p>
            <p className="muted">{p.description}</p>
            <div className="tags">
              {p.technologies.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <Link className="text-link" href={"/projects/" + p.slug + "/"}>
              Inside the project <ArrowUpRight size={16} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
