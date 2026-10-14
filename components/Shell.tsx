"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLaboratory } from "@/stores/laboratory";
import { Terminal } from "@/features/terminal/Terminal";
import { ScrollReveal } from "./ScrollReveal";
const nav = [
  ["/", "Home"],
  ["/work/", "Work"],
  ["/experience/", "Experience"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    [menu, setMenu] = useState(false);
  const terminal = useLaboratory((s) => s.terminal),
    setTerminal = useLaboratory((s) => s.setTerminal),
    theme = useLaboratory((s) => s.theme);
  const previousPath = useRef(path);
  useEffect(() => {
    setMenu(false);
    if (previousPath.current !== path)
      document.getElementById("main")?.focus({ preventScroll: true });
    previousPath.current = path;
  }, [path]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setTerminal(!useLaboratory.getState().terminal);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setTerminal]);
  return (
    <div data-theme={theme}>
      <ScrollReveal />
      <noscript>
        <style>{`@media(max-width:800px){.header{flex-wrap:wrap;height:auto;padding-top:20px}.navigation{display:flex;position:static;flex-wrap:wrap;order:3;width:100%;margin-top:10px}.mobile-menu,.terminal-trigger{display:none}}`}</style>
      </noscript>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header">
        <Link className="brand" href="/" aria-label="PAU.OS home">
          <span className="brand-symbol" aria-hidden="true">
            ◈
          </span>
          PAU<span className="brand-dot">.</span>OS
          <span className="brand-version">/ 01</span>
        </Link>
        <nav
          className={menu ? "navigation open" : "navigation"}
          id="primary-navigation"
          aria-label="Main navigation"
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                path === href ||
                (href !== "/" && path.startsWith(href.slice(0, -1)))
                  ? "page"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-tools">
          <Link className="header-resume" href="/resume/">
            Resume / CV <ArrowUpRight size={14} />
          </Link>
          <button
            className="mobile-menu icon-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="primary-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {children}
      <footer className="footer">
        <Link href="/" className="brand">
          PAU<span className="brand-dot">.</span>OS
        </Link>
        <span>Engineered with intention. Barcelona, Spain.</span>
        <a href="https://github.com/drpauu" target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={15} />
        </a>
        <span className="mono">© {new Date().getFullYear()} PAU ALCÁZAR</span>
      </footer>
      {terminal && <Terminal />}
    </div>
  );
}
