import type { Metadata } from "next";
import { PageIntro, ButtonLink } from "@/components/ui/Primitives";
import { PathLab } from "@/features/lab/PathLab";
export const metadata: Metadata = {
  title: "Engineering Lab",
  description:
    "An interactive shortest-path experiment. Explore how graph algorithms turn connected data into useful decisions.",
};
export default function Lab() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="03"
        title="Small experiments. Real ideas"
        description="A space to take a concept apart, understand the moving pieces and make it tangible."
      />
      <PathLab />
      <div className="lab-note">
        <h3>
          From graphs
          <br />
          to geography.
        </h3>
        <div>
          <p>
            Camí Curt applies graph thinking to the Catalan comarca map. This
            experiment isolates one idea: finding the minimum total weight
            through a network. The graph here is illustrative; the game uses its
            own geography and route rules.
          </p>
          <ButtonLink href="/projects/cami-curt/">Explore Camí Curt</ButtonLink>
        </div>
      </div>
    </main>
  );
}
