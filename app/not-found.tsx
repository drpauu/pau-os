import { ButtonLink, PageIntro } from "@/components/ui/Primitives";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="inner-page section-wrap">
      <PageIntro
        number="404"
        title="Outside the laboratory"
        description="This route does not exist. Let’s return to a known coordinate."
      />
      <ButtonLink href="/" primary>
        Return home
      </ButtonLink>
    </main>
  );
}
