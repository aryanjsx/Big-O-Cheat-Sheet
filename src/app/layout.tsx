import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import LiveRegion from "@/components/layout/LiveRegion";
import Shortcuts from "@/components/layout/Shortcuts";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import Providers from "./providers";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Big O cheat sheet: time and space complexity | BigOSheet",
    template: "%s | BigOSheet",
  },
  description:
    "Interactive Big O cheat sheet for coding interviews: time and space complexity of data structures, sorting, and graph algorithms, with a quiz and visualizer.",
  openGraph: {
    type: "website",
    siteName: "BigOSheet",
    title: "Big O cheat sheet: time and space complexity",
    description:
      "Interactive Big O reference for DSA and coding interviews: complexity tables, a playground, an algorithm visualizer, a quiz, and printable PDFs.",
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Big O cheat sheet",
  description:
    "Time and space complexity of common data structures, sorting algorithms, and graph and tree algorithms for DSA and coding interviews.",
  url: SITE_URL,
  inLanguage: "en",
  learningResourceType: "Reference",
  isAccessibleForFree: true,
  license: "https://opensource.org/licenses/MIT",
  teaches: ["Big O notation", "Time complexity", "Space complexity", "Data structures", "Sorting algorithms", "Graph algorithms"],
  author: { "@type": "Person", name: "aryanjsx", url: "https://github.com/aryanjsx" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <LiveRegion />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <Shortcuts />
        </Providers>
      </body>
    </html>
  );
}
