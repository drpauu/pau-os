"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = [
      ...document.querySelectorAll<HTMLElement>(
        ".project-row,.about-strip,.lab-note",
      ),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
      },
      { threshold: 0.08 },
    );
    for (const el of elements) {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add("reveal");
        observer.observe(el);
      }
    }
    return () => {
      observer.disconnect();
      elements.forEach((el) => el.classList.remove("reveal", "revealed"));
    };
  }, [path]);
  return null;
}
