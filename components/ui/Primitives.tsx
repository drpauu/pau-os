import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span /> {children}
    </p>
  );
}
export function PageIntro({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <Eyebrow>{number} / THE OBSERVATORY</Eyebrow>
      <h1>
        {title}
        <span className="accent">.</span>
      </h1>
      <p>{description}</p>
    </div>
  );
}
export function ButtonLink({
  href,
  children,
  primary = false,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  external?: boolean;
}) {
  const cls = "button " + (primary ? "primary" : "secondary");
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={16} />
    </a>
  ) : (
    <Link className={cls} href={href}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}
