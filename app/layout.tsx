import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { professional } from "@/lib/professional";
import { Shell } from "@/components/Shell";
const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pau-os-laboratory.poeticcrow1.chatgpt.site";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: "Pau Alcázar — PAU.OS", template: "%s — PAU.OS" },
  description:
    "Pau Alcázar, Data & AI Engineer. Explore the Engineering Observatory: software, algorithms and independent digital products.",
  openGraph: {
    title: "PAU.OS — Pau Alcázar",
    description: "Software. Data. Independent products.",
    images: ["/images/og.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: professional.name,
              url: origin,
              jobTitle: professional.role,
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Universitat Politècnica de Catalunya",
              },
              sameAs: [
                "https://github.com/drpauu",
                "https://www.linkedin.com/in/pau-alcázar-perdomo/",
              ],
            }),
          }}
        />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
